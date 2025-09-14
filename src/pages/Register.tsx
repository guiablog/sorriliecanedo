import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { useAuthStore } from '@/stores/auth'

const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: 'Nome deve ter pelo menos 3 caracteres.' }),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF inválido. Use o formato 000.000.000-00.',
  }),
  whatsapp: z
    .string()
    .transform((val) => val.replace(/\D/g, ''))
    .pipe(
      z
        .string()
        .min(10, { message: 'WhatsApp deve ter pelo menos 10 dígitos.' })
        .max(11, { message: 'WhatsApp deve ter no máximo 11 dígitos.' }),
    ),
  email: z.string().email({ message: 'E-mail inválido.' }),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function Register() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      cpf: '',
      whatsapp: '',
      email: '',
    },
  })

  function onSubmit(data: RegisterFormValues) {
    console.log(data)
    login('patient')
    toast({
      title: 'Cadastro realizado com sucesso!',
      description: 'Você será redirecionado para a tela inicial.',
    })
    setTimeout(() => navigate('/'), 1500)
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-light p-6 md:p-8 justify-center animate-fade-in">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <img
            src="https://img.usecurling.com/i?q=sorrilie-odontologia&color=solid-black"
            alt="Logo Sorriliê"
            className="h-12 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-neutral-dark">
            Crie sua Conta
          </h1>
          <p className="text-neutral-dark/70">
            Preencha seus dados para começar a usar o aplicativo.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input placeholder="000.000.000-00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} />
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
                      placeholder="seu@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              size="lg"
            >
              Cadastrar
            </Button>
          </form>
        </Form>
        <p className="mt-6 text-center text-sm text-neutral-dark/70">
          Já tem uma conta?{' '}
          <Link to="/" className="font-semibold text-accent hover:underline">
            Faça login.
          </Link>
        </p>
      </div>
    </div>
  )
}
