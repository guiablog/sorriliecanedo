import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Phone } from 'lucide-react'
import { useAppSettingsStore } from '@/stores/appSettings'
import { Skeleton } from '@/components/ui/skeleton'

export default function PatientLocalizar() {
  const { settings, loading } = useAppSettingsStore()

  return (
    <div className="p-4 space-y-6 animate-fade-in-up">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-accent" />
            Nossa Localização
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <>
              <p className="text-neutral-dark/80 mb-2">
                {settings?.clinic_address ||
                  'Endereço não disponível no momento.'}
              </p>
              {settings?.clinic_phone && (
                <a
                  href={`tel:${settings.clinic_phone.replace(/\D/g, '')}`}
                  className="flex items-center gap-2 text-sm text-secondary font-medium hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  {settings.clinic_phone}
                </a>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <a
          href="https://maps.app.goo.gl/vQhX47tweSYcdg478?g_st=ac"
          target="_blank"
          rel="noopener noreferrer"
        >
          <CardContent className="p-0">
            <iframe
              src="https://maps.google.com/maps?q=-16.729138263625725,-49.08742592883618&z=17&output=embed"
              className="w-full h-80 border-0 rounded-b-lg"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização da Clínica Sorriliê"
            ></iframe>
          </CardContent>
        </a>
      </Card>
    </div>
  )
}
