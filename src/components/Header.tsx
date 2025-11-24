import { useLanguage } from '../contexts/LanguageContext'
import { Building2 } from 'lucide-react'

const Header = () => {
  const { t } = useLanguage()

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <Building2 className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold">{t('app.title')}</h1>
            <p className="text-sm text-primary-light">{t('app.subtitle')}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

