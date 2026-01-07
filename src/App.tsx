import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import Auth from './pages/auth/Auth'
import AuthEmail from './pages/auth/AuthEmail'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
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
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import CookieConsent from './components/CookieConsent'
import { trackPageView } from './utils/analytics'

// Component to track page views on route changes
function PageViewTracker() {
  const location = useLocation()

  useEffect(() => {
    // Track page view when route changes
    trackPageView(location.pathname + location.search)
  }, [location])

  return null
}

function App() {
  return (
    <Router>
      <PageViewTracker />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/email" element={<AuthEmail />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
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
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
      <CookieConsent />
    </Router>
  )
}

export default App
