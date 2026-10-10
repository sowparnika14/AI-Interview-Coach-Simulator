import React, { useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  ChevronRight,
  Trash2,
  RotateCcw,
  Video,
  Award,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { InterviewSession } from '../types';

interface HistoryViewProps {
  sessions: InterviewSession[];
  onViewFeedback: (session: InterviewSession) => void;
  onRetakeInterview: (role: string, difficulty: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onStartNew: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  sessions,
  onViewFeedback,
  onRetakeInterview,
  onDeleteSession,
  onStartNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Filter & Search
  const filteredSessions = sessions
    .filter((s) => {
      const matchesSearch =
        s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.topic.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDiff =
        selectedDifficulty === 'all' || s.difficulty === selectedDifficulty;
      return matchesSearch && matchesDiff;
    })
    .sort((a, b) => {
      if (sortOrder === 'desc') {
        return b.timestamp - a.timestamp;
      }
      return a.timestamp - b.timestamp;
    });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 selection:bg-[#7657F6]/20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#10152B] tracking-tight font-heading">
            Interview History
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Review detailed rubrics, scores, and growth trends from past mock interviews.
          </p>
        </div>

        <button
          onClick={onStartNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#7657F6] hover:bg-[#6344E8] text-white text-xs font-bold rounded-xl shadow-md shadow-[#7657F6]/25 transition-all cursor-pointer self-start sm:self-auto active:scale-95"
        >
          <Video className="w-4 h-4" />
          <span>Start New Interview</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#F0EDFF] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search role or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7657F6]/20 focus:border-[#7657F6]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="py-1.5 px-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none font-medium text-gray-700"
            >
              <option value="all">All Difficulties</option>
              <option value="Entry-level">Entry-level</option>
              <option value="Mid-level">Mid-level</option>
              <option value="Senior">Senior</option>
              <option value="Staff / Lead">Staff / Lead</option>
            </select>
          </div>

          {/* Sort order toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>
      </div>

      {/* TABLE OF SESSIONS */}
      <div className="bg-white rounded-2xl border border-[#F0EDFF] shadow-xs overflow-hidden">
        {filteredSessions.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F0EDFF] text-[#7657F6] flex items-center justify-center mx-auto">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#10152B]">No interviews found</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              {searchTerm ? "No past sessions match your search criteria." : "Start your first mock interview to populate your history and track scores."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Role / Position</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Score</th>
                  <th className="py-3.5 px-6">Feedback Summary</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredSessions.map((s) => {
                  const score = s.evaluation?.overallScore || 8.5;
                  const label = s.evaluation?.scoreLabel || 'Great Job!';
                  const summaryHighlight = s.evaluation?.strengths?.[0] || 'Clear answers and solid confidence.';

                  return (
                    <tr
                      key={s.id}
                      className="hover:bg-[#F0EDFF]/20 transition-colors group"
                    >
                      {/* Column 1: Role / Position */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#F0EDFF] text-[#7657F6] flex items-center justify-center shrink-0">
                            <Video className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-[#10152B] block text-sm">
                              {s.role}
                            </span>
                            <span className="text-[11px] text-gray-500 font-medium">
                              {s.difficulty} · {s.topic}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Date & Duration */}
                      <td className="py-4 px-6 whitespace-nowrap text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{s.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{Math.round(s.durationSeconds / 60)} mins</span>
                        </div>
                      </td>

                      {/* Column 3: Score */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#20BFA9]/10 text-[#20BFA9] font-black text-xs">
                          <Award className="w-3.5 h-3.5" />
                          <span>{score.toFixed(1)} / 10</span>
                        </div>
                        <span className="block text-[10px] text-gray-500 font-medium mt-0.5">
                          {label}
                        </span>
                      </td>

                      {/* Column 4: Feedback */}
                      <td className="py-4 px-6 max-w-xs text-gray-700">
                        <p className="truncate text-xs font-normal">
                          {summaryHighlight}
                        </p>
                      </td>

                      {/* Column 5: Action */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onViewFeedback(s)}
                            className="px-3 py-1.5 bg-[#7657F6] hover:bg-[#6344E8] text-white font-bold rounded-lg shadow-xs transition-all cursor-pointer text-xs"
                          >
                            View Feedback
                          </button>

                          <button
                            onClick={() => onRetakeInterview(s.role, s.difficulty)}
                            title="Retake this interview type"
                            className="p-1.5 text-gray-400 hover:text-[#7657F6] hover:bg-[#F0EDFF] rounded-lg transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onDeleteSession(s.id)}
                            title="Delete session"
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
