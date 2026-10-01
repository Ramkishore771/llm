import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Brain,
  Search,
  Flame,
  Sun,
  Moon,
  User,
  LogOut,
  Settings,
  Sparkles,
  Menu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLearningProgress } from '../../context/LearningProgressContext';
import { useTheme } from '../../context/ThemeContext';
import { GlobalSearchModal } from './GlobalSearchModal';
import { apiService } from '../../services/api';

interface NavbarProps {
  onToggleSidebar?: () => void;
  openAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, openAuthModal }) => {
  const { user, logout } = useAuth();
  const { streakDays } = useLearningProgress();
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState(true);
  const navigate = useNavigate();

  // Hotkey for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Poll backend health once
  useEffect(() => {
    apiService
      .health()
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full h-16 bg-[#0a0d14]/90 dark:bg-[#0a0d14]/90 backdrop-blur-md border-b border-[#1f293d] px-4 lg:px-6 flex items-center justify-between transition-colors">
        {/* Left side: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition">
              <Brain className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                <span>NeuralForge</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  LLM Lab
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar Trigger */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-[#131b2c] hover:bg-[#1a243a] border border-[#232f48] text-slate-400 hover:text-slate-200 text-sm transition group"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-sky-400" />
              <span>Search topics, labs, quizzes, projects...</span>
            </span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right side: Streak, Status, Theme, Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Backend Status indicator */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-[#111827] border-[#1f2937]"
            title={backendOnline ? 'FastAPI Backend Online' : 'FastAPI Backend Offline'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                backendOnline ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'
              }`}
            />
            <span className="text-slate-400">{backendOnline ? 'API Active' : 'API Offline'}</span>
          </div>

          {/* Streak indicator */}
          {user && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{streakDays}d Streak</span>
            </div>
          )}

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-sky-400" />}
          </button>

          {/* Auth Button / User Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800/80 transition"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full object-cover border border-sky-500/40"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs shadow-md">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline font-medium text-sm text-slate-200 truncate max-w-[110px]">
                  {user.displayName.split(' ')[0]}
                </span>
              </button>

              {/* Profile dropdown */}
              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#111724] border border-[#232f48] shadow-2xl p-2 z-50 text-slate-200 animate-in fade-in"
                  onClick={() => setProfileOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-[#1f293d]">
                    <div className="font-semibold text-sm text-white truncate">{user.displayName}</div>
                    <div className="text-xs text-slate-400 truncate">{user.email}</div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      <Brain className="w-4 h-4 text-sky-400" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => navigate('/progress')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Achievements
                    </button>
                    <button
                      onClick={() => navigate('/settings')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      Settings & API Keys
                    </button>
                  </div>

                  <div className="pt-1 border-t border-[#1f293d]">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-500/15 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-sky-500/25 transition transform active:scale-95"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Demo</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
