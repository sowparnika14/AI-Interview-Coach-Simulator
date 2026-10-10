export interface User {
  id: string;
  name: string;
  email: string;
  targetRole: string;
  experienceLevel: 'Entry-level' | 'Mid-level' | 'Senior' | 'Lead / Principal';
  streakDays: number;
  lastActiveDate: string;
  avatarSeed?: string;
}

export interface Question {
  id: number;
  question: string;
  category: 'Technical Knowledge' | 'Problem Solving' | 'Communication' | 'System Architecture' | 'Confidence';
  hint?: string;
  idealPoints?: string[];
}

export interface QuestionAnswer {
  id: number;
  question: string;
  category: string;
  answer: string;
  durationSeconds: number;
  score?: number;
  feedback?: string;
  suggestedAnswer?: string;
  keyTakeaway?: string;
}

export interface SkillsAnalysis {
  communication: number; // 0 - 10
  technicalKnowledge: number;
  problemSolving: number;
  confidence: number;
  bodyLanguage: number;
}

export interface InterviewEvaluation {
  overallScore: number; // 0 - 10
  scoreLabel: string;
  skillsAnalysis: SkillsAnalysis;
  strengths: string[];
  areasToImprove: string[];
  improvementTips: string[];
  detailedFeedback: {
    questionId: number;
    question: string;
    answer: string;
    score: number;
    feedback: string;
    suggestedAnswer: string;
    keyTakeaway: string;
  }[];
}

export interface InterviewSession {
  id: string;
  userId: string;
  role: string;
  difficulty: string;
  topic: string;
  date: string;
  timestamp: number;
  durationSeconds: number;
  questions: Question[];
  answers: QuestionAnswer[];
  evaluation: InterviewEvaluation;
}

export interface ResumeData {
  id: string;
  fileName: string;
  uploadDate: string;
  candidateName: string;
  extractedRole: string;
  experienceYears: string;
  skills: string[];
  strengths: string[];
  gapAreas: string[];
  tailoredQuestions: string[];
  summary: string;
  rawText?: string;
}

export interface CoachMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
}

export type AppView = 
  | 'landing' 
  | 'dashboard' 
  | 'interview-live' 
  | 'performance' 
  | 'resume' 
  | 'history' 
  | 'ai-coach' 
  | 'settings';
