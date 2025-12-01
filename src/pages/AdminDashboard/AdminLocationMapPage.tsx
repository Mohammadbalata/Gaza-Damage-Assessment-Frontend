import { useLocation, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default marker icons for Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const AdminLocationMapPage = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const params = new URLSearchParams(location.search)
  const lat = Number(params.get('lat'))
  const lng = Number(params.get('lng'))
  const governorate = params.get('governorate') || ''
  const town = params.get('town') || ''
  const street = params.get('street') || ''

  const isValidCoords = !Number.isNaN(lat) && !Number.isNaN(lng)

  const center: [number, number] = isValidCoords ? [lat, lng] : [31.5, 34.3]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Location Map</h1>
          <p className="text-sm text-gray-500">
            Visualize the selected citizen location on the map.
          </p>
        </div>
        <button
          type="button"
          className="btn-outline"
          onClick={() => navigate('/admin/locations')}
        >
          Back to Locations
        </button>
      </div>

      {!isValidCoords && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-lg text-sm">
          Coordinates are missing or invalid. Please ensure the location has latitude and
          longitude values set.
        </div>
      )}

      <div className="card">
        <div className="h-[500px] rounded-lg overflow-hidden border border-gray-300">
          <MapContainer
            center={center}
            zoom={isValidCoords ? 16 : 11}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {isValidCoords && (
              <Marker position={center}>
                <Popup>
                  <div className="text-sm space-y-1">
                    <p className="font-semibold">Citizen Location</p>
                    <p className="text-xs text-gray-600">
                      {governorate && <span>{governorate}</span>}
                      {town && <span>{governorate ? ' • ' : ''}{town}</span>}
                      {street && <span>{(governorate || town) ? ' • ' : ''}{street}</span>}
                    </p>
                    <p className="text-xs text-gray-500">
                      Lat: {lat}, Lng: {lng}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  )
}

export default AdminLocationMapPage


