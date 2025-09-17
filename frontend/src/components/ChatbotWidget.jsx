import React, { useMemo, useState } from "react";

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showTopics, setShowTopics] = useState(true);

  const items = useMemo(
    () => ({
      about: {
        title: "About FlexiHire",
        content:
          "FlexiHire connects university students with clients for freelance projects, internships, and part‑time work. We verify students, track applications, and streamline collaboration.",
      },
      how: {
        title: "How it works",
        content:
          "Clients post needs → students apply → client selects → secure order flow with milestones and messaging. Universities/staff can verify students for added trust.",
      },
      services: {
        title: "Our Services",
        content:
          "• Software development and web apps\n• Design (UI/UX, graphics)\n• Content writing and research\n• Data analysis and dashboards\n• Tutoring and academic assistance",
      },
      students: {
        title: "For Students",
        content:
          "Build your portfolio, get verified, and earn while you learn. Apply to gigs that match your skills and track progress with our application tracker.",
      },
      clients: {
        title: "For Clients",
        content:
          "Access a vetted pool of talented students at flexible rates. Manage orders, milestones, and communication in one place.",
      },
      contact: {
        title: "Contact & Support",
        content:
          "Have questions? Visit the Contact page for email support, or sign in to use in‑app messaging with your freelancer or client.",
      },
    }),
    []
  );

  const quickReplies = useMemo(
    () => [
      { id: "about", label: "About" },
      { id: "how", label: "How it works" },
      { id: "services", label: "Services" },
      { id: "students", label: "For Students" },
      { id: "clients", label: "For Clients" },
      { id: "contact", label: "Contact" },
    ],
    []
  );

  const pushConversation = (topicId) => {
    const topic = items[topicId];
    if (!topic) return;
    setMessages((prev) => [
      ...prev,
      { from: "you", text: topic.title },
    ]);
    setShowTopics(false);
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: topic.content },
      ]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <div className="fixed z-50 right-4 bottom-4">
      {/* Panel */}
      {isOpen && (
        <div className="absolute right-0 bottom-16 w-[340px] sm:w-[360px] max-h-[500px] rounded-2xl shadow-2xl border border-gray-200 bg-white overflow-hidden animate-scale-in flex flex-col">
          <div className="px-4 py-3 bg-black text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-black font-bold">F</div>
              <div>
                <p className="text-sm font-semibold">FlexiHire Assistant</p>
                <p className="text-xs text-gray-300">Ask about the platform</p>
              </div>
            </div>
            <div className="flex items-center h-8">
              <button
                aria-label="Close chatbot"
                className="p-1.5 rounded-lg hover:bg-white/10 transition"
                onClick={() => setIsOpen(false)}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Conversation */}
          <div className="max-h-[360px] overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-sm text-gray-500">
                Select a topic below to start the conversation.
              </div>
            )}
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.from === 'you' ? 'justify-end' : 'justify-start'}`}>
                {m.from === 'bot' && (
                  <div className="mr-2 mt-1 w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-black text-xs font-bold">F</div>
                )}
                <div
                  className={`${
                    m.from === 'you'
                      ? 'bg-[var(--color-primary)] text-black'
                      : 'bg-gray-100 text-gray-800'
                  } px-3 py-2 rounded-2xl max-w-[80%] whitespace-pre-line shadow-sm`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center space-x-2 text-gray-500 text-sm">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              </div>
            )}
          </div>

          {/* Quick replies */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            {showTopics ? (
              <div className="flex flex-col gap-2">
                {quickReplies.map((qr) => (
                  <button
                    key={qr.id}
                    onClick={() => pushConversation(qr.id)}
                    className="w-full text-sm px-4 py-2 rounded-xl border border-gray-200 bg-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition text-left"
                  >
                    {qr.label}
                  </button>
                ))}
                <a href="/contact" className="w-full text-sm px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition text-left">Contact</a>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTopics(true)}
                  className="w-full text-sm px-4 py-2 rounded-xl border border-gray-200 bg-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition text-left"
                >
                  More topics
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        aria-label="Open chatbot"
        className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-black bg-[var(--color-primary)] hover:brightness-95 transition-all focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/40"
        onClick={() => setIsOpen((v) => !v)}
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
          <path d="M18 13a1 1 0 01-1 1H7l-4 4V4a1 1 0 011-1h13a1 1 0 011 1v9z" />
        </svg>
      </button>
    </div>
  );
}


export default ChatbotWidget;
