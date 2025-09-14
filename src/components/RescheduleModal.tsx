import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Appointment } from '@/stores/appointment'
import { toast } from '@/components/ui/use-toast'

const availableTimes = ['09:00', '10:30', '11:00', '14:00', '15:30', '16:00']

interface RescheduleModalProps {
  appointment: Appointment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (id: string, newDate: Date, newTime: string) => void
}

export const RescheduleModal = ({
  appointment,
  open,
  onOpenChange,
  onConfirm,
}: RescheduleModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    appointment ? new Date(appointment.date) : new Date(),
  )
  const [selectedTime, setSelectedTime] = useState<string | null>(
    appointment ? appointment.time : null,
  )

  if (!appointment) return null

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: 'Seleção Incompleta',
        description: 'Por favor, escolha uma nova data e horário.',
        variant: 'destructive',
      })
      return
    }
    onConfirm(appointment.id, selectedDate, selectedTime)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reagendar Consulta</DialogTitle>
          <DialogDescription>
            Selecione a nova data e horário para a consulta de{' '}
            {appointment.patient}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date()}
            className="rounded-md border"
          />
          <RadioGroup
            onValueChange={setSelectedTime}
            value={selectedTime || ''}
            className="grid grid-cols-3 gap-2 mt-4 w-full"
          >
            {availableTimes.map((t) => (
              <div key={t} className="flex items-center">
                <RadioGroupItem
                  value={t}
                  id={`reschedule-${t}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`reschedule-${t}`}
                  className="flex h-10 w-full items-center justify-center rounded-md border-2 border-muted bg-popover p-2 text-sm hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-secondary [&:has([data-state=checked])]:border-secondary"
                >
                  {t}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
