import React from 'react';
import {
  Play,
  ArrowRight,
  Sparkles,
  Video,
  CheckCircle2,
  TrendingUp,
  Award,
  Zap,
  Mic,
  FileCheck,
  ChevronRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import { AppView } from '../types';

interface LandingPageProps {
  onStartInterview: () => void;
  onWatchDemo: () => void;
  onGoToDashboard: () => void;
  setCurrentView: (view: AppView) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartInterview,
  onWatchDemo,
  onGoToDashboard,
  setCurrentView,
}) => {
  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#10152B] selection:bg-[#7657F6]/20">
      {/* HERO SECTION: Modern, luminous light gradient */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F0EDFF]/70 via-[#F7F8FC] to-[#FFFFFF] text-[#10152B] pt-14 pb-20 md:pt-20 md:pb-28 border-b border-[#F0EDFF]">
        {/* Soft, light ambient accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7657F6]/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#EAF2FF] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-[#20BFA9]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headings & Actions */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Clean Kicker */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#7657F6]/25 text-xs font-semibold text-[#7657F6] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#7657F6]" />
                <span>Next-Generation Career Intelligence</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-[1.15] text-[#10152B]">
                Your Personal{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7657F6] via-[#8B6DF8] to-[#20BFA9]">
                  AI Interview
                </span>{' '}
                Coach
              </h1>

              {/* Subtitle */}
              <p className="text-xl sm:text-2xl font-bold text-[#7657F6] tracking-tight">
                Practice. Improve. Get Hired.
              </p>

              {/* Supporting text */}
              <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Prepare for your dream job with AI-powered mock interviews, personalized feedback, resume analysis, and performance insights.
              </p>

              {/* Two Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={onStartInterview}
                  className="w-full sm:w-auto px-7 py-3.5 bg-[#7657F6] hover:bg-[#6344E8] text-white text-base font-semibold rounded-xl shadow-lg shadow-[#7657F6]/25 hover:shadow-[#7657F6]/35 transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 group"
                >
                  <span>Start Interview</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onWatchDemo}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-gray-50 text-[#10152B] text-base font-semibold rounded-xl border border-gray-200/80 shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
                >
                  <Play className="w-4 h-4 text-[#7657F6] fill-[#7657F6]" />
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Trust proof */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#20BFA9]" />
                  <span>Real voice & video analysis</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#20BFA9]" />
                  <span>Instant rubric feedback</span>
                </div>
              </div>
            </div>

            {/* Right Column: Illustration of Candidate practicing on laptop with Floating Interface Cards */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              {/* Laptop & Candidate Mockup Container */}
              <div className="relative w-full max-w-lg">
                {/* Decorative soft glow backing */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#7657F6]/15 to-[#20BFA9]/15 rounded-3xl blur-2xl transform scale-95" />

                {/* Laptop Body in crisp white/light style */}
                <div className="relative rounded-2xl bg-white p-3.5 border border-[#F0EDFF] shadow-2xl shadow-indigo-950/10">
                  {/* Laptop Screen Bezel */}
                  <div className="rounded-xl bg-[#F7F8FC] p-3 border border-gray-200/70 relative overflow-hidden">
                    {/* Top Screen Camera Dot */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-200/70">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#20BFA9]" />
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#20BFA9] animate-pulse" />
                        <span>Live AI Session</span>
                      </div>
                    </div>

                    {/* Inside Screen: Candidate & Question Split View */}
                    <div className="grid grid-cols-12 gap-2.5">
                      {/* Left: Candidate Cam Simulation */}
                      <div className="col-span-5 rounded-lg bg-white p-2.5 border border-[#F0EDFF] flex flex-col items-center justify-between min-h-[145px] shadow-xs">
                        {/* Avatar / Candidate Graphic */}
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#7657F6] to-[#20BFA9] p-0.5 mt-2">
                          <div className="w-full h-full rounded-full bg-[#F0EDFF] flex items-center justify-center text-white">
                            <span className="text-xl">👩‍💻</span>
                          </div>
                        </div>

                        {/* Speech indicator */}
                        <div className="w-full mt-2 bg-[#F7F8FC] rounded-md px-2 py-1 flex items-center justify-between border border-gray-100">
                          <span className="text-[10px] font-bold text-gray-700">Alex R.</span>
                          <div className="flex items-center gap-0.5">
                            <span className="w-1 h-2 bg-[#20BFA9] rounded-full animate-bounce" />
                            <span className="w-1 h-3 bg-[#20BFA9] rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
                            <span className="w-1 h-1 bg-[#20BFA9] rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                          </div>
                        </div>
                      </div>

                      {/* Right: AI Question on Screen */}
                      <div className="col-span-7 rounded-lg bg-white p-2.5 border border-[#F0EDFF] flex flex-col justify-between shadow-xs">
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-[#7657F6] font-bold mb-1">
                            <span>Question 2 of 5</span>
                            <span className="text-gray-400 font-mono">01:45</span>
                          </div>
                          <p className="text-[11px] font-semibold text-[#10152B] leading-snug">
                            "How do you manage state and optimize re-rendering in a high-traffic React app?"
                          </p>
                        </div>
                        <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#7657F6] animate-ping" />
                          <span className="text-[9px] text-gray-500 font-medium">Listening to candidate speech...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Laptop Base Stand */}
                <div className="h-2.5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-b-xl mx-8 shadow-xs" />

                {/* FLOATING CARD 1: AI Interview */}
                <div className="absolute -top-5 -left-4 sm:-left-8 bg-white rounded-xl p-3 border border-[#F0EDFF] shadow-lg shadow-indigo-900/10 flex items-center gap-3 animate-pulse-subtle">
                  <div className="w-9 h-9 rounded-lg bg-[#7657F6] flex items-center justify-center text-white shrink-0 shadow-xs">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#10152B] leading-tight">AI Interview</p>
                    <p className="text-[10px] text-gray-500 font-medium">Smart adaptive questions</p>
                  </div>
                </div>

                {/* FLOATING CARD 2: Instant Feedback */}
                <div className="absolute top-1/2 -right-4 sm:-right-8 -translate-y-1/2 bg-white rounded-xl p-3 border border-[#F0EDFF] shadow-lg shadow-indigo-900/10 flex items-center gap-3 animate-pulse-subtle" style={{ animationDelay: '1.2s' }}>
                  <div className="w-9 h-9 rounded-lg bg-[#20BFA9] flex items-center justify-center text-white shrink-0 shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-[#10152B] leading-tight">Instant Feedback</p>
                      <span className="text-[10px] font-extrabold text-[#20BFA9]">8.8/10</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium">Strengths & growth tips</p>
                  </div>
                </div>

                {/* FLOATING CARD 3: Track Progress */}
                <div className="absolute -bottom-6 left-6 sm:left-12 bg-white rounded-xl p-3 border border-[#F0EDFF] shadow-lg shadow-indigo-900/10 flex items-center gap-3 animate-pulse-subtle" style={{ animationDelay: '2.4s' }}>
                  <div className="w-9 h-9 rounded-lg bg-[#F0EDFF] text-[#7657F6] flex items-center justify-center shrink-0 shadow-xs">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-bold text-[#10152B] leading-tight">Track Progress</p>
                      <span className="text-[10px] text-[#20BFA9] font-bold">+24% pace</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium">Daily streaks & graphs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="bg-white border-b border-[#F0EDFF] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#7657F6]">12,500+</p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">Interviews Practiced</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#10152B]">94%</p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">Candidate Confidence Boost</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#20BFA9]">8.6 / 10</p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">Average Offer Score</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#7657F6]">3.2x</p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">Faster Job Offers</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: FEATURES */}
      <section id="features" className="py-20 bg-[#F7F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#7657F6] uppercase tracking-wider">Features</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10152B] tracking-tight mt-2 font-heading">
              Everything you need to conquer your technical and behavioral rounds
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-3 font-normal">
              Built with cutting-edge conversational intelligence to mirror real FAANG and top startup hiring panels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-6 border border-[#F0EDFF] shadow-xs hover:shadow-md hover:border-[#7657F6]/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#F0EDFF] text-[#7657F6] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#10152B] mb-2">Real Voice & Spoken Answers</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Practice answering questions out loud with realistic voice output and real-time speech recognition that transcribes your natural cadence.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-6 border border-[#F0EDFF] shadow-xs hover:shadow-md hover:border-[#7657F6]/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#EAF2FF] text-[#3B82F6] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#10152B] mb-2">Resume-Tailored Questions</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Upload your resume to extract skills, identify experience gaps, and generate customized questions based on your actual work history.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-6 border border-[#F0EDFF] shadow-xs hover:shadow-md hover:border-[#7657F6]/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#20BFA9]/10 text-[#20BFA9] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#10152B] mb-2">Rubric-Based Scoring</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Receive quantifiable breakdown across Communication, Technical Knowledge, Problem Solving, Confidence, and Body Language.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-6 border border-[#F0EDFF] shadow-xs hover:shadow-md hover:border-[#7657F6]/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#FFEAF0] text-[#E11D48] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#10152B] mb-2">Camera & Presence Guidance</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Keep your camera on during mock sessions to improve posture, eye contact, and build the physical presence required for remote loops.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-6 border border-[#F0EDFF] shadow-xs hover:shadow-md hover:border-[#7657F6]/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#F0EDFF] text-[#7657F6] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#10152B] mb-2">Personalized Improvement Tips</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Clear lists of Key Strengths and Areas to Improve with concrete example answers and STAR framework templates to study.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-6 border border-[#F0EDFF] shadow-xs hover:shadow-md hover:border-[#7657F6]/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#EAF2FF] text-[#2563EB] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#10152B] mb-2">Daily Streaks & Performance Graphs</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Stay consistent with practice streaks and visual score trends that prove your readiness before the real hiring committee calls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-white border-t border-[#F0EDFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#7657F6] uppercase tracking-wider">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10152B] tracking-tight mt-2 font-heading">
              How AI Interview Works
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-3 font-normal">
              Three streamlined steps from self-doubt to offer negotiation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-[#F7F8FC] rounded-2xl p-7 border border-[#F0EDFF] relative">
              <div className="w-10 h-10 rounded-xl bg-[#7657F6] text-white font-bold text-sm flex items-center justify-center mb-5 shadow-xs">
                01
              </div>
              <h3 className="text-lg font-bold text-[#10152B] mb-2">Select Role & Customize</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Pick your role (Frontend, Full Stack, Backend, PM, etc.) and difficulty. Optionally upload your resume to generate questions focused on your exact experience.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#F7F8FC] rounded-2xl p-7 border border-[#F0EDFF] relative">
              <div className="w-10 h-10 rounded-xl bg-[#20BFA9] text-white font-bold text-sm flex items-center justify-center mb-5 shadow-xs">
                02
              </div>
              <h3 className="text-lg font-bold text-[#10152B] mb-2">Live Interactive Mock Session</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Engage in an immersive interview with an AI interviewer speaking aloud. Respond via camera and microphone, just like an authentic technical video call.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#F7F8FC] rounded-2xl p-7 border border-[#F0EDFF] relative">
              <div className="w-10 h-10 rounded-xl bg-[#F0EDFF] text-[#7657F6] font-bold text-sm flex items-center justify-center mb-5 shadow-xs">
                03
              </div>
              <h3 className="text-lg font-bold text-[#10152B] mb-2">Review In-Depth Analysis</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Get an objective score out of 10, multi-skill radar ratings, line-by-line model answers, and actionable tips to refine before your next session.
              </p>
            </div>
          </div>

          <div className="mt-14 text-center">
            <button
              onClick={onStartInterview}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#7657F6] hover:bg-[#6344E8] text-white font-bold rounded-xl shadow-lg shadow-[#7657F6]/25 cursor-pointer active:scale-95 transition-all"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER: Clean Light Theme */}
      <footer className="bg-white text-[#10152B] py-12 border-t border-[#F0EDFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7657F6] to-[#9B82FC] flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold font-heading text-[#10152B]">AI Interview Coach</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <button onClick={() => setCurrentView('landing')} className="hover:text-[#7657F6] cursor-pointer transition-colors">
                Home
              </button>
              <button onClick={onGoToDashboard} className="hover:text-[#7657F6] cursor-pointer transition-colors">
                Dashboard
              </button>
              <button onClick={() => setCurrentView('resume')} className="hover:text-[#7657F6] cursor-pointer transition-colors">
                Resume Analyzer
              </button>
              <button onClick={() => setCurrentView('history')} className="hover:text-[#7657F6] cursor-pointer transition-colors">
                Interview History
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
            <p>© {new Date().getFullYear()} AI Interview Coach. Built for ambitious candidates.</p>
            <div className="flex items-center gap-4">
              <span>Privacy Focused</span>
              <span>·</span>
              <span>Local Storage Encrypted</span>
              <span>·</span>
              <span>Powered by Gemini</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
