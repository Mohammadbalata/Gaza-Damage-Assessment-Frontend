import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { FileText, Shield } from 'lucide-react'
import { ROUTES } from '../routes/Routes'

const HomePage = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('app.title')}</h1>
        <p className="text-xl text-gray-600 mb-8">{t('app.subtitle')}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(ROUTES.SIGNIN)}>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">{t('common.signIn')}</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Register a new damage assessment application using your National ID
          </p>
          <button className="btn-primary w-full">
            {t('common.next')}
          </button>
        </div>
        <div className="card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/track-status')}>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-secondary/10 p-3 rounded-lg">
              <FileText className="w-8 h-8 text-secondary" />
            </div>
            <h2 className="text-2xl font-semibold">{t('auth.trackStatus')}</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Track the status of your submitted application using your tracking number
          </p>
          <button className="btn-secondary w-full">
            {t('common.next')}
          </button>
        </div>
        <div className="card cursor-pointer hover:shadow-lg transition-shadow md:col-span-2" onClick={() => navigate('/admin/login')}>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gray-800/10 p-3 rounded-lg">
              <Shield className="w-8 h-8 text-gray-800" />
            </div>
            <h2 className="text-2xl font-semibold">{t('auth.adminLogin')}</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Access the administrative dashboard for government officials
          </p>
          <button className="btn-outline w-full">
            {t('auth.adminLogin')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomePage

