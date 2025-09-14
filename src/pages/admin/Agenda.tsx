import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppointmentStore, Appointment } from '@/stores/appointment'
import { RescheduleModal } from '@/components/RescheduleModal'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

type StatusFilter = 'all' | 'Pendente' | 'Confirmado'

export default function AdminAgenda() {
  const [date, setDate] = useState<Date | undefined>(
    new Date('2025-10-25T12:00:00Z'),
  )
  const { appointments, rescheduleAppointment } = useAppointmentStore()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [isRescheduleModalOpen, setRescheduleModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)

  const selectedDateString = date?.toISOString().split('T')[0]
  const todaysAppointments: Appointment[] = (
    selectedDateString
      ? appointments.filter((appt) => appt.date === selectedDateString)
      : []
  ).filter((appt) => {
    if (statusFilter === 'all') return true
    return appt.status === statusFilter
  })

  const handleRescheduleClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setRescheduleModalOpen(true)
  }

  const handleConfirmReschedule = (
    id: string,
    newDate: Date,
    newTime: string,
  ) => {
    rescheduleAppointment(id, newDate, newTime)
    toast({ title: 'Consulta reagendada com sucesso!' })
    setRescheduleModalOpen(false)
    setSelectedAppointment(null)
  }

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
              <div className="flex gap-2 pt-2">
                <Button
                  variant={statusFilter === 'all' ? 'secondary' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                >
                  Todos
                </Button>
                <Button
                  variant={
                    statusFilter === 'Confirmado' ? 'secondary' : 'outline'
                  }
                  onClick={() => setStatusFilter('Confirmado')}
                >
                  Confirmados
                </Button>
                <Button
                  variant={
                    statusFilter === 'Pendente' ? 'secondary' : 'outline'
                  }
                  onClick={() => setStatusFilter('Pendente')}
                >
                  Pendentes
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaysAppointments.length > 0 ? (
                todaysAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-3 border rounded-md flex justify-between items-start"
                  >
                    <div>
                      <p className="font-semibold">
                        {appt.time} - {appt.patient}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appt.service} com {appt.professional}
                      </p>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-accent"
                        onClick={() => handleRescheduleClick(appt)}
                      >
                        Reagendar
                      </Button>
                    </div>
                    <Badge
                      className={cn({
                        'bg-green-100 text-green-800':
                          appt.status === 'Confirmado' ||
                          appt.status === 'Realizado',
                        'bg-yellow-100 text-yellow-800':
                          appt.status === 'Pendente',
                        'bg-red-100 text-red-800': appt.status === 'Cancelado',
                      })}
                    >
                      {appt.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p>Nenhum agendamento para esta data e filtro.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <RescheduleModal
        appointment={selectedAppointment}
        open={isRescheduleModalOpen}
        onOpenChange={setRescheduleModalOpen}
        onConfirm={handleConfirmReschedule}
      />
    </div>
  )
}
