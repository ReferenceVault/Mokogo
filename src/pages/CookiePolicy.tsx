import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import { Cookie, Shield, Eye, Database, AlertCircle, Mail, CheckCircle, Settings, ChevronDown, ChevronUp } from 'lucide-react'

const CookiePolicy = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [expandedCookieTypes, setExpandedCookieTypes] = useState<{ [key: string]: boolean }>({
    necessary: true,
    performance: false,
    functional: false,
    thirdParty: false,
  })

  const toggleCookieType = (type: string) => {
    setExpandedCookieTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const cookieTypes = [
    {
      id: 'necessary',
      icon: Shield,
      title: 'Strictly Necessary Cookies',
      number: 1,
      description: 'These cookies are essential for the platform to function and cannot be switched off.',
      helps: [
        'Account login and authentication',
        'Session management',
        'Security and fraud prevention'
      ],
      note: 'Without these cookies, some parts of Mokogo may not work properly.'
    },
    {
      id: 'performance',
      icon: Eye,
      title: 'Performance & Analytics Cookies',
      number: 2,
      description: 'These cookies help us understand how users use Mokogo, so we can improve it.',
      collects: [
        'Pages visited',
        'Time spent on pages',
        'Error reports',
        'General usage patterns'
      ],
      note: 'All analytics data is collected in an aggregated and anonymized manner wherever possible.'
    },
    {
      id: 'functional',
      icon: Settings,
      title: 'Functional Cookies',
      number: 3,
      description: 'These cookies allow Mokogo to remember your preferences.',
      preferences: [
        'Selected city or search preferences',
        'Language or display settings'
      ],
      note: 'They help provide a more personalized experience.'
    },
    {
      id: 'thirdParty',
      icon: Database,
      title: 'Third-Party Cookies',
      number: 4,
      description: 'Some cookies may be placed by trusted third-party services we use.',
      services: [
        'Analytics providers',
        'Authentication services (e.g., Google Sign-In)'
      ],
      note: 'These third parties process information according to their own privacy policies. Mokogo does not control how third-party cookies are used.'
    }
  ]

  const cookieUses = [
    'Ensure the website functions correctly',
    'Keep you logged in and authenticated',
    'Improve performance and user experience',
    'Understand how users interact with the platform',
    'Protect against misuse, fraud, and security threats'
  ]

  const cookieDonts = [
    'Targeted advertising',
    'Cross-site tracking for ads',
    'Selling user data to third parties'
  ]

  const userControls = [
    'You can choose to block or delete cookies through your browser settings',
    'Most browsers allow you to manage cookies on a per-site basis',
    'Blocking certain cookies may affect site functionality',
    'For more information, check your browser\'s help section'
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
              Cookie Policy • Transparency & Control
            </span>
            <h1 className="mt-6 text-3xl sm:text-4xl lg:text-[2.9rem] font-bold leading-tight text-gray-900">
              Cookie Policy
            </h1>
            <p className="mt-5 text-lg sm:text-xl leading-relaxed text-gray-800">
              This Cookie Policy explains how Mokogo uses cookies and similar technologies when you visit or use our website and services.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-400/20 border border-orange-300/40 px-6 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-orange-800 shadow-lg shadow-orange-200/50 ring-1 ring-orange-300/30">
              Last updated: 6th January, 2026
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="relative px-6 md:px-[10%] py-16 sm:py-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#fef4f1] via-transparent to-transparent" />
          
          <div className="relative mx-auto max-w-6xl">
            {/* Introduction */}
            <div className="mb-12 relative overflow-hidden rounded-[2rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 p-8 md:p-10 shadow-xl shadow-orange-100/40">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_55%)]" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center">
                    <Cookie className="w-6 h-6 text-orange-500" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Understanding Cookies</h2>
                </div>
                <p className="text-base sm:text-lg leading-relaxed text-gray-700 mb-4">
                  By continuing to use Mokogo, you agree to the use of cookies as described in this policy, unless you choose to disable them through your browser settings.
                </p>
                <div className="bg-white rounded-xl p-5 border border-orange-200">
                  <p className="text-sm sm:text-base text-gray-700 mb-3">
                    Cookies are small text files placed on your device (computer, phone, tablet) when you visit a website. They help the site remember information about your visit, which can improve your experience and make the website work properly.
                  </p>
                  <p className="text-sm sm:text-base text-gray-700">
                    Cookies do not typically identify you personally, but they may be linked to personal data when combined with other information.
                  </p>
                </div>
              </div>
            </div>

            {/* How we use cookies - Grid Layout */}
            <div className="grid gap-8 lg:grid-cols-2 mb-12">
              {/* How we use cookies */}
              <div className="relative overflow-hidden rounded-[2rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 p-8 md:p-10 shadow-xl shadow-orange-100/40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_55%)]" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100/50 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-orange-700">
                    How We Use Cookies
                  </span>
                  <h3 className="mt-4 text-2xl font-semibold text-gray-900">Mokogo uses cookies to:</h3>
                  <ul className="mt-6 space-y-3 text-sm sm:text-base leading-relaxed text-gray-700">
                    {cookieUses.map((use, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-400/10 text-xs font-semibold text-orange-500 shadow-inner shadow-orange-200/50">
                          <CheckCircle className="h-3.5 w-3.5" />
                        </span>
                        <span>{use}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* What we don't use */}
              <div className="relative overflow-hidden rounded-[2rem] border border-orange-200 bg-gradient-to-br from-[#fff4f1] via-white to-[#fffafa] p-8 md:p-10 shadow-xl shadow-[#f8d8cf]/45">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.14),transparent_60%)]" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#f97316]">
                    What We Don't Use
                  </span>
                  <h3 className="mt-4 text-2xl font-semibold text-[#0f172a]">Cookies we do not use</h3>
                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-gray-700 mb-6">
                    To be clear, Mokogo does not use cookies for:
                  </p>
                  <ul className="space-y-3 text-sm sm:text-base leading-relaxed text-[#3f4756]">
                    {cookieDonts.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#f97316]/10 text-xs font-semibold text-[#f97316] shadow-inner shadow-[#fcd8ce]/50">
                          <span className="text-orange-500 font-bold">•</span>
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-green-800 font-medium text-sm">
                      We do not use cookies to sell your personal data or track you across unrelated websites.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Types of cookies - Interactive Expandable */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center">
                  <Database className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100/50 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-orange-700">
                    Cookie Types
                  </span>
                  <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900">Types of cookies we use</h2>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {cookieTypes.map((cookieType) => {
                  const Icon = cookieType.icon
                  const isExpanded = expandedCookieTypes[cookieType.id]
                  
                  return (
                    <div
                      key={cookieType.id}
                      className={`relative overflow-hidden rounded-[2rem] border border-orange-200 ${
                        cookieType.number % 2 === 0
                          ? 'bg-gradient-to-br from-[#fff4f1] via-white to-[#fffafa] shadow-xl shadow-[#f8d8cf]/45'
                          : 'bg-gradient-to-br from-orange-50 via-white to-orange-50/50 shadow-xl shadow-orange-100/40'
                      }`}
                    >
                      <div className={`absolute inset-0 ${
                        cookieType.number % 2 === 0
                          ? 'bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.14),transparent_60%)]'
                          : 'bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_55%)]'
                      }`} />
                      <div className="relative">
                        <button
                          onClick={() => toggleCookieType(cookieType.id)}
                          className="w-full flex items-start gap-4 p-6 hover:bg-orange-50/50 transition-colors text-left"
                        >
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center">
                              <Icon className="w-6 h-6 text-orange-500" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-orange-500">{cookieType.number}.</span>
                                <h3 className="text-lg font-semibold text-gray-900">{cookieType.title}</h3>
                              </div>
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-orange-500" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-orange-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-700">{cookieType.description}</p>
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="px-6 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            {cookieType.helps && (
                              <>
                                <p className="text-sm font-medium text-gray-800">They help with:</p>
                                <ul className="space-y-2 text-sm text-gray-700">
                                  {cookieType.helps.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <span className="text-orange-400 font-bold">•</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}
                            {cookieType.collects && (
                              <>
                                <p className="text-sm font-medium text-gray-800">They may collect information such as:</p>
                                <ul className="space-y-2 text-sm text-gray-700">
                                  {cookieType.collects.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <span className="text-orange-400 font-bold">•</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}
                            {cookieType.preferences && (
                              <>
                                <p className="text-sm font-medium text-gray-800">Such as:</p>
                                <ul className="space-y-2 text-sm text-gray-700">
                                  {cookieType.preferences.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <span className="text-orange-400 font-bold">•</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}
                            {cookieType.services && (
                              <>
                                <p className="text-sm font-medium text-gray-800">Such as:</p>
                                <ul className="space-y-2 text-sm text-gray-700">
                                  {cookieType.services.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <span className="text-orange-400 font-bold">•</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}
                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mt-4">
                              <p className="text-sm text-orange-800 italic">{cookieType.note}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Your choices and controls */}
            <div className="mb-12 relative overflow-hidden rounded-[2rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 p-8 md:p-10 shadow-xl shadow-orange-100/40">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.12),transparent_60%)]" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center">
                    <Settings className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100/50 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-orange-700">
                      Your Control
                    </span>
                    <h2 className="mt-2 text-2xl font-semibold text-gray-900">Your choices and controls</h2>
                  </div>
                </div>
                <p className="text-base text-gray-700 mb-6">
                  You have control over how cookies are used:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {userControls.map((control, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 border border-orange-200">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{control}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Updates & Contact - Grid Layout */}
            <div className="grid gap-8 lg:grid-cols-2 mb-12">
              {/* Updates */}
              <div className="relative overflow-hidden rounded-[2rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 p-8 md:p-10 shadow-xl shadow-orange-100/40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_55%)]" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Updates to this Cookie Policy</h3>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                    We may update this Cookie Policy from time to time to reflect changes in technology, law, or how Mokogo operates. Any updates will be posted on this page with a revised "Last updated" date.
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="relative overflow-hidden rounded-[2rem] border border-orange-200 bg-gradient-to-br from-[#fff4f1] via-white to-[#fffafa] p-8 md:p-10 shadow-xl shadow-[#f8d8cf]/45">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.14),transparent_60%)]" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Contact us</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 mb-4">
                    If you have questions about this Cookie Policy or how we use cookies, you can contact us at:
                  </p>
                  <div className="bg-gradient-to-br from-orange-400/10 to-orange-400/5 rounded-xl p-4 border border-orange-400/20">
                    <a 
                      href="mailto:hello@mokogo.in" 
                      className="text-lg font-bold text-orange-400 hover:text-orange-500 transition-colors flex items-center gap-2"
                    >
                      <Mail className="w-5 h-5" />
                      hello@mokogo.in
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Final note */}
            <div className="relative overflow-hidden rounded-[2rem] border border-[#fde1da] bg-gradient-to-br from-[#fff4f1] via-white to-[#fff9f6] p-8 md:p-10 shadow-xl shadow-[#f8d8cf]/45">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.12),transparent_60%)]" />
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-400/20 flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Final note</h3>
                  <p className="text-base leading-relaxed text-gray-700">
                    We use cookies thoughtfully and only where they genuinely help make Mokogo work better for you.
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

export default CookiePolicy
