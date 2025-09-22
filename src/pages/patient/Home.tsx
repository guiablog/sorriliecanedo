import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Calendar, Stethoscope, Lightbulb } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import { useAppointmentStore, Appointment } from '@/stores/appointment'
import { AppointmentDetailsModal } from '@/components/AppointmentDetailsModal'
import { CancelConfirmationDialog } from '@/components/CancelConfirmationDialog'
import { toast } from '@/components/ui/use-toast'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const mockPromotions = [
  {
    title: 'Clareamento Dental',
    description: 'Sorriso mais branco com 20% de desconto!',
    image: 'https://img.usecurling.com/p/400/200?q=teeth%20whitening',
  },
  {
    title: 'Check-up Preventivo',
    description: 'Agende sua avaliação e previna problemas futuros.',
    image: 'https://img.usecurling.com/p/400/200?q=dental%20checkup',
  },
]

export default function PatientHome() {
  const { fullName } = useAuthStore()
  const { appointments, updateAppointmentStatus } = useAppointmentStore()
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false)
  const [isCancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [bannerWidth, setBannerWidth] = useState<number | undefined>()
  const bannerRef = useRef<HTMLDivElement>(null)

  const patientName = fullName ? fullName.split(' ')[0] : 'Paciente'

  const nextAppointment = appointments
    .filter(
      (appt) =>
        appt.patient === fullName &&
        (appt.status === 'Confirmado' || appt.status === 'Pendente') &&
        new Date(`${appt.date}T${appt.time}`) >= new Date(),
    )
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.time}`).getTime() -
        new Date(`${b.date}T${b.time}`).getTime(),
    )[0]

  useEffect(() => {
    if (bannerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setBannerWidth(entry.contentRect.width)
        }
      })
      resizeObserver.observe(bannerRef.current)
      return () => resizeObserver.disconnect()
    }
  }, [nextAppointment])

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
        toast({
          title: 'Consulta Cancelada',
          description: 'Sua consulta foi cancelada com sucesso.',
        })
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
    <div className="p-4 space-y-6 animate-fade-in-up">
      <section>
        <h1 className="text-2xl font-bold text-neutral-dark">
          Olá, {patientName}!
        </h1>
        <p className="text-neutral-dark/70">Bem-vindo(a) de volta.</p>
      </section>

      <section>
        {nextAppointment ? (
          <Card
            ref={bannerRef}
            className="bg-secondary text-secondary-foreground"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Sua Próxima Consulta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <strong>Data:</strong>{' '}
                {format(
                  new Date(`${nextAppointment.date}T${nextAppointment.time}`),
                  "dd 'de' MMMM, yyyy 'às' HH:mm",
                  { locale: ptBR },
                )}
              </p>
              <p>
                <strong>Profissional:</strong> {nextAppointment.professional}
              </p>
              <p>
                <strong>Serviço:</strong> {nextAppointment.service}
              </p>
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleViewDetails(nextAppointment)}
                  className="bg-white/20 hover:bg-white/30 text-white"
                >
                  Ver Detalhes
                </Button>
                <Button
                  onClick={() => handleCancelClick(nextAppointment)}
                  className="bg-white/20 hover:bg-white/30 text-white"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="text-center">
            <CardContent className="p-6">
              <p className="mb-4 text-neutral-dark/80">
                Você não tem consultas agendadas.
              </p>
              <Button
                asChild
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                <Link to="/schedule">Agendar Consulta</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-dark">
          Acesso Rápido
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Card
            asChild
            className="cursor-pointer hover:shadow-md transition-shadow"
          >
            <Link
              to="/schedule"
              className="flex flex-col items-center justify-center p-4 text-center"
            >
              <Stethoscope className="h-8 w-8 text-accent mb-2" />
              <p className="font-semibold">Agendar Consulta</p>
            </Link>
          </Card>
          <Card
            asChild
            className="cursor-pointer hover:shadow-md transition-shadow"
          >
            <Link
              to="/content"
              className="flex flex-col items-center justify-center p-4 text-center"
            >
              <Lightbulb className="h-8 w-8 text-accent mb-2" />
              <p className="font-semibold">Dicas de Saúde</p>
            </Link>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-dark">
          Promoções e Destaques
        </h2>
        <Carousel opts={{ loop: true }}>
          <CarouselContent>
            {mockPromotions.map((promo, index) => (
              <CarouselItem key={index}>
                <Card className="overflow-hidden">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-32 object-cover"
                  />
                  <CardHeader>
                    <CardTitle>{promo.title}</CardTitle>
                    <CardDescription>{promo.description}</CardDescription>
                  </CardHeader>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </section>
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        open={isDetailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        customWidth={bannerWidth}
      />
      <CancelConfirmationDialog
        open={isCancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleConfirmCancel}
      />
    </div>
  )
}
