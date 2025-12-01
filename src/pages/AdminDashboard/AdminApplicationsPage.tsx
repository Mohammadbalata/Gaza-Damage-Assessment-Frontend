import { useEffect, useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { adminApi, Application } from '../../services/api'
import { useAuth } from '../../contexts/AdminAuthContext'
import { Plus, Trash2, X } from 'lucide-react'

const emptyForm = {
  citizenId: '',
  status: 'pending' as Application['status'],
  notes: '',
}

const AdminApplicationsPage = () => {
  const { t } = useLanguage()
  const { hasRole } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Application | null>(null)
  const [form, setForm] = useState(emptyForm)

  const canManage = hasRole('admin', 'supervisor')

  const loadApplications = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminApi.listApplications({ page: 1, pageSize: 100 })
      setApplications(res.data)
    } catch (e: any) {
      setError(e?.message || 'Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApplications()
  }, [])

  const openCreateDialog = () => {
    setEditing(null)
    setForm(emptyForm)
    setIsDialogOpen(true)
  }

  const openEditDialog = (application: Application) => {
    setEditing(application)
    setForm({
      citizenId: String(application.citizenId),
      status: application.status,
      notes: application.notes || '',
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
    setLoading(true)
    setError(null)
    try {
      if (editing) {
        await adminApi.updateApplication(editing.id, {
          citizenId,
          status: form.status,
          notes: form.notes,
        })
      } else {
        await adminApi.createApplication({
          citizenId,
          status: form.status,
          notes: form.notes,
        })
      }
      setIsDialogOpen(false)
      setEditing(null)
      setForm(emptyForm)
      loadApplications()
    } catch (e: any) {
      setError(e?.message || 'Failed to save application')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!canManage) return
    if (!window.confirm('Delete application?')) return
    setLoading(true)
    setError(null)
    try {
      await adminApi.deleteApplication(id)
      loadApplications()
    } catch (e: any) {
      setError(e?.message || 'Failed to delete application')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Applications</h1>
          <p className="text-sm text-gray-500">
            Manage all citizen damage assessment applications.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary flex items-center gap-2"
          onClick={openCreateDialog}
          disabled={!canManage}
        >
          <Plus className="w-4 h-4" />
          Create Application
        </button>
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
              <th className="text-left py-3 px-2 font-semibold">ID</th>
              <th className="text-left py-3 px-2 font-semibold">Citizen</th>
              <th className="text-left py-3 px-2 font-semibold">Status</th>
              <th className="text-left py-3 px-2 font-semibold">Updated</th>
              <th className="text-left py-3 px-2 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id} className="border-b border-gray-100">
                <td className="py-3 px-2 font-medium">#{application.id}</td>
                <td className="py-3 px-2 text-gray-700">
                  {application.citizen?.full_name || application.citizenId}
                </td>
                <td className="py-3 px-2 capitalize">{application.status}</td>
                <td className="py-3 px-2 text-gray-500">
                  {new Date(application.updatedAt).toLocaleString()}
                </td>
                <td className="py-3 px-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      onClick={() => openEditDialog(application)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800 text-xs font-medium flex items-center gap-1"
                      onClick={() => handleDelete(application.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!applications.length && !loading && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">
                  No applications found.
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
                {editing ? 'Edit Application' : 'Create Application'}
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
                    Status
                  </label>
                  <select
                    className="input-field capitalize"
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        status: e.target.value as Application['status'],
                      }))
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  className="input-field"
                  rows={4}
                  value={form.notes}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Add internal notes for this application"
                />
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

export default AdminApplicationsPage


