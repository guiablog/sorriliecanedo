import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/components/ui/use-toast'

const loginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido.' }),
  password: z.string().min(1, 'Senha é obrigatória.'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function AdminLogin() {
  const navigate = useNavigate()
  const adminLogin = useAuthStore((state) => state.adminLogin)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const handleLogin = async (data: LoginFormValues) => {
    setIsLoading(true)
    const success = await adminLogin(data.email, data.password)
    setIsLoading(false)

    if (success) {
      navigate('/admin/dashboard')
    } else {
      toast({
        title: 'Falha no Login',
        description: 'Credenciais inválidas ou usuário inativo.',
        variant: 'destructive',
      })
      form.setError('root', { message: 'Credenciais inválidas' })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-light">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <img
            src="https://img.usecurling.com/i?q=sorrilie-odontologia&color=solid-black"
            alt="Logo Sorriliê"
            className="h-12 mx-auto mb-4"
          />
          <CardTitle className="text-2xl">Login Administrativo</CardTitle>
          <CardDescription>
            Acesse o painel para gerenciar a clínica.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="grid gap-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@sorrilie.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Senha</FormLabel>
                      <Link
                        to="/admin/forgot-password"
                        className="ml-auto inline-block text-sm underline"
                      >
                        Esqueceu sua senha?
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
