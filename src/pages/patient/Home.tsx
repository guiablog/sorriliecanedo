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

const mockAppointment = {
  date: '25 de Outubro, 2025',
  time: '10:30',
  professional: 'Dr. Ricardo Alves',
  service: 'Limpeza de Rotina',
}

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
  {
    title: 'Implantes Dentários',
    description: 'Recupere seu sorriso com tecnologia de ponta.',
    image: 'https://img.usecurling.com/p/400/200?q=dental%20implant',
  },
]

export default function PatientHome() {
  const patientName = 'Maria' // Mock data
  const hasAppointment = true // Mock data

  return (
    <div className="p-4 space-y-6 animate-fade-in-up">
      <section>
        <h1 className="text-2xl font-bold text-neutral-dark">
          Olá, {patientName}!
        </h1>
        <p className="text-neutral-dark/70">Bem-vindo(a) de volta.</p>
      </section>

      <section>
        {hasAppointment ? (
          <Card className="bg-secondary text-secondary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Sua Próxima Consulta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <strong>Data:</strong> {mockAppointment.date} às{' '}
                {mockAppointment.time}
              </p>
              <p>
                <strong>Profissional:</strong> {mockAppointment.professional}
              </p>
              <p>
                <strong>Serviço:</strong> {mockAppointment.service}
              </p>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30"
                >
                  Ver Detalhes
                </Button>
                <Button variant="destructive">Cancelar</Button>
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
    </div>
  )
}
