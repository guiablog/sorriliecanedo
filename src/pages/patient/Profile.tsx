import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useAuthStore } from '@/stores/auth'
import { usePatientStore } from '@/stores/patient'
import { isValidCPF } from '@/lib/utils'
import { whatsappMask, cpfMask } from '@/lib/masks'

const profileSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Nome deve ter pelo menos 3 caracteres.' }),
  cpf: z.string().refine(isValidCPF, {
    message: 'Por favor, insira um CPF válido.',
  }),
  whatsapp: z.string().min(14, { message: 'WhatsApp inválido.' }),
  email: z.string().email({ message: 'E-mail inválido.' }),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function Profile() {
  const navigate = useNavigate()
  const { fullName, logout } = useAuthStore()
  const { patients, updatePatient } = usePatientStore()

  const currentUser = patients.find((p) => p.name === fullName)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      cpf: '',
      whatsapp: '',
      email: '',
    },
  })

  useEffect(() => {
    if (currentUser) {
      form.reset({
        name: currentUser.name,
        cpf: currentUser.cpf,
        whatsapp: currentUser.whatsapp,
        email: currentUser.email,
      })
    }
  }, [currentUser, form])

  function onSubmit(data: ProfileFormValues) {
    if (!currentUser) return
    updatePatient(currentUser.cpf, data)
    toast({ title: 'Alterações salvas com sucesso!' })
  }

  const handleLogout = () => {
    logout()
    navigate('/onboarding')
  }

  return (
    <div className="p-4 space-y-8 animate-fade-in-up">
      <section>
        <h2 className="text-xl font-semibold text-neutral-dark mb-4">
          Dados Pessoais
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(cpfMask(e.target.value))}
                    />
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
                    <Input
                      {...field}
                      onChange={(e) =>
                        field.onChange(whatsappMask(e.target.value))
                      }
                    />
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
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              Salvar Alterações
            </Button>
          </form>
        </Form>
      </section>

      <Button variant="destructive" className="w-full" onClick={handleLogout}>
        Sair
      </Button>
    </div>
  )
}
