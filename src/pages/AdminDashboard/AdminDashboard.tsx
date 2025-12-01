import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import AdminStats from '../../components/admin/AdminStats'
import { adminApi } from '../../services/api'
import { useAuth } from '../../contexts/AdminAuthContext'
import { Users, FileText, IdCard, MapPinned } from 'lucide-react'

const AdminDashboard = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totals, setTotals] = useState({
    users: 0,
    applications: 0,
    citizens: 0,
    locations: 0,
  })

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const [usersRes, appsRes, citizensRes, locationsRes] = await Promise.all([
          adminApi.listUsers({ page: 1, pageSize: 1 }),
          adminApi.listApplications({ page: 1, pageSize: 1 }),
          adminApi.listCitizens({ page: 1, pageSize: 1 }),
          adminApi.listLocations({ page: 1, pageSize: 1 }),
        ])

        setTotals({
          users: usersRes.total,
          applications: appsRes.total,
          citizens: citizensRes.total,
          locations: locationsRes.total,
        })
      } catch (e: any) {
        setError(e?.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.dashboard')}</h1>
          <p className="text-sm text-gray-500">
            {user
              ? `${t('admin.welcomeBack') || 'Welcome back'}, ${user.name}`
              : t('admin.manage')}
          </p>
        </div>
        <div className="text-sm text-gray-600">
          {t('admin.role')}:{' '}
          <span className="font-semibold capitalize">{user?.role ?? 'guest'}</span>
        </div>
      </div>

      <AdminStats />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-light/10 flex items-center justify-center text-primary">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Manage Users</h2>
                <p className="text-sm text-gray-500">
                  Administrator & supervisor accounts overview.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Total: <span className="font-semibold">{totals.users.toLocaleString()}</span>
            </p>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate('/admin/users')}
            disabled={loading}
          >
            Manage Users
          </button>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-light/10 flex items-center justify-center text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Manage Applications</h2>
                <p className="text-sm text-gray-500">
                  Damage assessment applications from citizens.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Total:{' '}
              <span className="font-semibold">
                {totals.applications.toLocaleString()}
              </span>
            </p>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate('/admin/applications')}
            disabled={loading}
          >
            Manage Applications
          </button>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-light/10 flex items-center justify-center text-primary">
                <IdCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Manage Citizens</h2>
                <p className="text-sm text-gray-500">
                  Registered citizens and verification status.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Total:{' '}
              <span className="font-semibold">
                {totals.citizens.toLocaleString()}
              </span>
            </p>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate('/admin/citizens')}
            disabled={loading}
          >
            Manage Citizens
          </button>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-light/10 flex items-center justify-center text-primary">
                <MapPinned className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Manage Locations</h2>
                <p className="text-sm text-gray-500">
                  Citizen locations before/after war and temporary housing.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Total:{' '}
              <span className="font-semibold">
                {totals.locations.toLocaleString()}
              </span>
            </p>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate('/admin/locations')}
            disabled={loading}
          >
            Manage Locations
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard