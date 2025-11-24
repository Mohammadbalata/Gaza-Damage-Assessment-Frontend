import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import AdminStats from '../components/admin/AdminStats'
import AdminSearchFilters from '../components/admin/AdminSearchFilters'
import AdminApplicationsTable from '../components/admin/AdminApplicationsTable'
import AdminMapView from '../components/admin/AdminMapView'
import { Table, Map } from 'lucide-react'

const AdminDashboard = () => {
  const { t } = useLanguage()
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table')
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    damageLevel: '',
    propertyType: '',
    dateFrom: '',
    dateTo: '',
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('admin.dashboard')}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              viewMode === 'table' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <Table className="w-5 h-5" />
            Table
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              viewMode === 'map' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <Map className="w-5 h-5" />
            Map
          </button>
        </div>
      </div>

      <AdminStats />

      <AdminSearchFilters filters={filters} onFiltersChange={setFilters} />

      {viewMode === 'table' ? (
        <AdminApplicationsTable filters={filters} />
      ) : (
        <AdminMapView filters={filters} />
      )}
    </div>
  )
}

export default AdminDashboard

