import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useApplicationStore } from '../store/applicationStore'

interface FormData {
  nationalId: string
}

const NationalIdPage = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { setNationalId } = useApplicationStore()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const onSubmit = (data: FormData) => {
    setNationalId(data.nationalId)
    navigate('/verification-questions')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">{t('auth.nationalId')}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.nationalId')} <span className="text-red-500">*</span>
            </label>
            <input
              id="nationalId"
              type="text"
              {...register('nationalId', {
                required: t('common.required'),
                pattern: {
                  value: /^\d{9}$/,
                  message: t('auth.nationalIdError')
                }
              })}
              placeholder={t('auth.nationalIdPlaceholder')}
              className="input-field"
              maxLength={9}
            />
            {errors.nationalId && (
              <p className="mt-1 text-sm text-red-600">{errors.nationalId.message}</p>
            )}
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => navigate('/')} className="btn-outline flex-1">
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn-primary flex-1">
              {t('common.next')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NationalIdPage

