import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface Appointment {
  date: string // YYYY-MM-DD
  time: string
  patient: string
  service: string
  professional: string
  status: 'Confirmado' | 'Pendente' | 'Cancelado' | 'Realizado'
}

interface AppointmentState {
  appointments: Appointment[]
  addAppointment: (appointment: Appointment) => void
}

const initialAppointments: Appointment[] = [
  {
    date: '2025-10-25',
    time: '10:30',
    patient: 'Maria da Silva',
    service: 'Limpeza',
    professional: 'Dr. Ricardo',
    status: 'Confirmado',
  },
  {
    date: '2025-10-25',
    time: '14:00',
    patient: 'João Pereira',
    service: 'Avaliação',
    professional: 'Dra. Ana',
    status: 'Pendente',
  },
  {
    date: '2025-10-27',
    time: '09:00',
    patient: 'Carlos Souza',
    service: 'Restauração',
    professional: 'Dr. Ricardo',
    status: 'Confirmado',
  },
  {
    date: '2025-09-15',
    time: '11:00',
    patient: 'Maria da Silva',
    service: 'Clareamento',
    professional: 'Dra. Ana',
    status: 'Realizado',
  },
  {
    date: '2025-08-05',
    time: '16:00',
    patient: 'João Pereira',
    service: 'Restauração',
    professional: 'Dr. Ricardo',
    status: 'Cancelado',
  },
  {
    date: new Date().toISOString().split('T')[0], // An appointment for today
    time: '15:00',
    patient: 'Ana Costa',
    service: 'Check-up',
    professional: 'Dra. Ana',
    status: 'Confirmado',
  },
]

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set) => ({
      appointments: initialAppointments,
      addAppointment: (appointment) =>
        set((state) => ({
          appointments: [...state.appointments, appointment],
        })),
    }),
    {
      name: 'appointment-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
