import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Auth from './pages/auth/Auth'
import AuthEmail from './pages/auth/AuthEmail'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import GoogleCallback from './pages/auth/GoogleCallback'
import ListingWizard from './pages/listing/ListingWizard'
import Dashboard from './pages/Dashboard'
import RequestsList from './pages/requests/RequestsList'
import RequestDetail from './pages/requests/RequestDetail'
import ListingDetail from './pages/ListingDetail'
import ExploreProperties from './pages/ExploreProperties'
import CityListings from './pages/CityListings'
import SafetyTips from './pages/SafetyTips'
import HowItWorks from './pages/HowItWorks'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import CookiePolicy from './pages/CookiePolicy'
import HelpCentre from './pages/HelpCentre'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/email" element={<AuthEmail />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/listing/wizard" element={<ListingWizard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/requests" element={<RequestsList />} />
        <Route path="/requests/:requestId" element={<RequestDetail />} />
        <Route path="/listings/:listingId" element={<ListingDetail />} />
        <Route path="/explore" element={<ExploreProperties />} />
        <Route path="/city/:cityName" element={<CityListings />} />
        <Route path="/safety-tips" element={<SafetyTips />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/help-centre" element={<HelpCentre />} />
      </Routes>
    </Router>
  )
}

export default App
