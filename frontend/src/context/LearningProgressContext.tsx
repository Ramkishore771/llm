import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Achievement, QuizResult } from '../types';
import { useAuth } from './AuthContext';
import { db, isFirebaseConfigured, doc, setDoc, getDoc } from '../services/firebase';

interface LearningProgressContextType {
  completedTopics: string[];
  quizScores: Record<string, QuizResult>;
  completedProjects: string[];
  experimentCount: number;
  streakDays: number;
  achievements: Achievement[];
  isTopicCompleted: (topicId: string) => boolean;
  toggleCompleteTopic: (topicId: string) => void;
  saveQuizScore: (topicId: string, score: number, total: number, answers?: Record<number, number>) => void;
  completeProject: (projectId: string) => void;
  recordExperiment: (type?: string) => void;
  getOverallProgress: () => number;
  resetProgress: () => void;
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_beginner',
    title: 'LLM Beginner',
    description: 'Complete the first 3 introductory topics in the LLM Roadmap.',
    iconName: 'BookOpen',
    unlocked: false,
    progressPercent: 0,
  },
  {
    id: 'ach_tokenizer',
    title: 'Tokenization Explorer',
    description: 'Experiment with tokenization and inspect subword token IDs.',
    iconName: 'Binary',
    unlocked: false,
    progressPercent: 0,
  },
  {
    id: 'ach_prompt',
    title: 'Prompt Engineer',
    description: 'Compare Zero-shot vs Few-shot prompts in the Prompt Lab.',
    iconName: 'Sparkles',
    unlocked: false,
    progressPercent: 0,
  },
  {
    id: 'ach_rag',
    title: 'RAG Explorer',
    description: 'Ingest a document and query knowledge vectors in the RAG Lab.',
    iconName: 'Database',
    unlocked: false,
    progressPercent: 0,
  },
  {
    id: 'ach_builder',
    title: 'AI Builder',
    description: 'Successfully complete and run an AI project from the Project Lab.',
    iconName: 'Layers',
    unlocked: false,
    progressPercent: 0,
  },
];

const TOTAL_TOPICS_COUNT = 23;

const LearningProgressContext = createContext<LearningProgressContextType | undefined>(undefined);

export const LearningProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.uid || 'guest';

  const [completedTopics, setCompletedTopics] = useState<string[]>(['topic-1', 'topic-2']);
  const [quizScores, setQuizScores] = useState<Record<string, QuizResult>>({});
  const [completedProjects, setCompletedProjects] = useState<string[]>([]);
  const [experimentCount, setExperimentCount] = useState<number>(3);
  const [streakDays, setStreakDays] = useState<number>(3);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);

  const storageKey = `llm_progress_${userId}`;

  // Load progress
  useEffect(() => {
    if (!userId) return;

    const loadLocal = () => {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.completedTopics) setCompletedTopics(data.completedTopics);
          if (data.quizScores) setQuizScores(data.quizScores);
          if (data.completedProjects) setCompletedProjects(data.completedProjects);
          if (data.experimentCount !== undefined) setExperimentCount(data.experimentCount);
          if (data.streakDays !== undefined) setStreakDays(data.streakDays);
        } catch (e) {
          console.error('Failed to parse progress', e);
        }
      }
    };

    if (isFirebaseConfigured && db && user?.uid) {
      getDoc(doc(db, 'users', user.uid, 'progress', 'state'))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            if (data.completedTopics) setCompletedTopics(data.completedTopics);
            if (data.quizScores) setQuizScores(data.quizScores);
            if (data.completedProjects) setCompletedProjects(data.completedProjects);
            if (data.experimentCount !== undefined) setExperimentCount(data.experimentCount);
            if (data.streakDays !== undefined) setStreakDays(data.streakDays);
          } else {
            loadLocal();
          }
        })
        .catch(() => loadLocal());
    } else {
      loadLocal();
    }
  }, [userId, user?.uid, storageKey]);

  // Recalculate achievements whenever state changes
  useEffect(() => {
    const updated = INITIAL_ACHIEVEMENTS.map((ach) => {
      let unlocked = false;
      let progress = 0;

      if (ach.id === 'ach_beginner') {
        const beginnerTopics = ['topic-1', 'topic-2', 'topic-3'];
        const done = beginnerTopics.filter((t) => completedTopics.includes(t)).length;
        progress = Math.min(100, Math.round((done / 3) * 100));
        unlocked = done >= 3;
      } else if (ach.id === 'ach_tokenizer') {
        const hasTokenized = experimentCount >= 1 || completedTopics.includes('topic-6');
        progress = hasTokenized ? 100 : 0;
        unlocked = hasTokenized;
      } else if (ach.id === 'ach_prompt') {
        const hasPrompt = experimentCount >= 2 || completedTopics.includes('topic-16');
        progress = hasPrompt ? 100 : 0;
        unlocked = hasPrompt;
      } else if (ach.id === 'ach_rag') {
        const hasRag = experimentCount >= 3 || completedTopics.includes('topic-17');
        progress = hasRag ? 100 : 0;
        unlocked = hasRag;
      } else if (ach.id === 'ach_builder') {
        progress = completedProjects.length > 0 ? 100 : 0;
        unlocked = completedProjects.length > 0;
      }

      return {
        ...ach,
        unlocked,
        progressPercent: progress,
      };
    });

    setAchievements(updated);

    // Save to storage
    const state = {
      completedTopics,
      quizScores,
      completedProjects,
      experimentCount,
      streakDays,
    };
    localStorage.setItem(storageKey, JSON.stringify(state));

    if (isFirebaseConfigured && db && user?.uid) {
      setDoc(doc(db, 'users', user.uid, 'progress', 'state'), state, { merge: true }).catch(() => {});
    }
  }, [completedTopics, quizScores, completedProjects, experimentCount, streakDays, storageKey, user?.uid]);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#818cf8', '#c084fc', '#34d399'],
      });
    } catch {
      // ignore
    }
  };

  const isTopicCompleted = (topicId: string) => completedTopics.includes(topicId);

  const toggleCompleteTopic = (topicId: string) => {
    setCompletedTopics((prev) => {
      const isAlready = prev.includes(topicId);
      const next = isAlready ? prev.filter((id) => id !== topicId) : [...prev, topicId];
      if (!isAlready) triggerCelebration();
      return next;
    });
  };

  const saveQuizScore = (
    topicId: string,
    score: number,
    total: number,
    answers: Record<number, number> = {}
  ) => {
    const percentage = Math.round((score / total) * 100);
    const result: QuizResult = {
      id: 'quiz_' + Date.now(),
      topicId,
      score,
      totalQuestions: total,
      percentage,
      timestamp: Date.now(),
      answers,
    };

    setQuizScores((prev) => ({
      ...prev,
      [topicId]: result,
    }));

    if (percentage >= 70) {
      triggerCelebration();
    }
  };

  const completeProject = (projectId: string) => {
    if (!completedProjects.includes(projectId)) {
      setCompletedProjects((prev) => [...prev, projectId]);
      triggerCelebration();
    }
  };

  const recordExperiment = (_type?: string) => {
    setExperimentCount((prev) => prev + 1);
  };

  const getOverallProgress = () => {
    const topicPercent = (completedTopics.length / TOTAL_TOPICS_COUNT) * 60;
    const projectPercent = (completedProjects.length / 6) * 20;
    const quizCount = Object.keys(quizScores).length;
    const quizPercent = (Math.min(quizCount, 10) / 10) * 20;
    return Math.min(100, Math.round(topicPercent + projectPercent + quizPercent));
  };

  const resetProgress = () => {
    setCompletedTopics([]);
    setQuizScores({});
    setCompletedProjects([]);
    setExperimentCount(0);
    localStorage.removeItem(storageKey);
  };

  return (
    <LearningProgressContext.Provider
      value={{
        completedTopics,
        quizScores,
        completedProjects,
        experimentCount,
        streakDays,
        achievements,
        isTopicCompleted,
        toggleCompleteTopic,
        saveQuizScore,
        completeProject,
        recordExperiment,
        getOverallProgress,
        resetProgress,
      }}
    >
      {children}
    </LearningProgressContext.Provider>
  );
};

export const useLearningProgress = () => {
  const ctx = useContext(LearningProgressContext);
  if (!ctx) throw new Error('useLearningProgress must be used within LearningProgressProvider');
  return ctx;
};
