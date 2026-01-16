import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import ExploreContent from '@/components/ExploreContent'

const MikoResults = () => {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20 flex flex-col">
      <Header />
      <SocialSidebar />
      <main className="flex-1">
        <ExploreContent
          onListingClick={(listingId) => {
            navigate(`/listings/${listingId}`)
          }}
          hideFilters
          headerTitle="MIKO Vibe Search"
          headerSubtitle="Matched properties based on your answers"
          showClearMiko={false}
        />
      </main>
      <Footer />
    </div>
  )
}

export default MikoResults
