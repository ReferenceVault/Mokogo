import { useEffect } from 'react'

interface ToastProps {
  message: string
  onClose: () => void
  duration?: number
}

const Toast = ({ message, onClose, duration = 5000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-5 flex items-start gap-3">
      <span className="text-sm">{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 text-gray-300 hover:text-white focus:outline-none"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  )
}

export default Toast
