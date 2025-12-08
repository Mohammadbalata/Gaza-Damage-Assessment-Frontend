import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useApplicationStore } from '../store/applicationStore'

interface FormData {
  damageLevel: string
  propertyType: string
  propertySize: number
  numberOfRooms: number
  isInhabitable: string
  additionalNotes: string
}

const DamageAssessmentDialog = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { data, setDamageAssessment } = useApplicationStore()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      damageLevel: data.damageLevel || '',
      propertyType: data.propertyType || '',
      propertySize: data.propertySize || 0,
      numberOfRooms: data.numberOfRooms || 0,
      isInhabitable: data.isInhabitable ? 'yes' : 'no',
      additionalNotes: data.additionalNotes || '',
    }
  })

  const onSubmit = (formData: FormData) => {
    setDamageAssessment({
      ...formData,
      isInhabitable: formData.isInhabitable === 'yes'
    })
    navigate('/current-location')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Damage Assessment</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="damageLevel" className="block text-sm font-medium text-gray-700 mb-2">
              {t('form.damageLevel')} <span className="text-red-500">*</span>
            </label>
            <select
              id="damageLevel"
              {...register('damageLevel', { required: t('common.required') })}
              className="input-field"
            >
              <option value="">{t('common.required')}</option>
              <option value="destroyed">Completely Destroyed</option>
              <option value="severe">Severe Damage</option>
              <option value="moderate">Moderate Damage</option>
              <option value="minor">Minor Damage</option>
            </select>
            {errors.damageLevel && (
              <p className="mt-1 text-sm text-red-600">{errors.damageLevel.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
              {t('form.propertyType')} <span className="text-red-500">*</span>
            </label>
            <select
              id="propertyType"
              {...register('propertyType', { required: t('common.required') })}
              className="input-field"
            >
              <option value="">{t('common.required')}</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="commercial">Commercial Property</option>
              <option value="land">Land</option>
            </select>
            {errors.propertyType && (
              <p className="mt-1 text-sm text-red-600">{errors.propertyType.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="propertySize" className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.propertySize')} <span className="text-red-500">*</span>
              </label>
              <input
                id="propertySize"
                type="number"
                {...register('propertySize', {
                  required: t('common.required'),
                  min: { value: 10, message: 'Minimum 10 sq meters' },
                  max: { value: 10000, message: 'Maximum 10000 sq meters' },
                  valueAsNumber: true
                })}
                className="input-field"
              />
              {errors.propertySize && (
                <p className="mt-1 text-sm text-red-600">{errors.propertySize.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="numberOfRooms" className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.numberOfRooms')} <span className="text-red-500">*</span>
              </label>
              <input
                id="numberOfRooms"
                type="number"
                {...register('numberOfRooms', {
                  required: t('common.required'),
                  min: { value: 1, message: 'Minimum 1 room' },
                  max: { value: 50, message: 'Maximum 50 rooms' },
                  valueAsNumber: true
                })}
                className="input-field"
              />
              {errors.numberOfRooms && (
                <p className="mt-1 text-sm text-red-600">{errors.numberOfRooms.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('form.isInhabitable')} <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="yes"
                  {...register('isInhabitable', { required: t('common.required') })}
                  className="w-4 h-4"
                />
                <span>{t('form.yes')}</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="no"
                  {...register('isInhabitable', { required: t('common.required') })}
                  className="w-4 h-4"
                />
                <span>{t('form.no')}</span>
              </label>
            </div>
            {errors.isInhabitable && (
              <p className="mt-1 text-sm text-red-600">{errors.isInhabitable.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
              {t('form.additionalNotes')} <span className="text-gray-500">({t('common.optional')})</span>
            </label>
            <textarea
              id="additionalNotes"
              {...register('additionalNotes')}
              className="input-field min-h-[96px] resize-none"
              rows={4}
            />
          </div>

          <div className="flex gap-4">
            <button type="submit" className="btn-primary flex-1">
              Continue to Current Location
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DamageAssessmentDialog

