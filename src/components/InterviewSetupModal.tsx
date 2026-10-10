import React, { useState } from 'react';
import { X, Sparkles, Video, FileText, ChevronRight, Check } from 'lucide-react';
import { ResumeData } from '../types';

interface InterviewSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (config: {
    role: string;
    difficulty: string;
    topic: string;
    useResume: boolean;
    questionCount: number;
    enableCamera: boolean;
  }) => void;
  availableResumes: ResumeData[];
  defaultRole?: string;
}

export const InterviewSetupModal: React.FC<InterviewSetupModalProps> = ({
  isOpen,
  onClose,
  onStart,
  availableResumes,
  defaultRole = 'Senior Frontend Engineer',
}) => {
  const [role, setRole] = useState(defaultRole);
  const [difficulty, setDifficulty] = useState<'Entry-level' | 'Mid-level' | 'Senior' | 'Staff / Lead'>('Mid-level');
  const [topic, setTopic] = useState('Full Stack & System Architecture');
  const [useResume, setUseResume] = useState(availableResumes.length > 0);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [enableCamera, setEnableCamera] = useState(true);

  if (!isOpen) return null;

  const rolesList = [
    'Senior Frontend Engineer',
    'Full Stack Developer',
    'Backend Engineer',
    'System Design & Architecture',
    'Engineering Manager / Lead',
    'Product Manager',
    'Behavioral & Culture Fit',
  ];

  const topicsList = [
    'Full Stack & System Architecture',
    'React, State & Web Performance',
    'Distributed Systems & APIs',
    'Data Structures & Algorithms',
    'Conflict Resolution & Leadership (STAR)',
    'Database Modeling & Concurrency',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({
      role,
      difficulty,
      topic,
      useResume,
      questionCount,
      enableCamera,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10152B]/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#F0EDFF] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#F0EDFF]/70 via-white to-white border-b border-[#F0EDFF] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7657F6] text-white flex items-center justify-center shadow-md shadow-[#7657F6]/25">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#10152B]">Configure AI Mock Interview</h2>
              <p className="text-xs text-gray-500">Customize role, level, and AI interviewer focus</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Target Role */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Target Role / Position
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7657F6]/20 focus:border-[#7657F6] font-medium"
            >
              {rolesList.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Difficulty & Seniority
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Entry-level', 'Mid-level', 'Senior', 'Staff / Lead'] as const).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setDifficulty(lvl)}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                    difficulty === lvl
                      ? 'bg-[#7657F6] text-white border-[#7657F6] shadow-xs'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Focus */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Focus Domain
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7657F6]/20 focus:border-[#7657F6] font-medium"
            >
              {topicsList.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Interview Length
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { count: 3, label: '3 Questions', desc: '~6 mins quick check' },
                { count: 5, label: '5 Questions', desc: '~12 mins standard' },
                { count: 8, label: '8 Questions', desc: '~20 mins comprehensive' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.count}
                  onClick={() => setQuestionCount(opt.count)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    questionCount === opt.count
                      ? 'bg-[#F0EDFF] border-[#7657F6] text-[#7657F6]'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <p className="text-xs font-bold">{opt.label}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Resume Integration Switch */}
          {availableResumes.length > 0 && (
            <div className="p-3.5 rounded-xl bg-purple-50/50 border border-[#7657F6]/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#7657F6]" />
                <div>
                  <p className="text-xs font-bold text-[#10152B]">Tailor with Uploaded Resume</p>
                  <p className="text-[11px] text-gray-500">
                    Using: {availableResumes[0].fileName || 'Latest Profile'}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={useResume}
                onChange={(e) => setUseResume(e.target.checked)}
                className="w-4 h-4 text-[#7657F6] rounded accent-[#7657F6] cursor-pointer"
              />
            </div>
          )}

          {/* Camera Presence */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#20BFA9]" />
              <span>Enable camera for body language practice</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableCamera}
                onChange={(e) => setEnableCamera(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7657F6]"></div>
            </label>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#7657F6] hover:bg-[#6344E8] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#7657F6]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Live AI Interview</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
