import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

const services = ['Limpeza', 'Clareamento', 'Restauração', 'Avaliação']
const availableTimes = ['09:00', '10:30', '11:00', '14:00', '15:30']

export default function Schedule() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedProfessional, setSelectedProfessional] = useState<
    string | null
  >(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const { professionals } = useProfessionalStore()
  const activeProfessionals = professionals.filter((p) => p.status === 'Ativo')

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>1. Escolha o Serviço</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {services.map((s) => (
                <Button
                  key={s}
                  variant={selectedService === s ? 'secondary' : 'outline'}
                  onClick={() => setSelectedService(s)}
                >
                  {s}
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
                  className="w-full justify-start"
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
                      className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-secondary [&:has([data-state=checked])]:border-secondary"
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
              <CardTitle>Agendamento Confirmado!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-left">
              <p className="flex items-center">
                <Stethoscope className="mr-2 h-4 w-4 text-accent" />
                <strong>Serviço:</strong> {selectedService}
              </p>
              <p className="flex items-center">
                <User className="mr-2 h-4 w-4 text-accent" />
                <strong>Profissional:</strong> {selectedProfessional}
              </p>
              <p className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4 text-accent" />
                <strong>Data:</strong> {selectedDate?.toLocaleDateString()}
              </p>
              <p className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-accent" />
                <strong>Horário:</strong> {selectedTime}
              </p>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  const handleNext = () => {
    if (step === 1 && selectedService) setStep(2)
    else if (step === 2 && selectedProfessional) setStep(3)
    else if (step === 3 && selectedDate && selectedTime) {
      setStep(4)
      toast({ title: 'Agendamento realizado com sucesso!' })
    }
  }

  return (
    <div className="p-4 space-y-4 animate-fade-in-up">
      {renderStep()}
      <div className="flex justify-between">
        {step > 1 && step < 4 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Voltar
          </Button>
        )}
        {step < 3 && (
          <Button
            onClick={handleNext}
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground ml-auto"
          >
            Próximo
          </Button>
        )}
        {step === 3 && (
          <Button
            onClick={handleNext}
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            Confirmar Agendamento
          </Button>
        )}
      </div>
    </div>
  )
}
