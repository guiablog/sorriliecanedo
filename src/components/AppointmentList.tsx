import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppointmentStore, Appointment } from '@/stores/appointment'
import { useAuthStore } from '@/stores/auth'
import { AppointmentDetailsModal } from '@/components/AppointmentDetailsModal'
import { CancelConfirmationDialog } from '@/components/CancelConfirmationDialog'
import { toast } from '@/components/ui/use-toast'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const AppointmentItem = ({
  appointment,
  onViewDetails,
  onCancel,
}: {
  appointment: Appointment
  onViewDetails: (appt: Appointment) => void
  onCancel: (appt: Appointment) => void
}) => (
  <Card>
    <CardContent className="p-4">
      <p className="font-bold">
        {format(new Date(`${appointment.date}T00:00:00`), "dd 'de' MMMM", {
          locale: ptBR,
        })}{' '}
        às {appointment.time}
      </p>
      <p className="text-sm text-muted-foreground">{appointment.service}</p>
      <p className="text-sm text-muted-foreground">
        com {appointment.professional}
      </p>
      <div className="flex gap-2 pt-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onViewDetails(appointment)}
        >
          Detalhes
        </Button>
        {new Date(`${appointment.date}T${appointment.time}`) >= new Date() &&
          appointment.status !== 'Cancelado' &&
          appointment.status !== 'Realizado' && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onCancel(appointment)}
            >
              Cancelar
            </Button>
          )}
      </div>
    </CardContent>
  </Card>
)

export const AppointmentList = () => {
  const { name } = useAuthStore()
  const {
    appointments,
    updateAppointmentStatus,
    loading: appointmentsLoading,
  } = useAppointmentStore()

  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false)
  const [isCancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)

  const userAppointments = useMemo(
    () => appointments.filter((a) => a.patient === name),
    [appointments, name],
  )

  const upcomingAppointments = useMemo(
    () =>
      userAppointments
        .filter(
          (a) =>
            new Date(`${a.date}T${a.time}`) >= new Date() &&
            a.status !== 'Cancelado' &&
            a.status !== 'Realizado',
        )
        .sort(
          (a, b) =>
            new Date(`${a.date}T${a.time}`).getTime() -
            new Date(`${b.date}T${b.time}`).getTime(),
        ),
    [userAppointments],
  )

  const pastAppointments = useMemo(
    () =>
      userAppointments
        .filter(
          (a) =>
            new Date(`${a.date}T${a.time}`) < new Date() ||
            a.status === 'Cancelado' ||
            a.status === 'Realizado',
        )
        .sort(
          (a, b) =>
            new Date(`${b.date}T${b.time}`).getTime() -
            new Date(`${a.date}T${a.time}`).getTime(),
        ),
    [userAppointments],
  )

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setDetailsModalOpen(true)
  }

  const handleCancelClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setCancelDialogOpen(true)
  }

  const handleConfirmCancel = async () => {
    if (selectedAppointment) {
      try {
        await updateAppointmentStatus(selectedAppointment.id, 'Cancelado')
        toast({ title: 'Consulta Cancelada' })
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Não foi possível cancelar a consulta.',
          variant: 'destructive',
        })
      }
    }
    setCancelDialogOpen(false)
    setSelectedAppointment(null)
  }

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-lg font-semibold mb-2">Próximas Consultas</h3>
        <div className="space-y-4">
          {appointmentsLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appt) => (
              <AppointmentItem
                key={appt.id}
                appointment={appt}
                onViewDetails={handleViewDetails}
                onCancel={handleCancelClick}
              />
            ))
          ) : (
            <p className="text-muted-foreground text-sm">
              Nenhuma consulta futura encontrada.
            </p>
          )}
        </div>
      </section>
      <section>
        <h3 className="text-lg font-semibold mb-2">Consultas Anteriores</h3>
        <div className="space-y-4">
          {appointmentsLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : pastAppointments.length > 0 ? (
            pastAppointments.map((appt) => (
              <AppointmentItem
                key={appt.id}
                appointment={appt}
                onViewDetails={handleViewDetails}
                onCancel={handleCancelClick}
              />
            ))
          ) : (
            <p className="text-muted-foreground text-sm">
              Nenhum histórico de consultas encontrado.
            </p>
          )}
        </div>
      </section>

      <AppointmentDetailsModal
        appointment={selectedAppointment}
        open={isDetailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />
      <CancelConfirmationDialog
        open={isCancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleConfirmCancel}
      />
    </div>
  )
}
