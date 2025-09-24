import { Link } from 'react-router-dom'
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
import { Seo } from '@/components/Seo'

export default function ForgotPassword() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Instruções Enviadas',
      description:
        'Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.',
    })
  }

  return (
    <>
      <Seo
        title="Recuperar Senha Admin - Sorriliê Odontologia"
        description="Recupere o acesso ao painel administrativo da Clínica Sorriliê Odontologia."
      />
      <div className="flex items-center justify-center min-h-screen bg-neutral-light">
        <Card className="mx-auto max-w-sm w-full">
          <CardHeader className="text-center">
            <img
              src="https://img.usecurling.com/i?q=sorrilie-odontologia&color=solid-black"
              alt="Logo Sorriliê"
              className="h-12 mx-auto mb-4"
            />
            <CardTitle className="text-2xl">Recuperar Senha</CardTitle>
            <CardDescription>
              Digite seu e-mail para receber as instruções.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@sorrilie.com"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                Enviar
              </Button>
              <div className="mt-4 text-center text-sm">
                Lembrou a senha?{' '}
                <Link to="/admin/login" className="underline">
                  Voltar para o login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
