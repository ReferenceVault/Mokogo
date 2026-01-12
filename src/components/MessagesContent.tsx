import { useState, useEffect, useRef } from 'react'
import { useStore } from '@/store/useStore'
import { messagesApi, ConversationResponse, MessageResponse } from '@/services/api'
import { websocketService } from '@/services/websocket'
import UserAvatar from './UserAvatar'
import { 
  MoreVertical, 
  Shield,
  Paperclip,
  Image as ImageIcon,
  Send,
  X,
  Flag,
  Archive
} from 'lucide-react'

interface MessagesContentProps {
  initialConversationId?: string
}

const MessagesContent = ({ initialConversationId }: MessagesContentProps) => {
  const { user } = useStore()
  const [conversations, setConversations] = useState<ConversationResponse[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(initialConversationId || null)
  const [messages, setMessages] = useState<MessageResponse[]>([])
  const [message, setMessage] = useState('')
  const [showProfile, setShowProfile] = useState(true)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const conversationsLoadedRef = useRef(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const conversationMenuRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  useEffect(() => {
    if (user && !conversationsLoadedRef.current) {
      const token = localStorage.getItem('mokogo-access-token')
      if (token) {
        websocketService.connect(token)
      }
      fetchConversations()
      conversationsLoadedRef.current = true
    }

    // WebSocket listeners
    const handleNewMessage = (newMessage: MessageResponse) => {
      // Update conversations list to refresh unread count and last message
      setConversations(prev => {
        return prev.map(conv => {
          const convId = conv._id || conv.id
          if (convId === newMessage.conversationId) {
            // Update last message and increment unread count if not from current user
            const senderId = typeof newMessage.senderId === 'object' ? newMessage.senderId._id : newMessage.senderId
            const userId = typeof user === 'object' && user?.id ? user.id : ''
            const isFromCurrentUser = senderId === userId
            const isCurrentConversation = selectedConversationId === convId
            
            return {
              ...conv,
              lastMessageId: newMessage,
              lastMessageAt: newMessage.createdAt,
              unreadCount: isFromCurrentUser || isCurrentConversation 
                ? (conv.unreadCount || 0) 
                : (conv.unreadCount || 0) + 1
            }
          }
          return conv
        })
      })

      // Only process messages for the current conversation
      if (selectedConversationId && newMessage.conversationId !== selectedConversationId) {
        return
      }

      setMessages(prev => {
        // Check if message already exists by ID
        const existingIndex = prev.findIndex(m => (m._id || m.id) === (newMessage._id || newMessage.id))
        if (existingIndex >= 0) {
          // Message already exists, update it (replace temp message with real one)
          const updated = [...prev]
          updated[existingIndex] = newMessage
          return updated
        }
        
        // Check if there's a temp message with the same text and sender that we should replace
        const senderId = typeof newMessage.senderId === 'object' ? newMessage.senderId._id : newMessage.senderId
        const userId = typeof user === 'object' && user?.id ? user.id : ''
        const isFromCurrentUser = senderId === userId
        
        const tempIndex = prev.findIndex(m => 
          m._id?.startsWith('temp-') && 
          m.text === newMessage.text &&
          m.conversationId === newMessage.conversationId &&
          isFromCurrentUser // Only replace temp messages from the current user
        )
        
        if (tempIndex >= 0) {
          // Replace temp message with real message
          const updated = [...prev]
          updated[tempIndex] = newMessage
          return updated
        }
        
        // New message, add it
        return [...prev, newMessage]
      })
      // Mark as read if it's the current conversation
      if (selectedConversationId && newMessage.conversationId === selectedConversationId) {
        messagesApi.markAsRead(selectedConversationId).catch(console.error)
      }
    }

    const handleConversationUpdate = (updatedConversation: ConversationResponse) => {
      setConversations(prev => {
        const index = prev.findIndex(c => (c._id || c.id) === (updatedConversation._id || updatedConversation.id))
        if (index >= 0) {
          const updated = [...prev]
          // Preserve unreadCount if not provided in update
          const existingConv = updated[index]
          const updatedConv = {
            ...updatedConversation,
            unreadCount: updatedConversation.unreadCount !== undefined 
              ? updatedConversation.unreadCount 
              : existingConv.unreadCount
          }
          // Move to top
          updated.splice(index, 1)
          updated.unshift(updatedConv)
          return updated
        }
        return prev
      })
    }

    const handleMessagesRead = (data: { conversationId: string; lastReadMessageId: string }) => {
      // Only update if it's the current conversation
      if (selectedConversationId && data.conversationId === selectedConversationId) {
        setMessages(prev => {
          const userId = typeof user === 'object' && user?.id ? user.id : ''
          const lastReadMsgId = data.lastReadMessageId
          
          // Find the index of the last read message
          const lastReadIndex = prev.findIndex(m => (m._id || m.id) === lastReadMsgId)
          if (lastReadIndex === -1) return prev
          
          // Mark all messages from current user up to and including the lastReadMessageId as read
          return prev.map((msg, index) => {
            const senderId = typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId
            // Only mark messages from current user that are at or before the last read message
            if (senderId === userId && index <= lastReadIndex) {
              return { ...msg, isRead: true }
            }
            return msg
          })
        })
      }
    }

    websocketService.on('new_message', handleNewMessage)
    websocketService.on('conversation_updated', handleConversationUpdate)
    websocketService.on('messages_read', handleMessagesRead)

    return () => {
      websocketService.off('new_message', handleNewMessage)
      websocketService.off('conversation_updated', handleConversationUpdate)
      websocketService.off('messages_read', handleMessagesRead)
    }
  }, [user, selectedConversationId])

  useEffect(() => {
    if (initialConversationId && !selectedConversationId) {
      setSelectedConversationId(initialConversationId)
    }
  }, [initialConversationId])

  useEffect(() => {
    if (selectedConversationId) {
      fetchMessages(selectedConversationId)
      websocketService.emit('join_conversation', { conversationId: selectedConversationId })
    }
  }, [selectedConversationId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchConversations = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const data = await messagesApi.getAllConversations()
      setConversations(data)
      if (initialConversationId && !selectedConversationId) {
        setSelectedConversationId(initialConversationId)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      const data = await messagesApi.getMessages(conversationId)
      setMessages(data)
      await messagesApi.markAsRead(conversationId)
      
      // Reset unread count for this conversation
      setConversations(prev => 
        prev.map(conv => 
          (conv._id || conv.id) === conversationId 
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      )
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedConversationId || sending) return

    setSending(true)
    const messageText = message.trim()
    setMessage('')

    try {
      // Optimistically add message
      const tempMessage: MessageResponse = {
        _id: `temp-${Date.now()}`,
        id: `temp-${Date.now()}`,
        conversationId: selectedConversationId,
        senderId: typeof user === 'object' && user?.id ? { _id: user.id, name: user.name || '', email: user.email || '' } : user?.id || '',
        text: messageText,
        isRead: false,
        isSystem: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setMessages(prev => [...prev, tempMessage])

      // Send via WebSocket (primary method)
      websocketService.emit('send_message', {
        conversationId: selectedConversationId,
        text: messageText,
      })

      // Note: We don't call the API here because WebSocket handles it
      // The WebSocket gateway will create the message and emit it back
      // If WebSocket fails, we'll remove the optimistic message in the catch block
    } catch (error) {
      console.error('Error sending message:', error)
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => !m._id?.startsWith('temp-')))
      alert('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleClearChat = async () => {
    if (!selectedConversationId) return
    
    if (!confirm('Are you sure you want to clear all messages in this chat? This action cannot be undone.')) {
      return
    }

    try {
      await messagesApi.clearMessages(selectedConversationId)
      setMessages([])
      setShowMenu(false)
      
      // Update conversation to remove last message
      setConversations(prev => 
        prev.map(conv => 
          (conv._id || conv.id) === selectedConversationId
            ? { ...conv, lastMessageId: undefined, lastMessageAt: new Date().toISOString() }
            : conv
        )
      )
    } catch (error) {
      console.error('Error clearing messages:', error)
      alert('Failed to clear messages. Please try again.')
    }
  }

  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      return
    }

    try {
      await messagesApi.deleteConversation(conversationId)
      setConversations(prev => prev.filter(conv => (conv._id || conv.id) !== conversationId))
      setOpenMenuId(null)
      
      // If deleted conversation was selected, clear selection
      if (selectedConversationId === conversationId) {
        setSelectedConversationId(null)
        setMessages([])
      }
    } catch (error) {
      console.error('Error deleting conversation:', error)
      alert('Failed to delete conversation. Please try again.')
    }
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
      
      // Close conversation menus
      let clickedOutside = true
      conversationMenuRefs.current.forEach((ref) => {
        if (ref && ref.contains(event.target as Node)) {
          clickedOutside = false
        }
      })
      
      if (clickedOutside) {
        setOpenMenuId(null)
      }
    }

    if (showMenu || openMenuId) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu, openMenuId])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
  }

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }

  const getOtherUser = (conversation: ConversationResponse) => {
    const userId = typeof user === 'object' && user?.id ? user.id : ''
    const user1Id = typeof conversation.user1Id === 'object' ? conversation.user1Id._id : conversation.user1Id
    
    if (user1Id === userId) {
      if (typeof conversation.user2Id === 'object') {
        return {
          _id: conversation.user2Id._id,
          name: conversation.user2Id.name,
          email: conversation.user2Id.email,
          profileImageUrl: conversation.user2Id.profileImageUrl
        }
      }
      return { _id: conversation.user2Id, name: 'Unknown', email: '', profileImageUrl: undefined }
    }
    
    if (typeof conversation.user1Id === 'object') {
      return {
        _id: conversation.user1Id._id,
        name: conversation.user1Id.name,
        email: conversation.user1Id.email,
        profileImageUrl: conversation.user1Id.profileImageUrl
      }
    }
    return { _id: conversation.user1Id, name: 'Unknown', email: '', profileImageUrl: undefined }
  }


  const getLastMessage = (conversation: ConversationResponse) => {
    if (conversation.lastMessageId && typeof conversation.lastMessageId === 'object') {
      return conversation.lastMessageId.text
    }
    return 'No messages yet'
  }

  const selectedConversation = conversations.find(c => (c._id || c.id) === selectedConversationId)
  const otherUser = selectedConversation ? getOtherUser(selectedConversation) : null
  
  // Debug: Log to see what data we're getting
  if (import.meta.env.DEV && selectedConversation) {
    console.log('Selected conversation:', selectedConversation)
    console.log('Other user:', otherUser)
    console.log('User1Id:', selectedConversation.user1Id)
    console.log('User2Id:', selectedConversation.user2Id)
  }

  return (
    <div className="h-[calc(100vh-120px)] flex bg-gray-50">
      {/* Left Panel - Messages List */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Messages</h2>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto border-t border-gray-200">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-gray-500 text-sm">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const other = getOtherUser(conv)
              const isSelected = (conv._id || conv.id) === selectedConversationId
              const unreadCount = conv.unreadCount || 0
              
              const convId = conv._id || conv.id
              const isMenuOpen = openMenuId === convId
              
              return (
                <div
                  key={convId}
                  onClick={() => setSelectedConversationId(convId)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors relative ${
                    isSelected ? 'bg-orange-50 border-l-4 border-l-orange-400' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <UserAvatar 
                        user={other}
                        size="lg" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-900 truncate">{other.name || 'Unknown'}</span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-gray-500">
                            {formatTime(conv.lastMessageAt)}
                          </span>
                          {unreadCount > 0 && (
                            <span className="bg-orange-400 text-white text-xs font-semibold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 truncate mb-1">{getLastMessage(conv)}</p>
                    </div>
                    <div 
                      ref={(el) => {
                        if (el) conversationMenuRefs.current.set(convId, el)
                        else conversationMenuRefs.current.delete(convId)
                      }}
                      className="relative flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMenuId(isMenuOpen ? null : convId)
                        }}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                      {isMenuOpen && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[140px]">
                          <button
                            onClick={(e) => handleDeleteConversation(convId, e)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Delete Chat
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Center Panel - Chat Window */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConversation && otherUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <UserAvatar 
                    user={otherUser}
                    size="md" 
                  />
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-900">{otherUser.name || 'Unknown'}</span>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 relative" ref={menuRef}>
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[160px]">
                    <button
                      onClick={handleClearChat}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Clear Chat
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {(() => {
                const userId = typeof user === 'object' && user?.id ? user.id : ''
                // Find the last message sent by current user
                const userMessages = messages.filter(m => {
                  const mSenderId = typeof m.senderId === 'object' ? m.senderId._id : m.senderId
                  return mSenderId === userId && !m.isSystem
                })
                const lastUserMessage = userMessages[userMessages.length - 1]
                const lastUserMessageId = lastUserMessage ? (lastUserMessage._id || lastUserMessage.id) : null
                
                return messages.map((msg) => {
                  if (msg.isSystem) {
                    return (
                      <div key={msg._id || msg.id} className="flex justify-center">
                        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 max-w-md">
                          <p className="text-xs text-green-800 text-center">{msg.text}</p>
                        </div>
                      </div>
                    )
                  }

                  const senderId = typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId
                  const isYou = senderId === userId
                  const msgId = msg._id || msg.id
                  const isLastUserMessage = msgId === lastUserMessageId

                  return (
                    <div key={msgId} className={`flex ${isYou ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex gap-2 max-w-[70%] ${isYou ? 'flex-row-reverse' : 'flex-row'}`}>
                        {!isYou && (
                          <UserAvatar 
                            user={{
                              name: typeof msg.senderId === 'object' ? msg.senderId.name : undefined,
                              profileImageUrl: typeof msg.senderId === 'object' ? (msg.senderId as any).profileImageUrl : undefined
                            }} 
                            size="sm" 
                            className="flex-shrink-0"
                          />
                        )}
                        <div className={`rounded-lg px-4 py-2 ${isYou ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-900'}`}>
                          <p className="text-sm whitespace-pre-line">{msg.text}</p>
                          <div className={`flex items-center gap-1 mt-1 ${isYou ? 'justify-end' : 'justify-start'}`}>
                            <span className={`text-xs ${isYou ? 'text-orange-100' : 'text-gray-500'}`}>
                              {formatTimestamp(msg.createdAt)}
                            </span>
                            {isYou && isLastUserMessage && msg.isRead && (
                              <span className="text-xs text-orange-100 italic">Seen</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              })()}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <span className="text-xl text-gray-600">+</span>
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={sending}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent disabled:opacity-50"
                />
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ImageIcon className="w-5 h-5 text-gray-600" />
                </button>
                <button 
                  onClick={handleSendMessage}
                  disabled={sending || !message.trim()}
                  className="w-10 h-10 bg-orange-400 text-white rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>

      {/* Right Panel - User Profile */}
      {selectedConversation && otherUser && showProfile && (
        <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <UserAvatar 
                    user={otherUser}
                    size="xl" 
                  />
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-900">{otherUser.name || 'Unknown'}</span>
                  <div className="text-xs text-green-500">Online</div>
                </div>
              </div>
              <button
                onClick={() => setShowProfile(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Basic Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="text-gray-900 font-medium">{otherUser.email || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Safety & Privacy */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Safety & Privacy</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  Report User
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                  <X className="w-4 h-4" />
                  Block User
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                  <Archive className="w-4 h-4" />
                  Archive Conversation
                </button>
              </div>
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-green-900 mb-1">Safe Communication Active</div>
                    <p className="text-xs text-green-700">
                      Your messages are encrypted and monitored for safety. Never share personal financial information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessagesContent
