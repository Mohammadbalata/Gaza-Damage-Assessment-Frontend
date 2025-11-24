import { useLanguage } from '../../contexts/LanguageContext'
import { X } from 'lucide-react'

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
  application: Application
  onClose: () => void
}

const ApplicationDetailsModal = ({ application, onClose }: Props) => {
  const { t } = useLanguage()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Application Details</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
              <p className="font-mono font-bold">{application.trackingNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className="font-medium">{t(`status.${application.status}`)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Full Name</p>
              <p className="font-medium">{application.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">National ID</p>
              <p className="font-medium">{application.nationalId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Location</p>
              <p className="font-medium">{application.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Damage Level</p>
              <p className="font-medium capitalize">{application.damageLevel}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Property Type</p>
              <p className="font-medium capitalize">{application.propertyType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Submitted At</p>
              <p className="font-medium">{new Date(application.submittedAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button className="btn-primary flex-1">Approve</button>
            <button className="btn-outline flex-1">Reject</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicationDetailsModal

