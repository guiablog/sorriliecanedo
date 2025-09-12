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

const history = [
  {
    title: 'Promoção de Clareamento',
    segment: 'Todos os Pacientes',
    date: '12/10/2025',
  },
  {
    title: 'Lembrete de Agendamento',
    segment: 'Pacientes com consulta',
    date: '11/10/2025',
  },
]

export default function AdminNotifications() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Enviar Notificações</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Nova Notificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input id="title" />
            </div>
            <div>
              <Label htmlFor="message">Mensagem</Label>
              <Textarea id="message" />
            </div>
            <div>
              <Label htmlFor="segment">Segmento</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o segmento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Pacientes</SelectItem>
                  <SelectItem value="scheduled">
                    Com Consultas Agendadas
                  </SelectItem>
                  <SelectItem value="not-scheduled">
                    Sem Consultas Agendadas
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              Enviar Notificação
            </Button>
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
                {history.map((h) => (
                  <TableRow key={h.title}>
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
