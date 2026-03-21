import { useEffect, useRef, useState } from 'react'

const quickReplies = ['Add Employee', 'View Dashboard', 'Generate Report', 'Login Help']

const welcomeMessages = [
  {
    id: 'welcome',
    sender: 'bot',
    text: "Hi! I'm your assistant 👋 How can I help you today?",
    suggestions: quickReplies,
  },
]

const rules = [
  {
    keywords: ['add employee', 'create employee'],
    response: "Go to Dashboard -> Click 'Add Employee' -> Fill form -> Submit",
  },
  {
    keywords: ['add', 'employee'],
    response: "Go to Dashboard -> Click 'Add Employee' -> Fill form -> Submit",
    matchAll: true,
  },
  {
    keywords: ['view dashboard', 'dashboard'],
    response: 'Dashboard shows employee stats, performance charts, and reports',
  },
  {
    keywords: ['generate report', 'report', 'reports'],
    response: "Go to Reports section -> Click 'Generate Report'",
  },
  {
    keywords: ['login help', 'login', 'sign in'],
    response: 'Enter your email and password. If not registered, create an account',
  },
  {
    keywords: ['logout', 'sign out'],
    response: 'Click the logout button in the top right corner',
  },
  {
    keywords: ['performance', 'score'],
    response: 'Performance shows employee productivity score (0-100) in dashboard charts',
  },
  {
    keywords: ['status', 'active', 'inactive', 'needs review'],
    response: 'Status indicates employee state: Active, Needs Review, or Inactive',
  },
]

function getBotResponse(message) {
  const normalizedMessage = message.trim().toLowerCase()

  for (const rule of rules) {
    if (rule.matchAll) {
      const matched = rule.keywords.every((keyword) => normalizedMessage.includes(keyword))
      if (matched) {
        return rule.response
      }
      continue
    }

    const matched = rule.keywords.some((keyword) => normalizedMessage.includes(keyword))
    if (matched) {
      return rule.response
    }
  }

  return "Sorry, I didn't understand. Try options like 'Add Employee' or 'Dashboard'"
}

function createMessage(sender, text, suggestions = []) {
  return {
    id: `${sender}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    sender,
    text,
    suggestions,
  }
}

function ChatBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState(welcomeMessages)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen, isTyping])

  const sendMessage = (text) => {
    const trimmedText = text.trim()

    if (!trimmedText || isTyping) {
      return
    }

    setMessages((current) => [...current, createMessage('user', trimmedText)])
    setInputValue('')
    setIsTyping(true)

    window.setTimeout(() => {
      const response = getBotResponse(trimmedText)
      setMessages((current) => [
        ...current,
        createMessage('bot', response, quickReplies),
      ])
      setIsTyping(false)
    }, 700)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    sendMessage(inputValue)
  }

  const handleClearChat = () => {
    setMessages(welcomeMessages)
    setInputValue('')
    setIsTyping(false)
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isOpen ? (
        <section className="pointer-events-auto w-full overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur transition duration-300">
          <div className="bg-[linear-gradient(135deg,#2563eb_0%,#4f46e5_100%)] px-5 py-4 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-100/90">
                  Website Assistant
                </p>
                <h2 className="mt-1 text-lg font-bold">Need quick help?</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearChat}
                  className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/25"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
                  aria-label="Close chat"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M6 6 18 18M18 6 6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="h-80 overflow-y-auto bg-[linear-gradient(180deg,#f8fbff_0%,#eef2ff_100%)] px-4 py-4 sm:h-96">
            <div className="space-y-3">
              {messages.map((message) => {
                const isUserMessage = message.sender === 'user'

                return (
                  <div
                    key={message.id}
                    className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[84%] rounded-[22px] px-4 py-3 text-sm leading-6 shadow-sm ${
                        isUserMessage
                          ? 'rounded-br-md bg-[linear-gradient(135deg,#2563eb_0%,#4f46e5_100%)] text-white'
                          : 'rounded-bl-md border border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-75">
                        {isUserMessage ? 'You' : 'Assistant'}
                      </p>
                      <p className="mt-1">{message.text}</p>

                      {!isUserMessage && message.suggestions?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion) => (
                            <button
                              key={`${message.id}-${suggestion}`}
                              type="button"
                              onClick={() => sendMessage(suggestion)}
                              className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:scale-105 hover:bg-blue-100"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                )
              })}

              {isTyping ? (
                <div className="flex justify-start">
                  <div className="rounded-[22px] rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400" />
                    </div>
                  </div>
                </div>
              ) : null}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-3">
            <div className="flex items-center gap-2 rounded-[22px] border border-slate-200 bg-slate-50 p-2">
              <input
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Ask about dashboard, reports, login..."
                disabled={isTyping}
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
              />

              <button
                type="submit"
                disabled={isTyping || !inputValue.trim()}
                className="inline-flex h-11 shrink-0 items-center justify-center rounded-[18px] bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Send
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="pointer-events-auto inline-flex items-center gap-3 rounded-full bg-[linear-gradient(135deg,#2563eb_0%,#4f46e5_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(37,99,235,0.38)] transition hover:-translate-y-0.5"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/18">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path
              d="M8 10h8M8 14h5m-7 6 2.6-2H19a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h1Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {isOpen ? 'Hide assistant' : 'Ask assistant'}
      </button>
    </div>
  )
}

export default ChatBox
