import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, FileDown } from 'lucide-react'

const patients = [
  {
    name: 'Maria da Silva',
    cpf: '123.456.789-00',
    whatsapp: '(11) 98765-4321',
    email: 'maria@email.com',
    registered: '10/09/2025',
    status: 'Ativo',
  },
  {
    name: 'João Pereira',
    cpf: '987.654.321-00',
    whatsapp: '(21) 91234-5678',
    email: 'joao@email.com',
    registered: '05/09/2025',
    status: 'Ativo',
  },
  {
    name: 'Ana Costa',
    cpf: '111.222.333-44',
    whatsapp: '(31) 95555-4444',
    email: 'ana@email.com',
    registered: '01/09/2025',
    status: 'Inativo',
  },
]

export default function AdminPatients() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gerenciamento de Pacientes</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" /> Exportar CSV
          </Button>
          <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            Adicionar Paciente
          </Button>
        </div>
      </div>
      <Input placeholder="Buscar por nome, CPF, e-mail..." />
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((p) => (
              <TableRow key={p.cpf}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.cpf}</TableCell>
                <TableCell>{p.whatsapp}</TableCell>
                <TableCell>{p.email}</TableCell>
                <TableCell>{p.registered}</TableCell>
                <TableCell>{p.status}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Desativar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
