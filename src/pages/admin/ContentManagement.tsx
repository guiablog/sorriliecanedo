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

const tips = [
  {
    title: 'A Importância da Escovação Noturna',
    published: '10/10/2025',
    status: 'Publicado',
  },
  {
    title: 'Use o Fio Dental Diariamente',
    published: '08/10/2025',
    status: 'Publicado',
  },
]

const news = [
  {
    title: 'Novas Tecnologias em Clareamento a Laser',
    published: '05/10/2025',
    status: 'Rascunho',
  },
]

export default function AdminContentManagement() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gerenciamento de Conteúdos</h1>
      <Tabs defaultValue="tips">
        <TabsList>
          <TabsTrigger value="tips">Dicas de Saúde</TabsTrigger>
          <TabsTrigger value="news">Novidades</TabsTrigger>
        </TabsList>
        <TabsContent value="tips" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              Adicionar Dica
            </Button>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Publicado em</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tips.map((item) => (
                  <TableRow key={item.title}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.published}</TableCell>
                    <TableCell>{item.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="news" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              Adicionar Novidade
            </Button>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Publicado em</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.map((item) => (
                  <TableRow key={item.title}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.published}</TableCell>
                    <TableCell>{item.status}</TableCell>
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
