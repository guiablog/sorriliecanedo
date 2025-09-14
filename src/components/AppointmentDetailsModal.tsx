import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Appointment } from '@/stores/appointment'
import { Calendar, Clock, Stethoscope, User, BadgeCheck } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface AppointmentDetailsModalProps {
  appointment: Appointment | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const AppointmentDetailsModal = ({
  appointment,
  open,
  onOpenChange,
}: AppointmentDetailsModalProps) => {
  if (!appointment) return null

  const appointmentDate = new Date(`${appointment.date}T${appointment.time}`)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detalhes da Consulta</DialogTitle>
          <DialogDescription>
            Confira as informações do seu agendamento.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Stethoscope className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Serviço</p>
              <p className="font-medium">{appointment.service}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <User className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Profissional</p>
              <p className="font-medium">{appointment.professional}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Data</p>
              <p className="font-medium">
                {format(appointmentDate, "dd 'de' MMMM, yyyy", {
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Clock className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Horário</p>
              <p className="font-medium">{appointment.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <BadgeCheck className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">{appointment.status}</p>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Fechar
        </Button>
      </DialogContent>
    </Dialog>
  )
}
