import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
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
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { contactService } from '@/services/contactService'
import { useAuthStore } from '@/stores/auth'
import { usePatientStore } from '@/stores/patient'
import { useEffect, useState } from 'react'
import { Seo } from '@/components/Seo'
import { Loader2 } from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(3, { message: 'Nome é obrigatório.' }),
  email: z.string().email({ message: 'E-mail inválido.' }),
  phone: z.string().optional(),
  subject: z.string().min(5, { message: 'Assunto é obrigatório.' }),
  message: z.string().min(10, { message: 'Mensagem é obrigatória.' }),
})

type ContactFormValues = z.infer<typeof contactSchema>

export default function Contact() {
  const { name: authName } = useAuthStore()
  const { patients } = usePatientStore()
  const [isLoading, setIsLoading] = useState(false)

  const currentUser = patients.find((p) => p.name === authName)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  })

  useEffect(() => {
    if (currentUser) {
      form.reset({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.whatsapp,
        subject: '',
        message: '',
      })
    }
  }, [currentUser, form])

  async function onSubmit(data: ContactFormValues) {
    setIsLoading(true)
    try {
      await contactService.submitInquiry(data)
      toast({
        title: 'Mensagem Enviada!',
        description: 'Obrigado por entrar em contato. Responderemos em breve.',
      })
      form.reset({
        ...form.getValues(),
        subject: '',
        message: '',
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar sua mensagem. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Seo
        title="Fale Conosco - Sorriliê Odontologia"
        description="Entre em contato com a Clínica Sorriliê Odontologia para tirar suas dúvidas ou enviar sugestões."
      />
      <div className="p-4 animate-fade-in-up">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome completo" {...field} />
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
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assunto</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Sobre o que você quer falar?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite sua mensagem aqui..."
                      className="min-h-[120px]"
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
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Enviando...' : 'Enviar Mensagem'}
            </Button>
          </form>
        </Form>
      </div>
    </>
  )
}
