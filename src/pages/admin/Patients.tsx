import { useState, useMemo } from 'react'
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MoreHorizontal, FileDown, Search } from 'lucide-react'
import { usePatientStore, Patient } from '@/stores/patient'
import { toast } from '@/components/ui/use-toast'
import { PatientDetailsModal } from '@/components/PatientDetailsModal'
import { PatientForm, PatientFormValues } from '@/components/PatientForm'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'

export default function AdminPatients() {
  const { patients, updatePatient, deletePatient, loading } = usePatientStore()
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false)
  const [isFormModalOpen, setFormModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPatients = useMemo(() => {
    if (!searchTerm) return patients
    const lowercasedFilter = searchTerm.toLowerCase()
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(lowercasedFilter) ||
        p.email.toLowerCase().includes(lowercasedFilter) ||
        p.whatsapp?.replace(/\D/g, '').includes(lowercasedFilter),
    )
  }, [patients, searchTerm])

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient)
    setDetailsModalOpen(true)
  }

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient)
    setFormModalOpen(true)
  }

  const handleDelete = async (userId: string) => {
    try {
      await deletePatient(userId)
      toast({
        title: 'Sucesso',
        description: 'Paciente excluído com sucesso.',
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o paciente.',
        variant: 'destructive',
      })
    }
  }

  const handleFormSubmit = async (data: PatientFormValues) => {
    if (!selectedPatient || !selectedPatient.user_id) return
    try {
      await updatePatient(selectedPatient.user_id, data)
      toast({ title: 'Paciente atualizado com sucesso!' })
      setFormModalOpen(false)
      setSelectedPatient(null)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as alterações do paciente.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gerenciamento de Pacientes</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" /> Exportar CSV
          </Button>
        </div>
      </div>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por nome, e-mail ou WhatsApp..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              : filteredPatients.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.whatsapp || '-'}</TableCell>
                    <TableCell>{p.email}</TableCell>
                    <TableCell>
                      {format(new Date(p.registered), 'dd/MM/yyyy')}
                    </TableCell>
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
                            onClick={() => handleViewDetails(p)}
                          >
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(p)}>
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
                                  Você tem certeza?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. Isso excluirá
                                  permanentemente o paciente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    p.user_id && handleDelete(p.user_id)
                                  }
                                >
                                  Sim, excluir
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
      <PatientDetailsModal
        patient={selectedPatient}
        open={isDetailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />
      <Dialog open={isFormModalOpen} onOpenChange={setFormModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Paciente</DialogTitle>
          </DialogHeader>
          <PatientForm
            patient={selectedPatient}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setFormModalOpen(false)
              setSelectedPatient(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
