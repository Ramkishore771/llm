import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LearningProgressProvider } from './context/LearningProgressContext';
import { ThemeProvider } from './context/ThemeContext';

import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AuthModal } from './components/auth/AuthModal';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LearningHubPage } from './pages/LearningHubPage';
import { TopicDetailPage } from './pages/TopicDetailPage';
import { TokenizationLabPage } from './pages/TokenizationLabPage';
import { VocabularyLabPage } from './pages/VocabularyLabPage';
import { EmbeddingLabPage } from './pages/EmbeddingLabPage';
import { AIPlaygroundPage } from './pages/AIPlaygroundPage';
import { AIChatPage } from './pages/AIChatPage';
import { RAGLabPage } from './pages/RAGLabPage';
import { MiniLLMVisualizerPage } from './pages/MiniLLMVisualizerPage';
import { AttentionVisualizerPage } from './pages/AttentionVisualizerPage';
import { PromptLabPage } from './pages/PromptLabPage';
import { ProjectLabPage } from './pages/ProjectLabPage';
import { QuizSystemPage } from './pages/QuizSystemPage';
import { ProgressAchievementsPage } from './pages/ProgressAchievementsPage';
import { SettingsPage } from './pages/SettingsPage';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={!isLanding ? () => setSidebarOpen((prev) => !prev) : undefined}
        openAuthModal={() => setAuthModalOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 flex">
        {/* Render Sidebar on all portal app pages */}
        {!isLanding && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <main
          className={`flex-1 transition-all duration-300 ${
            !isLanding ? 'lg:pl-64' : ''
          }`}
        >
          <Routes>
            <Route
              path="/"
              element={<LandingPage openAuthModal={() => setAuthModalOpen(true)} />}
            />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/learn" element={<LearningHubPage />} />
            <Route path="/learn/:topicId" element={<TopicDetailPage />} />
            <Route path="/tokenization" element={<TokenizationLabPage />} />
            <Route path="/vocabulary" element={<VocabularyLabPage />} />
            <Route path="/embeddings" element={<EmbeddingLabPage />} />
            <Route path="/playground" element={<AIPlaygroundPage />} />
            <Route path="/chat" element={<AIChatPage />} />
            <Route path="/rag" element={<RAGLabPage />} />
            <Route path="/visualizer" element={<MiniLLMVisualizerPage />} />
            <Route path="/attention" element={<AttentionVisualizerPage />} />
            <Route path="/prompt-lab" element={<PromptLabPage />} />
            <Route path="/projects" element={<ProjectLabPage />} />
            <Route path="/projects/:projectId" element={<ProjectLabPage />} />
            <Route path="/quizzes" element={<QuizSystemPage />} />
            <Route path="/progress" element={<ProgressAchievementsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LearningProgressProvider>
        <ThemeProvider>
          <Router>
            <AppLayout />
          </Router>
        </ThemeProvider>
      </LearningProgressProvider>
    </AuthProvider>
  );
}
