import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useLanguage } from '../../contexts/LanguageContext'
import { adminApi, Location } from '../../services/api'
import { useAuth } from '../../contexts/AdminAuthContext'
import { Plus, Trash2, X } from 'lucide-react'

const emptyLocation = {
  citizenId: '',
  type: 'current' as Location['type'],
  governorate: '',
  town: '',
  street: '',
  block_number: '',
  house_number: '',
  latitude: '',
  longitude: '',
  notes: '',
}

// Fix default marker icons for Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface MapClickSelectorProps {
  onSelect: (lat: number, lng: number) => void
}

const MapClickSelector = ({ onSelect }: MapClickSelectorProps) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

const AdminLocationsPage = () => {
  const { t } = useLanguage()
  const { hasRole } = useAuth()
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Location | null>(null)
  const [form, setForm] = useState(emptyLocation)

  const canManage = hasRole('admin')
  const canView = hasRole('admin', 'supervisor')

  const loadLocations = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminApi.listLocations({ page: 1, pageSize: 100 })
      setLocations(res.data)
    } catch (e: any) {
      setError(e?.message || 'Failed to load locations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLocations()
  }, [])

  const openCreateDialog = () => {
    setEditing(null)
    setForm(emptyLocation)
    setIsDialogOpen(true)
  }

  const openEditDialog = (location: Location) => {
    setEditing(location)
    setForm({
      citizenId: String(location.citizenId),
      type: location.type,
      governorate: location.governorate || '',
      town: location.town || '',
      street: location.street || '',
      block_number: location.block_number || '',
      house_number: location.house_number || '',
      latitude: location.latitude != null ? String(location.latitude) : '',
      longitude: location.longitude != null ? String(location.longitude) : '',
      notes: location.notes || '',
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canManage) return
    const citizenId = Number(form.citizenId)
    if (Number.isNaN(citizenId)) {
      setError('Citizen ID must be a valid number')
      return
    }
    const latitude = form.latitude ? Number(form.latitude) : undefined
    const longitude = form.longitude ? Number(form.longitude) : undefined

    if (form.latitude && Number.isNaN(latitude)) {
      setError('Latitude must be a valid number')
      return
    }
    if (form.longitude && Number.isNaN(longitude)) {
      setError('Longitude must be a valid number')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const payload = {
        citizenId,
        type: form.type,
        governorate: form.governorate || null,
        town: form.town || null,
        street: form.street || null,
        block_number: form.block_number || null,
        house_number: form.house_number || null,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        notes: form.notes || null,
      }

      if (editing) {
        await adminApi.updateLocation(editing.id, payload)
      } else {
        await adminApi.createLocation(payload)
      }
      setIsDialogOpen(false)
      setEditing(null)
      setForm(emptyLocation)
      loadLocations()
    } catch (e: any) {
      setError(e?.message || 'Failed to save location')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!canManage) return
    if (!window.confirm('Delete location?')) return
    setLoading(true)
    setError(null)
    try {
      await adminApi.deleteLocation(id)
      loadLocations()
    } catch (e: any) {
      setError(e?.message || 'Failed to delete location')
    } finally {
      setLoading(false)
    }
  }

  if (!canView) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Locations</h1>
        <p className="text-sm text-gray-500">
          You do not have permission to view locations.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Locations</h1>
          <p className="text-sm text-gray-500">
            Manage citizen locations before/after war and temporary housing.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            className="btn-primary flex items-center gap-2"
            onClick={openCreateDialog}
          >
            <Plus className="w-4 h-4" />
            Create Location
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 font-semibold">Citizen</th>
              <th className="text-left py-3 px-2 font-semibold">Type</th>
              <th className="text-left py-3 px-2 font-semibold">Address</th>
              <th className="text-left py-3 px-2 font-semibold">Coordinates</th>
              {canManage && (
                <th className="text-left py-3 px-2 font-semibold">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr key={location.id} className="border-b border-gray-100">
                <td className="py-3 px-2">
                  <p className="font-medium">
                    {location.citizen?.full_name || `Citizen #${location.citizenId}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {location.citizen?.national_id}
                  </p>
                </td>
                <td className="py-3 px-2 capitalize">
                  {location.type.replace('_', ' ')}
                </td>
                <td className="py-3 px-2 text-gray-700">
                  {[location.governorate, location.town, location.street]
                    .filter(Boolean)
                    .join(' • ') || '-'}
                </td>
                <td className="py-3 px-2 text-gray-600">
                  {location.latitude != null && location.longitude != null ? (
                    <div className="space-y-1">
                      <p>
                        {location.latitude}, {location.longitude}
                      </p>
                      <Link
                        to={
                          `/admin/locations/map?lat=${location.latitude}&lng=${location.longitude}` +
                          `&governorate=${encodeURIComponent(location.governorate || '')}` +
                          `&town=${encodeURIComponent(location.town || '')}` +
                          `&street=${encodeURIComponent(location.street || '')}`
                        }
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        View on map
                      </Link>
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
                {canManage && (
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        onClick={() => openEditDialog(location)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800 text-xs font-medium flex items-center gap-1"
                        onClick={() => handleDelete(location.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {!locations.length && !loading && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">
                  No locations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isDialogOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsDialogOpen(false)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editing ? 'Edit Location' : 'Create Location'}
              </h2>
              <button
                type="button"
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setIsDialogOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Citizen ID
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={form.citizenId}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, citizenId: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    className="input-field capitalize"
                    value={form.type}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        type: e.target.value as Location['type'],
                      }))
                    }
                  >
                    <option value="before_war">Before war</option>
                    <option value="after_war">After war</option>
                    <option value="temporary">Temporary</option>
                    <option value="current">Current</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Governorate
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={form.governorate}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, governorate: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Town
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={form.town}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, town: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={form.street}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, street: e.target.value }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Block
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={form.block_number}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          block_number: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      House
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={form.house_number}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          house_number: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0000001"
                    className="input-field"
                    value={form.latitude}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, latitude: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0000001"
                    className="input-field"
                    value={form.longitude}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, longitude: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={form.notes}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Select coordinates on map
                </p>
                <p className="text-xs text-gray-500">
                  Click anywhere on the map to set latitude and longitude for this location.
                </p>
                <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
                  <MapContainer
                    center={[31.5, 34.3]}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapClickSelector
                      onSelect={(lat, lng) =>
                        setForm((prev) => ({
                          ...prev,
                          latitude: String(lat.toFixed(7)),
                          longitude: String(lng.toFixed(7)),
                        }))
                      }
                    />
                    {form.latitude && form.longitude && (
                      <Marker position={[Number(form.latitude), Number(form.longitude)]} />
                    )}
                  </MapContainer>
                </div>
                {form.latitude && form.longitude && (
                  <p className="text-xs text-gray-600">
                    Selected: {form.latitude}, {form.longitude}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminLocationsPage


