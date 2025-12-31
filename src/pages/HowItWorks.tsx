import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import { Home, Users, MessageSquare } from 'lucide-react'

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState<'seeking' | 'listing'>('seeking')

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const seekingSteps = [
    {
      number: 1,
      title: "Share your preferences",
      description: "Tell us your city, budget, and move-in date. We'll help you find listings that match what you're looking for."
    },
    {
      number: 2,
      title: "Browse matching listings",
      description: "Mokogo shows you listings that match or are close to your preferences. You can explore freely and see what's available."
    },
    {
      number: 3,
      title: "Explore listings freely",
      description: "You can view listing details, photos, and information without creating an account. Take your time to find what feels right."
    },
    {
      number: 4,
      title: "Contact when ready",
      description: "When you find a listing you're interested in, you'll need to sign up or log in to contact the lister. This helps keep the platform safe for everyone."
    }
  ]

  const listingSteps = [
    {
      number: 1,
      title: "Sign up or log in",
      description: "Create an account or log in using email, phone, or Google Sign-In. The process is quick and straightforward."
    },
    {
      number: 2,
      title: "Create your listing",
      description: "Fill in details about your space: location, photos, rent, availability, and any preferences you have for potential flatmates.",
      tip: "Include clear photos and accurate information to help seekers find the right match."
    },
    {
      number: 3,
      title: "Your listing goes live",
      description: "Once you submit your listing, it becomes visible to people searching in your city. Your listing will appear in relevant searches based on the details you provided."
    },
    {
      number: 4,
      title: "Connect with interested seekers",
      description: "When someone is interested in your space, they'll reach out to you. You can then connect directly, share more details, and arrange visits."
    }
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <SocialSidebar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100/50 to-orange-50 px-6 md:px-[10%] pt-14 pb-16 sm:pt-16 sm:pb-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.15),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.12),transparent_60%),radial-gradient(circle_at_center,rgba(254,215,170,0.10),transparent_65%),radial-gradient(circle_at_top_right,rgba(255,237,213,0.08),transparent_70%)]" />
          
          <div className="relative mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-300/50 bg-orange-200/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-orange-800/80">
              Simple & Transparent • Step by Step
            </span>
            <h1 className="mt-6 text-3xl sm:text-4xl lg:text-[2.9rem] font-bold leading-tight text-gray-900">
              How Mokogo Works
            </h1>
            <p className="mt-5 text-lg sm:text-xl leading-relaxed text-gray-800">
              Mokogo helps people connect to find the right place or flatmate, simply and transparently.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="relative px-6 md:px-[10%] py-16 sm:py-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#fef4f1] via-transparent to-transparent" />
          
          <div className="relative mx-auto max-w-6xl">
            {/* Tabs Section */}
            <div className="mb-16">
              {/* Tab Buttons */}
              <div className="flex gap-4 mb-10 border-b border-orange-200">
                <button
                  onClick={() => setActiveTab('seeking')}
                  className={`flex items-center gap-3 px-6 py-4 border-b-2 transition-all ${
                    activeTab === 'seeking'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-600 hover:text-orange-500'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activeTab === 'seeking'
                      ? 'bg-gradient-to-br from-orange-400 to-orange-500 shadow-lg'
                      : 'bg-orange-100'
                  }`}>
                    <Home className={`w-5 h-5 ${activeTab === 'seeking' ? 'text-white' : 'text-orange-500'}`} />
                  </div>
                  <span className="text-lg font-semibold">For Seekers</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('listing')}
                  className={`flex items-center gap-3 px-6 py-4 border-b-2 transition-all ${
                    activeTab === 'listing'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-600 hover:text-orange-500'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activeTab === 'listing'
                      ? 'bg-gradient-to-br from-orange-400 to-orange-500 shadow-lg'
                      : 'bg-orange-100'
                  }`}>
                    <Users className={`w-5 h-5 ${activeTab === 'listing' ? 'text-white' : 'text-orange-500'}`} />
                  </div>
                  <span className="text-lg font-semibold">For Listers</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="relative overflow-hidden rounded-[2rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 shadow-xl shadow-orange-100/40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_55%)]" />
                <div className="relative p-8 md:p-10">
                  {activeTab === 'seeking' && (
                    <div>
                      <div className="mb-8">
                        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">Looking for a place?</h2>
                        <p className="text-gray-700">Follow these simple steps to find your perfect room and flatmate.</p>
                      </div>
                      <div className="grid gap-6 md:grid-cols-2">
                        {seekingSteps.map((step, index) => (
                          <div
                            key={index}
                            className={`relative overflow-hidden rounded-[2rem] border border-orange-200 ${
                              index % 2 === 0
                                ? 'bg-gradient-to-br from-orange-50 via-white to-orange-50/50 shadow-xl shadow-orange-100/40'
                                : 'bg-gradient-to-br from-[#fff4f1] via-white to-[#fffafa] shadow-xl shadow-[#f8d8cf]/45'
                            } p-8 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
                          >
                            <div className={`absolute inset-0 ${
                              index % 2 === 0
                                ? 'bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_55%)]'
                                : 'bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.14),transparent_60%)]'
                            }`} />
                            <div className="relative">
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg">
                                    <span className="text-2xl font-bold text-white">{step.number}</span>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                                  <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                                    {step.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'listing' && (
                    <div>
                      <div className="mb-8">
                        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">Listing a space?</h2>
                        <p className="text-gray-700">Get your space listed and connect with potential flatmates in just a few steps.</p>
                      </div>
                      <div className="grid gap-6 md:grid-cols-2">
                        {listingSteps.map((step, index) => (
                          <div
                            key={index}
                            className={`relative overflow-hidden rounded-[2rem] border border-orange-200 ${
                              index % 2 === 0
                                ? 'bg-gradient-to-br from-orange-50 via-white to-orange-50/50 shadow-xl shadow-orange-100/40'
                                : 'bg-gradient-to-br from-[#fff4f1] via-white to-[#fffafa] shadow-xl shadow-[#f8d8cf]/45'
                            } p-8 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
                          >
                            <div className={`absolute inset-0 ${
                              index % 2 === 0
                                ? 'bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_55%)]'
                                : 'bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.14),transparent_60%)]'
                            }`} />
                            <div className="relative">
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg">
                                    <span className="text-2xl font-bold text-white">{step.number}</span>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                                  <p className="text-sm sm:text-base leading-relaxed text-gray-700 mb-3">
                                    {step.description}
                                  </p>
                                  {step.tip && (
                                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mt-3">
                                      <p className="text-sm text-orange-800">
                                        {step.tip}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="relative overflow-hidden rounded-[2rem] border border-[#fde1da] bg-gradient-to-br from-[#fff4f1] via-white to-[#fff9f6] p-8 md:p-10 shadow-xl shadow-[#f8d8cf]/45">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.12),transparent_60%)]" />
              <div className="relative flex flex-col md:flex-row items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-[#f97316]/20 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-8 h-8 text-[#f97316]" />
                </div>
                <div className="flex-1">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#f97316]">
                    A Quick Note
                  </span>
                  <h3 className="mt-4 text-2xl font-semibold text-[#0f172a]">How Mokogo Works</h3>
                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#3a4a61]">
                    Mokogo is a discovery and connection platform. We help people find each other, but final decisions, visits, and agreements happen directly between users. Take your time, meet in person when possible, and make choices that feel right for you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default HowItWorks
