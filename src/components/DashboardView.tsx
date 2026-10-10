import React from 'react';
import {
  Video,
  UploadCloud,
  Camera,
  TrendingUp,
  Award,
  FileCheck2,
  Target,
  Sparkles,
  ArrowRight,
  Flame,
  ChevronRight,
  Calendar,
  Clock
} from 'lucide-react';
import { User, InterviewSession, AppView } from '../types';

interface DashboardViewProps {
  currentUser: User | null;
  sessions: InterviewSession[];
  onStartNewInterview: () => void;
  onUploadResume: () => void;
  onPracticeCamera: () => void;
  onViewPerformance: () => void;
  onViewSessionFeedback: (session: InterviewSession) => void;
  setCurrentView: (view: AppView) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  sessions,
  onStartNewInterview,
  onUploadResume,
  onPracticeCamera,
  onViewPerformance,
  onViewSessionFeedback,
  setCurrentView,
}) => {
  const userName = currentUser?.name || 'Alex';

  // Compute metrics
  const totalInterviews = sessions.length;
  const avgScore = totalInterviews > 0
    ? (sessions.reduce((acc, s) => acc + (s.evaluation?.overallScore || 0), 0) / totalInterviews).toFixed(1)
    : '8.5';
  const feedbackReportsCount = sessions.filter(s => !!s.evaluation).length;
  const nextGoal = currentUser?.targetRole ? `Ace ${currentUser.targetRole} Loop` : 'Senior Tech Round';
  const streakDays = currentUser?.streakDays || 4;

  // Chart data: last 7 days or sessions
  const chartPoints = [
    { label: 'Mon', score: 7.6 },
    { label: 'Tue', score: 8.0 },
    { label: 'Wed', score: 8.2 },
    { label: 'Thu', score: 8.4 },
    { label: 'Fri', score: 8.5 },
    { label: 'Sat', score: 8.8 },
    { label: 'Sun', score: 9.0 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-white via-[#F0EDFF]/30 to-white p-6 sm:p-8 rounded-2xl border border-[#F0EDFF] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#7657F6] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Career Readiness
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10152B] tracking-tight font-heading">
            Good Morning, {userName}!
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Ready to ace your next interview?
          </p>
        </div>

        {/* Streak & Primary Quick CTA */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-amber-50 border border-amber-200/60 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Flame className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-950">{streakDays}-Day Streak</p>
              <p className="text-[11px] text-amber-700 font-medium">Keep momentum!</p>
            </div>
          </div>

          <button
            onClick={onStartNewInterview}
            className="flex items-center gap-2 px-5 py-3 bg-[#7657F6] hover:bg-[#6344E8] text-white text-sm font-bold rounded-xl shadow-md shadow-[#7657F6]/25 hover:shadow-lg transition-all cursor-pointer active:scale-95"
          >
            <Video className="w-4 h-4" />
            <span>Start Interview</span>
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Interviews */}
        <div className="bg-white rounded-2xl p-5 border border-[#F0EDFF] shadow-xs hover:border-[#7657F6]/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Interviews</span>
            <div className="w-9 h-9 rounded-xl bg-[#F0EDFF] text-[#7657F6] flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#10152B] font-heading">{totalInterviews}</span>
            <span className="text-xs text-[#20BFA9] font-bold">+2 this week</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">Completed mock sessions</p>
        </div>

        {/* Card 2: Average Score */}
        <div className="bg-white rounded-2xl p-5 border border-[#F0EDFF] shadow-xs hover:border-[#7657F6]/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Average Score</span>
            <div className="w-9 h-9 rounded-xl bg-[#20BFA9]/10 text-[#20BFA9] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#10152B] font-heading">{avgScore}</span>
            <span className="text-xs text-gray-400 font-semibold">/ 10.0</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">Target benchmark: 8.0+</p>
        </div>

        {/* Card 3: Feedback Reports */}
        <div className="bg-white rounded-2xl p-5 border border-[#F0EDFF] shadow-xs hover:border-[#7657F6]/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Feedback Reports</span>
            <div className="w-9 h-9 rounded-xl bg-[#EAF2FF] text-[#2563EB] flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#10152B] font-heading">{feedbackReportsCount}</span>
            <span className="text-xs text-[#20BFA9] font-bold">100% analyzed</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">Actionable rubric breakdowns</p>
        </div>

        {/* Card 4: Next Goal */}
        <div className="bg-white rounded-2xl p-5 border border-[#F0EDFF] shadow-xs hover:border-[#7657F6]/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Next Goal</span>
            <div className="w-9 h-9 rounded-xl bg-[#FFEAF0] text-[#E11D48] flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-[#10152B] font-heading truncate">{nextGoal}</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">Target interview in 7 days</p>
        </div>
      </div>

      {/* QUICK ACTIONS SECTION (4 cards requested) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#10152B] font-heading">Quick Actions</h2>
          <span className="text-xs text-gray-500">Pick an activity to sharpen your skills</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Action 1: Start New Interview */}
          <div
            onClick={onStartNewInterview}
            className="group bg-white rounded-2xl p-6 border border-[#F0EDFF] shadow-xs hover:shadow-md hover:border-[#7657F6] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#F0EDFF] text-[#7657F6] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#10152B] mb-1.5 group-hover:text-[#7657F6] transition-colors">
                1. Start New Interview
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Choose different roles and difficulty levels. Full live session with spoken audio.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#7657F6]">
              <span>Launch session</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 2: Upload Resume */}
          <div
            onClick={onUploadResume}
            className="group bg-white rounded-2xl p-6 border border-[#F0EDFF] shadow-xs hover:shadow-md hover:border-[#7657F6] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EAF2FF] text-[#2563EB] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#10152B] mb-1.5 group-hover:text-[#2563EB] transition-colors">
                2. Upload Resume
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Get personalized questions and resume insights tailored to your real background.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#2563EB]">
              <span>Analyze resume</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 3: Practice with Camera */}
          <div
            onClick={onPracticeCamera}
            className="group bg-white rounded-2xl p-6 border border-[#F0EDFF] shadow-xs hover:shadow-md hover:border-[#7657F6] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FFEAF0] text-[#E11D48] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#10152B] mb-1.5 group-hover:text-[#E11D48] transition-colors">
                3. Practice with Camera
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Improve confidence and body language with live framing and posture awareness.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#E11D48]">
              <span>Test camera</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action 4: View Performance */}
          <div
            onClick={onViewPerformance}
            className="group bg-white rounded-2xl p-6 border border-[#F0EDFF] shadow-xs hover:shadow-md hover:border-[#7657F6] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#20BFA9]/10 text-[#20BFA9] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#10152B] mb-1.5 group-hover:text-[#20BFA9] transition-colors">
                4. View Performance
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Track progress, review strength radar, and identify specific areas to improve.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#20BFA9]">
              <span>View analytics</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* PERFORMANCE GRAPH & RECENT SESSIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Activity & Score Trend Graph */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#F0EDFF] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-[#10152B] font-heading">Performance Progression</h3>
              <p className="text-xs text-gray-500">Weekly average mock interview scores</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#20BFA9] bg-[#20BFA9]/10 px-2.5 py-1 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18% Improvement</span>
            </div>
          </div>

          {/* Clean SVG Graph */}
          <div className="h-44 w-full relative pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
              {/* Background horizontal grid lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="#F0EDFF" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="#F0EDFF" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#F0EDFF" strokeWidth="1" strokeDasharray="4 4" />

              {/* Area gradient */}
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7657F6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#7657F6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Score path */}
              <path
                d="M 10 90 Q 90 75, 170 65 T 330 45 T 490 20"
                fill="none"
                stroke="#7657F6"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Closed area under curve */}
              <path
                d="M 10 90 Q 90 75, 170 65 T 330 45 T 490 20 L 490 120 L 10 120 Z"
                fill="url(#scoreGrad)"
              />

              {/* Points on curve */}
              {[
                { cx: 10, cy: 90, val: '7.6' },
                { cx: 90, cy: 78, val: '8.0' },
                { cx: 170, cy: 65, val: '8.2' },
                { cx: 250, cy: 55, val: '8.4' },
                { cx: 330, cy: 45, val: '8.5' },
                { cx: 410, cy: 32, val: '8.8' },
                { cx: 490, cy: 20, val: '9.0' },
              ].map((pt, i) => (
                <g key={i}>
                  <circle cx={pt.cx} cy={pt.cy} r="4.5" fill="#FFFFFF" stroke="#7657F6" strokeWidth="2.5" />
                </g>
              ))}
            </svg>

            {/* Labels below */}
            <div className="flex justify-between text-[11px] text-gray-500 font-medium pt-3">
              {chartPoints.map((pt, i) => (
                <span key={i}>{pt.label}</span>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Score calculated from 5 core competency areas</span>
            <button
              onClick={onViewPerformance}
              className="text-[#7657F6] font-semibold hover:underline cursor-pointer"
            >
              Detailed breakdown →
            </button>
          </div>
        </div>

        {/* Recent Interviews Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#F0EDFF] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#10152B] font-heading">Recent Interviews</h3>
              <button
                onClick={() => setCurrentView('history')}
                className="text-xs text-[#7657F6] font-semibold hover:underline cursor-pointer"
              >
                View all ({sessions.length})
              </button>
            </div>

            {sessions.length === 0 ? (
              <div className="py-8 text-center text-gray-500 text-xs">
                <Video className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p>No completed interviews yet.</p>
                <button
                  onClick={onStartNewInterview}
                  className="mt-3 text-[#7657F6] font-bold hover:underline"
                >
                  Start your first mock interview
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.slice(0, 3).map((s) => (
                  <div
                    key={s.id}
                    onClick={() => onViewSessionFeedback(s)}
                    className="p-3.5 rounded-xl border border-gray-100 hover:border-[#7657F6]/30 hover:bg-[#F0EDFF]/20 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#10152B] group-hover:text-[#7657F6] transition-colors truncate">
                        {s.role}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {s.date}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {Math.round(s.durationSeconds / 60)} min
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-3">
                      <div className="px-2.5 py-1 rounded-lg bg-[#20BFA9]/10 text-[#20BFA9] text-xs font-extrabold">
                        {s.evaluation?.overallScore?.toFixed(1) || '8.5'}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#7657F6] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <button
              onClick={onStartNewInterview}
              className="text-xs font-bold text-[#7657F6] hover:text-[#6344E8] cursor-pointer inline-flex items-center gap-1"
            >
              <span>Practice another question set</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
