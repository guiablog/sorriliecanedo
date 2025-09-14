import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { format } from 'date-fns'

interface RescheduleHistoryEntry {
  previousDate: string
  previousTime: string
  newDate: string
  newTime: string
  changedAt: string
}

export interface Appointment {
  id: string
  date: string // YYYY-MM-DD
  time: string
  patient: string
  service: string
  professional: string
  status: 'Confirmado' | 'Pendente' | 'Cancelado' | 'Realizado'
  rescheduleHistory?: RescheduleHistoryEntry[]
}

interface AppointmentState {
  appointments: Appointment[]
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void
  rescheduleAppointment: (id: string, newDate: Date, newTime: string) => void
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
    rescheduleHistory: [
      {
        previousDate: '2025-10-24',
        previousTime: '09:00',
        newDate: '2025-10-25',
        newTime: '10:30',
        changedAt: new Date('2025-10-20T10:00:00Z').toISOString(),
      },
    ],
  },
  {
    id: '2',
    date: '2025-10-25',
    time: '14:00',
    patient: 'João Pereira',
    service: 'Avaliação',
    professional: 'Dra. Ana Costa',
    status: 'Pendente',
    rescheduleHistory: [],
  },
  {
    id: '3',
    date: '2025-10-27',
    time: '09:00',
    patient: 'Carlos Souza',
    service: 'Restauração',
    professional: 'Dr. Ricardo Alves',
    status: 'Confirmado',
    rescheduleHistory: [],
  },
  {
    id: '4',
    date: '2025-09-15',
    time: '11:00',
    patient: 'Maria da Silva',
    service: 'Clareamento',
    professional: 'Dra. Ana Costa',
    status: 'Realizado',
    rescheduleHistory: [],
  },
  {
    id: '5',
    date: '2025-08-05',
    time: '16:00',
    patient: 'João Pereira',
    service: 'Restauração',
    professional: 'Dr. Ricardo Alves',
    status: 'Cancelado',
    rescheduleHistory: [],
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
    rescheduleHistory: [],
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
            { ...appointment, id: crypto.randomUUID(), rescheduleHistory: [] },
          ],
        })),
      updateAppointmentStatus: (id, status) =>
        set((state) => ({
          appointments: state.appointments.map((appt) =>
            appt.id === id ? { ...appt, status } : appt,
          ),
        })),
      rescheduleAppointment: (id, newDate, newTime) =>
        set((state) => ({
          appointments: state.appointments.map((appt) => {
            if (appt.id === id) {
              const historyEntry: RescheduleHistoryEntry = {
                previousDate: appt.date,
                previousTime: appt.time,
                newDate: format(newDate, 'yyyy-MM-dd'),
                newTime: newTime,
                changedAt: new Date().toISOString(),
              }
              return {
                ...appt,
                date: format(newDate, 'yyyy-MM-dd'),
                time: newTime,
                status: appt.status, // Explicitly keep the status the same
                rescheduleHistory: [
                  ...(appt.rescheduleHistory || []),
                  historyEntry,
                ],
              }
            }
            return appt
          }),
        })),
    }),
    {
      name: 'appointment-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
