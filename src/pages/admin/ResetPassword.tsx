import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { ArrowLeft } from 'lucide-react'

export default function ResetPassword() {
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Senha Redefinida',
      description:
        'Sua senha foi alterada com sucesso. Você já pode fazer login.',
    })
    navigate('/admin/login')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-light">
      <Card className="mx-auto max-w-sm w-full relative">
        <Link to="/admin/login" className="absolute top-4 left-4 z-10">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <CardHeader className="text-center">
          <img
            src="https://img.usecurling.com/i?q=sorrilie-odontologia&color=solid-black"
            alt="Logo Sorriliê"
            className="h-12 mx-auto mb-4"
          />
          <CardTitle className="text-2xl">Redefinir Senha</CardTitle>
          <CardDescription>Crie uma nova senha para sua conta.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Nova Senha</Label>
              <Input id="password" type="password" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input id="confirm-password" type="password" required />
            </div>
            <Button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              Salvar Nova Senha
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
