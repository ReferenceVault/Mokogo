import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Auth from './pages/auth/Auth'
import AuthEmail from './pages/auth/AuthEmail'
import ListingWizard from './pages/listing/ListingWizard'
import Dashboard from './pages/Dashboard'
import RequestsList from './pages/requests/RequestsList'
import RequestDetail from './pages/requests/RequestDetail'
import ListingDetail from './pages/ListingDetail'
import ExploreProperties from './pages/ExploreProperties'
import CityListings from './pages/CityListings'
import SafetyTips from './pages/SafetyTips'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/email" element={<AuthEmail />} />
        <Route path="/listing/wizard" element={<ListingWizard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/requests" element={<RequestsList />} />
        <Route path="/requests/:requestId" element={<RequestDetail />} />
        <Route path="/listings/:listingId" element={<ListingDetail />} />
        <Route path="/explore" element={<ExploreProperties />} />
        <Route path="/city/:cityName" element={<CityListings />} />
        <Route path="/safety-tips" element={<SafetyTips />} />
      </Routes>
    </Router>
  )
}

export default App
