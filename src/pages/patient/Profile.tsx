import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'

const mockHistory = [
  { date: '15/09/2025', service: 'Clareamento', status: 'Realizado' },
  { date: '25/10/2025', service: 'Limpeza de Rotina', status: 'Confirmado' },
  { date: '05/08/2025', service: 'Restauração', status: 'Cancelado' },
]

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Realizado':
      return 'default'
    case 'Confirmado':
      return 'secondary'
    case 'Cancelado':
      return 'destructive'
    default:
      return 'outline'
  }
}

export default function Profile() {
  const handleSaveChanges = () => {
    toast({ title: 'Alterações salvas com sucesso!' })
  }

  return (
    <div className="p-4 space-y-8 animate-fade-in-up">
      <section>
        <h2 className="text-xl font-semibold text-neutral-dark mb-4">
          Dados Pessoais
        </h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nome Completo</Label>
            <Input id="name" defaultValue="Maria da Silva" />
          </div>
          <div>
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input id="whatsapp" defaultValue="(11) 98765-4321" />
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              defaultValue="maria.silva@email.com"
            />
          </div>
          <div>
            <Label htmlFor="cpf">CPF</Label>
            <Input id="cpf" value="123.456.789-00" disabled />
          </div>
          <Button
            onClick={handleSaveChanges}
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            Salvar Alterações
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-neutral-dark mb-4">
          Histórico de Consultas
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {mockHistory.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>
                {item.date} - {item.service}
              </AccordionTrigger>
              <AccordionContent className="flex justify-between items-center">
                <p>Status da consulta:</p>
                <Badge variant={getStatusVariant(item.status)}>
                  {item.status}
                </Badge>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-neutral-dark mb-4">
          Configurações
        </h2>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <Label htmlFor="notifications" className="flex flex-col space-y-1">
            <span>Receber Notificações</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Lembretes de consultas, promoções e novidades.
            </span>
          </Label>
          <Switch id="notifications" defaultChecked />
        </div>
      </section>

      <Button variant="destructive" className="w-full">
        Sair
      </Button>
    </div>
  )
}
