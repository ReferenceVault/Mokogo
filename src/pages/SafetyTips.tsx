import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Shield, Eye, DollarSign, CheckCircle, MessageSquare, Home, Calendar, Lock, AlertCircle, Heart } from 'lucide-react'

const SafetyTips = () => {
  return (
    <div className="min-h-screen bg-mokogo-off-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-mokogo-primary/20 to-mokogo-primary/10 py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-400/20 mb-6">
              <Shield className="w-8 h-8 text-orange-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Safety Tips
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Finding a room or a flatmate is a big decision, and we want your experience on Mokogo to be smooth and stress-free. While we help people discover and connect with each other, a little caution goes a long way.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 py-12">
          {/* Introduction */}
          <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray p-8 mb-8">
            <p className="text-gray-700 leading-relaxed">
              Here are a few simple tips to help you stay safe and confident along the way.
            </p>
          </div>

          {/* If you're looking for a room */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center">
                <Home className="w-6 h-6 text-orange-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">If you're looking for a room</h2>
            </div>

            <div className="space-y-6">
              {/* Meet before you commit */}
              <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <Eye className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Meet before you commit</h3>
                    <p className="text-gray-700 mb-4">
                      Photos and descriptions are useful, but nothing beats seeing the place in person. Always try to visit the property and meet the lister (and flatmates, if possible) before making any decisions.
                    </p>
                    <div className="bg-mokogo-info-bg border border-mokogo-info-border rounded-lg p-4">
                      <p className="text-sm font-medium text-mokogo-info-text mb-2">If you can:</p>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          <span>Visit during the daytime</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          <span>Take a friend along</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          <span>Ask all the questions you have — there's no such thing as a silly one</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Be careful with payments */}
              <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Be careful with payments</h3>
                    <p className="text-gray-700">
                      Avoid sending any advance payment, token amount, or deposit before you've seen the place and spoken to the person listing it.
                    </p>
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-800">
                        If someone is pushing you to transfer money quickly or asking for payment before a visit, it's okay to pause or walk away.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Double-check the basics */}
              <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Double-check the basics</h3>
                    <p className="text-gray-700 mb-4">
                      Make sure you're clear on things like:
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        <span>Rent and deposit</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        <span>Move-in date</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        <span>Exact location</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        <span>House rules and shared expenses</span>
                      </li>
                    </ul>
                    <p className="text-gray-700 mt-4">
                      If something doesn't add up, ask again. Clarity now saves trouble later.
                    </p>
                  </div>
                </div>
              </div>

              {/* Share thoughtfully */}
              <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Share thoughtfully</h3>
                    <p className="text-gray-700">
                      It's normal to exchange contact details to coordinate visits, but try not to share sensitive personal or financial information too early.
                    </p>
                    <p className="text-gray-700 mt-3">
                      Keep conversations respectful and comfortable — if something feels off, you don't have to continue.
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust your gut */}
              <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Trust your gut</h3>
                    <p className="text-gray-700">
                      If a listing, conversation, or situation doesn't feel right, it's okay to say no. The right place should feel comfortable, not rushed or pressured.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* If you're listing a room */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center">
                <Home className="w-6 h-6 text-orange-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">If you're listing a room</h2>
            </div>

            <div className="space-y-6">
              {/* Take your time with conversations */}
              <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Take your time with conversations</h3>
                    <p className="text-gray-700">
                      Before inviting someone over or sharing your exact address, have a quick chat to understand what they're looking for. This helps you decide if it's worth moving ahead.
                    </p>
                  </div>
                </div>
              </div>

              {/* Show your place safely */}
              <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <Eye className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Show your place safely</h3>
                    <p className="text-gray-700 mb-4">When scheduling visits:</p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                        <span>Pick a time that works for you</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                        <span>Let a flatmate or friend know someone is coming</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                        <span>Don't feel obligated to entertain multiple visitors at once</span>
                      </li>
                    </ul>
                    <p className="text-gray-700 mt-4 font-medium">
                      Your comfort always comes first.
                    </p>
                  </div>
                </div>
              </div>

              {/* Be clear upfront */}
              <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Be clear upfront</h3>
                    <p className="text-gray-700">
                      Clearly communicate rent, deposit, house rules, and expectations from the start. Being open and honest makes it easier to find someone who's a good fit.
                    </p>
                  </div>
                </div>
              </div>

              {/* Protect your privacy */}
              <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Protect your privacy</h3>
                    <p className="text-gray-700">
                      Share photos and details carefully, and avoid giving out personal information unless you're comfortable. If someone asks for details that feel unnecessary, it's okay to say no.
                    </p>
                  </div>
                </div>
              </div>

              {/* Don't feel rushed */}
              <div className="bg-white rounded-2xl shadow-sm border border-mokogo-gray p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Don't feel rushed</h3>
                    <p className="text-gray-700">
                      If someone is pushing you to decide quickly or making you uncomfortable, you can always step back. It's better to wait a little longer than end up with the wrong flatmate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick note for everyone */}
          <div className="bg-mokogo-info-bg border border-mokogo-info-border rounded-2xl p-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-400/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-mokogo-info-text" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-mokogo-info-text mb-4">A quick note for everyone</h3>
                <p className="text-mokogo-info-text leading-relaxed mb-4">
                  Mokogo helps people find and connect with each other, but decisions around visits, payments, and move-ins are made directly between users. Take your time, communicate openly, and always do what feels right for you.
                </p>
                <p className="text-mokogo-info-text leading-relaxed">
                  If you notice anything suspicious or misuse of the platform, feel free to reach out — your feedback helps keep Mokogo better for everyone.
                </p>
              </div>
            </div>
          </div>

          {/* Final thought */}
          <div className="bg-gradient-to-br from-orange-400/10 to-orange-400/5 rounded-2xl p-8 border border-orange-400/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-400/20 flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-orange-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Final thought</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Finding the right place or person can take a bit of patience. Stay alert, trust your instincts, and don't rush the process. We're glad you're here, and we hope Mokogo helps you find a place that truly feels right.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default SafetyTips

