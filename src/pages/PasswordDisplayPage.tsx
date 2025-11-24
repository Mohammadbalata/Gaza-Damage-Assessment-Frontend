import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useApplicationStore } from '../store/applicationStore'
import { Eye, EyeOff, Copy, CheckCircle } from 'lucide-react'
import { generatePassword } from '../utils/helpers'

const PasswordDisplayPage = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { data, setPassword } = useApplicationStore()
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)
  const [password, setPasswordState] = useState('')

  useEffect(() => {
    // Generate password if not already generated
    if (!data.password) {
      const newPassword = generatePassword()
      setPassword(newPassword)
      setPasswordState(newPassword)
    } else {
      setPasswordState(data.password)
    }
  }, [data.password, setPassword])

  const handleCopy = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleContinue = () => {
    navigate('/damage-assessment-dialog')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Verification Successful!</h2>
        <p className="text-gray-600 mb-8">
          Your identity has been verified. Please save your password securely.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('success.password')}
          </label>
          <div className="flex items-center justify-center gap-2">
            <p className="text-2xl font-mono font-bold text-primary">
              {showPassword ? password : '••••••••••••'}
            </p>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-600 hover:text-primary"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            <button
              onClick={handleCopy}
              className="text-gray-600 hover:text-primary"
              title="Copy"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
          {copied && (
            <p className="text-sm text-green-600 mt-2">Copied to clipboard!</p>
          )}
          <p className="text-sm text-red-600 mt-4">{t('success.savePassword')}</p>
        </div>

        <button onClick={handleContinue} className="btn-primary w-full">
          Continue to Damage Assessment
        </button>
      </div>
    </div>
  )
}

export default PasswordDisplayPage

