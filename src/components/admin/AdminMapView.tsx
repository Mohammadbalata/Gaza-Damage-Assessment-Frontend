import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useLanguage } from '../../contexts/LanguageContext'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface Filters {
  search: string
  status: string
  damageLevel: string
  propertyType: string
  dateFrom: string
  dateTo: string
}

interface Props {
  filters: Filters
}

const AdminMapView = ({ filters }: Props) => {
  console.log(filters);
  
  const { t } = useLanguage()

  // Mock data - in production, fetch from API
  const applications = [
    {
      id: '1',
      trackingNumber: 'GZA-2024-123456',
      fullName: 'Ahmad Hassan Mohammad',
      damageLevel: 'severe',
      status: 'underReview',
      lat: 31.5203,
      lng: 34.4668,
    },
    {
      id: '2',
      trackingNumber: 'GZA-2024-123457',
      fullName: 'Mohammed Ali Salem',
      damageLevel: 'destroyed',
      status: 'approved',
      lat: 31.3547,
      lng: 34.3088,
    },
  ]

  const getMarkerColor = (status: string) => {
    const colors: Record<string, string> = {
      submitted: '#3b82f6',
      underReview: '#f59e0b',
      approved: '#10b981',
      rejected: '#ef4444',
    }
    return colors[status] || '#6b7280'
  }

  return (
    <div className="card">
      <div className="h-[600px] rounded-lg overflow-hidden border border-gray-300">
        <MapContainer
          center={[31.3547, 34.3088]}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {applications.map((app) => (
            <Marker
              key={app.id}
              position={[app.lat, app.lng]}
              icon={L.divIcon({
                className: 'custom-marker',
                html: `<div style="background-color: ${getMarkerColor(app.status)}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              })}
            >
              <Popup>
                <div className="p-2">
                  <p className="font-bold">{app.trackingNumber}</p>
                  <p className="text-sm">{app.fullName}</p>
                  <p className="text-sm text-gray-600 capitalize">{app.damageLevel}</p>
                  <p className="text-sm">{t(`status.${app.status}`)}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span>Submitted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
          <span>Under Review</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span>Approved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span>Rejected</span>
        </div>
      </div>
    </div>
  )
}

export default AdminMapView

