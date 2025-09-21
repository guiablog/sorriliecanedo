import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useNotificationStore } from '@/stores/notification'
import { toast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminNotifications() {
  const { notifications, addNotification, loading } = useNotificationStore()
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [segment, setSegment] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !segment) {
      toast({
        title: 'Erro',
        description: 'Título e segmento são obrigatórios.',
        variant: 'destructive',
      })
      return
    }
    try {
      await addNotification({ title, message, segment })
      toast({ title: 'Notificação enviada com sucesso!' })
      setTitle('')
      setMessage('')
      setSegment('')
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a notificação.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Enviar Notificações</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Nova Notificação</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="segment">Segmento</Label>
                <Select value={segment} onValueChange={setSegment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o segmento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos os Pacientes">
                      Todos os Pacientes
                    </SelectItem>
                    <SelectItem value="Com Consultas Agendadas">
                      Com Consultas Agendadas
                    </SelectItem>
                    <SelectItem value="Sem Consultas Agendadas">
                      Sem Consultas Agendadas
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                Enviar Notificação
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Histórico de Envios</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Segmento</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={3}>
                          <Skeleton className="h-8 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  : notifications.map((h, i) => (
                      <TableRow key={i}>
                        <TableCell>{h.title}</TableCell>
                        <TableCell>{h.segment}</TableCell>
                        <TableCell>{h.date}</TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
