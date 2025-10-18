import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppointmentStore } from '@/stores/appointment'
import { useAuthStore } from '@/stores/auth'
import { usePatientStore } from '@/stores/patient'
import { useMemo } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface AppointmentHistoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Realizado':
      return 'default'
    case 'Confirmado':
      return 'secondary'
    case 'Cancelado':
      return 'destructive'
    default:
      return 'outline'
  }
}

export const AppointmentHistoryModal = ({
  open,
  onOpenChange,
}: AppointmentHistoryModalProps) => {
  const { userId } = useAuthStore()
  const { patients } = usePatientStore()
  const { appointments, loading } = useAppointmentStore()

  const currentUser = useMemo(
    () => patients.find((p) => p.user_id === userId),
    [patients, userId],
  )

  const userAppointments = useMemo(() => {
    if (!currentUser) return []
    return appointments
      .filter((a) => a.patient_id === currentUser.id)
      .sort(
        (a, b) =>
          new Date(`${b.date}T${b.time}`).getTime() -
          new Date(`${a.date}T${a.time}`).getTime(),
      )
  }, [appointments, currentUser])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm rounded-lg">
        <DialogHeader>
          <DialogTitle>Histórico de Consultas</DialogTitle>
          <DialogDescription>
            Aqui estão todas as suas consultas, passadas e futuras.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[50vh] pr-4">
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))
            ) : userAppointments.length > 0 ? (
              userAppointments.map((item) => (
                <div
                  key={item.id}
                  className="p-3 border rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">
                      {format(
                        new Date(`${item.date}T00:00:00`),
                        "dd 'de' MMMM, yyyy",
                        { locale: ptBR },
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.service}
                    </p>
                  </div>
                  <Badge variant={getStatusVariant(item.status)}>
                    {item.status}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Você ainda não possui consultas.
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
