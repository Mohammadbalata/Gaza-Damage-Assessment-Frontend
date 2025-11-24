import { Routes, Route } from 'react-router-dom'
import Layout from '../components/Layout'
import HomePage from '../pages/HomePage'
import NationalIdPage from '../pages/NationalIdPage'
import VerificationQuestionsPage from '../pages/VerificationQuestionsPage'
import PreviousLocationMapPage from '../pages/PreviousLocationMapPage'
import PasswordDisplayPage from '../pages/PasswordDisplayPage'
import DamageAssessmentDialog from '../pages/DamageAssessmentDialog'
import CurrentLocationMapPage from '../pages/CurrentLocationMapPage'
import PersonalInfoPage from '../pages/PersonalInfoPage'
import FamilyInfoPage from '../pages/FamilyInfoPage'
import DamageAssessmentPage from '../pages/DamageAssessmentPage'
import DocumentsPage from '../pages/DocumentsPage'
import MapPage from '../pages/MapPage'
import ReviewPage from '../pages/ReviewPage'
import SuccessPage from '../pages/SuccessPage'
import TrackStatusPage from '../pages/TrackStatusPage'
import AdminLoginPage from '../pages/AdminLoginPage'
import AdminDashboard from '../pages/AdminDashboard'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="national-id" element={<NationalIdPage />} />
        <Route path="verification-questions" element={<VerificationQuestionsPage />} />
        <Route path="previous-location" element={<PreviousLocationMapPage />} />
        <Route path="password-display" element={<PasswordDisplayPage />} />
        <Route path="damage-assessment-dialog" element={<DamageAssessmentDialog />} />
        <Route path="current-location" element={<CurrentLocationMapPage />} />
        <Route path="personal-info" element={<PersonalInfoPage />} />
        <Route path="family-info" element={<FamilyInfoPage />} />
        <Route path="damage-assessment" element={<DamageAssessmentPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="review" element={<ReviewPage />} />
        <Route path="success" element={<SuccessPage />} />
        <Route path="track-status" element={<TrackStatusPage />} />
        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route path="admin/dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes

