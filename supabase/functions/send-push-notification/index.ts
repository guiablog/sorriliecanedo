import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const FCM_API_KEY = Deno.env.get('FCM_SERVER_KEY') // Needs to be set in Supabase secrets
const FCM_API_URL = 'https://fcm.googleapis.com/fcm/send'

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers':
          'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      },
    )

    const { title, message, segment } = await req.json()

    // Fetch tokens based on segment
    const { data: tokens, error } = await supabaseClient
      .from('user_push_subscriptions')
      .select('fcm_token')

    if (error) throw error

    const registration_ids = tokens.map((t) => t.fcm_token)

    if (registration_ids.length === 0) {
      return new Response(JSON.stringify({ message: 'No users to notify' }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        status: 200,
      })
    }

    const fcmResponse = await fetch(FCM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${FCM_API_KEY}`,
      },
      body: JSON.stringify({
        registration_ids,
        notification: {
          title,
          body: message,
          icon: '/favicon.ico',
        },
      }),
    })

    if (!fcmResponse.ok) {
      const errorBody = await fcmResponse.text()
      throw new Error(`FCM request failed: ${fcmResponse.status} ${errorBody}`)
    }

    const fcmData = await fcmResponse.json()

    return new Response(JSON.stringify({ success: true, fcmData }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      status: 200,
    })
  } catch (err) {
    return new Response(String(err?.message ?? err), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
})
