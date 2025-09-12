import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      // In a real app, you'd check for authentication here.
      // If authenticated, navigate('/'); otherwise, navigate('/onboarding').
      navigate('/onboarding')
    }, 2500)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary animate-fade-in">
      <img
        src="https://img.usecurling.com/i?q=sorrilie-odontologia&color=white"
        alt="Sorriliê Odontologia Logo"
        className="w-48 h-auto"
      />
    </div>
  )
}
