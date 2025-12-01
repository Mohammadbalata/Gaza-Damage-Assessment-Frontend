import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAuth } from '../../contexts/AdminAuthContext'
import { adminApi } from '../../services/api'
import { FileText, IdCard, MapPinned, ShieldAlert } from 'lucide-react'

const SupervisorDashboard = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totals, setTotals] = useState({
    applications: 0,
    citizens: 0,
    locations: 0,
  })

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const [appsRes, citizensRes, locationsRes] = await Promise.all([
          adminApi.listApplications({ page: 1, pageSize: 1 }),
          adminApi.listCitizens({ page: 1, pageSize: 1 }),
          adminApi.listLocations({ page: 1, pageSize: 1 }),
        ])

        setTotals({
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
          <h1 className="text-3xl font-bold">
            {t('admin.supervisorDashboard') || 'Supervisor Dashboard'}
          </h1>
          <p className="text-sm text-gray-500">
            {user
              ? `${t('admin.welcomeBack') || 'Welcome back'}, ${user.name}`
              : ''}
          </p>
        </div>
        <div className="text-sm text-gray-600">
          {t('admin.role')}:{' '}
          <span className="font-semibold capitalize">{user?.role ?? 'guest'}</span>
        </div>
      </div>

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
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Applications</h2>
                <p className="text-sm text-gray-500">
                  Full create, edit, and delete access to applications.
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
                <h2 className="text-xl font-semibold">Citizens</h2>
                <p className="text-sm text-gray-500">
                  View-only access to citizen records.
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
            className="btn-outline"
            onClick={() => navigate('/admin/citizens')}
            disabled={loading}
          >
            View Citizens
          </button>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-light/10 flex items-center justify-center text-primary">
                <MapPinned className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Locations</h2>
                <p className="text-sm text-gray-500">
                  View-only access to citizen locations.
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
            className="btn-outline"
            onClick={() => navigate('/admin/locations')}
            disabled={loading}
          >
            View Locations
          </button>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-light/10 flex items-center justify-center text-red-500">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Users</h2>
                <p className="text-sm text-gray-500">
                  User management is restricted to admins only.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-outline cursor-not-allowed opacity-60"
            disabled
          >
            No Access
          </button>
        </div>
      </div>
    </div>
  )
}

export default SupervisorDashboard