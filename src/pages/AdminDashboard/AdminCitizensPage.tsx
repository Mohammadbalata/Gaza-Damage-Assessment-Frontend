import { useEffect, useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { adminApi, Citizen } from '../../services/api'
import { useAuth } from '../../contexts/AdminAuthContext'
import { Plus, Trash2, X } from 'lucide-react'

const emptyCitizen = {
  national_id: '',
  full_name: '',
  gender: '' as Citizen['gender'] | '',
  status: 'alive' as Citizen['status'],
}

const AdminCitizensPage = () => {
  const { t } = useLanguage()
  const { hasRole } = useAuth()
  const [citizens, setCitizens] = useState<Citizen[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Citizen | null>(null)
  const [form, setForm] = useState(emptyCitizen)

  const canManage = hasRole('admin')
  const canView = hasRole('admin', 'supervisor')

  const loadCitizens = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminApi.listCitizens({ page: 1, pageSize: 100 })
      setCitizens(res.data)
    } catch (e: any) {
      setError(e?.message || 'Failed to load citizens')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCitizens()
  }, [])

  const openCreateDialog = () => {
    setEditing(null)
    setForm(emptyCitizen)
    setIsDialogOpen(true)
  }

  const openEditDialog = (citizen: Citizen) => {
    setEditing(citizen)
    setForm({
      national_id: citizen.national_id,
      full_name: citizen.full_name || '',
      gender: citizen.gender || '',
      status: citizen.status,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canManage) return
    setLoading(true)
    setError(null)
    try {
      if (editing) {
        await adminApi.updateCitizen(editing.id, {
          national_id: form.national_id,
          full_name: form.full_name || undefined,
          gender: form.gender || undefined,
          status: form.status,
        })
      } else {
        await adminApi.createCitizen({
          national_id: form.national_id,
          full_name: form.full_name || undefined,
          gender: form.gender || undefined,
          status: form.status,
        })
      }
      setIsDialogOpen(false)
      setEditing(null)
      setForm(emptyCitizen)
      loadCitizens()
    } catch (e: any) {
      setError(e?.message || 'Failed to save citizen')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!canManage) return
    if (!window.confirm('Delete citizen?')) return
    setLoading(true)
    setError(null)
    try {
      await adminApi.deleteCitizen(id)
      loadCitizens()
    } catch (e: any) {
      setError(e?.message || 'Failed to delete citizen')
    } finally {
      setLoading(false)
    }
  }

  if (!canView) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Citizens</h1>
        <p className="text-sm text-gray-500">
          You do not have permission to view citizens.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Citizens</h1>
          <p className="text-sm text-gray-500">
            Manage registered citizens and verification status.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            className="btn-primary flex items-center gap-2"
            onClick={openCreateDialog}
          >
            <Plus className="w-4 h-4" />
            Create Citizen
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
              <th className="text-left py-3 px-2 font-semibold">National ID</th>
              <th className="text-left py-3 px-2 font-semibold">Full Name</th>
              <th className="text-left py-3 px-2 font-semibold">Gender</th>
              <th className="text-left py-3 px-2 font-semibold">Status</th>
              {canManage && (
                <th className="text-left py-3 px-2 font-semibold">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {citizens.map((citizen) => (
              <tr key={citizen.id} className="border-b border-gray-100">
                <td className="py-3 px-2 font-mono text-sm">{citizen.national_id}</td>
                <td className="py-3 px-2 text-gray-700">
                  {citizen.full_name || '-'}
                </td>
                <td className="py-3 px-2 capitalize">
                  {citizen.gender || 'unknown'}
                </td>
                <td className="py-3 px-2 capitalize">{citizen.status}</td>
                {canManage && (
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        onClick={() => openEditDialog(citizen)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800 text-xs font-medium flex items-center gap-1"
                        onClick={() => handleDelete(citizen.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {!citizens.length && !loading && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">
                  No citizens found.
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
            className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editing ? 'Edit Citizen' : 'Create Citizen'}
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
                    National ID
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={form.national_id}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, national_id: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={form.full_name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, full_name: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    className="input-field"
                    value={form.gender || ''}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        gender: e.target.value as Citizen['gender'],
                      }))
                    }
                  >
                    <option value="">Not set</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="input-field"
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        status: e.target.value as Citizen['status'],
                      }))
                    }
                  >
                    <option value="alive">Alive</option>
                    <option value="dead">Dead</option>
                  </select>
                </div>
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

export default AdminCitizensPage


