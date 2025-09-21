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
import { toast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { AdminUserForm, AdminUserFormValues } from '@/components/AdminUserForm'
import { adminUserService } from '@/services/adminUserService'
import { AdminUser } from '@/types/admin'
import { format } from 'date-fns'

export default function AdminSettings() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setModalOpen] = useState(false)

  const fetchAdminUsers = async () => {
    setLoading(true)
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
      setLoading(false)
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
      fetchAdminUsers() // Refresh the list
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Configurações</h1>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Usuários Administrativos</h2>
          <Button
            onClick={() => setModalOpen(true)}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            Adicionar Administrador
          </Button>
        </div>
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
              {loading
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
      </div>

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
