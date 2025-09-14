import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface Appointment {
  id: string
  date: string // YYYY-MM-DD
  time: string
  patient: string
  service: string
  professional: string
  status: 'Confirmado' | 'Pendente' | 'Cancelado' | 'Realizado'
}

interface AppointmentState {
  appointments: Appointment[]
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void
}

const initialAppointments: Appointment[] = [
  {
    id: '1',
    date: '2025-10-25',
    time: '10:30',
    patient: 'Maria da Silva',
    service: 'Limpeza de Rotina',
    professional: 'Dr. Ricardo Alves',
    status: 'Confirmado',
  },
  {
    id: '2',
    date: '2025-10-25',
    time: '14:00',
    patient: 'João Pereira',
    service: 'Avaliação',
    professional: 'Dra. Ana Costa',
    status: 'Pendente',
  },
  {
    id: '3',
    date: '2025-10-27',
    time: '09:00',
    patient: 'Carlos Souza',
    service: 'Restauração',
    professional: 'Dr. Ricardo Alves',
    status: 'Confirmado',
  },
  {
    id: '4',
    date: '2025-09-15',
    time: '11:00',
    patient: 'Maria da Silva',
    service: 'Clareamento',
    professional: 'Dra. Ana Costa',
    status: 'Realizado',
  },
  {
    id: '5',
    date: '2025-08-05',
    time: '16:00',
    patient: 'João Pereira',
    service: 'Restauração',
    professional: 'Dr. Ricardo Alves',
    status: 'Cancelado',
  },
  {
    id: '6',
    date: new Date(new Date().setDate(new Date().getDate() + 5))
      .toISOString()
      .split('T')[0],
    time: '15:00',
    patient: 'Ana Costa',
    service: 'Check-up',
    professional: 'Dra. Ana Costa',
    status: 'Confirmado',
  },
]

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set) => ({
      appointments: initialAppointments,
      addAppointment: (appointment) =>
        set((state) => ({
          appointments: [
            ...state.appointments,
            { ...appointment, id: crypto.randomUUID() },
          ],
        })),
      updateAppointmentStatus: (id, status) =>
        set((state) => ({
          appointments: state.appointments.map((appt) =>
            appt.id === id ? { ...appt, status } : appt,
          ),
        })),
    }),
    {
      name: 'appointment-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
