import { useEffect, useState } from 'react'
import { VibeTagId } from '@/types'
import Logo from '@/components/Logo'

interface MikoQuizResult {
  tags: VibeTagId[]
  roomTypePreference?: 'private' | 'shared' | 'either'
  city?: string
}

interface MikoVibeQuizProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (result: MikoQuizResult) => void
}

interface MikoOption {
  id: string
  label: string
  description: string
  tag: VibeTagId
  roomTypePreference?: 'private' | 'shared' | 'either'
  city?: string
}

interface MikoQuestion {
  id: string
  title: string
  options: MikoOption[]
}

const QUESTIONS: MikoQuestion[] = [
  {
    id: 'city',
    title: 'Which city are you searching in?',
    options: [
      {
        id: 'pune',
        label: '📍 Pune',
        description: 'Pune',
        tag: 'well_connected_area',
        city: 'Pune',
      },
      {
        id: 'mumbai',
        label: '📍 Mumbai',
        description: 'Mumbai',
        tag: 'well_connected_area',
        city: 'Mumbai',
      },
      {
        id: 'hyderabad',
        label: '📍 Hyderabad',
        description: 'Hyderabad',
        tag: 'well_connected_area',
        city: 'Hyderabad',
      },
      {
        id: 'bangalore',
        label: '📍 Bangalore',
        description: 'Bangalore',
        tag: 'well_connected_area',
        city: 'Bangalore',
      },
      {
        id: 'any-city',
        label: '🌍 Any City',
        description: 'Show matches across cities',
        tag: 'flexible_overall',
        city: 'any',
      },
    ],
  },
  {
    id: 'ideal-vibe',
    title: "What's your ideal home vibe?",
    options: [
      {
        id: 'calm',
        label: '🌿 Calm, quiet, and low-key',
        description: 'Mostly quiet, low distractions',
        tag: 'calm_vibes',
      },
      {
        id: 'thoughtfully-social',
        label: '🛋 Friendly but everyone has their own space',
        description: 'Balanced vibe with personal space',
        tag: 'thoughtfully_social',
      },
      {
        id: 'lively',
        label: '🎉 Social, chatty, and lively',
        description: 'House feels social and energetic',
        tag: 'lively',
      },
    ],
  },
  {
    id: 'home-time',
    title: 'How do you usually spend time at home?',
    options: [
      {
        id: 'couch',
        label: '😴 Mostly winding down after work',
        description: 'Quiet downtime matters most',
        tag: 'couch_chill_repeat',
      },
      {
        id: 'remote',
        label: '💻 Working from home most days',
        description: 'Need a WFH-friendly setup',
        tag: 'remote_life',
      },
      {
        id: 'community',
        label: '🍕 Hanging out with flatmates',
        description: 'Love shared time and connection',
        tag: 'community_living',
      },
    ],
  },
  {
    id: 'priority',
    title: "What's your top priority right now?",
    options: [
      {
        id: 'budget',
        label: '💸 Staying within budget',
        description: 'Best value for money',
        tag: 'wallet_friendly',
      },
      {
        id: 'feel-good',
        label: '🛏 Comfort, space, and good vibes',
        description: 'Comfort-first living',
        tag: 'feel_good_space',
      },
      {
        id: 'commute',
        label: '🚇 Location & easy commute',
        description: 'Stay close to hotspots',
        tag: 'well_connected_area',
      },
    ],
  },
  {
    id: 'move-timing',
    title: 'When are you thinking of moving?',
    options: [
      {
        id: 'asap',
        label: '⚡ ASAP — I’m ready to move',
        description: 'Within 1–2 weeks',
        tag: 'asap',
      },
      {
        id: 'few-weeks',
        label: '📆 In the next few weeks',
        description: 'Within 2–4 weeks',
        tag: 'next_few_weeks',
      },
      {
        id: 'browsing',
        label: '👀 Just browsing for now',
        description: 'Flexible timeline',
        tag: 'no_rush',
      },
    ],
  },
  {
    id: 'personal-space',
    title: 'How important is personal space for you?',
    options: [
      {
        id: 'private',
        label: '🔐 I need my own private room',
        description: 'Private room only',
        tag: 'privacy_over_all',
        roomTypePreference: 'private',
      },
      {
        id: 'shared',
        label: '🤝 Shared room works for me',
        description: 'Open to sharing',
        tag: 'open_to_sharing',
        roomTypePreference: 'shared',
      },
      {
        id: 'either',
        label: '🤷 Open to either',
        description: 'Private or shared both work',
        tag: 'either_works',
        roomTypePreference: 'either',
      },
    ],
  },
  {
    id: 'hard-no',
    title: 'Anything that’s a hard no for you?',
    options: [
      {
        id: 'smoking',
        label: '🚬 Smoking',
        description: 'Prefer smoke-free homes',
        tag: 'smoke_free',
      },
      {
        id: 'noise',
        label: '🔊 Too much noise',
        description: 'Prefer quieter homes',
        tag: 'peace_over_noise',
      },
      {
        id: 'pets',
        label: '🐶 Pets',
        description: 'Prefer no pets',
        tag: 'no_furry_roommates',
      },
      {
        id: 'flexible',
        label: '✅ Nope, I’m flexible',
        description: 'Open to most situations',
        tag: 'flexible_overall',
      },
    ],
  },
]

const MikoVibeQuiz = ({ isOpen, onClose, onComplete }: MikoVibeQuizProps) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, MikoOption>>({})
  const [typedQuestion, setTypedQuestion] = useState('')
  const [showCursor, setShowCursor] = useState(true)

  const totalSteps = QUESTIONS.length
  const currentQuestion = QUESTIONS[currentStep]

  const selectedOption = answers[currentQuestion.id]

  const handleSelect = (option: MikoOption) => {
    const nextAnswers = { ...answers, [currentQuestion.id]: option }
    setAnswers(nextAnswers)

    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1)
      return
    }

    const collected = Object.values(nextAnswers)
    const tags = Array.from(new Set(collected.map(item => item.tag)))
    const roomTypePreference = collected.find(item => item.roomTypePreference)?.roomTypePreference
    const city = collected.find(item => item.city)?.city

    onComplete({ tags, roomTypePreference, city })
    setCurrentStep(0)
    setAnswers({})
  }

  const handleBack = () => {
    if (currentStep === 0) return
    setCurrentStep(prev => prev - 1)
  }

  useEffect(() => {
    setTypedQuestion('')
    let index = 0
    const text = currentQuestion.title
    const typingTimer = setInterval(() => {
      index += 1
      setTypedQuestion(text.slice(0, index))
      if (index >= text.length) {
        clearInterval(typingTimer)
      }
    }, 22)
    return () => clearInterval(typingTimer)
  }, [currentQuestion.title])

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    return () => clearInterval(cursorTimer)
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <section className="relative w-full max-w-4xl h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8 bg-[#F7F5F2] rounded-3xl border border-[#E9E3DC] shadow-2xl overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZGVmcz48cGF0dGVybiBpZD0idGV4dHVyZSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ0cmFuc3BhcmVudCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjAuNSIgZmlsbD0iIzJDMkMyQyIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3RleHR1cmUpIi8+PC9zdmc+')] opacity-50" />
        </div>

        <div className="relative w-full max-w-3xl flex flex-col items-center text-center -mt-6">
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="scale-125 md:scale-150 origin-center">
              <Logo />
            </div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#B5573E]/80">
              MIKO VIBE SEARCH
            </p>
            <p className="text-[#2C2C2C]/60 text-center font-light max-w-md text-xs md:text-sm">
              Get matched with homes that fit your lifestyle, not just your budget.
            </p>
          </div>

          <div className="w-full flex flex-col items-center gap-4 mt-12 relative">
            <button
              onClick={onClose}
              className="absolute right-0 top-0 text-[#2C2C2C]/75 hover:text-[#B5573E] transition-colors text-xs md:text-sm font-medium"
              type="button"
            >
              Close
            </button>
            <h2 className="text-2xl md:text-3xl font-light text-[#2C2C2C] text-center">
              {typedQuestion}
              <span className={`ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}>
                |
              </span>
            </h2>
          </div>

          <div className="mt-6 w-full flex items-center justify-center gap-2">
            {QUESTIONS.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 w-1.5 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-[#B5573E]'
                    : index < currentStep
                    ? 'bg-[#B5573E]/60'
                    : 'bg-[#E9E3DC]'
                }`}
              />
            ))}
          </div>

          <div
            className={`mt-6 w-full grid gap-4 ${
              currentQuestion.options.length === 3
                ? 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-1 sm:grid-cols-2'
            }`}
          >
            {currentQuestion.options.map((option, index) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full flex items-center justify-center gap-3 px-5 py-3 rounded-full border transition-all duration-300 text-[#2C2C2C] bg-white ${
                  selectedOption?.id === option.id
                    ? 'border-[#B5573E] shadow-md'
                    : 'border-[#E9E3DC] hover:border-[#B5573E]/60 hover:shadow-sm'
                } ${
                  currentQuestion.options.length % 2 === 1 &&
                  index === currentQuestion.options.length - 1
                    ? 'sm:col-span-2 sm:justify-self-center sm:max-w-[320px]'
                    : ''
                }`}
              >
                <span className="text-sm md:text-base font-medium">
                  {option.label}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between w-full">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 rounded-xl border border-[#B5573E]/40 text-[#2C2C2C]/80 font-medium hover:text-[#2C2C2C] hover:border-[#B5573E]/70 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={currentStep === 0}
            >
              Back
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MikoVibeQuiz
