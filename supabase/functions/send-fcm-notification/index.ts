import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createSupabaseAdminClient } from '../shared/supabase-client.ts'
import { corsHeaders } from '../shared/cors.ts'

const FCM_URL = 'https://fcm.googleapis.com/fcm/send'

interface NotificationPayload {
  title: string
  message: string
  segment:
    | 'Todos os Pacientes'
    | 'Com Consultas Agendadas'
    | 'Sem Consultas Agendadas'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { title, message, segment }: NotificationPayload = await req.json()
    const FIREBASE_SERVER_KEY = Deno.env.get('FIREBASE_SERVER_KEY')

    if (!FIREBASE_SERVER_KEY) {
      throw new Error(
        'FIREBASE_SERVER_KEY is not set in environment variables.',
      )
    }

    const supabaseAdmin = createSupabaseAdminClient()

    let userIds: string[] = []

    if (segment === 'Todos os Pacientes') {
      const { data, error } = await supabaseAdmin
        .from('patients')
        .select('user_id')
        .not('user_id', 'is', null)
      if (error) throw error
      userIds = data.map((p) => p.user_id)
    } else if (segment === 'Com Consultas Agendadas') {
      const { data, error } = await supabaseAdmin
        .from('appointments')
        .select('patients!inner(user_id)')
        .in('status', ['Pendente', 'Confirmado', 'Remarcada'])
        .not('patients.user_id', 'is', null)
      if (error) throw error
      const nestedUserIds = data.map((a: any) => a.patients.user_id)
      userIds = [...new Set(nestedUserIds)]
    } else if (segment === 'Sem Consultas Agendadas') {
      const { data: patientsWithAppointments, error: appointmentsError } =
        await supabaseAdmin
          .from('appointments')
          .select('patients!inner(user_id)')
          .in('status', ['Pendente', 'Confirmado', 'Remarcada'])
          .not('patients.user_id', 'is', null)
      if (appointmentsError) throw appointmentsError
      const userIdsWithAppointments = new Set(
        patientsWithAppointments.map((a: any) => a.patients.user_id),
      )

      const { data: allPatients, error: allPatientsError } = await supabaseAdmin
        .from('patients')
        .select('user_id')
        .not('user_id', 'is', null)
      if (allPatientsError) throw allPatientsError

      userIds = allPatients
        .map((p) => p.user_id!)
        .filter((id) => !userIdsWithAppointments.has(id))
    }

    if (userIds.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No users found for the selected segment.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    const { data: tokensData, error: tokensError } = await supabaseAdmin
      .from('user_push_subscriptions')
      .select('fcm_token')
      .in('user_id', userIds)
    if (tokensError) throw tokensError
    const fcmTokens = tokensData.map((t) => t.fcm_token)

    if (fcmTokens.length === 0) {
      return new Response(
        JSON.stringify({
          message: 'No FCM tokens found for the targeted users.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    const fcmPayload = {
      registration_ids: fcmTokens,
      notification: { title, body: message, sound: 'default' },
    }

    const response = await fetch(FCM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${FIREBASE_SERVER_KEY}`,
      },
      body: JSON.stringify(fcmPayload),
    })

    const responseData = await response.json()
    if (!response.ok) {
      console.error('FCM Error Response:', responseData)
      throw new Error(`FCM request failed with status ${response.status}`)
    }

    console.log('FCM Success Response:', responseData)
    return new Response(
      JSON.stringify({ success: true, fcmResponse: responseData }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error sending notification:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
