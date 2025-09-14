import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAppointmentStore, Appointment } from '@/stores/appointment'

export default function AdminAgenda() {
  const [date, setDate] = useState<Date | undefined>(
    new Date('2025-10-25T12:00:00Z'),
  )
  const appointments = useAppointmentStore((state) => state.appointments)

  const selectedDateString = date?.toISOString().split('T')[0]
  const todaysAppointments: Appointment[] = selectedDateString
    ? appointments.filter((appt) => appt.date === selectedDateString)
    : []

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Agenda da Clínica</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Agendamentos para{' '}
                {date?.toLocaleDateString('pt-BR') ||
                  'Nenhuma data selecionada'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaysAppointments.length > 0 ? (
                todaysAppointments.map((appt, i) => (
                  <div
                    key={i}
                    className="p-3 border rounded-md flex justify-between items-start"
                  >
                    <div>
                      <p className="font-semibold">
                        {appt.time} - {appt.patient}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appt.service} com {appt.professional}
                      </p>
                    </div>
                    <Badge
                      variant={
                        appt.status === 'Confirmado' ||
                        appt.status === 'Realizado'
                          ? 'secondary'
                          : appt.status === 'Cancelado'
                            ? 'destructive'
                            : 'default'
                      }
                    >
                      {appt.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p>Nenhum agendamento para esta data.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
