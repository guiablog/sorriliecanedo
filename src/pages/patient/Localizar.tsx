import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Facebook, Instagram } from 'lucide-react'
import { useAppSettingsStore } from '@/stores/appSettings'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/use-toast'

export default function PatientLocalizar() {
  const { settings, loading } = useAppSettingsStore()

  const clinicAddress = settings?.clinic_address

  const mapEmbedUrl = useMemo(() => {
    const address =
      clinicAddress ||
      'Av. Pedro Miranda, Quadra: 05 Lote 38 Sala 1 Res. Pedro Miranda, Sen. Canedo - GO, 75262-553, Brasil'
    return `https://maps.google.com/maps?q=${encodeURIComponent(
      address,
    )}&z=17&output=embed`
  }, [clinicAddress])

  const mapDirectionsUrl = useMemo(() => {
    if (!clinicAddress) return '#'
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      clinicAddress,
    )}&travelmode=driving`
  }, [clinicAddress])

  const handleMapClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!clinicAddress) {
      e.preventDefault()
      toast({
        title: 'Endereço não disponível',
        description: 'Não foi possível obter a rota para a clínica.',
        variant: 'destructive',
      })
    }
  }

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
                {clinicAddress || 'Endereço não disponível no momento.'}
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
          href={mapDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleMapClick}
          aria-label="Abrir rotas para a clínica no mapa"
        >
          <CardContent className="p-0">
            <iframe
              src={mapEmbedUrl}
              className="w-full h-80 border-0 rounded-b-lg pointer-events-none"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização da Clínica Sorriliê"
            ></iframe>
          </CardContent>
        </a>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nos siga nas Redes Sociais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://www.facebook.com/sorrilie/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button variant="outline" className="w-full">
                <Facebook className="mr-2 h-5 w-5 text-blue-600" />
                Facebook
              </Button>
            </a>
            <a
              href="https://www.instagram.com/sorrilie/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button variant="outline" className="w-full">
                <Instagram className="mr-2 h-5 w-5 text-pink-500" />
                Instagram
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
