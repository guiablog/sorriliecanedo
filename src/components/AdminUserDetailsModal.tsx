import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AdminUser } from '@/types/admin'
import { User, Mail, Calendar, BadgeCheck } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface AdminUserDetailsModalProps {
  user: AdminUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const AdminUserDetailsModal = ({
  user,
  open,
  onOpenChange,
}: AdminUserDetailsModalProps) => {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Administrador</DialogTitle>
          <DialogDescription>
            Informações completas do usuário.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <User className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Nome Completo</p>
              <p className="font-medium">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Mail className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">E-mail</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Data de Cadastro</p>
              <p className="font-medium">
                {format(new Date(user.created_at), "dd 'de' MMMM, yyyy", {
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <BadgeCheck className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">
                {user.status === 'active' ? 'Ativo' : 'Inativo'}
              </p>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Fechar
        </Button>
      </DialogContent>
    </Dialog>
  )
}
