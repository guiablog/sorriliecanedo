import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function Onboarding() {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [notificationsAccepted, setNotificationsAccepted] = useState(false)
  const navigate = useNavigate()

  const handleContinue = () => {
    if (termsAccepted) {
      // Here you would save the notification consent `notificationsAccepted`
      navigate('/register')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-light p-6 md:p-8 justify-between animate-fade-in">
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <img
          src="https://img.usecurling.com/p/400/300?q=friendly%20dentist%20illustration"
          alt="Ilustração de dentista amigável"
          className="w-full max-w-sm mx-auto mb-8 rounded-lg"
        />
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-dark mb-2">
          Bem-vindo(a) à Sorriliê Odontologia!
        </h1>
        <p className="text-neutral-dark/70 max-w-md">
          Agende consultas, receba dicas de saúde bucal e cuide do seu sorriso
          com facilidade.
        </p>
      </div>

      <div className="flex-shrink-0 space-y-6">
        <div className="space-y-4">
          <p className="text-sm text-neutral-dark/80 text-center">
            Para continuar, por favor, leia e aceite nossos{' '}
            <Dialog>
              <DialogTrigger asChild>
                <span className="text-accent font-semibold cursor-pointer">
                  Termos de Uso
                </span>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Termos de Uso</DialogTitle>
                  <DialogDescription className="max-h-[60vh] overflow-y-auto pr-4">
                    Aqui vai o texto completo dos termos de uso...
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            {' e '}
            <Dialog>
              <DialogTrigger asChild>
                <span className="text-accent font-semibold cursor-pointer">
                  Política de Privacidade
                </span>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Política de Privacidade</DialogTitle>
                  <DialogDescription className="max-h-[60vh] overflow-y-auto pr-4">
                    Aqui vai o texto completo da política de privacidade...
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            .
          </p>
          <div className="flex items-center space-x-2 justify-center">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(!!checked)}
            />
            <Label
              htmlFor="terms"
              className="text-sm font-medium text-neutral-dark leading-none"
            >
              Li e concordo com os Termos e a Política de Privacidade.
            </Label>
          </div>
          <div className="flex items-center space-x-2 justify-center">
            <Checkbox
              id="notifications"
              checked={notificationsAccepted}
              onCheckedChange={(checked) => setNotificationsAccepted(!!checked)}
            />
            <Label
              htmlFor="notifications"
              className="text-sm font-medium text-neutral-dark leading-none"
            >
              Sim, desejo receber notificações.
            </Label>
          </div>
        </div>
        <Button
          onClick={handleContinue}
          disabled={!termsAccepted}
          className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          size="lg"
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}
