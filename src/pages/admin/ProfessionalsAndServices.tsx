import { useState } from 'react'
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { useProfessionalStore, Professional } from '@/stores/professional'
import { useServiceStore, Service } from '@/stores/service'
import { ProfessionalForm } from '@/components/ProfessionalForm'
import { ServiceForm } from '@/components/ServiceForm'
import { toast } from '@/components/ui/use-toast'

export default function AdminProfessionalsAndServices() {
  const {
    professionals,
    addProfessional,
    updateProfessional,
    deleteProfessional,
  } = useProfessionalStore()
  const { services, addService, updateService, deleteService } =
    useServiceStore()

  const [isProfessionalModalOpen, setProfessionalModalOpen] = useState(false)
  const [isServiceModalOpen, setServiceModalOpen] = useState(false)
  const [editingProfessional, setEditingProfessional] =
    useState<Professional | null>(null)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const handleProfessionalSubmit = (data: any) => {
    if (editingProfessional) {
      updateProfessional({ ...editingProfessional, ...data })
      toast({ title: 'Profissional atualizado com sucesso!' })
    } else {
      addProfessional(data)
      toast({ title: 'Profissional adicionado com sucesso!' })
    }
    setEditingProfessional(null)
    setProfessionalModalOpen(false)
  }

  const handleServiceSubmit = (data: any) => {
    if (editingService) {
      updateService({ ...editingService, ...data })
      toast({ title: 'Serviço atualizado com sucesso!' })
    } else {
      addService(data)
      toast({ title: 'Serviço adicionado com sucesso!' })
    }
    setEditingService(null)
    setServiceModalOpen(false)
  }

  const openProfessionalModal = (professional: Professional | null = null) => {
    setEditingProfessional(professional)
    setProfessionalModalOpen(true)
  }

  const openServiceModal = (service: Service | null = null) => {
    setEditingService(service)
    setServiceModalOpen(true)
  }

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
            <Button
              onClick={() => openProfessionalModal()}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              Adicionar Profissional
            </Button>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Especialidade</TableHead>
                  <TableHead>CRO</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {professionals.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.specialty}</TableCell>
                    <TableCell>{p.cro}</TableCell>
                    <TableCell>{p.status}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openProfessionalModal(p)}
                          >
                            Editar
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-destructive"
                              >
                                Excluir
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Tem certeza?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Essa ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteProfessional(p.id)}
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="services" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => openServiceModal()}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
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
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.duration}</TableCell>
                    <TableCell>{s.status}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openServiceModal(s)}>
                            Editar
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-destructive"
                              >
                                Excluir
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Tem certeza?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Essa ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteService(s.id)}
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog
        open={isProfessionalModalOpen}
        onOpenChange={setProfessionalModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProfessional ? 'Editar' : 'Adicionar'} Profissional
            </DialogTitle>
          </DialogHeader>
          <ProfessionalForm
            professional={editingProfessional}
            onSubmit={handleProfessionalSubmit}
            onCancel={() => {
              setEditingProfessional(null)
              setProfessionalModalOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isServiceModalOpen} onOpenChange={setServiceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Editar' : 'Adicionar'} Serviço
            </DialogTitle>
          </DialogHeader>
          <ServiceForm
            service={editingService}
            onSubmit={handleServiceSubmit}
            onCancel={() => {
              setEditingService(null)
              setServiceModalOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
