import { User, InterviewSession, ResumeData } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'ai_interview_current_user',
  USERS_DB: 'ai_interview_users_db',
  SESSIONS: 'ai_interview_sessions_',
  RESUMES: 'ai_interview_resumes_',
  GUEST_ID: 'guest-user-default',
};

// Default initial guest/sample user
const DEFAULT_USER: User = {
  id: 'user_alex_101',
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  targetRole: 'Senior Frontend Engineer',
  experienceLevel: 'Mid-level',
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

// Initial mock past sessions so user immediately sees a rich history & performance data upon first load
const SAMPLE_SESSIONS: InterviewSession[] = [
  {
    id: 'session-demo-01',
    userId: 'user_alex_101',
    role: 'Senior Frontend Engineer',
    difficulty: 'Mid-level',
    topic: 'React, Performance & State Management',
    date: new Date(Date.now() - 86400000 * 2).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    timestamp: Date.now() - 86400000 * 2,
    durationSeconds: 780,
    questions: [
      {
        id: 1,
        question: "Can you explain the difference between synchronous and asynchronous JavaScript?",
        category: "Technical Knowledge",
        hint: "Mention the event loop and single-threaded call stack.",
        idealPoints: ["Event loop", "Call stack & Web APIs", "Microtasks & Macrotasks", "Async/Await vs Promises"]
      },
      {
        id: 2,
        question: "How do you systematically debug and optimize slow re-renders in a large React application?",
        category: "Problem Solving",
        hint: "Discuss React DevTools Profiler, useMemo, and context splitting.",
        idealPoints: ["Profiler flamegraphs", "Memoization tradeoffs", "State lifting/colocation", "Selective re-renders"]
      },
      {
        id: 3,
        question: "Describe a time you resolved a technical disagreement regarding architectural trade-offs.",
        category: "Communication",
        hint: "Focus on data, prototypes, and team consensus.",
        idealPoints: ["Active listening", "Benchmarking solutions", "Team alignment"]
      }
    ],
    answers: [
      {
        id: 1,
        question: "Can you explain the difference between synchronous and asynchronous JavaScript?",
        category: "Technical Knowledge",
        answer: "JavaScript is single-threaded. Synchronous code blocks execution line by line on the call stack. Asynchronous operations like fetch or timers get delegated to browser APIs and resolved via the event loop callback queue without blocking the UI thread.",
        durationSeconds: 140,
        score: 8.8,
        feedback: "Exceptional explanation of call stack mechanics and asynchronous execution loop.",
        suggestedAnswer: "Mentioning microtask queue priority for Promises vs task queue for setTimeout elevates the response further.",
        keyTakeaway: "Clear grasp of concurrency mechanics."
      },
      {
        id: 2,
        question: "How do you systematically debug and optimize slow re-renders in a large React application?",
        category: "Problem Solving",
        answer: "I start by profiling using React DevTools to find committed render times. Then I check whether states can be pushed down closer to leaf components or if Context needs splitting into separate state and dispatch providers.",
        durationSeconds: 180,
        score: 8.5,
        feedback: "Great emphasis on measuring first with DevTools before blindly optimizing with useMemo.",
        suggestedAnswer: "Include a real-world example with numbers like reducing render cycles by 40%.",
        keyTakeaway: "Strong pragmatic troubleshooting flow."
      },
      {
        id: 3,
        question: "Describe a time you resolved a technical disagreement regarding architectural trade-offs.",
        category: "Communication",
        answer: "When choosing between Redux and TanStack Query for server state, our team was divided. I built a quick prototype comparing boilerplate, caching efficiency, and maintenance. The tangible benchmark helped everyone align comfortably.",
        durationSeconds: 160,
        score: 8.2,
        feedback: "Excellent leadership through prototyping and evidence-based decision making.",
        suggestedAnswer: "Structure using the STAR framework to highlight the positive business outcome.",
        keyTakeaway: "Data-driven alignment strategy."
      }
    ],
    evaluation: {
      overallScore: 8.5,
      scoreLabel: "Great Job!",
      skillsAnalysis: {
        communication: 8.4,
        technicalKnowledge: 8.8,
        problemSolving: 8.5,
        confidence: 8.6,
        bodyLanguage: 8.2
      },
      strengths: [
        "Clear and structured answers.",
        "Good technical understanding.",
        "Confident and calm tone."
      ],
      areasToImprove: [
        "Provide more real-world examples.",
        "Avoid filler words.",
        "Explain answers more specifically."
      ],
      improvementTips: [
        "Adopt the STAR method explicitly for behavioral questions.",
        "Quote specific performance metrics (e.g. bundle size or load time reductions).",
        "Add brief conclusions to summarize each answer before yielding."
      ],
      detailedFeedback: [
        {
          questionId: 1,
          question: "Can you explain the difference between synchronous and asynchronous JavaScript?",
          answer: "JavaScript is single-threaded. Synchronous code blocks execution line by line on the call stack...",
          score: 8.8,
          feedback: "Great explanation of call stack mechanics and non-blocking event loop.",
          suggestedAnswer: "Distinguish between microtask and macrotask queues to demonstrate deep mastery.",
          keyTakeaway: "Crystal clear core concept delivery."
        },
        {
          questionId: 2,
          question: "How do you systematically debug and optimize slow re-renders in a large React application?",
          answer: "I start by profiling using React DevTools to find committed render times...",
          score: 8.5,
          feedback: "Pragmatic approach focusing on profiling before refactoring.",
          suggestedAnswer: "Discuss memoization overhead and virtualization for very long lists.",
          keyTakeaway: "Measurement-driven optimization."
        },
        {
          questionId: 3,
          question: "Describe a time you resolved a technical disagreement regarding architectural trade-offs.",
          answer: "When choosing between Redux and TanStack Query, I built a quick prototype...",
          score: 8.2,
          feedback: "Constructive collaboration demonstrated via hands-on prototyping.",
          suggestedAnswer: "State the post-launch impact on developer velocity.",
          keyTakeaway: "Evidence beats opinions."
        }
      ]
    }
  }
];

export const StorageService = {
  // Current user
  getCurrentUser(): User {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (stored) return JSON.parse(stored);
      // Initialize default
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USER));
      return DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  },

  setCurrentUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  updateCurrentUser(updates: Partial<User>): User {
    const current = this.getCurrentUser();
    const updated = { ...current, ...updates };
    this.setCurrentUser(updated);
    return updated;
  },

  // Auth & credentials
  login(email: string, password: string): { success: boolean; user?: User; error?: string } {
    const usersMap = this.getUsersDatabase();
    const userEntry = usersMap[email.toLowerCase().trim()];
    if (!userEntry) {
      return { success: false, error: 'User not found. Please sign up first.' };
    }
    if (userEntry.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    // Update streak if needed
    const today = new Date().toISOString().split('T')[0];
    const user = { ...userEntry.user };
    if (user.lastActiveDate !== today) {
      user.streakDays = (user.streakDays || 0) + 1;
      user.lastActiveDate = today;
    }

    this.setCurrentUser(user);
    this.saveUserToDatabase(email, password, user);
    return { success: true, user };
  },

  register(name: string, email: string, password: string, targetRole: string = 'Software Engineer'): { success: boolean; user?: User; error?: string } {
    if (!email || !password || !name) {
      return { success: false, error: 'Please provide all required fields.' };
    }
    const cleanEmail = email.toLowerCase().trim();
    const usersMap = this.getUsersDatabase();
    if (usersMap[cleanEmail]) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email: cleanEmail,
      targetRole: targetRole || 'Frontend Engineer',
      experienceLevel: 'Mid-level',
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };

    this.saveUserToDatabase(cleanEmail, password, newUser);
    this.setCurrentUser(newUser);
    return { success: true, user: newUser };
  },

  logout(): void {
    // Revert to demo user or blank
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getUsersDatabase(): Record<string, { password: string; user: User }> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS_DB);
      if (data) return JSON.parse(data);
    } catch {}
    // Seed default alex account
    const initialDb: Record<string, { password: string; user: User }> = {
      'alex.rivera@example.com': {
        password: 'password123',
        user: DEFAULT_USER
      }
    };
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(initialDb));
    return initialDb;
  },

  saveUserToDatabase(email: string, password: string, user: User) {
    const db = this.getUsersDatabase();
    db[email.toLowerCase().trim()] = { password, user };
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(db));
  },

  // Sessions
  getUserSessions(userId: string): InterviewSession[] {
    try {
      const key = `${STORAGE_KEYS.SESSIONS}${userId}`;
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);

      if (userId === DEFAULT_USER.id) {
        localStorage.setItem(key, JSON.stringify(SAMPLE_SESSIONS));
        return SAMPLE_SESSIONS;
      }
      return [];
    } catch {
      return [];
    }
  },

  saveSession(session: InterviewSession): void {
    const sessions = this.getUserSessions(session.userId);
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.unshift(session);
    }
    localStorage.setItem(`${STORAGE_KEYS.SESSIONS}${session.userId}`, JSON.stringify(sessions));

    // Also update streak
    const user = this.getCurrentUser();
    if (user.id === session.userId) {
      const today = new Date().toISOString().split('T')[0];
      if (user.lastActiveDate !== today) {
        user.streakDays = (user.streakDays || 1) + 1;
        user.lastActiveDate = today;
        this.setCurrentUser(user);
      }
    }
  },

  deleteSession(userId: string, sessionId: string): void {
    const sessions = this.getUserSessions(userId).filter(s => s.id !== sessionId);
    localStorage.setItem(`${STORAGE_KEYS.SESSIONS}${userId}`, JSON.stringify(sessions));
  },

  getSessionById(userId: string, sessionId: string): InterviewSession | undefined {
    const sessions = this.getUserSessions(userId);
    return sessions.find(s => s.id === sessionId);
  },

  // Resumes
  getUserResumes(userId: string): ResumeData[] {
    try {
      const key = `${STORAGE_KEYS.RESUMES}${userId}`;
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
      return [];
    } catch {
      return [];
    }
  },

  saveResume(userId: string, resume: ResumeData): void {
    const resumes = this.getUserResumes(userId);
    resumes.unshift(resume);
    localStorage.setItem(`${STORAGE_KEYS.RESUMES}${userId}`, JSON.stringify(resumes));
  },

  deleteResume(userId: string, resumeId: string): void {
    const resumes = this.getUserResumes(userId).filter(r => r.id !== resumeId);
    localStorage.setItem(`${STORAGE_KEYS.RESUMES}${userId}`, JSON.stringify(resumes));
  }
};
