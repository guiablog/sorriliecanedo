import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { DataProvider } from '@/components/DataProvider'

import Layout from './components/Layout'
import MobileLayout from './components/MobileLayout'
import AdminLayout from './components/AdminLayout'
import { ProtectedRoute } from './components/ProtectedRoute'

import SplashScreen from './pages/Index'
import Login from './pages/Login'
import Register from './pages/Register'
import PatientForgotPassword from './pages/patient/ForgotPassword'
import PatientResetPassword from './pages/patient/ResetPassword'
import PatientHome from './pages/patient/Home'
import PatientSchedule from './pages/patient/Schedule'
import PatientContent from './pages/patient/Content'
import PatientProfile from './pages/patient/Profile'
import PatientLoyalty from './pages/patient/Loyalty'

import AdminLogin from './pages/admin/Login'
import AdminRegister from './pages/admin/Register'
import AdminForgotPassword from './pages/admin/ForgotPassword'
import AdminResetPassword from './pages/admin/ResetPassword'
import AdminDashboard from './pages/admin/Dashboard'
import AdminPatients from './pages/admin/Patients'
import AdminAgenda from './pages/admin/Agenda'
import AdminProfessionalsAndServices from './pages/admin/ProfessionalsAndServices'
import AdminContentManagement from './pages/admin/ContentManagement'
import AdminNotifications from './pages/admin/Notifications'
import AdminSettings from './pages/admin/Settings'

import NotFound from './pages/NotFound'

const App = () => (
  <BrowserRouter>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <DataProvider>
        <Routes>
          <Route element={<Layout />}>
            {/* Standalone Pages */}
            <Route path="/" element={<SplashScreen />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/forgot-password"
              element={<PatientForgotPassword />}
            />
            <Route path="/reset-password" element={<PatientResetPassword />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route
              path="/admin/forgot-password"
              element={<AdminForgotPassword />}
            />
            <Route
              path="/admin/reset-password"
              element={<AdminResetPassword />}
            />

            {/* Patient App Routes */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={['patient']}
                  redirectPath="/login"
                />
              }
            >
              <Route element={<MobileLayout />}>
                <Route path="/home" element={<PatientHome />} />
                <Route path="/schedule" element={<PatientSchedule />} />
                <Route path="/content" element={<PatientContent />} />
                <Route path="/profile" element={<PatientProfile />} />
                <Route path="/loyalty" element={<PatientLoyalty />} />
              </Route>
            </Route>

            {/* Admin Panel Routes */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={['admin']}
                  redirectPath="/admin/login"
                />
              }
            >
              <Route path="/admin" element={<AdminLayout />}>
                <Route
                  index
                  element={<Navigate to="/admin/dashboard" replace />}
                />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="patients" element={<AdminPatients />} />
                <Route path="agenda" element={<AdminAgenda />} />
                <Route
                  path="professionals-services"
                  element={<AdminProfessionalsAndServices />}
                />
                <Route path="content" element={<AdminContentManagement />} />
                <Route path="notifications" element={<AdminNotifications />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </DataProvider>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
