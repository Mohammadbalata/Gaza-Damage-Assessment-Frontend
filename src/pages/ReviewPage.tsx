import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useApplicationStore } from '../store/applicationStore'
import { FileText, MapPin, Home, Users } from 'lucide-react'
import { generateTrackingNumber } from '../utils/helpers'

const ReviewPage = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { data, setTrackingNumber } = useApplicationStore()

  const handleSubmit = () => {
    // Generate tracking number (password already generated)
    const trackingNum = generateTrackingNumber()
    
    setTrackingNumber(trackingNum)
    
    // In production, submit to API here
    // For now, just navigate to success page
    navigate('/success')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <h2 className="text-2xl font-bold mb-6">{t('review.title')}</h2>

        {/* Identity Information */}
        <section className="mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">{t('review.identityInfo')}</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">{t('auth.nationalId')}</p>
              <p className="font-medium">{data.nationalId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('form.fullName')}</p>
              <p className="font-medium">{data.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('form.motherName')}</p>
              <p className="font-medium">{data.motherName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('form.dateOfBirth')}</p>
              <p className="font-medium">{data.dateOfBirth}</p>
            </div>
          </div>
        </section>

        {/* Family Information */}
        <section className="mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">{t('review.familyInfo')}</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">{t('form.addressBeforeWar')}</p>
              <p className="font-medium">{data.addressBeforeWar}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('form.numberOfChildren')}</p>
              <p className="font-medium">{data.numberOfChildren}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('form.wifeName')}</p>
              <p className="font-medium">{data.wifeName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('form.wifeNationalId')}</p>
              <p className="font-medium">{data.wifeNationalId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('form.phoneNumber')}</p>
              <p className="font-medium">{data.phoneNumber}</p>
            </div>
          </div>
        </section>

        {/* Damage Assessment */}
        <section className="mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Home className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">{t('review.damageInfo')}</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">{t('form.damageLevel')}</p>
              <p className="font-medium capitalize">{data.damageLevel}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('form.propertyType')}</p>
              <p className="font-medium capitalize">{data.propertyType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('form.propertySize')}</p>
              <p className="font-medium">{data.propertySize} sq meters</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('form.numberOfRooms')}</p>
              <p className="font-medium">{data.numberOfRooms}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('form.isInhabitable')}</p>
              <p className="font-medium">{data.isInhabitable ? t('form.yes') : t('form.no')}</p>
            </div>
          </div>
        </section>

        {/* Previous Location (Before War) */}
        {data.previousLatitude && data.previousLongitude && (
          <section className="mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">Previous Location (Before War)</h3>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('map.address')}</p>
              <p className="font-medium">{data.previousLocationAddress}</p>
              <p className="text-sm text-gray-500 mt-1">
                {data.previousLatitude.toFixed(6)}, {data.previousLongitude.toFixed(6)}
              </p>
            </div>
          </section>
        )}

        {/* Current Location */}
        {data.currentLatitude && data.currentLongitude && (
          <section className="mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">Current Location</h3>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('map.address')}</p>
              <p className="font-medium">{data.currentLocationAddress}</p>
              <p className="text-sm text-gray-500 mt-1">
                {data.currentLatitude.toFixed(6)}, {data.currentLongitude.toFixed(6)}
              </p>
            </div>
          </section>
        )}

        {/* Documents */}
        {data.documents && data.documents.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">{t('review.documents')}</h3>
            </div>
            <p className="text-gray-600">{data.documents.length} file(s) uploaded</p>
          </section>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => navigate('/current-location')}
          className="btn-outline flex-1"
        >
          {t('common.back')}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="btn-primary flex-1"
        >
          {t('review.submit')}
        </button>
      </div>
    </div>
  )
}

export default ReviewPage

