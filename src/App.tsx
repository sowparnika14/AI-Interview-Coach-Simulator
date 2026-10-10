/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { LiveInterviewView } from './components/LiveInterviewView';
import { FeedbackView } from './components/FeedbackView';
import { ResumeUploadView } from './components/ResumeUploadView';
import { HistoryView } from './components/HistoryView';
import { AiCoachView } from './components/AiCoachView';
import { SettingsView } from './components/SettingsView';
import { AuthModal } from './components/AuthModal';
import { DemoModal } from './components/DemoModal';
import { InterviewSetupModal } from './components/InterviewSetupModal';
import { StorageService } from './services/storage';
import { ApiService } from './services/api';
import {
  AppView,
  User,
  InterviewSession,
  ResumeData,
  Question,
  QuestionAnswer
} from './types';
import { Sparkles, Loader2, Menu } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [selectedSessionForFeedback, setSelectedSessionForFeedback] = useState<InterviewSession | null>(null);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Live session ongoing state
  const [activeInterviewConfig, setActiveInterviewConfig] = useState<{
    role: string;
    difficulty: string;
    topic: string;
    questions: Question[];
    enableCamera: boolean;
  } | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [loadingText, setLoadingText] = useState('Generating tailored interview questions...');

  // Initialize data on mount
  useEffect(() => {
    const user = StorageService.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      const userSessions = StorageService.getUserSessions(user.id);
      setSessions(userSessions);
      const userResumes = StorageService.getUserResumes(user.id);
      setResumes(userResumes);
      if (userSessions.length > 0) {
        setSelectedSessionForFeedback(userSessions[0]);
      }
    }
  }, []);

  // Update sessions when user changes
  const handleUserChange = (user: User) => {
    setCurrentUser(user);
    const userSessions = StorageService.getUserSessions(user.id);
    setSessions(userSessions);
    const userResumes = StorageService.getUserResumes(user.id);
    setResumes(userResumes);
    if (userSessions.length > 0) {
      setSelectedSessionForFeedback(userSessions[0]);
    }
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    StorageService.logout();
    setCurrentUser(null);
    setCurrentView('landing');
  };

  // Launch interview setup
  const handleStartInterviewFromModal = async (config: {
    role: string;
    difficulty: string;
    topic: string;
    useResume: boolean;
    questionCount: number;
    enableCamera: boolean;
  }) => {
    setIsSetupOpen(false);
    setIsLoadingSession(true);
    setLoadingText('Consulting Gemini AI to prepare custom questions...');

    let resumeContext = '';
    if (config.useResume && resumes.length > 0) {
      const targetResume = resumes[0];
      resumeContext = `Skills: ${targetResume.skills.join(', ')}. Strengths: ${targetResume.strengths.join('; ')}`;
    }

    try {
      const questions = await ApiService.generateQuestions({
        role: config.role,
        difficulty: config.difficulty,
        topic: config.topic,
        resumeContext,
        questionCount: config.questionCount,
      });

      setActiveInterviewConfig({
        role: config.role,
        difficulty: config.difficulty,
        topic: config.topic,
        questions,
        enableCamera: config.enableCamera,
      });
      setCurrentView('interview-live');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingSession(false);
    }
  };

  // Complete live interview
  const handleFinishInterview = async (answers: QuestionAnswer[]) => {
    if (!activeInterviewConfig) return;

    setIsLoadingSession(true);
    setLoadingText('Analyzing speech, technical accuracy, and generating feedback...');

    try {
      const evaluation = await ApiService.analyzeInterview({
        role: activeInterviewConfig.role,
        difficulty: activeInterviewConfig.difficulty,
        questionsWithAnswers: answers.map((a) => ({
          id: a.id,
          question: a.question,
          category: a.category,
          answer: a.answer,
          durationSeconds: a.durationSeconds,
        })),
      });

      const totalDuration = answers.reduce((acc, a) => acc + (a.durationSeconds || 30), 0);

      const newSession: InterviewSession = {
        id: `session_${Date.now()}`,
        userId: currentUser?.id || 'guest',
        role: activeInterviewConfig.role,
        difficulty: activeInterviewConfig.difficulty,
        topic: activeInterviewConfig.topic,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: Date.now(),
        durationSeconds: totalDuration,
        questions: activeInterviewConfig.questions,
        answers,
        evaluation,
      };

      StorageService.saveSession(newSession);
      const updatedSessions = [newSession, ...sessions];
      setSessions(updatedSessions);
      setSelectedSessionForFeedback(newSession);
      setCurrentView('performance');
    } catch (err) {
      console.error('Error completing interview:', err);
    } finally {
      setIsLoadingSession(false);
      setActiveInterviewConfig(null);
    }
  };

  // Resume handlers
  const handleSaveResume = (resume: ResumeData) => {
    if (!currentUser) return;
    StorageService.saveResume(currentUser.id, resume);
    setResumes([resume, ...resumes]);
  };

  const handleDeleteResume = (id: string) => {
    if (!currentUser) return;
    StorageService.deleteResume(currentUser.id, id);
    setResumes(resumes.filter(r => r.id !== id));
  };

  const handleStartInterviewWithResume = (resume: ResumeData) => {
    setIsSetupOpen(true);
  };

  // History handlers
  const handleDeleteSession = (sessionId: string) => {
    if (!currentUser) return;
    StorageService.deleteSession(currentUser.id, sessionId);
    setSessions(sessions.filter(s => s.id !== sessionId));
  };

  const handleRetakeInterview = (role: string, difficulty: string) => {
    setIsSetupOpen(true);
  };

  const handleViewSessionFeedback = (session: InterviewSession) => {
    setSelectedSessionForFeedback(session);
    setCurrentView('performance');
  };

  // Profile update
  const handleUpdateUser = (updates: Partial<User>) => {
    const updated = StorageService.updateCurrentUser(updates);
    setCurrentUser(updated);
  };

  const handleResetData = () => {
    localStorage.clear();
    const user = StorageService.getCurrentUser();
    setCurrentUser(user);
    const userSessions = StorageService.getUserSessions(user.id);
    setSessions(userSessions);
    const userResumes = StorageService.getUserResumes(user.id);
    setResumes(userResumes);
    if (userSessions.length > 0) {
      setSelectedSessionForFeedback(userSessions[0]);
    }
  };

  // Live Interview Page takes full screen distraction-free
  if (currentView === 'interview-live' && activeInterviewConfig) {
    return (
      <LiveInterviewView
        role={activeInterviewConfig.role}
        difficulty={activeInterviewConfig.difficulty}
        questions={activeInterviewConfig.questions}
        enableCamera={activeInterviewConfig.enableCamera}
        onFinishInterview={handleFinishInterview}
        onCancel={() => {
          setActiveInterviewConfig(null);
          setCurrentView('dashboard');
        }}
      />
    );
  }

  const isLanding = currentView === 'landing';

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#10152B] flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSetup={() => setIsSetupOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 flex w-full">
        {/* Left Sidebar for non-landing views */}
        {!isLanding && (
          <Sidebar
            currentView={currentView}
            setCurrentView={setCurrentView}
            currentUser={currentUser}
            onOpenSetup={() => setIsSetupOpen(true)}
            onLogout={handleLogout}
            isMobileOpen={isMobileSidebarOpen}
            setIsMobileOpen={setIsMobileSidebarOpen}
          />
        )}

        {/* Content Area */}
        <div className={`flex-1 flex flex-col ${!isLanding ? 'p-4 sm:p-6 lg:p-8 overflow-y-auto' : ''}`}>
          {/* Mobile hamburger button inside dashboard */}
          {!isLanding && (
            <div className="lg:hidden mb-4 flex items-center justify-between">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-[#F0EDFF] text-xs font-bold text-gray-700 shadow-xs cursor-pointer"
              >
                <Menu className="w-4 h-4 text-[#7657F6]" />
                <span>Dashboard Menu</span>
              </button>
            </div>
          )}

          {/* VIEW ROUTING */}
          {currentView === 'landing' && (
            <LandingPage
              onStartInterview={() => setIsSetupOpen(true)}
              onWatchDemo={() => setIsDemoOpen(true)}
              onGoToDashboard={() => setCurrentView('dashboard')}
              setCurrentView={setCurrentView}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardView
              currentUser={currentUser}
              sessions={sessions}
              onStartNewInterview={() => setIsSetupOpen(true)}
              onUploadResume={() => setCurrentView('resume')}
              onPracticeCamera={() => setIsSetupOpen(true)}
              onViewPerformance={() => {
                if (sessions.length > 0) {
                  setSelectedSessionForFeedback(sessions[0]);
                  setCurrentView('performance');
                } else {
                  setIsSetupOpen(true);
                }
              }}
              onViewSessionFeedback={handleViewSessionFeedback}
              setCurrentView={setCurrentView}
            />
          )}

          {currentView === 'performance' && selectedSessionForFeedback && (
            <FeedbackView
              session={selectedSessionForFeedback}
              onPracticeAgain={() => setIsSetupOpen(true)}
              onBackToDashboard={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'performance' && !selectedSessionForFeedback && (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#F0EDFF] max-w-lg mx-auto my-12 space-y-4">
              <h2 className="text-lg font-bold">No Performance Record Yet</h2>
              <p className="text-xs text-gray-500">
                Complete a mock interview to generate your first detailed performance evaluation.
              </p>
              <button
                onClick={() => setIsSetupOpen(true)}
                className="px-6 py-2.5 bg-[#7657F6] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Start Interview Now
              </button>
            </div>
          )}

          {currentView === 'resume' && (
            <ResumeUploadView
              currentUser={currentUser}
              resumes={resumes}
              onSaveResume={handleSaveResume}
              onDeleteResume={handleDeleteResume}
              onStartInterviewWithResume={handleStartInterviewWithResume}
            />
          )}

          {currentView === 'history' && (
            <HistoryView
              sessions={sessions}
              onViewFeedback={handleViewSessionFeedback}
              onRetakeInterview={handleRetakeInterview}
              onDeleteSession={handleDeleteSession}
              onStartNew={() => setIsSetupOpen(true)}
            />
          )}

          {currentView === 'ai-coach' && (
            <AiCoachView currentUser={currentUser} />
          )}

          {currentView === 'settings' && (
            <SettingsView
              currentUser={currentUser}
              onUpdateUser={handleUpdateUser}
              onResetData={handleResetData}
            />
          )}
        </div>
      </div>

      {/* Global Loading Overlay when generating questions or evaluating */}
      {isLoadingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10152B]/40 backdrop-blur-sm text-[#10152B] animate-in fade-in">
          <div className="bg-white border border-[#F0EDFF] rounded-2xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-[#F0EDFF] border border-[#7657F6]/20 flex items-center justify-center mx-auto text-[#7657F6]">
              <Loader2 className="w-7 h-7 animate-spin text-[#7657F6]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#10152B]">AI Engine Processing</h3>
              <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                {loadingText}
              </p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#7657F6] to-[#20BFA9] rounded-full animate-pulse" style={{ width: '85%' }} />
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleUserChange}
      />

      <DemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onStartReal={() => {
          setIsDemoOpen(false);
          setIsSetupOpen(true);
        }}
      />

      <InterviewSetupModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        onStart={handleStartInterviewFromModal}
        availableResumes={resumes}
        defaultRole={currentUser?.targetRole || 'Senior Frontend Engineer'}
      />
    </div>
  );
}
