import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePatientStore } from '@/stores/patient'
import { isValidCPF } from '@/lib/utils'
import { cpfMask } from '@/lib/masks'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  cpf: z.string().refine(isValidCPF, {
    message: 'Por favor, insira um CPF válido.',
  }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const { patients } = usePatientStore()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { cpf: '' },
  })

  function onSubmit(data: LoginFormValues) {
    const maskedCpf = cpfMask(data.cpf)
    const patientExists = patients.some(
      (p) => p.cpf === maskedCpf && p.status === 'Ativo',
    )

    navigate('/register', {
      state: {
        cpf: maskedCpf,
        isLogin: patientExists,
      },
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-light p-6 md:p-8 justify-center items-center animate-fade-in">
      <div className="w-full max-w-sm text-center">
        <img
          src="https://img.usecurling.com/i?q=sorrilie-odontologia&color=solid-black"
          alt="Logo Sorriliê"
          className="h-12 mx-auto mb-6"
        />
        <h1 className="text-lg font-semibold text-neutral-dark mb-4">
          Faça login e aproveite o Aplicativo da Clinica Sorriliê
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem className="text-left">
                  <Label htmlFor="cpf">CPF</Label>
                  <FormControl>
                    <Input
                      id="cpf"
                      placeholder="000.000.000-00"
                      {...field}
                      onChange={(e) => field.onChange(cpfMask(e.target.value))}
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
              Próximo
            </Button>
          </form>
        </Form>
        <div className="mt-6">
          <Link
            to="/register"
            className="font-semibold text-accent hover:underline"
          >
            Novo usuário? Criar conta
          </Link>
        </div>
      </div>
    </div>
  )
}
