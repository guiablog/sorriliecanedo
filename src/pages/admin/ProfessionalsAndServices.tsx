import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const professionals = [
  { name: 'Dr. Ricardo Alves', specialty: 'Clínico Geral', status: 'Ativo' },
  { name: 'Dra. Ana Costa', specialty: 'Ortodontista', status: 'Ativo' },
]

const services = [
  { name: 'Limpeza', duration: '45 min', status: 'Ativo' },
  { name: 'Clareamento', duration: '90 min', status: 'Ativo' },
]

export default function AdminProfessionalsAndServices() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profissionais e Serviços</h1>
      <Tabs defaultValue="professionals">
        <TabsList>
          <TabsTrigger value="professionals">Profissionais</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
        </TabsList>
        <TabsContent value="professionals" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              Adicionar Profissional
            </Button>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Especialidade</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {professionals.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.specialty}</TableCell>
                    <TableCell>{p.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="services" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              Adicionar Serviço
            </Button>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((s) => (
                  <TableRow key={s.name}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.duration}</TableCell>
                    <TableCell>{s.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
