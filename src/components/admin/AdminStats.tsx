import { useEffect, useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { adminApi, Application } from '../../services/api'
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react'

const AdminStats = () => {
  const { t } = useLanguage()
  const [stats, setStats] = useState({
    total: 0,
    pendingReview: 0,
    approved: 0,
    rejected: 0,
  })

  useEffect(() => {
    const load = async () => {
      try {
        const apps = await adminApi.listApplications({ page: 1, pageSize: 500 })
        const pending = apps.filter((a: Application) => a.status === 'pending').length
        const approved = apps.filter((a: Application) => a.status === 'approved').length
        const rejected = apps.filter((a: Application) => a.status === 'rejected').length

        setStats({
          total: apps.length,
          pendingReview: pending,
          approved,
          rejected,
        })
      } catch (e) {
        console.error(e)
      }
    }

    load()
  }, [])

  const statCards = [
    {
      label: t('admin.totalApplications'),
      value: stats.total,
      icon: FileText,
      color: 'blue',
    },
    {
      label: t('admin.pendingReview'),
      value: stats.pendingReview,
      icon: Clock,
      color: 'yellow',
    },
    {
      label: t('admin.approved'),
      value: stats.approved,
      icon: CheckCircle,
      color: 'green',
    },
    {
      label: t('admin.rejected'),
      value: stats.rejected,
      icon: XCircle,
      color: 'red',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        const colorClasses = {
          blue: 'bg-blue-100 text-blue-600 border-blue-500',
          yellow: 'bg-yellow-100 text-yellow-600 border-yellow-500',
          green: 'bg-green-100 text-green-600 border-green-500',
          red: 'bg-red-100 text-red-600 border-red-500',
        }

        return (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
              </div>
              <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default AdminStats

