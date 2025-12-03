import { useEffect, useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { adminApi, AdminUser, UserRole } from '../../services/api'
import { useAuth } from '../../contexts/AdminAuthContext'
import { Plus, X, Trash2 } from 'lucide-react'

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'admin' as UserRole,
}

const AdminUsersPage = () => {
  const { t } = useLanguage()
  const { hasRole } = useAuth()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editing, setEditing] = useState<AdminUser | null>(null)
  const [form, setForm] = useState(emptyForm)

  const canManage = hasRole('admin')
  const canView = hasRole('admin')

  const loadUsers = async () => {
    if (!canView) return
    setLoading(true)
    setError(null)
    try {
      const res = await adminApi.listUsers({ page: 1, pageSize: 100 })
      setUsers(res)
    } catch (e) {
      console.error(e)
      setError(t('error.loadUsers'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [canView, t])

  const openCreateDialog = () => {
    setEditing(null)
    setForm(emptyForm)
    setIsDialogOpen(true)
  }

  const openEditDialog = (user: AdminUser) => {
    setEditing(user)
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
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
        await adminApi.updateUser(editing.id, {
          name: form.name,
          email: form.email,
          role: form.role,
          password: form.password || undefined,
        })
      } else {
        await adminApi.createUser({
          name: form.name,
          email: form.email,
          role: form.role,
          password: form.password,
        })
      }
      setIsDialogOpen(false)
      setForm(emptyForm)
      setEditing(null)
      loadUsers()
    } catch (e) {
      console.error(e)
      setError(t('error.saveUser'))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!canManage) return
    if (
      !window.confirm(t('admin.users.deleteConfirm') || 'Are you sure you want to delete this user?')
    )
      return
    setLoading(true)
    setError(null)
    try {
      await adminApi.deleteUser(id)
      loadUsers()
    } catch (e) {
      console.error(e)
      setError(t('error.deleteUser'))
    } finally {
      setLoading(false)
    }
  }

  if (!canView) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{t('admin.users.title')}</h1>
        <p className="text-sm text-gray-500">{t('admin.noUsersPermission')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.users.title')}</h1>
          <p className="text-sm text-gray-500">
            {t('admin.users.subtitle')}
          </p>
        </div>
        <button
          type="button"
          className="btn-primary flex items-center gap-2"
          onClick={openCreateDialog}
          disabled={!canManage}
        >
          <Plus className="w-4 h-4" />
          {t('admin.users.create')}
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
              <th className="text-left py-3 px-2 font-semibold">
                {t('admin.users.name')}
              </th>
              <th className="text-left py-3 px-2 font-semibold">
                {t('admin.users.email')}
              </th>
              <th className="text-left py-3 px-2 font-semibold">
                {t('admin.users.role')}
              </th>
              <th className="text-left py-3 px-2 font-semibold">
                {t('common.created') || 'Created'}
              </th>
              <th className="text-left py-3 px-2 font-semibold">
                {t('admin.actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100">
                <td className="py-3 px-2 font-medium">{user.name}</td>
                <td className="py-3 px-2 text-gray-600">{user.email}</td>
                <td className="py-3 px-2 capitalize">{user.role}</td>
                <td className="py-3 px-2 text-gray-500">
                  {new Date(user.createdAt).toLocaleString()}
                </td>
                <td className="py-3 px-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      onClick={() => openEditDialog(user)}
                    >
                      {t('common.edit')}
                    </button>
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800 text-xs font-medium flex items-center gap-1"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                      {t('common.delete')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!users.length && !loading && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">
                  {t('admin.noUsersFound')}
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
                {editing ? t('admin.users.update') : t('admin.users.create')}
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
                    {t('admin.users.name')}
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.users.email')}
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.users.role')}
                  </label>
                  <select
                    className="input-field"
                    value={form.role}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        role: e.target.value as UserRole,
                      }))
                    }
                  >
                    <option value="admin">{t('admin.users')}</option>
                    <option value="supervisor">{t('admin.supervisorDashboard')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {editing ? t('admin.users.passwordOptional') : t('admin.users.password')}
                  </label>
                  <input
                    type="password"
                    className="input-field"
                    value={form.password}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                    required={!editing}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  {t('common.cancel')}
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {editing ? t('admin.users.update') : t('common.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsersPage


