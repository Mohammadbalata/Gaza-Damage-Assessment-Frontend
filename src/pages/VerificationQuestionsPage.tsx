import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useApplicationStore } from '../store/applicationStore'
import { getRandomQuestions, verifyAnswers, mockCivilRegistry } from '../utils/civilRegistry'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface FormData {
  [key: string]: string
}

const VerificationQuestionsPage = () => {
  const navigate = useNavigate()
  const { t, language } = useLanguage()
  const { data, setPersonalInfo } = useApplicationStore()
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  useEffect(() => {
    // Get random questions for this user
    if (data.nationalId) {
      const randomQuestions = getRandomQuestions(data.nationalId)
      setQuestions(randomQuestions)
      
      // Also populate personal info from civil registry
      const registryData = mockCivilRegistry[data.nationalId]
      if (registryData) {
        setPersonalInfo({
          fullName: registryData.fullName,
          motherName: registryData.motherName,
          dateOfBirth: registryData.dateOfBirth,
          wifeName: registryData.wifeName,
          phoneNumber: registryData.phoneNumber,
          addressBeforeWar: registryData.registeredAddress,
          numberOfChildren: registryData.numberOfSons + registryData.numberOfDaughters,
        })
      } else {
        // If not in mock data, still allow but with minimal info
        setPersonalInfo({
          fullName: '',
          motherName: '',
          dateOfBirth: '',
          wifeName: '',
          phoneNumber: '',
          addressBeforeWar: '',
        })
      }
      
      setLoading(false)
    } else {
      navigate('/national-id')
    }
  }, [data.nationalId, navigate, setPersonalInfo])

  const onSubmit = (formData: FormData) => {
    if (!data.nationalId) return

    const isValid = verifyAnswers(data.nationalId, formData)
    
    if (isValid) {
      // Verification successful - proceed to previous location map
      navigate('/previous-location')
    } else {
      setError('Verification failed. Please check your answers and try again.')
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <p>{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">National ID not found in civil registry</p>
          <button onClick={() => navigate('/national-id')} className="btn-primary mt-4">
            {t('common.back')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Identity Verification</h2>
          <p className="text-gray-600">
            Please answer the following questions to verify your identity. These questions are based on your civil registry information.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {index + 1}. {language === 'ar' ? question.questionAr : question.question}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                {...register(question.id, {
                  required: t('common.required'),
                })}
                className="input-field"
                placeholder={language === 'ar' ? 'أدخل الإجابة' : 'Enter your answer'}
              />
              {errors[question.id] && (
                <p className="mt-1 text-sm text-red-600">{errors[question.id]?.message as string}</p>
              )}
            </div>
          ))}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/national-id')}
              className="btn-outline flex-1"
            >
              {t('common.back')}
            </button>
            <button type="submit" className="btn-primary flex-1">
              {t('auth.verify')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VerificationQuestionsPage

