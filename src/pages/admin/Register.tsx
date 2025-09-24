import { useEffect, useState } from 'react'
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
import { toast } from '@/components/ui/use-toast'
import { adminUserService } from '@/services/adminUserService'
import { Seo } from '@/components/Seo'

const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'Nome deve ter pelo menos 3 caracteres.' }),
    email: z.string().email({ message: 'E-mail inválido.' }),
    password: z
      .string()
      .min(6, { message: 'Senha deve ter no mínimo 6 caracteres.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function AdminRegister() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkAdmins = async () => {
      const count = await adminUserService.getAdminUsersCount()
      if (count > 0) {
        toast({
          title: 'Acesso Negado',
          description: 'Um administrador já está cadastrado.',
          variant: 'destructive',
        })
        navigate('/admin/login')
      }
    }
    checkAdmins()
  }, [navigate])

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const handleRegister = async (data: RegisterFormValues) => {
    setIsLoading(true)
    try {
      await adminUserService.createAdminUser(data)
      toast({
        title: 'Cadastro Realizado!',
        description:
          'O primeiro administrador foi criado. Verifique seu e-mail para confirmação.',
      })
      navigate('/admin/login')
    } catch (error: any) {
      const isDuplicate =
        error.message?.includes('duplicate key value') ||
        error.message?.includes('already registered')
      toast({
        title: 'Falha no Cadastro',
        description: isDuplicate
          ? 'Este e-mail já está em uso.'
          : 'Não foi possível criar o usuário.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Seo
        title="Cadastro Admin - Sorriliê Odontologia"
        description="Cadastro do primeiro administrador do painel da Clínica Sorriliê Odontologia."
      />
      <div className="flex items-center justify-center min-h-screen bg-neutral-light">
        <Card className="mx-auto max-w-sm w-full">
          <CardHeader className="text-center">
            <img
              src="https://img.usecurling.com/i?q=sorrilie-odontologia&color=solid-black"
              alt="Logo Sorriliê"
              className="h-12 mx-auto mb-4"
            />
            <CardTitle className="text-2xl">Cadastrar Administrador</CardTitle>
            <CardDescription>
              Crie o primeiro usuário para acessar o painel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleRegister)}
                className="grid gap-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Senha</FormLabel>
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
                  {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              Já tem uma conta?{' '}
              <Link to="/admin/login" className="underline">
                Fazer login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
