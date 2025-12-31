import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import { Users, Home, Shield, Lock, DollarSign, Mail, CheckCircle, FileText, MessageSquare, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  subAnswer?: string
  list?: string[]
  link?: {
    text: string
    href: string
  }
}

const HelpCentre = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    gettingStarted: true,
    lookingForRoom: false,
    listingRoom: false,
    accounts: false,
    safety: false,
    payments: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const quickLinks = [
    { icon: Home, label: 'Find Your Place', href: '/explore', color: 'orange' },
    { icon: Users, label: 'List Your Space', href: '/listing/wizard', color: 'orange' },
    { icon: Shield, label: 'Safety Tips', href: '/safety-tips', color: 'orange' },
    { icon: FileText, label: 'How It Works', href: '/how-it-works', color: 'orange' },
  ]

  const faqSections = [
    {
      id: 'gettingStarted',
      icon: FileText,
      title: 'Getting Started',
      color: 'orange',
      items: [
        {
          question: 'What is Mokogo?',
          answer: 'Mokogo is a platform that helps people list rooms and find flatmates or shared spaces. We help users discover and connect — decisions and agreements happen directly between users.'
        },
        {
          question: 'Who can use Mokogo?',
          answer: 'Anyone aged 18 or above can use Mokogo to:',
          list: [
            'Look for a room or shared space',
            'List a room they want to rent out',
            'Connect directly with potential flatmates'
          ]
        }
      ]
    },
    {
      id: 'lookingForRoom',
      icon: Home,
      title: 'For People Looking for a Room',
      color: 'orange',
      items: [
        {
          question: 'How do I search for a room?',
          answer: 'Click "Find Your Place", tell us a few basics like your city, budget, and move-in date, and we\'ll show you the most relevant listings available.'
        },
        {
          question: 'Why am I not seeing any listings?',
          answer: 'Sometimes we don\'t have listings that match all your preferences exactly.',
          subAnswer: 'You can:',
          list: [
            'Adjust your budget or move-in date',
            'Try nearby locations',
            'Check back later — new listings are added regularly'
          ]
        },
        {
          question: 'Do I need an account to browse listings?',
          answer: 'You can explore listings without signing up. You\'ll be asked to create an account only when you want to contact a lister.'
        },
        {
          question: 'Is it safe to contact listers?',
          answer: 'We encourage users to:',
          list: [
            'Meet in person before committing',
            'Avoid paying anything before visiting',
            'Trust their instincts'
          ],
          link: { text: 'Safety Tips page', href: '/safety-tips' }
        }
      ]
    },
    {
      id: 'listingRoom',
      icon: Users,
      title: 'For People Listing a Room',
      color: 'orange',
      items: [
        {
          question: 'How do I list my space?',
          answer: 'Click "List Your Space", sign up or log in, and fill in the listing details. The process is simple and should take just a few minutes.'
        },
        {
          question: 'Can I edit or remove my listing?',
          answer: 'Yes. You can edit or remove your listing anytime after logging in.'
        },
        {
          question: 'Who will be able to see my listing?',
          answer: 'Your listing will be visible to users searching in the relevant city and criteria. Only share personal contact details when you\'re comfortable.'
        }
      ]
    },
    {
      id: 'accounts',
      icon: Lock,
      title: 'Accounts & Login',
      color: 'orange',
      items: [
        {
          question: 'How can I sign up or log in?',
          answer: 'You can sign up or log in using:',
          list: [
            'Email and password',
            'Email login link',
            'Phone number (OTP)',
            'Google Sign-In'
          ],
          subAnswer: 'Choose whatever feels easiest for you.'
        },
        {
          question: 'I\'m not receiving OTP or login emails',
          answer: 'Please check:',
          list: [
            'Your spam or promotions folder',
            'That your email address or phone number is correct'
          ],
          subAnswer: 'If the issue continues, reach out to us.'
        }
      ]
    },
    {
      id: 'safety',
      icon: Shield,
      title: 'Safety & Verification',
      color: 'orange',
      items: [
        {
          question: 'Are users verified?',
          answer: 'We use basic verification methods like phone or email verification to reduce misuse. However, we don\'t conduct background checks or property verification.',
          subAnswer: 'Always meet, verify, and decide independently.'
        },
        {
          question: 'I came across something suspicious. What should I do?',
          answer: 'If you notice:',
          list: [
            'A misleading listing',
            'Spam or suspicious behaviour',
            'Someone making you uncomfortable'
          ],
          subAnswer: 'Please contact us so we can review it.'
        }
      ]
    },
    {
      id: 'payments',
      icon: DollarSign,
      title: 'Payments & Agreements',
      color: 'orange',
      items: [
        {
          question: 'Does Mokogo handle payments?',
          answer: 'No. Mokogo does not collect rent, deposits, or booking fees. All payments and agreements are handled directly between users. Please be cautious and avoid paying before visiting a property.'
        }
      ]
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
              Help & Support • We're Here for You
            </span>
            <h1 className="mt-6 text-3xl sm:text-4xl lg:text-[2.9rem] font-bold leading-tight text-gray-900">
              Welcome to Mokogo's Help Centre 👋
            </h1>
            <p className="mt-5 text-lg sm:text-xl leading-relaxed text-gray-800">
              We're here to make finding or listing a place as smooth as possible.
            </p>
            <p className="mt-2 text-base sm:text-lg leading-relaxed text-gray-700">
              Below you'll find answers to common questions, along with guidance on how to get help if you're stuck.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="relative px-6 md:px-[10%] py-16 sm:py-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#fef4f1] via-transparent to-transparent" />
          
          <div className="relative mx-auto max-w-6xl">
            {/* Quick Links */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Links</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={index}
                      to={link.href}
                      className="group relative overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 p-6 shadow-lg shadow-orange-100/40 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-200/50"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_55%)]" />
                      <div className="relative text-center">
                        <div className="w-12 h-12 rounded-full bg-orange-400/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-400/20 transition-colors">
                          <Icon className="w-6 h-6 text-orange-500" />
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{link.label}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* FAQ Sections */}
            <div className="space-y-6">
              {faqSections.map((section) => {
                const Icon = section.icon
                const isExpanded = expandedSections[section.id]
                
                return (
                  <div
                    key={section.id}
                    className="relative overflow-hidden rounded-[2rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 shadow-xl shadow-orange-100/40"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_55%)]" />
                    <div className="relative">
                      {/* Section Header - Clickable */}
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-6 md:p-8 hover:bg-orange-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-orange-500" />
                          </div>
                          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">{section.title}</h2>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-6 h-6 text-orange-500" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-orange-500" />
                        )}
                      </button>

                      {/* Section Content - Expandable */}
                      {isExpanded && (
                        <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                          {section.items.map((item, index) => (
                            <div
                              key={index}
                              className="bg-white rounded-xl p-5 border border-orange-200 shadow-sm hover:shadow-md transition-shadow"
                            >
                              <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.question}</h3>
                              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                                {item.answer}
                              </p>
                              {(item as FAQItem).subAnswer && (
                                <p className="text-sm font-medium text-gray-800 mb-2">{(item as FAQItem).subAnswer}</p>
                              )}
                              {item.list && (
                                <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                                  {item.list.map((listItem, listIndex) => (
                                    <li key={listIndex} className="flex items-start gap-2">
                                      <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                                      <span>{listItem}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                              {(item as FAQItem).link && (
                                <p className="text-sm text-gray-700 mt-3">
                                  You can read more on our{' '}
                                  <Link to={(item as FAQItem).link!.href} className="text-orange-400 hover:text-orange-500 underline font-medium">
                                    {(item as FAQItem).link!.text}
                                  </Link>.
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Need More Help - CTA Card */}
            <div className="mt-12 relative overflow-hidden rounded-[2rem] border border-[#fde1da] bg-gradient-to-br from-[#fff4f1] via-white to-[#fff9f6] p-8 md:p-10 shadow-xl shadow-[#f8d8cf]/45">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.12),transparent_60%)]" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#f97316]">
                      Need More Help?
                    </span>
                    <h2 className="mt-2 text-2xl font-semibold text-gray-900">Still have questions?</h2>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 border border-orange-200 shadow-sm mb-6">
                  <p className="text-base text-gray-700 mb-4">
                    If you didn't find what you were looking for, we're happy to help.
                  </p>
                  <div className="bg-gradient-to-br from-orange-400/10 to-orange-400/5 rounded-xl p-5 border border-orange-400/20 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Mail className="w-5 h-5 text-orange-400" />
                      <span className="text-lg font-semibold text-gray-900">Email us at:</span>
                    </div>
                    <a 
                      href="mailto:hello@mokogo.in" 
                      className="text-xl font-bold text-orange-400 hover:text-orange-500 transition-colors ml-8"
                    >
                      hello@mokogo.in
                    </a>
                  </div>
                  <p className="text-sm font-medium text-gray-800 mb-3">Tell us:</p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 font-bold">•</span>
                      <span>What you were trying to do</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 font-bold">•</span>
                      <span>What went wrong</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 font-bold">•</span>
                      <span>Any screenshots (if applicable)</span>
                    </li>
                  </ul>
                  <p className="text-sm text-gray-700 mt-4">
                    We'll get back to you as soon as possible.
                  </p>
                </div>
              </div>
            </div>

            {/* One last thing */}
            <div className="mt-8 relative overflow-hidden rounded-[2rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 p-8 shadow-xl shadow-orange-100/40">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.12),transparent_60%)]" />
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-400/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">One last thing</h3>
                  <p className="text-base leading-relaxed text-gray-700">
                    Mokogo is still growing, and your feedback really helps. If something feels confusing or broken, let us know — we're listening.
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

export default HelpCentre
