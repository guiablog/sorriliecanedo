import { useState, useMemo, useEffect } from 'react'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  useAppointmentStore,
  Appointment,
  AppointmentStatus,
} from '@/stores/appointment'
import { RescheduleModal } from '@/components/RescheduleModal'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { DateRange } from 'react-day-picker'
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns'
import { MoreHorizontal } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

type StatusFilter = 'all' | AppointmentStatus
type Period = 'day' | 'week' | 'month' | 'custom'

const statusOptions: AppointmentStatus[] = [
  'Pendente',
  'Confirmado',
  'Realizado',
  'Remarcada',
  'Cancelado',
]

export default function AdminAgenda() {
  const {
    appointments,
    rescheduleAppointment,
    updateAppointmentStatus,
    loading,
  } = useAppointmentStore()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [period, setPeriod] = useState<Period>('week')
  const [patientNameFilter, setPatientNameFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [isRescheduleModalOpen, setRescheduleModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)

  useEffect(() => {
    const now = new Date()
    if (period === 'day')
      setDateRange({ from: startOfDay(now), to: endOfDay(now) })
    if (period === 'week')
      setDateRange({ from: startOfWeek(now), to: endOfWeek(now) })
    if (period === 'month')
      setDateRange({ from: startOfMonth(now), to: endOfMonth(now) })
    if (period === 'custom' && !dateRange) setDateRange({ from: now, to: now })
  }, [period])

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((appt) => {
        const apptDate = new Date(`${appt.date}T00:00:00`)
        const isDateInRange =
          dateRange?.from &&
          dateRange?.to &&
          apptDate >= startOfDay(dateRange.from) &&
          apptDate <= endOfDay(dateRange.to)
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

  const handleConfirmReschedule = async (
    id: string,
    newDate: Date,
    newTime: string,
  ) => {
    try {
      await rescheduleAppointment(id, newDate, newTime)
      toast({ title: 'Consulta reagendada com sucesso!' })
      setRescheduleModalOpen(false)
      setSelectedAppointment(null)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível reagendar a consulta.',
        variant: 'destructive',
      })
    }
  }

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    try {
      await updateAppointmentStatus(id, status)
      toast({ title: `Status alterado para ${status}!` })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Agenda da Clínica</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex flex-col gap-4">
          <ToggleGroup
            type="single"
            value={period}
            onValueChange={(v) => v && setPeriod(v as Period)}
            className="w-full grid grid-cols-4"
          >
            <ToggleGroupItem value="day">Dia</ToggleGroupItem>
            <ToggleGroupItem value="week">Semana</ToggleGroupItem>
            <ToggleGroupItem value="month">Mês</ToggleGroupItem>
            <ToggleGroupItem value="custom">Período</ToggleGroupItem>
          </ToggleGroup>
          {period === 'custom' && (
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              className="rounded-md border"
            />
          )}
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
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))
              ) : filteredAppointments.length > 0 ? (
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
                      <Badge
                        className={cn('mt-2', {
                          'bg-green-100 text-green-800':
                            appt.status === 'Confirmado' ||
                            appt.status === 'Realizado',
                          'bg-yellow-100 text-yellow-800':
                            appt.status === 'Pendente',
                          'bg-red-100 text-red-800':
                            appt.status === 'Cancelado',
                          'bg-blue-100 text-blue-800':
                            appt.status === 'Remarcada',
                        })}
                      >
                        {appt.status}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleRescheduleClick(appt)}
                        >
                          Reagendar
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            Alterar Status
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            {statusOptions.map((status) => (
                              <DropdownMenuItem
                                key={status}
                                onClick={() =>
                                  handleStatusChange(appt.id, status)
                                }
                              >
                                {status}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
