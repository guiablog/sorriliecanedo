import { useState, useMemo } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppointmentStore, Appointment } from '@/stores/appointment'
import { RescheduleModal } from '@/components/RescheduleModal'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { DateRange } from 'react-day-picker'
import { addDays, format } from 'date-fns'

type StatusFilter =
  | 'all'
  | 'Pendente'
  | 'Confirmado'
  | 'Cancelado'
  | 'Realizado'

export default function AdminAgenda() {
  const { appointments, rescheduleAppointment } = useAppointmentStore()
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  })
  const [patientNameFilter, setPatientNameFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [isRescheduleModalOpen, setRescheduleModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((appt) => {
        const apptDate = new Date(`${appt.date}T00:00:00`) // Ensure date is parsed correctly without timezone issues
        const isDateInRange =
          dateRange?.from &&
          dateRange?.to &&
          apptDate >= dateRange.from &&
          apptDate <= dateRange.to
        const isPatientMatch = appt.patient
          .toLowerCase()
          .includes(patientNameFilter.toLowerCase())
        const isStatusMatch =
          statusFilter === 'all' || appt.status === statusFilter

        return isDateInRange && isPatientMatch && isStatusMatch
      })
      .sort(
        (a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime() ||
          a.time.localeCompare(b.time),
      )
  }, [appointments, dateRange, patientNameFilter, statusFilter])

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
        <div className="md:col-span-1 flex flex-col gap-4">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            className="rounded-md border"
          />
          <Input
            placeholder="Filtrar por nome do paciente..."
            value={patientNameFilter}
            onChange={(e) => setPatientNameFilter(e.target.value)}
          />
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Confirmado">Confirmado</SelectItem>
              <SelectItem value="Cancelado">Cancelado</SelectItem>
              <SelectItem value="Realizado">Realizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Agendamentos de{' '}
                {dateRange?.from ? format(dateRange.from, 'dd/MM/yy') : ''} a{' '}
                {dateRange?.to ? format(dateRange.to, 'dd/MM/yy') : ''}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-3 border rounded-md flex justify-between items-start"
                  >
                    <div>
                      <p className="font-semibold">
                        {format(new Date(`${appt.date}T00:00:00`), 'dd/MM/yy')}{' '}
                        às {appt.time} - {appt.patient}
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
                <p>Nenhum agendamento encontrado para os filtros aplicados.</p>
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
