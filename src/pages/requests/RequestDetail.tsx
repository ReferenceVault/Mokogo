import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Logo from '@/components/Logo'
import { useStore } from '@/store/useStore'

const RequestDetail = () => {
  const { requestId } = useParams()
  const { requests, updateRequest, user } = useStore()
  const [showAcceptModal, setShowAcceptModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showBlockModal, setShowBlockModal] = useState(false)

  const request = requests.find((r) => r.id === requestId)

  if (!request) {
    return (
      <div className="min-h-screen bg-mokogo-off-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Request not found</p>
          <Link to="/requests" className="text-mokogo-primary hover:underline">
            Back to requests
          </Link>
        </div>
      </div>
    )
  }

  const handleAccept = () => {
    // In real app, this would reveal contact details from backend
    const seekerPhone = '+91-9876543210' // Mock data
    const seekerEmail = 'seeker@example.com' // Mock data

    updateRequest(request.id, {
      status: 'accepted',
      contactRevealed: true,
      seekerPhone,
      seekerEmail,
    })
    setShowAcceptModal(false)
  }

  const handleReject = () => {
    updateRequest(request.id, {
      status: 'rejected',
    })
    setShowRejectModal(false)
  }

  const handleBlock = () => {
    updateRequest(request.id, {
      status: 'blocked',
    })
    setShowBlockModal(false)
  }

  return (
    <div className="min-h-screen bg-mokogo-off-white">
      <header className="bg-white border-b border-mokogo-gray px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <Link to="/requests" className="text-mokogo-primary hover:underline mb-4 inline-block">
          ← Back to requests
        </Link>

        <div className="card">
          <div className="mb-6">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                request.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : request.status === 'accepted'
                  ? 'bg-green-100 text-green-800'
                  : request.status === 'rejected'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>

          {/* Seeker Summary */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Seeker summary</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-mokogo-primary/20 flex items-center justify-center">
                <span className="text-mokogo-primary font-medium text-xl">
                  {request.seekerName[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{request.seekerName}</h3>
                {request.seekerAge && (
                  <p className="text-sm text-gray-600">Age: {request.seekerAge}</p>
                )}
                {request.seekerGender && (
                  <p className="text-sm text-gray-600">Gender: {request.seekerGender}</p>
                )}
                {request.seekerOccupation && (
                  <p className="text-sm text-gray-600">{request.seekerOccupation}</p>
                )}
                {request.seekerCity && (
                  <p className="text-sm text-gray-600">From: {request.seekerCity}</p>
                )}
              </div>
            </div>
          </section>

          {/* Intro Message */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Intro message</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{request.introMessage}</p>
          </section>

          {/* Meta */}
          <section className="mb-6 text-sm text-gray-600">
            <p>Requested on: {new Date(request.requestedAt).toLocaleString()}</p>
            {request.desiredMoveInDate && (
              <p>Desired move-in: {new Date(request.desiredMoveInDate).toLocaleDateString()}</p>
            )}
          </section>

          {/* Privacy Notice */}
          {request.status === 'pending' && (
            <div className="bg-mokogo-info-bg border border-mokogo-info-border rounded-lg p-4 mb-6">
              <p className="text-sm text-mokogo-info-text">
                Your phone number and email are hidden. They are only shared if you accept this request.
              </p>
            </div>
          )}

          {/* Contact Details (if accepted) */}
          {request.status === 'accepted' && request.contactRevealed && (
            <section className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-3">Contact details shared</h3>
              <div className="space-y-2 mb-3">
                <div>
                  <p className="text-xs text-green-700 mb-1">Your contact:</p>
                  <p className="text-sm text-green-900">{user?.phone || 'N/A'}</p>
                  <p className="text-sm text-green-900">{user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-green-700 mb-1">Seeker's contact:</p>
                  <p className="text-sm text-green-900">{request.seekerPhone || 'N/A'}</p>
                  <p className="text-sm text-green-900">{request.seekerEmail || 'N/A'}</p>
                </div>
              </div>
              <p className="text-xs text-green-700">
                You can now coordinate visits directly by call or messaging.
              </p>
            </section>
          )}

          {/* Rejected/Blocked Info */}
          {request.status === 'rejected' && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                You rejected this request on {new Date(request.requestedAt).toLocaleDateString()}.
              </p>
            </div>
          )}

          {request.status === 'blocked' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                Blocked until {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}.
              </p>
            </div>
          )}

          {/* Actions */}
          {request.status === 'pending' && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowAcceptModal(true)}
                className="btn-primary"
              >
                Accept request
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="btn-secondary"
              >
                Reject
              </button>
              <button
                onClick={() => setShowBlockModal(true)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Block this user for 14 days
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Accept Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Share your contact details?</h3>
            <p className="text-gray-600 mb-4">
              If you accept, your phone number and email will be shared with this person so they can contact you directly.
            </p>
            <div className="flex gap-3">
              <button onClick={handleAccept} className="btn-primary flex-1">
                Confirm & share details
              </button>
              <button
                onClick={() => setShowAcceptModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reject this request?</h3>
            <p className="text-gray-600 mb-4">
              They won't see your contact details.
            </p>
            <div className="flex gap-3">
              <button onClick={handleReject} className="btn-primary flex-1">
                Reject
              </button>
              <button
                onClick={() => setShowRejectModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Block this user?</h3>
            <p className="text-gray-600 mb-4">
              They won't be able to send you new requests for 14 days.
            </p>
            <div className="flex gap-3">
              <button onClick={handleBlock} className="btn-primary flex-1">
                Block
              </button>
              <button
                onClick={() => setShowBlockModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RequestDetail