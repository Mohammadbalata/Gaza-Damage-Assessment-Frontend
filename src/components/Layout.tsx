import { Outlet } from 'react-router-dom'
import LanguageToggle from './LanguageToggle'
import Header from './Header'

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <LanguageToggle />
    </div>
  )
}

export default Layout

