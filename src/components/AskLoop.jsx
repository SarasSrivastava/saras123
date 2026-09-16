// Project LOOP - Ask LOOP Grounded RAG Copilot (React JavaScript)
import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Quote, 
  ExternalLink,
  ChevronRight,
  Database,
  Search
} from 'lucide-react';
import { searchCorpus, synthesizeAskLoopAnswer } from '../utils/aiEngine';

export default function AskLoop({ feedbackList = [], onSelectFeedback }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome_1',
      sender: 'assistant',
      text: `👋 Hello! I am **Ask LOOP**, your evidence-grounded feedback copilot.\n\nAsk me plain-English questions across your **${feedbackList.length} customer feedback records**. Every conclusion is strictly retrieved using **64-dimensional cosine vector similarity** and cites exact verbatim feedback IDs.`,
      citations: []
    }
  ]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'What are the biggest complaints during onboarding?',
    'Why is billing sentiment dropping this month?',
    'What features are mobile users requesting?',
    'Which enterprise deals were blocked by SSO?'
  ];

  const handleAsk = (customQuery) => {
    const q = (customQuery || query).trim();
    if (!q || loading) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: q,
      citations: []
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    setTimeout(() => {
      const retrieved = searchCorpus(q, feedbackList, 5);
      const { answer, citations } = synthesizeAskLoopAnswer(q, retrieved);

      const botMsg = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        text: answer,
        citations
      };

      setMessages((prev) => [...prev, botMsg]);
      setLoading(false);
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Retrieval-Augmented Generation (RAG)</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white">
          Ask LOOP Intelligence Copilot
        </h1>
        <p className="text-xs text-gray-400 max-w-lg mx-auto">
          Query your multi-tenant feedback corpus in natural language. Powered by semantic vector search and zero-hallucination citations.
        </p>
      </div>

      {/* Suggested Quick Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleAsk(p)}
            className="bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-gray-300 hover:text-white text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <Search className="w-3 h-3 text-indigo-400" />
            <span>"{p}"</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 min-h-[420px] max-h-[540px] overflow-y-auto space-y-6 custom-scrollbar shadow-xl">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`space-y-3 max-w-2xl ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`rounded-2xl p-4 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-none shadow-md font-medium'
                    : 'bg-slate-800/80 text-gray-200 border border-slate-700/80 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
              </div>

              {/* Citations Panel */}
              {m.citations && m.citations.length > 0 && (
                <div className="space-y-2 bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-3 h-3 text-indigo-400" />
                    <span>Grounded Feedback Citations ({m.citations.length})</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {m.citations.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => onSelectFeedback(c)}
                        className="p-2.5 bg-slate-900/90 hover:bg-slate-850 rounded-lg border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all"
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-mono font-bold text-indigo-400">{c.id}</span>
                          <span className="text-[10px] text-gray-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            {c.channel}
                          </span>
                        </div>
                        <p className="text-gray-300 text-[11px] line-clamp-2 font-medium">"{c.content}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-gray-300 flex-shrink-0 shadow-md">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center text-xs text-indigo-400 animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center">
              <Bot className="w-4 h-4 text-indigo-400" />
            </div>
            <span>Embedding query & calculating cosine vector similarity across corpus...</span>
          </div>
        )}
      </div>

      {/* Input Query Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
        className="flex gap-3"
      >
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Ask anything regarding customer feedback..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-900/90 text-white rounded-2xl px-5 py-3.5 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs shadow-lg"
          />
        </div>
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-3.5 rounded-2xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
        >
          <Send className="w-4 h-4" />
          <span>Ask AI</span>
        </button>
      </form>
    </div>
  );
}
