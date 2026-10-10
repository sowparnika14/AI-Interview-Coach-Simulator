import React, { useState, useEffect } from 'react';
import { X, Play, Pause, CheckCircle2, Mic, Bot, Sparkles, ArrowRight } from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartReal: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, onStartReal }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const demoSteps = [
    {
      title: "1. AI Asks Real Technical Question",
      speaker: "AI Interviewer (Jordan)",
      text: "Can you explain the difference between synchronous and asynchronous JavaScript, and how the event loop manages asynchronous tasks?",
      hint: "Jordan uses natural speech synthesis and pauses politely for candidate response.",
      activeRole: 'ai'
    },
    {
      title: "2. Candidate Answers via Voice & Video",
      speaker: "Candidate (Alex)",
      text: "JavaScript runs on a single thread with one call stack. Synchronous functions execute immediately line by line. Asynchronous tasks like fetch or setTimeout are sent to browser APIs, and their callbacks wait in the task queue or microtask queue until the call stack clears.",
      hint: "Real-time speech-to-text transcribes answers accurately with low latency.",
      activeRole: 'candidate'
    },
    {
      title: "3. Instant Comprehensive Feedback",
      speaker: "AI Analysis Engine",
      text: "Overall Score: 8.8/10. Key Strength: Clear distinction between call stack and microtask queues. Improvement: Provide a quick code example using Promise.then vs async/await.",
      hint: "Multidimensional radar scores communication, technical depth, and body language.",
      activeRole: 'feedback'
    }
  ];

  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % demoSteps.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  const current = demoSteps[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10152B]/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white border border-[#F0EDFF] rounded-2xl shadow-2xl overflow-hidden text-[#10152B] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-[#F0EDFF] flex items-center justify-between bg-gradient-to-r from-[#F0EDFF]/50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#7657F6] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#10152B]">Interactive Demo Walkthrough</h3>
              <p className="text-xs text-gray-500">See how real-time AI mock interviews work</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicators */}
        <div className="grid grid-cols-3 gap-1 p-2 bg-[#F7F8FC] border-b border-gray-100">
          {demoSteps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setStep(idx)}
              className={`py-2 px-3 text-xs font-semibold rounded-lg text-left transition-all cursor-pointer ${
                step === idx 
                  ? 'bg-white text-[#7657F6] shadow-xs border border-[#F0EDFF]' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/60'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Interactive Simulation Stage in Light Colors */}
        <div className="p-6 flex-1 flex flex-col justify-center space-y-6 bg-white">
          <div className="p-5 rounded-2xl bg-[#F0EDFF]/35 border border-[#7657F6]/20 relative overflow-hidden shadow-xs">
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7657F6]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {current.activeRole === 'ai' ? (
                  <div className="w-7 h-7 rounded-lg bg-[#7657F6] flex items-center justify-center text-white shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                ) : current.activeRole === 'candidate' ? (
                  <div className="w-7 h-7 rounded-lg bg-[#20BFA9] flex items-center justify-center text-white shadow-xs">
                    <Mic className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-[#F0EDFF] text-[#7657F6] flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
                <span className="text-xs font-bold uppercase tracking-wider text-[#7657F6]">
                  {current.speaker}
                </span>
              </div>

              {/* Animated Waveform in purple */}
              <div className="flex items-center gap-1 h-4">
                <span className="w-1 h-3 bg-[#7657F6] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-5 bg-[#7657F6] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-2 bg-[#7657F6] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="w-1 h-4 bg-[#7657F6] rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
              </div>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-[#10152B] font-semibold">
              "{current.text}"
            </p>

            <div className="mt-4 pt-3 border-t border-purple-200/50 flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>{current.hint}</span>
              <span className="text-[#20BFA9] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Live Verified
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#F0EDFF] bg-gray-50/70 flex items-center justify-between">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 text-xs text-gray-600 hover:text-[#10152B] cursor-pointer px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause auto-play' : 'Resume auto-play'}</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-[#10152B] cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onStartReal();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#7657F6] hover:bg-[#6344E8] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all active:scale-95"
            >
              <span>Try Live Interview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
