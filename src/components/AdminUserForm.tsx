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
import { AdminUser } from '@/types/admin'
import { useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const baseSchema = {
  name: z
    .string()
    .min(3, { message: 'Nome deve ter pelo menos 3 caracteres.' }),
  email: z.string().email({ message: 'E-mail inválido.' }),
}

const createAdminUserSchema = z
  .object({
    ...baseSchema,
    password: z
      .string()
      .min(6, { message: 'Senha deve ter no mínimo 6 caracteres.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  })

const editAdminUserSchema = z.object({
  ...baseSchema,
  status: z.enum(['active', 'inactive']),
})

export type AdminUserFormValues =
  | z.infer<typeof createAdminUserSchema>
  | z.infer<typeof editAdminUserSchema>

interface AdminUserFormProps {
  adminUser?: AdminUser | null
  onSubmit: (data: AdminUserFormValues) => void
  onCancel: () => void
}

export const AdminUserForm = ({
  adminUser,
  onSubmit,
  onCancel,
}: AdminUserFormProps) => {
  const isEditing = !!adminUser

  const form = useForm<AdminUserFormValues>({
    resolver: zodResolver(
      isEditing ? editAdminUserSchema : createAdminUserSchema,
    ),
    defaultValues: isEditing
      ? {
          name: adminUser.name,
          email: adminUser.email,
          status: adminUser.status,
        }
      : {
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        },
  })

  useEffect(() => {
    if (adminUser) {
      form.reset({
        name: adminUser.name,
        email: adminUser.email,
        status: adminUser.status,
      })
    } else {
      form.reset({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
    }
  }, [adminUser, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Nome do administrador" {...field} />
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
        {!isEditing && (
          <>
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
          </>
        )}
        {isEditing && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            {isEditing ? 'Salvar Alterações' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
