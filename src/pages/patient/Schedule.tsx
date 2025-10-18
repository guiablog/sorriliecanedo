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
} from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { useProfessionalStore } from '@/stores/professional'
import { useAppointmentStore } from '@/stores/appointment'
import { useAuthStore } from '@/stores/auth'
import { useServiceStore } from '@/stores/service'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { HistoryCard } from '@/components/HistoryCard'
import { AppointmentHistoryModal } from '@/components/AppointmentHistoryModal'

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
  const [isHistoryModalOpen, setHistoryModalOpen] = useState(false)

  const { professionals, loading: professionalsLoading } =
    useProfessionalStore()
  const { services, loading: servicesLoading } = useServiceStore()
  const { addAppointment } = useAppointmentStore()
  const { name, userId } = useAuthStore()

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
      if (selectedService && selectedProfessional && name && userId) {
        try {
          await addAppointment(
            {
              date: format(selectedDate, 'yyyy-MM-dd'),
              time: selectedTime,
              patient: name,
              service: selectedService,
              professional: selectedProfessional,
              status: 'Pendente',
            },
            userId,
          )
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
                      onClick={() => setSelectedService(s.name)}
                      className={cn(
                        'h-12 font-bold border-2 bg-schedule-button text-black border-primary/20 hover:bg-schedule-button/80',
                        selectedService === s.name &&
                          'bg-accent text-accent-foreground border-accent',
                      )}
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
                      className={cn(
                        'w-full justify-start h-auto p-2 text-left font-bold border-2 bg-schedule-button text-black border-primary/20 hover:bg-schedule-button/80',
                        selectedProfessional === p.name &&
                          'bg-accent text-accent-foreground border-accent',
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
                      className="flex h-10 w-full items-center justify-center rounded-md border-2 border-primary/20 bg-schedule-button p-2 text-sm font-bold text-black hover:bg-schedule-button/80 cursor-pointer peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent peer-data-[state=checked]:text-accent-foreground"
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
      <HistoryCard onClick={() => setHistoryModalOpen(true)} />
      <AppointmentHistoryModal
        open={isHistoryModalOpen}
        onOpenChange={setHistoryModalOpen}
      />
    </div>
  )
}
