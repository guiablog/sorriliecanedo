import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  User,
  Stethoscope,
  Calendar as CalendarIcon,
  Clock,
} from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { useProfessionalStore } from '@/stores/professional'
import { useAppointmentStore } from '@/stores/appointment'
import { useAuthStore } from '@/stores/auth'
import { useServiceStore } from '@/stores/service'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ReviewDrawer } from '@/components/ReviewDrawer'

const availableTimes = ['09:00', '10:30', '11:00', '14:00', '15:30']

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

export default function Schedule() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedProfessional, setSelectedProfessional] = useState<
    string | null
  >(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isReviewDrawerOpen, setReviewDrawerOpen] = useState(false)
  const [selectedAppointmentForReview, setSelectedAppointmentForReview] =
    useState<any>(null)

  const { professionals } = useProfessionalStore()
  const { services } = useServiceStore()
  const { appointments, addAppointment } = useAppointmentStore()
  const { fullName } = useAuthStore()

  const activeProfessionals = professionals.filter((p) => p.status === 'Ativo')
  const activeServices = services.filter((s) => s.status === 'Ativo')
  const userAppointments = appointments.filter((a) => a.patient === fullName)

  const handleNext = () => {
    if (step === 1 && !selectedService) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, selecione um serviço.',
        variant: 'destructive',
      })
      return
    }
    if (step === 2 && !selectedProfessional) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, selecione um profissional.',
        variant: 'destructive',
      })
      return
    }
    if (step === 3 && (!selectedDate || !selectedTime)) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, selecione uma data e horário.',
        variant: 'destructive',
      })
      return
    }

    if (step === 3 && selectedDate && selectedTime) {
      if (selectedService && selectedProfessional && fullName) {
        addAppointment({
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedTime,
          patient: fullName,
          service: selectedService,
          professional: selectedProfessional,
          status: 'Pendente',
        })
        setStep(4)
        toast({
          title: 'Agendamento realizado com sucesso!',
          description: 'Sua consulta está pendente de confirmação.',
        })
      }
    } else {
      setStep(step + 1)
    }
  }

  const handleOpenReview = (appointment: any) => {
    setSelectedAppointmentForReview(appointment)
    setReviewDrawerOpen(true)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>1. Escolha o Serviço</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {activeServices.map((s) => (
                <Button
                  key={s.id}
                  variant={selectedService === s.name ? 'secondary' : 'outline'}
                  onClick={() => setSelectedService(s.name)}
                  className="h-12"
                >
                  {s.name}
                </Button>
              ))}
            </CardContent>
          </Card>
        )
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>2. Escolha o Profissional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeProfessionals.map((p) => (
                <Button
                  key={p.id}
                  variant={
                    selectedProfessional === p.name ? 'secondary' : 'outline'
                  }
                  className="w-full justify-start h-12"
                  onClick={() => setSelectedProfessional(p.name)}
                >
                  <User className="mr-2 h-4 w-4" /> {p.name}
                </Button>
              ))}
            </CardContent>
          </Card>
        )
      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>3. Escolha a Data e Horário</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
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
                className="grid grid-cols-3 gap-2 mt-4"
              >
                {availableTimes.map((t) => (
                  <div key={t} className="flex items-center">
                    <RadioGroupItem value={t} id={t} className="peer sr-only" />
                    <Label
                      htmlFor={t}
                      className="flex h-10 w-full items-center justify-center rounded-md border-2 border-muted bg-popover p-2 text-sm hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-secondary [&:has([data-state=checked])]:border-secondary"
                    >
                      {t}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        )
      case 4:
        return (
          <Card className="text-center">
            <CardHeader>
              <CheckCircle className="mx-auto h-12 w-12 text-success" />
              <CardTitle>Agendamento Realizado!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-left">
              <p className="flex items-center">
                <Stethoscope className="mr-2 h-4 w-4 text-accent" />
                <strong>Serviço:</strong>&nbsp;{selectedService}
              </p>
              <p className="flex items-center">
                <User className="mr-2 h-4 w-4 text-accent" />
                <strong>Profissional:</strong>&nbsp;{selectedProfessional}
              </p>
              <p className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4 text-accent" />
                <strong>Data:</strong>&nbsp;
                {selectedDate
                  ? format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR })
                  : ''}
              </p>
              <p className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-accent" />
                <strong>Horário:</strong>&nbsp;{selectedTime}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => navigate('/home')}
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                Voltar para o Início
              </Button>
            </CardFooter>
          </Card>
        )
      default:
        return null
    }
  }

  const getButtonText = () => {
    if (step < 3) return 'Próximo'
    if (step === 3) return 'Confirmar Agendamento'
    return ''
  }

  return (
    <div className="p-4 space-y-4 animate-fade-in-up">
      {renderStep()}
      <div className="flex justify-between gap-2">
        {step > 1 && step < 4 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Voltar
          </Button>
        )}
        {step < 4 && (
          <Button
            onClick={handleNext}
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            {getButtonText()}
          </Button>
        )}
      </div>

      <section className="pt-4">
        <h2 className="text-xl font-semibold text-neutral-dark mb-4">
          Histórico de Consultas
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {userAppointments.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>
                {format(new Date(item.date), 'dd/MM/yyyy')} - {item.service}
              </AccordionTrigger>
              <AccordionContent className="flex justify-between items-center">
                <Badge variant={getStatusVariant(item.status)}>
                  {item.status}
                </Badge>
                {item.status === 'Realizado' && (
                  <Button
                    variant="link"
                    className="text-accent"
                    onClick={() => handleOpenReview(item)}
                  >
                    Avaliar
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <ReviewDrawer
        appointment={selectedAppointmentForReview}
        open={isReviewDrawerOpen}
        onOpenChange={setReviewDrawerOpen}
      />
    </div>
  )
}
