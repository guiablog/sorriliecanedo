import { useState, useEffect } from 'react'
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/components/ui/use-toast'
import { adminUserService } from '@/services/adminUserService'
import { Seo } from '@/components/Seo'
import { Skeleton } from '@/components/ui/skeleton'

const loginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido.' }),
  password: z.string().min(1, 'Senha é obrigatória.'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function AdminLogin() {
  const navigate = useNavigate()
  const {
    adminLogin,
    isAuthenticated,
    loading: authLoading,
    userType,
  } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showRegisterLink, setShowRegisterLink] = useState(false)

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (userType === 'admin') {
        navigate('/admin/dashboard', { replace: true })
      } else if (userType === 'patient') {
        navigate('/home', { replace: true })
      }
    }
  }, [isAuthenticated, authLoading, userType, navigate])

  useEffect(() => {
    const checkAdminCount = async () => {
      const count = await adminUserService.getAdminUsersCount()
      setShowRegisterLink(count === 0)
    }
    checkAdminCount()
  }, [])

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const handleLogin = async (data: LoginFormValues) => {
    setIsSubmitting(true)
    const result = await adminLogin(data.email, data.password)
    setIsSubmitting(false)

    if (result !== true) {
      toast({
        title: 'Falha no Login',
        description: result,
        variant: 'destructive',
      })
      form.setError('root', { message: result })
    }
  }

  if (authLoading) {
    return <Skeleton className="h-screen w-screen" />
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <>
      <Seo
        title="Login Admin - Sorriliê Odontologia"
        description="Acesso ao painel administrativo da Clínica Sorriliê Odontologia."
      />
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
                {form.formState.errors.root && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {form.formState.errors.root.message}
                    </AlertDescription>
                  </Alert>
                )}
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
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </Form>
            {showRegisterLink && (
              <div className="mt-4 text-center text-sm">
                <Link to="/admin/register" className="underline">
                  Cadastrar primeiro administrador
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
