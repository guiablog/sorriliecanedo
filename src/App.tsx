import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

import Layout from './components/Layout'
import MobileLayout from './components/MobileLayout'
import AdminLayout from './components/AdminLayout'

import SplashScreen from './pages/Index'
import Onboarding from './pages/Onboarding'
import Register from './pages/Register'
import PatientHome from './pages/patient/Home'
import PatientSchedule from './pages/patient/Schedule'
import PatientContent from './pages/patient/Content'
import PatientProfile from './pages/patient/Profile'

import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminPatients from './pages/admin/Patients'
import AdminAgenda from './pages/admin/Agenda'
import AdminProfessionalsAndServices from './pages/admin/ProfessionalsAndServices'
import AdminContentManagement from './pages/admin/ContentManagement'
import AdminNotifications from './pages/admin/Notifications'

import NotFound from './pages/NotFound'

const App = () => (
  <BrowserRouter>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route element={<Layout />}>
          {/* Standalone Pages */}
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Patient App Routes */}
          <Route element={<MobileLayout />}>
            <Route path="/" element={<PatientHome />} />
            <Route path="/schedule" element={<PatientSchedule />} />
            <Route path="/content" element={<PatientContent />} />
            <Route path="/profile" element={<PatientProfile />} />
          </Route>

          {/* Admin Panel Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="patients" element={<AdminPatients />} />
            <Route path="agenda" element={<AdminAgenda />} />
            <Route
              path="professionals-services"
              element={<AdminProfessionalsAndServices />}
            />
            <Route path="content" element={<AdminContentManagement />} />
            <Route path="notifications" element={<AdminNotifications />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
