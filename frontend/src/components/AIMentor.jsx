import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { sendMentorChat } from '../services/api';

const SUGGESTED_PROMPTS = [
  'Why is this issue suitable for me?',
  'What should I do first?',
  'What tests should I write?',
  'Explain this issue in simple terms.',
  'What should I learn before starting?',
];

export default function AIMentor({ repository, recommendedIssue, fullRecommendation }) {
  const [messages, setMessages] = useState([
    {
      sender: 'mentor',
      text: `Hello! I'm FirstPR AI, your open-source mentor for ${repository?.full_name || 'this project'}. I've tailored this recommendation for issue #${recommendedIssue?.number}. Ask me anything about how to set up your environment, write tests, inspect the relevant files, or format your pull request!`,
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (questionText) => {
    const q = (questionText || inputQuestion).trim();
    if (!q || isSending) return;

    const userMessage = { sender: 'user', text: q };
    setMessages((prev) => [...prev, userMessage]);
    setInputQuestion('');
    setIsSending(true);

    try {
      const answer = await sendMentorChat({
        question: q,
        repositoryContext: repository || {},
        recommendation: recommendedIssue || {},
      });

      setMessages((prev) => [...prev, { sender: 'mentor', text: answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'mentor',
          text: `Sorry, I encountered an issue while generating an answer: ${err.message}. Please try again.`,
          isError: true,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-2xl">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Ask FirstPR AI</h3>
            <p className="text-xs text-slate-400">Context-grounded mentor for #{recommendedIssue?.number}</p>
          </div>
        </div>

        <span className="text-[11px] px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
          Interactive Mentor
        </span>
      </div>

      {/* Suggested Prompt Pills */}
      <div className="mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Suggested Questions:</p>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_PROMPTS.map((promptText, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(promptText)}
              disabled={isSending}
              className="text-left px-2.5 py-1 rounded-lg text-xs bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 text-slate-300 hover:text-white transition-all disabled:opacity-50"
            >
              {promptText}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 mb-4">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-indigo-400 border border-slate-700'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : msg.isError
                    ? 'bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-tl-none'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-800 text-indigo-400 border border-slate-700 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 rounded-tl-none flex items-center gap-2 text-xs text-slate-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>Analyzing repository context and drafting response...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2 pt-2 border-t border-slate-800/80"
      >
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder="Ask anything about this contribution..."
          disabled={isSending}
          className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm transition-colors"
        />
        <button
          type="submit"
          disabled={!inputQuestion.trim() || isSending}
          className="px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ask</span>
        </button>
      </form>
    </div>
  );
}
