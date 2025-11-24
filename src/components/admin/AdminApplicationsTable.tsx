import { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { Eye, CheckCircle, XCircle } from 'lucide-react'
import ApplicationDetailsModal from './ApplicationDetailsModal'

interface Filters {
  search: string
  status: string
  damageLevel: string
  propertyType: string
  dateFrom: string
  dateTo: string
}

interface Application {
  id: string
  trackingNumber: string
  nationalId: string
  fullName: string
  location: string
  damageLevel: string
  propertyType: string
  status: string
  submittedAt: string
}

interface Props {
  filters: Filters
}

const AdminApplicationsTable = ({ filters }: Props) => {
  const { t } = useLanguage()
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)

  // Mock data - in production, fetch from API
  const applications: Application[] = [
    {
      id: '1',
      trackingNumber: 'GZA-2024-123456',
      nationalId: '123456789',
      fullName: 'Ahmad Hassan Mohammad',
      location: 'Al-Rimal District, Gaza City',
      damageLevel: 'severe',
      propertyType: 'apartment',
      status: 'underReview',
      submittedAt: '2024-11-23T10:30:00Z',
    },
    {
      id: '2',
      trackingNumber: 'GZA-2024-123457',
      nationalId: '987654321',
      fullName: 'Mohammed Ali Salem',
      location: 'Al-Shati Camp, Gaza',
      damageLevel: 'destroyed',
      propertyType: 'house',
      status: 'approved',
      submittedAt: '2024-11-22T14:20:00Z',
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusClass = `badge badge-${status.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    return <span className={statusClass}>{t(`status.${status}`)}</span>
  }

  const getDamageBadge = (level: string) => {
    const colors: Record<string, string> = {
      destroyed: 'bg-red-100 text-red-800',
      severe: 'bg-orange-100 text-orange-800',
      moderate: 'bg-yellow-100 text-yellow-800',
      minor: 'bg-blue-100 text-blue-800',
    }
    return (
      <span className={`badge ${colors[level] || 'bg-gray-100 text-gray-800'}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    )
  }

  return (
    <>
      <div className="card overflow-x-auto">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {applications.length} results
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Tracking Number</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">National ID</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Full Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Damage Level</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Property Type</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Submitted</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-sm">{app.trackingNumber}</td>
                <td className="py-3 px-4">{app.nationalId}</td>
                <td className="py-3 px-4 font-medium">{app.fullName}</td>
                <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate" title={app.location}>
                  {app.location}
                </td>
                <td className="py-3 px-4">{getDamageBadge(app.damageLevel)}</td>
                <td className="py-3 px-4 capitalize">{app.propertyType}</td>
                <td className="py-3 px-4">{getStatusBadge(app.status)}</td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {new Date(app.submittedAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedApplication(app)}
                      className="text-blue-600 hover:text-blue-800"
                      title={t('admin.viewDetails')}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {app.status === 'underReview' && (
                      <>
                        <button
                          className="text-green-600 hover:text-green-800"
                          title={t('admin.approve')}
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          title={t('admin.reject')}
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </>
  )
}

export default AdminApplicationsTable

