import { useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { StarRating } from '@/components/StarRating'
import { toast } from '@/components/ui/use-toast'

interface Appointment {
  date: string
  service: string
  status: string
}

interface ReviewDrawerProps {
  appointment: Appointment | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ReviewDrawer = ({
  appointment,
  open,
  onOpenChange,
}: ReviewDrawerProps) => {
  const [consultationRating, setConsultationRating] = useState(0)
  const [professionalRating, setProfessionalRating] = useState(0)
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    console.log({
      appointment,
      consultationRating,
      professionalRating,
      comment,
    })
    toast({
      title: 'Avaliação Enviada!',
      description: 'Obrigado pelo seu feedback.',
    })
    onOpenChange(false)
    // Reset state for next time
    setConsultationRating(0)
    setProfessionalRating(0)
    setComment('')
  }

  if (!appointment) return null

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Avaliar Consulta</DrawerTitle>
            <DrawerDescription>
              {appointment.service} em {appointment.date}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0 space-y-4">
            <div className="space-y-2">
              <Label>Como foi a consulta?</Label>
              <StarRating
                rating={consultationRating}
                onRatingChange={setConsultationRating}
              />
            </div>
            <div className="space-y-2">
              <Label>Como foi o atendimento do profissional?</Label>
              <StarRating
                rating={professionalRating}
                onRatingChange={setProfessionalRating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Deixe um comentário (opcional)</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Sua opinião é importante para nós..."
              />
            </div>
          </div>
          <DrawerFooter>
            <Button
              onClick={handleSubmit}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              Enviar Avaliação
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
