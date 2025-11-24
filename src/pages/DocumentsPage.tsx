import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useApplicationStore } from '../store/applicationStore'
import { Upload, X, File } from 'lucide-react'

const DocumentsPage = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { data, setDocuments } = useApplicationStore()
  const [files, setFiles] = useState<File[]>(data.documents || [])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return

    const fileArray = Array.from(newFiles)
    const validFiles: File[] = []
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/webp', 'application/pdf']

    fileArray.forEach((file) => {
      if (files.length + validFiles.length >= 10) {
        alert('Maximum 10 files allowed')
        return
      }
      if (file.size > maxSize) {
        alert(`${file.name} exceeds 5MB limit`)
        return
      }
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name} is not a supported format`)
        return
      }
      validFiles.push(file)
    })

    setFiles((prev) => [...prev, ...validFiles])
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleNext = () => {
    setDocuments(files)
    navigate('/map')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">{t('form.uploadDocuments')}</h2>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-2">{t('form.dragDrop')}</p>
          <p className="text-sm text-gray-500 mb-4">{t('form.maxFiles')}</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary"
          >
            {t('common.select') || 'Select Files'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
        </div>

        {files.length > 0 && (
          <div className="mt-6 space-y-2">
            <h3 className="font-medium mb-2">Uploaded Files ({files.length}/10)</h3>
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <File className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate('/damage-assessment')}
            className="btn-outline flex-1"
          >
            {t('common.back')}
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="btn-primary flex-1"
            disabled={files.length === 0}
          >
            {t('common.next')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DocumentsPage

