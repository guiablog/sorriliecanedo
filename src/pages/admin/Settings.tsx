import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { AdminUserForm, AdminUserFormValues } from '@/components/AdminUserForm'
import { adminUserService } from '@/services/adminUserService'
import { AdminUser } from '@/types/admin'
import { format } from 'date-fns'
import { useAppSettingsStore } from '@/stores/appSettings'
import { storageService } from '@/services/storageService'
import { Loader2, MoreHorizontal, Trash2, Edit, View } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { AdminUserDetailsModal } from '@/components/AdminUserDetailsModal'
import { useAuthStore } from '@/stores/auth'

const settingsSchema = z.object({
  whatsapp_contact: z
    .string()
    .min(10, {
      message: 'Número de WhatsApp deve ter pelo menos 10 caracteres.',
    }),
  whatsapp_button_enabled: z.boolean(),
  whatsapp_icon_url: z.string().url().optional().nullable(),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

export default function AdminSettings() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [isFormModalOpen, setFormModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false)
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const { adminUser: currentAdmin } = useAuthStore()

  const {
    settings,
    updateAppSettings,
    loading: settingsLoading,
  } = useAppSettingsStore()
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [isUploadingSplash, setIsUploadingSplash] = useState(false)
  const [isUploadingWpp, setIsUploadingWpp] = useState(false)

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      whatsapp_contact: '',
      whatsapp_button_enabled: true,
      whatsapp_icon_url: null,
    },
  })

  useEffect(() => {
    if (settings) {
      form.reset({
        whatsapp_contact: settings.whatsapp_contact || '',
        whatsapp_button_enabled: settings.whatsapp_button_enabled ?? true,
        whatsapp_icon_url: settings.whatsapp_icon_url,
      })
    }
  }, [settings, form])

  const fetchAdminUsers = async () => {
    setLoadingUsers(true)
    try {
      const users = await adminUserService.getAllAdminUsers()
      setAdminUsers(users)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os administradores.',
        variant: 'destructive',
      })
    } finally {
      setLoadingUsers(false)
    }
  }

  useEffect(() => {
    fetchAdminUsers()
  }, [])

  const handleAdminFormSubmit = async (data: AdminUserFormValues) => {
    try {
      if (selectedUser) {
        await adminUserService.updateAdminUser(
          selectedUser.user_id,
          data as any,
        )
        toast({ title: 'Administrador atualizado com sucesso!' })
      } else {
        await adminUserService.createAdminUser(data as any)
        toast({ title: 'Administrador adicionado com sucesso!' })
      }
      setFormModalOpen(false)
      setSelectedUser(null)
      fetchAdminUsers()
    } catch (error: any) {
      const isDuplicate =
        error.message?.includes('duplicate key value') ||
        error.message?.includes('already registered')
      toast({
        title: 'Erro',
        description: isDuplicate
          ? 'Este e-mail já está em uso.'
          : 'Não foi possível salvar o administrador.',
        variant: 'destructive',
      })
    }
  }

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'splash' | 'wpp',
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    const setUploading = {
      logo: setIsUploadingLogo,
      splash: setIsUploadingSplash,
      wpp: setIsUploadingWpp,
    }[type]
    setUploading(true)

    try {
      const publicUrl = await storageService.uploadImage(file, 'imagens')
      const settingKey = {
        logo: 'logo_url',
        splash: 'splash_screen_image_url',
        wpp: 'whatsapp_icon_url',
      }[type]
      await updateAppSettings({ [settingKey]: publicUrl })
      if (type === 'wpp') {
        form.setValue('whatsapp_icon_url', publicUrl)
      }
      toast({ title: 'Imagem atualizada com sucesso!' })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro no Upload',
        description: 'Não foi possível enviar a nova imagem.',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSettingsSubmit = async (data: SettingsFormValues) => {
    try {
      await updateAppSettings(data)
      toast({ title: 'Configurações salvas com sucesso!' })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações.',
        variant: 'destructive',
      })
    }
  }

  const handleViewDetails = (user: AdminUser) => {
    setSelectedUser(user)
    setDetailsModalOpen(true)
  }

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user)
    setFormModalOpen(true)
  }

  const handleDeleteUser = (user: AdminUser) => {
    setSelectedUser(user)
    setDeleteAlertOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedUser) return
    try {
      await adminUserService.deleteAdminUser(selectedUser.user_id)
      toast({ title: 'Administrador excluído com sucesso!' })
      fetchAdminUsers()
    } catch (error: any) {
      toast({
        title: 'Erro',
        description:
          error.message || 'Não foi possível excluir o administrador.',
        variant: 'destructive',
      })
    } finally {
      setDeleteAlertOpen(false)
      setSelectedUser(null)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Configurações</h1>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSettingsSubmit)}>
            <CardHeader>
              <CardTitle>Branding e Contato</CardTitle>
              <CardDescription>
                Personalize a aparência e informações de contato do aplicativo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Logo da Clínica</Label>
                {settingsLoading ? (
                  <Skeleton className="h-16 w-32 rounded-md" />
                ) : (
                  settings?.logo_url && (
                    <img
                      src={settings.logo_url}
                      alt="Logo atual"
                      className="h-16 w-auto rounded-md bg-muted p-2"
                    />
                  )
                )}
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'logo')}
                  disabled={isUploadingLogo}
                  className="max-w-sm"
                />
                {isUploadingLogo && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Imagem da Splash Screen</Label>
                {settingsLoading ? (
                  <Skeleton className="h-16 w-32 rounded-md" />
                ) : (
                  settings?.splash_screen_image_url && (
                    <img
                      src={settings.splash_screen_image_url}
                      alt="Splash Screen atual"
                      className="h-16 w-auto rounded-md bg-muted p-2"
                    />
                  )
                )}
                <Input
                  id="splash-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'splash')}
                  disabled={isUploadingSplash}
                  className="max-w-sm"
                />
                {isUploadingSplash && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </div>
                )}
              </div>
              <FormField
                control={form.control}
                name="whatsapp_contact"
                render={({ field }) => (
                  <FormItem className="max-w-sm">
                    <Label>WhatsApp para Contato</Label>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsapp_button_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm max-w-sm">
                    <div className="space-y-0.5">
                      <Label>Habilitar Botão do WhatsApp</Label>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <Label>Ícone do WhatsApp</Label>
                {settingsLoading ? (
                  <Skeleton className="h-16 w-16 rounded-full" />
                ) : (
                  form.watch('whatsapp_icon_url') && (
                    <img
                      src={form.watch('whatsapp_icon_url')!}
                      alt="Ícone do WhatsApp"
                      className="h-16 w-16 rounded-full bg-muted p-2"
                    />
                  )
                )}
                <Input
                  id="wpp-icon-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'wpp')}
                  disabled={isUploadingWpp}
                  className="max-w-sm"
                />
                {isUploadingWpp && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                Salvar Alterações
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Usuários Administrativos</CardTitle>
            <CardDescription>
              Gerencie quem pode acessar o painel.
            </CardDescription>
          </div>
          <Button
            onClick={() => {
              setSelectedUser(null)
              setFormModalOpen(true)
            }}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            Adicionar Administrador
          </Button>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingUsers
                  ? Array.from({ length: 2 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={4}>
                          <Skeleton className="h-8 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  : adminUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.status === 'active' ? 'Ativo' : 'Inativo'}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleViewDetails(user)}
                              >
                                <View className="mr-2 h-4 w-4" /> Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="mr-2 h-4 w-4" /> Editar
                              </DropdownMenuItem>
                              {currentAdmin?.email !== user.email && (
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDeleteUser(user)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormModalOpen} onOpenChange={setFormModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? 'Editar' : 'Adicionar'} Administrador
            </DialogTitle>
          </DialogHeader>
          <AdminUserForm
            adminUser={selectedUser}
            onSubmit={handleAdminFormSubmit}
            onCancel={() => {
              setFormModalOpen(false)
              setSelectedUser(null)
            }}
          />
        </DialogContent>
      </Dialog>

      <AdminUserDetailsModal
        user={selectedUser}
        open={isDetailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o
              usuário "{selectedUser?.name}" e removerá seu acesso ao painel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
