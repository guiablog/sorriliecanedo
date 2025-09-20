import { BarChart, LineChart, PieChart } from 'recharts'
import {
  subDays,
  isAfter,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  parse,
} from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'
import { Users, Calendar, Bell, CheckCircle } from 'lucide-react'
import { usePatientStore } from '@/stores/patient'
import { useAppointmentStore } from '@/stores/appointment'
import { useNotificationStore } from '@/stores/notification'

const lineChartData = Array.from({ length: 7 }, (_, i) => ({
  day: `Dia ${i + 1}`,
  signups: Math.floor(Math.random() * 10) + 5,
}))

const parsePtBrDate = (dateString: string) => {
  return parse(dateString, 'dd/MM/yyyy', new Date())
}

export default function AdminDashboard() {
  const patients = usePatientStore((state) => state.patients)
  const appointments = useAppointmentStore((state) => state.appointments)
  const notifications = useNotificationStore((state) => state.notifications)

  const thirtyDaysAgo = subDays(new Date(), 30)
  const newRegistrationsCount = patients.filter((p) =>
    isAfter(parsePtBrDate(p.registered), thirtyDaysAgo),
  ).length

  const today = new Date()
  const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 })
  const endOfThisWeek = endOfWeek(today, { weekStartsOn: 1 })
  const appointmentsThisWeekCount = appointments.filter((a) =>
    isWithinInterval(new Date(`${a.date}T00:00:00`), {
      start: startOfThisWeek,
      end: endOfThisWeek,
    }),
  ).length

  const notificationsSentCount = notifications.length

  const completedAppointmentsCount = appointments.filter(
    (a) => a.status === 'Realizado',
  ).length

  const pieChartData = [
    {
      name: 'Pendente',
      value: appointments.filter((a) => a.status === 'Pendente').length,
      fill: 'hsl(var(--warning))',
    },
    {
      name: 'Confirmado',
      value: appointments.filter((a) => a.status === 'Confirmado').length,
      fill: 'hsl(var(--success))',
    },
    {
      name: 'Cancelado',
      value: appointments.filter((a) => a.status === 'Cancelado').length,
      fill: 'hsl(var(--destructive))',
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle>Novos Cadastros (30d)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newRegistrationsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle>Consultas da Semana</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointmentsThisWeekCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle>Notificações Enviadas</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notificationsSentCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle>Consultas Realizadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedAppointmentsCount}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Cadastros</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-64 w-full">
              <LineChart
                data={lineChartData}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <LineChart.CartesianGrid strokeDasharray="3 3" />
                <LineChart.XAxis dataKey="day" />
                <LineChart.YAxis />
                <LineChart.Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Cadastros
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {payload[0].value}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <LineChart.Line
                  type="monotone"
                  dataKey="signups"
                  stroke="hsl(var(--primary))"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Consultas por Status</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer config={{}} className="h-64 w-full">
              <PieChart>
                <PieChart.Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                {payload[0].name}
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {payload[0].value}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <PieChart.Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
