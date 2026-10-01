import React, { useState } from 'react';
import {
  Settings,
  Key,
  Sun,
  Moon,
  Trash2,
  Check,
  AlertCircle,
  ShieldCheck,
  Server,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useLearningProgress } from '../context/LearningProgressContext';
import { apiService } from '../services/api';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { resetProgress } = useLearningProgress();

  const [geminiKey, setGeminiKey] = useState(
    () => localStorage.getItem('llm_gemini_key') || ''
  );
  const [openaiKey, setOpenaiKey] = useState(
    () => localStorage.getItem('llm_openai_key') || ''
  );

  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    if (geminiKey.trim()) {
      localStorage.setItem('llm_gemini_key', geminiKey.trim());
    } else {
      localStorage.removeItem('llm_gemini_key');
    }

    if (openaiKey.trim()) {
      localStorage.setItem('llm_openai_key', openaiKey.trim());
    } else {
      localStorage.removeItem('llm_openai_key');
    }

    setSaveStatus('API Keys securely saved in browser storage.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleTestBackend = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const health = await apiService.health();
      setTestResult(`Backend Active: ${health.service} (${health.version})`);
    } catch (err: any) {
      setTestResult(`Error: ${err.message || 'Cannot reach FastAPI backend server.'}`);
    } finally {
      setTesting(false);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset your curriculum progress?')) {
      resetProgress();
      alert('Your learning progress has been reset.');
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-900/30 via-indigo-900/30 to-[#101624] border border-[#232f48] p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/25 text-sky-400 text-xs font-semibold">
            <Settings className="w-4 h-4" />
            <span>Platform Configuration</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Portal Settings</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Configure external AI provider API keys (Gemini / OpenAI), test local FastAPI backend
            connectivity, adjust appearance, and manage workspace data.
          </p>
        </div>
      </div>

      {/* API Keys Configuration Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#101624] border border-[#232f48] space-y-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#1e293d]">
          <div className="flex items-center gap-2.5">
            <Key className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold text-white">AI Provider API Keys</h2>
          </div>
          <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Stored Securely in Browser</span>
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          The portal comes with an intelligent built-in pedagogical simulation engine that works
          100% out of the box. To connect directly to frontier models (Gemini 1.5/2.0 Flash or
          GPT-4o), enter your key below:
        </p>

        <form onSubmit={handleSaveKeys} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Google Gemini API Key
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full bg-[#141b2c] border border-[#232f48] focus:border-sky-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              OpenAI API Key
            </label>
            <input
              type="password"
              placeholder="sk-proj-..."
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className="w-full bg-[#141b2c] border border-[#232f48] focus:border-sky-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none font-mono"
            />
          </div>

          {saveStatus && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
              <Check className="w-4 h-4 shrink-0" />
              <span>{saveStatus}</span>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition shadow-md shadow-sky-500/20"
            >
              Save API Configuration
            </button>
          </div>
        </form>
      </div>

      {/* Backend Health Check Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#101624] border border-[#232f48] space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#1e293d]">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">FastAPI Backend Connectivity</h2>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          Backend server proxy is mapped to <code className="text-sky-300">http://127.0.0.1:8000/api</code>.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTestBackend}
            disabled={testing}
            className="px-5 py-2 rounded-xl bg-[#161f33] hover:bg-[#1f2b47] border border-[#232f48] text-xs font-semibold text-slate-200 transition"
          >
            {testing ? 'Pinging /api/health...' : 'Test Backend Connection'}
          </button>
        </div>

        {testResult && (
          <div
            className={`p-3 rounded-xl text-xs font-mono ${
              testResult.startsWith('Error')
                ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
            }`}
          >
            {testResult}
          </div>
        )}
      </div>

      {/* Appearance & Workspace Data */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#101624] border border-[#232f48] space-y-5 shadow-sm">
        <h2 className="text-base font-bold text-white">Appearance & Workspace Data</h2>

        <div className="flex items-center justify-between py-2 border-b border-[#1e293d]">
          <div>
            <div className="text-xs font-semibold text-white">Theme Mode</div>
            <div className="text-[11px] text-slate-400">Currently active: {theme}</div>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#161f33] hover:bg-[#1f2b47] border border-[#232f48] text-xs font-semibold text-slate-200 transition"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-sky-400" />}
            <span>Toggle Theme</span>
          </button>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <div className="text-xs font-semibold text-rose-400">Reset Local Curriculum Progress</div>
            <div className="text-[11px] text-slate-500">
              Clear completed topics and quiz scores from your local cache.
            </div>
          </div>
          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-400 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};
