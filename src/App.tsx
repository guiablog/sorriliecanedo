import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { DataProvider } from '@/components/DataProvider'
import { PageLoader } from '@/components/PageLoader'

const Layout = lazy(() => import('./components/Layout'))
const MobileLayout = lazy(() => import('./components/MobileLayout'))
const AdminLayout = lazy(() => import('./components/AdminLayout'))
const ProtectedRoute = lazy(() =>
  import('./components/ProtectedRoute').then((module) => ({
    default: module.ProtectedRoute,
  })),
)
const ProfileCompletionGuard = lazy(() =>
  import('./components/ProfileCompletionGuard').then((module) => ({
    default: module.ProfileCompletionGuard,
  })),
)

const SplashScreen = lazy(() => import('./pages/Index'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const PatientForgotPassword = lazy(
  () => import('./pages/patient/ForgotPassword'),
)
const PatientResetPassword = lazy(() => import('./pages/patient/ResetPassword'))
const CompleteProfile = lazy(() => import('./pages/patient/CompleteProfile'))
const PatientHome = lazy(() => import('./pages/patient/Home'))
const PatientSchedule = lazy(() => import('./pages/patient/Schedule'))
const PatientContent = lazy(() => import('./pages/patient/Content'))
const PatientProfile = lazy(() => import('./pages/patient/Profile'))
const PatientLocalizar = lazy(() => import('./pages/patient/Localizar'))
const PatientContact = lazy(() => import('./pages/patient/Contact'))

const AdminLogin = lazy(() => import('./pages/admin/Login'))
const AdminRegister = lazy(() => import('./pages/admin/Register'))
const AdminForgotPassword = lazy(() => import('./pages/admin/ForgotPassword'))
const AdminResetPassword = lazy(() => import('./pages/admin/ResetPassword'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminPatients = lazy(() => import('./pages/admin/Patients'))
const AdminAgenda = lazy(() => import('./pages/admin/Agenda'))
const AdminProfessionalsAndServices = lazy(
  () => import('./pages/admin/ProfessionalsAndServices'),
)
const AdminContentManagement = lazy(
  () => import('./pages/admin/ContentManagement'),
)
const AdminNotifications = lazy(() => import('./pages/admin/Notifications'))
const AdminSettings = lazy(() => import('./pages/admin/Settings'))

const NotFound = lazy(() => import('./pages/NotFound'))

const App = () => {
  useEffect(() => {
    // PWA Setup: Service Worker Registration and Manifest Link
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js') // Use the new service worker file
          .then((registration) => {
            console.log(
              'ServiceWorker registration successful with scope: ',
              registration.scope,
            )
          })
          .catch((error) => {
            console.log('ServiceWorker registration failed: ', error)
          })
      })
    }

    const link = document.createElement('link')
    link.rel = 'manifest'
    link.href = '/app.webmanifest' // Use the new manifest file
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  return (
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <DataProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<SplashScreen />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/forgot-password"
                  element={<PatientForgotPassword />}
                />
                <Route
                  path="/reset-password"
                  element={<PatientResetPassword />}
                />
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

                <Route
                  element={
                    <ProtectedRoute
                      allowedRoles={['patient']}
                      redirectPath="/login"
                    />
                  }
                >
                  <Route
                    path="/complete-profile"
                    element={<CompleteProfile />}
                  />
                  <Route element={<ProfileCompletionGuard />}>
                    <Route element={<MobileLayout />}>
                      <Route path="/home" element={<PatientHome />} />
                      <Route path="/schedule" element={<PatientSchedule />} />
                      <Route path="/content" element={<PatientContent />} />
                      <Route path="/profile" element={<PatientProfile />} />
                      <Route path="/localizar" element={<PatientLocalizar />} />
                      <Route path="/contact" element={<PatientContact />} />
                    </Route>
                  </Route>
                </Route>

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
                    <Route
                      path="content"
                      element={<AdminContentManagement />}
                    />
                    <Route
                      path="notifications"
                      element={<AdminNotifications />}
                    />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </DataProvider>
      </TooltipProvider>
    </BrowserRouter>
  )
}

export default App
