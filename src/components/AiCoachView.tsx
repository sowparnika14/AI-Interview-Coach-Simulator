import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { ApiService } from '../services/api';
import { CoachMessage, User as UserType } from '../types';

interface AiCoachViewProps {
  currentUser: UserType | null;
}

export const AiCoachView: React.FC<AiCoachViewProps> = ({ currentUser }) => {
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: '1',
      sender: 'coach',
      text: `Hello ${currentUser?.name || 'Alex'}! I'm Coach Jordan, your AI Executive Interview Strategist. Whether you want to polish your STAR answers, prepare for tricky behavioral curves, or practice a system design opener, ask away!`,
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const samplePrompts = [
    "How should I answer 'What is your greatest technical weakness?'",
    "Teach me how to use the STAR method for a conflict question.",
    "Give me 3 tough questions for a Senior Frontend position.",
    "How do I negotiate compensation after passing the interview loops?"
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: CoachMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const historyForApi = [...messages, userMsg].map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const reply = await ApiService.askCoach(
        text,
        historyForApi,
        currentUser?.targetRole || 'Software Engineer'
      );

      const coachMsg: CoachMessage = {
        id: `coach_${Date.now()}`,
        sender: 'coach',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, coachMsg]);
    } catch {
      // Handled via fallback in ApiService
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 selection:bg-[#7657F6]/20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-[#7657F6] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> 24/7 Coaching Desk
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#10152B] tracking-tight font-heading">
          Ask AI Coach
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Personalized advice, answer rehearsal, and strategic feedback tailored to {currentUser?.targetRole || 'your target role'}.
        </p>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            className="p-3 bg-white rounded-xl border border-[#F0EDFF] hover:border-[#7657F6]/40 text-left text-xs font-medium text-gray-700 hover:text-[#7657F6] transition-all shadow-xs cursor-pointer flex items-start gap-2 group"
          >
            <Lightbulb className="w-3.5 h-3.5 text-[#7657F6] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
            <span className="leading-snug">{p}</span>
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-2xl border border-[#F0EDFF] shadow-xs flex flex-col h-[520px] overflow-hidden">
        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-[#F7F8FC]/30">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {m.sender === 'coach' ? (
                <div className="w-9 h-9 rounded-xl bg-[#7657F6] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-[#10152B] text-white flex items-center justify-center shrink-0 shadow-xs text-xs font-bold">
                  {currentUser?.name?.slice(0, 2).toUpperCase() || 'ME'}
                </div>
              )}

              <div className={`max-w-[80%] rounded-2xl p-4 shadow-xs text-xs sm:text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#7657F6] text-white rounded-tr-none'
                  : 'bg-white border border-[#F0EDFF] text-[#10152B] rounded-tl-none'
              }`}>
                <p className="whitespace-pre-line font-normal">{m.text}</p>
                <span className={`block text-[10px] mt-2 font-medium ${
                  m.sender === 'user' ? 'text-purple-200 text-right' : 'text-gray-400'
                }`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#7657F6] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white border border-[#F0EDFF] rounded-2xl rounded-tl-none p-4 shadow-xs text-xs text-gray-500 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#7657F6] animate-spin" />
                <span>Coach Jordan is typing tailored advice...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-[#F0EDFF]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask for advice, rehearse an answer, or ask for tactical feedback..."
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7657F6]/20 focus:border-[#7657F6] transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-5 py-3 bg-[#7657F6] hover:bg-[#6344E8] disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
