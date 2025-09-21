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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { AdminUserForm, AdminUserFormValues } from '@/components/AdminUserForm'
import { adminUserService } from '@/services/adminUserService'
import { AdminUser } from '@/types/admin'
import { format } from 'date-fns'
import { useAppSettingsStore } from '@/stores/appSettings'
import { storageService } from '@/services/storageService'
import { Loader2 } from 'lucide-react'

export default function AdminSettings() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [isModalOpen, setModalOpen] = useState(false)
  const {
    settings,
    updateLogoUrl,
    loading: settingsLoading,
  } = useAppSettingsStore()
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)

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

  const handleFormSubmit = async (data: AdminUserFormValues) => {
    try {
      await adminUserService.createAdminUser(data)
      toast({ title: 'Administrador adicionado com sucesso!' })
      setModalOpen(false)
      fetchAdminUsers()
    } catch (error: any) {
      const isDuplicate = error.message?.includes('duplicate key value')
      toast({
        title: 'Erro',
        description: isDuplicate
          ? 'Este e-mail já está em uso.'
          : 'Não foi possível adicionar o administrador.',
        variant: 'destructive',
      })
    }
  }

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploadingLogo(true)
    try {
      const publicUrl = await storageService.uploadImage(file, 'imagens')
      await updateLogoUrl(publicUrl)
      toast({ title: 'Logo atualizado com sucesso!' })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro no Upload',
        description: 'Não foi possível enviar o novo logo.',
        variant: 'destructive',
      })
    } finally {
      setIsUploadingLogo(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Configurações</h1>
      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
          <CardDescription>
            Personalize a aparência do aplicativo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
              onChange={handleLogoUpload}
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
        </CardContent>
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
            onClick={() => setModalOpen(true)}
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
                  <TableHead>Criado em</TableHead>
                  <TableHead>Status</TableHead>
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
                          {format(new Date(user.created_at), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>{user.status}</TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Administrador</DialogTitle>
          </DialogHeader>
          <AdminUserForm
            onSubmit={handleFormSubmit}
            onCancel={() => setModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
