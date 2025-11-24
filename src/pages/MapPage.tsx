import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { useLanguage } from '../contexts/LanguageContext'
import { useApplicationStore } from '../store/applicationStore'
import { RotateCcw, Check } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface LocationMarkerProps {
  position: [number, number] | null
  setPosition: (pos: [number, number]) => void
}

function LocationMarker({ position, setPosition }: LocationMarkerProps) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
    },
  })

  return position === null ? null : <Marker position={position} />
}

const MapPage = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { data, setLocation } = useApplicationStore()
  const [position, setPosition] = useState<[number, number] | null>(
    data.latitude && data.longitude ? [data.latitude, data.longitude] : null
  )
  const [address, setAddress] = useState(data.locationAddress || '')

  // Default center: Gaza City
  const defaultCenter: [number, number] = [31.3547, 34.3088]
  const center = position || defaultCenter

  useEffect(() => {
    if (position) {
      // Reverse geocoding (simplified - in production, use a geocoding service)
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}`)
        .then((res) => res.json())
        .then((data) => {
          setAddress(data.display_name || 'Location selected')
        })
        .catch(() => {
          setAddress(`Lat: ${position[0].toFixed(6)}, Lng: ${position[1].toFixed(6)}`)
        })
    }
  }, [position])

  const handleReset = () => {
    setPosition(null)
    setAddress('')
  }

  const handleConfirm = () => {
    if (position) {
      setLocation(position[0], position[1], address)
      navigate('/review')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">{t('map.selectLocation')}</h2>
        <p className="text-gray-600 mb-4">{t('map.clickToPlace')}</p>

        <div className="mb-4 h-96 rounded-lg overflow-hidden border border-gray-300">
          <MapContainer
            center={center}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>
        </div>

        {position && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('map.coordinates')}
              </label>
              <p className="text-gray-900">
                {position[0].toFixed(6)}, {position[1].toFixed(6)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('map.address')}
              </label>
              <p className="text-gray-900">{address}</p>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/documents')}
            className="btn-outline flex-1"
          >
            {t('common.back')}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn-outline flex-1"
            disabled={!position}
          >
            <RotateCcw className="w-4 h-4 inline mr-2" />
            {t('map.reset')}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="btn-primary flex-1"
            disabled={!position}
          >
            <Check className="w-4 h-4 inline mr-2" />
            {t('map.confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MapPage

