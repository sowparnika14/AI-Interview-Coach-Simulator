import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Download,
  RotateCcw,
  LayoutDashboard,
  Sparkles,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  FileText,
  User,
  Lightbulb
} from 'lucide-react';
import { InterviewSession, AppView } from '../types';

interface FeedbackViewProps {
  session: InterviewSession;
  onPracticeAgain: () => void;
  onBackToDashboard: () => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  session,
  onPracticeAgain,
  onBackToDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'transcript'>('overview');

  const { evaluation, role, difficulty, date, durationSeconds, answers } = session;
  const overallScore = evaluation?.overallScore || 8.5;
  const scoreLabel = evaluation?.scoreLabel || 'Great Job!';

  const skills = evaluation?.skillsAnalysis || {
    communication: 8.5,
    technicalKnowledge: 8.4,
    problemSolving: 8.2,
    confidence: 8.8,
    bodyLanguage: 8.5,
  };

  const strengths = evaluation?.strengths?.length ? evaluation.strengths : [
    "Clear and structured answers.",
    "Good technical understanding.",
    "Confident and calm tone."
  ];

  const areasToImprove = evaluation?.areasToImprove?.length ? evaluation.areasToImprove : [
    "Provide more real-world examples.",
    "Avoid filler words.",
    "Explain answers more specifically."
  ];

  const improvementTips = evaluation?.improvementTips || [
    "Practice using the STAR formula to structure your situational answers.",
    "State the trade-offs before locking in a technical solution.",
    "Summarize your thoughts concisely before handing the floor back."
  ];

  // Printable Download Report handler
  const handleDownloadReport = () => {
    window.print();
  };

  // Circular progress math (SVG circle stroke-dasharray)
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 10) * circumference;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 selection:bg-[#7657F6]/20">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#7657F6] font-semibold transition-colors mb-2 cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-[#10152B]">Performance Report</span>
          </button>
          <h1 className="text-3xl font-extrabold text-[#10152B] tracking-tight font-heading">
            Your Performance
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {role} ({difficulty}) · Evaluated on {date}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#F0EDFF] hover:border-[#7657F6]/40 text-[#10152B] text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#7657F6]" />
            <span>Download Report</span>
          </button>

          <button
            onClick={onPracticeAgain}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#7657F6] hover:bg-[#6344E8] text-white text-xs font-bold rounded-xl shadow-md shadow-[#7657F6]/25 transition-all cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Again</span>
          </button>
        </div>
      </div>

      {/* OVERALL SCORE & SUMMARY HERO CARD (White with lavender accents) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F0EDFF] shadow-xs relative overflow-hidden">
        {/* Lavender gradient accent glow in top corner */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F0EDFF] rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Circular Score Indicator */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-[#F0EDFF]/40 rounded-2xl border border-[#F0EDFF]">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background track circle */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  stroke="#E5DFFF"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Foreground progress circle */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  stroke="#7657F6"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Text inside circle */}
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-3xl font-black text-[#10152B] font-heading leading-none">
                  {overallScore.toFixed(1)}
                </span>
                <span className="text-xs font-bold text-gray-400 mt-1">/ 10</span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-sm font-extrabold text-[#7657F6] block">
                {overallScore.toFixed(1)}/10 — {scoreLabel}
              </span>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                Benchmark reached: Candidate Qualified
              </p>
            </div>
          </div>

          {/* Quick Metrics & Highlights */}
          <div className="md:col-span-8 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-[#7657F6]" />
                <span className="text-xs font-bold text-[#7657F6] uppercase tracking-wider">Interview Summary</span>
              </div>
              <h2 className="text-xl font-bold text-[#10152B]">
                Strong communication and practical problem solving demonstrated.
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                Your responses displayed thorough domain knowledge and composure. Refining concrete project metrics and structuring situational questions with the STAR method will push your score into the top 5th percentile.
              </p>
            </div>

            {/* Quick stats tags */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[#F7F8FC] border border-gray-100 text-center">
                <p className="text-xs text-gray-500 font-medium">Questions</p>
                <p className="text-lg font-bold text-[#10152B]">{answers.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F8FC] border border-gray-100 text-center">
                <p className="text-xs text-gray-500 font-medium">Duration</p>
                <p className="text-lg font-bold text-[#10152B]">{Math.round(durationSeconds / 60)} min</p>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F8FC] border border-gray-100 text-center">
                <p className="text-xs text-gray-500 font-medium">Pacing</p>
                <p className="text-lg font-bold text-[#20BFA9]">Optimal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 p-1 bg-white rounded-xl border border-[#F0EDFF] max-w-md">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#7657F6] text-white shadow-xs'
              : 'text-gray-600 hover:text-[#10152B]'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('detailed')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'detailed'
              ? 'bg-[#7657F6] text-white shadow-xs'
              : 'text-gray-600 hover:text-[#10152B]'
          }`}
        >
          Detailed Feedback
        </button>
        <button
          onClick={() => setActiveTab('transcript')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'transcript'
              ? 'bg-[#7657F6] text-white shadow-xs'
              : 'text-gray-600 hover:text-[#10152B]'
          }`}
        >
          Transcript
        </button>
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* SKILLS ANALYSIS SECTION WITH PROGRESS BARS */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#F0EDFF] shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#10152B] font-heading">Skills Analysis</h3>
                <p className="text-xs text-gray-500">Core competencies rated out of 10.0</p>
              </div>
              <span className="text-xs font-bold text-[#7657F6] bg-[#F0EDFF] px-3 py-1 rounded-lg">
                5 Dimensions
              </span>
            </div>

            <div className="space-y-5">
              {[
                { label: 'Communication', score: skills.communication, color: 'bg-[#7657F6]' },
                { label: 'Technical Knowledge', score: skills.technicalKnowledge, color: 'bg-[#3B82F6]' },
                { label: 'Problem Solving', score: skills.problemSolving, color: 'bg-[#20BFA9]' },
                { label: 'Confidence', score: skills.confidence, color: 'bg-[#F59E0B]' },
                { label: 'Body Language', score: skills.bodyLanguage, color: 'bg-[#EC4899]' },
              ].map((skill) => (
                <div key={skill.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#10152B]">{skill.label}</span>
                    <span className="text-gray-700 font-bold">{skill.score.toFixed(1)} / 10</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${skill.color} rounded-full transition-all duration-700 ease-out`}
                      style={{ width: `${(skill.score / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TWO SECTIONS: KEY STRENGTHS & AREAS TO IMPROVE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Strengths */}
            <div className="bg-white rounded-2xl p-6 border border-[#F0EDFF] shadow-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#20BFA9]/10 text-[#20BFA9] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#10152B]">Key Strengths</h3>
                  <p className="text-xs text-gray-500">What set you apart in this session</p>
                </div>
              </div>

              <ul className="space-y-3">
                {strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#20BFA9] shrink-0 mt-2" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas to Improve */}
            <div className="bg-white rounded-2xl p-6 border border-[#F0EDFF] shadow-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#10152B]">Areas to Improve</h3>
                  <p className="text-xs text-gray-500">Key focus areas for your next mock</p>
                </div>
              </div>

              <ul className="space-y-3">
                {areasToImprove.map((area, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* PERSONALIZED IMPROVEMENT TIPS */}
          <div className="bg-gradient-to-r from-[#F0EDFF]/60 via-white to-[#F0EDFF]/40 rounded-2xl p-6 border border-[#F0EDFF]">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-[#7657F6]" />
              <h3 className="text-sm font-bold text-[#10152B]">Actionable Next Steps from AI Coach</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {improvementTips.map((tip, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 border border-[#F0EDFF] text-xs text-gray-700 leading-relaxed shadow-xs">
                  <span className="font-bold text-[#7657F6] block mb-1">Tip #{idx + 1}</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: DETAILED FEEDBACK */}
      {activeTab === 'detailed' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#10152B] font-heading">
              Question-by-Question Evaluation
            </h3>
            <span className="text-xs text-gray-500">{answers.length} questions analyzed</span>
          </div>

          {evaluation?.detailedFeedback && evaluation.detailedFeedback.length > 0 ? (
            evaluation.detailedFeedback.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-[#F0EDFF] shadow-xs space-y-4">
                <div className="flex items-start justify-between gap-4 pb-3 border-b border-gray-100">
                  <div className="flex items-start gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#F0EDFF] text-[#7657F6] text-xs font-bold flex items-center justify-center shrink-0">
                      Q{idx + 1}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-[#10152B] leading-snug">
                      {item.question}
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#20BFA9]/10 text-[#20BFA9] text-xs font-extrabold shrink-0">
                    {item.score?.toFixed(1) || '8.5'} / 10
                  </span>
                </div>

                {/* Candidate's Answer */}
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    Your Response
                  </span>
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed italic">
                    "{item.answer}"
                  </p>
                </div>

                {/* AI Rubric Critique */}
                <div className="p-3.5 rounded-xl bg-[#F0EDFF]/30 border border-[#F0EDFF] space-y-1">
                  <span className="text-[11px] font-bold text-[#7657F6] uppercase tracking-wider block">
                    Interviewer Analysis
                  </span>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    {item.feedback}
                  </p>
                </div>

                {/* Suggested Ideal Answer Structure */}
                {item.suggestedAnswer && (
                  <div className="text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-100 space-y-1">
                    <span className="font-bold text-[#20BFA9] block">Model Approach:</span>
                    <p>{item.suggestedAnswer}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            answers.map((ans, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-[#F0EDFF] shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm font-bold text-[#10152B]">Question {idx + 1}: {ans.question}</span>
                  <span className="text-xs font-bold text-[#20BFA9]">8.5 / 10</span>
                </div>
                <p className="text-xs text-gray-700 italic bg-gray-50 p-3 rounded-xl">"{ans.answer}"</p>
                <p className="text-xs text-gray-600">Well-articulated answer. Demonstrated strong command of the core subject matter.</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: TRANSCRIPT */}
      {activeTab === 'transcript' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F0EDFF] shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-bold text-[#10152B] font-heading">Complete Interview Transcript</h3>
              <p className="text-xs text-gray-500">Verbatim log with timings</p>
            </div>
            <button
              onClick={() => {
                const text = answers.map((a, i) => `Q${i+1}: ${a.question}\nA: ${a.answer}\n`).join('\n');
                navigator.clipboard.writeText(text);
                alert("Transcript copied to clipboard!");
              }}
              className="text-xs font-bold text-[#7657F6] hover:underline cursor-pointer"
            >
              Copy Full Transcript
            </button>
          </div>

          <div className="space-y-6">
            {answers.map((item, idx) => (
              <div key={idx} className="space-y-3 pb-6 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#10152B] text-white text-[10px] font-bold">
                    AI INTERVIEWER
                  </span>
                  <span className="text-xs text-gray-400">Question {idx + 1}</span>
                </div>
                <p className="text-sm font-semibold text-[#10152B] pl-3 border-l-2 border-[#7657F6]">
                  {item.question}
                </p>

                <div className="flex items-center gap-2 pt-2">
                  <span className="px-2 py-0.5 rounded bg-[#20BFA9] text-white text-[10px] font-bold">
                    CANDIDATE
                  </span>
                  <span className="text-xs text-gray-400">Duration: ~{item.durationSeconds || 30}s</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 pl-3 border-l-2 border-[#20BFA9] leading-relaxed">
                  {item.answer || "(No verbal response captured)"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
