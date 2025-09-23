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
  CheckCircle,
  User,
  Stethoscope,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Phone,
} from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { useProfessionalStore } from '@/stores/professional'
import { useAppointmentStore } from '@/stores/appointment'
import { useAuthStore } from '@/stores/auth'
import { useServiceStore } from '@/stores/service'
import { useAppSettingsStore } from '@/stores/appSettings'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const availableTimes = ['09:00', '10:30', '11:00', '14:00', '15:30']

export default function Schedule() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedProfessional, setSelectedProfessional] = useState<
    string | null
  >(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const { professionals, loading: professionalsLoading } =
    useProfessionalStore()
  const { services, loading: servicesLoading } = useServiceStore()
  const { addAppointment } = useAppointmentStore()
  const { name } = useAuthStore()
  const { settings } = useAppSettingsStore()

  const activeProfessionals = professionals.filter((p) => p.status === 'Ativo')
  const activeServices = services.filter((s) => s.status === 'Ativo')

  const handleNext = async () => {
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
      if (selectedService && selectedProfessional && name) {
        try {
          await addAppointment({
            date: format(selectedDate, 'yyyy-MM-dd'),
            time: selectedTime,
            patient: name,
            service: selectedService,
            professional: selectedProfessional,
            status: 'Pendente',
          })
          setStep(4)
          toast({
            title: 'Agendamento realizado com sucesso!',
            description: 'Sua consulta está pendente de confirmação.',
          })
        } catch (error) {
          toast({
            title: 'Erro',
            description: 'Não foi possível realizar o agendamento.',
            variant: 'destructive',
          })
        }
      }
    } else {
      setStep(step + 1)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className="bg-schedule-background">
            <CardHeader>
              <CardTitle>1. Escolha o Serviço</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {servicesLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))
                : activeServices.map((s) => (
                    <Button
                      key={s.id}
                      variant={
                        selectedService === s.name ? 'secondary' : 'outline'
                      }
                      onClick={() => setSelectedService(s.name)}
                      className="h-12 font-bold border-2"
                    >
                      {s.name}
                    </Button>
                  ))}
            </CardContent>
          </Card>
        )
      case 2:
        return (
          <Card className="bg-schedule-background">
            <CardHeader>
              <CardTitle>2. Escolha o Profissional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {professionalsLoading
                ? Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-2">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-4 w-[100px]" />
                      </div>
                    </div>
                  ))
                : activeProfessionals.map((p) => (
                    <Button
                      key={p.id}
                      variant="outline"
                      className={cn(
                        'w-full justify-start h-auto p-2 text-left font-bold border-2',
                        selectedProfessional === p.name && 'border-secondary',
                      )}
                      onClick={() => setSelectedProfessional(p.name)}
                    >
                      <Avatar className="h-16 w-16 mr-4">
                        <AvatarImage src={p.photo_url || undefined} />
                        <AvatarFallback>
                          <User className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold">{p.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {p.specialty}
                        </span>
                      </div>
                    </Button>
                  ))}
            </CardContent>
          </Card>
        )
      case 3:
        return (
          <Card className="bg-schedule-background">
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
                locale={ptBR}
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
                      className="flex h-10 w-full items-center justify-center rounded-md border-2 border-muted bg-popover p-2 text-sm font-bold hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-secondary [&:has([data-state=checked])]:border-secondary"
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
          <Card className="text-center bg-schedule-background">
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
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            className="font-bold border-2"
          >
            Voltar
          </Button>
        )}
        {step < 4 && (
          <Button
            onClick={handleNext}
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold border-2 border-secondary"
          >
            {getButtonText()}
          </Button>
        )}
      </div>

      {step < 4 && (
        <>
          {settings?.clinic_address && settings?.clinic_phone && (
            <Card className="bg-schedule-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-5 w-5 text-accent" />
                  Endereço:
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">{settings.clinic_address}</p>
                <a
                  href={`tel:${settings.clinic_phone.replace(/\D/g, '')}`}
                  className="flex items-center gap-2 text-sm text-secondary font-medium hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  Telefone: {settings.clinic_phone}
                </a>
              </CardContent>
            </Card>
          )}
          <Card className="bg-schedule-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-5 w-5 text-accent" />
                Localização da Clínica
              </CardTitle>
            </CardHeader>
            <a
              href="https://maps.app.goo.gl/vQhX47tweSYcdg478?g_st=ac"
              target="_blank"
              rel="noopener noreferrer"
            >
              <CardContent className="p-0">
                <iframe
                  src="https://maps.google.com/maps?q=-16.729138263625725,-49.08742592883618&z=17&output=embed"
                  className="w-full h-64 border-0 rounded-b-lg pointer-events-none"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização da Clínica Sorriliê"
                ></iframe>
              </CardContent>
            </a>
          </Card>
        </>
      )}
    </div>
  )
}
