import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, AlertCircle, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
}) => {
  const { login, signup, loginWithGoogle, loginGuestDemo, resetPassword, error, clearError } =
    useAuth();

  const [tab, setTab] = useState<'login' | 'signup' | 'forgot'>(defaultTab);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const handleSwitchTab = (newTab: 'login' | 'signup' | 'forgot') => {
    setTab(newTab);
    setLocalError('');
    clearError();
    setResetSent(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (tab === 'forgot') {
      if (!email) {
        setLocalError('Please enter your email address.');
        return;
      }
      setIsSubmitting(true);
      try {
        await resetPassword(email);
        setResetSent(true);
      } catch (err: any) {
        setLocalError(err.message || 'Failed to send reset email.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (tab === 'signup') {
      if (!fullName.trim()) {
        setLocalError('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setLocalError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await signup(fullName, email, password);
      }
      onClose();
    } catch (err: any) {
      setLocalError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setLocalError('');
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setLocalError(err.message || 'Google sign-in was cancelled.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsSubmitting(true);
    try {
      await loginGuestDemo();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div
        className="w-full max-w-md bg-[#101624] border border-[#232f48] rounded-2xl shadow-2xl p-6 sm:p-8 relative text-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 mb-3 shadow-lg shadow-sky-500/25">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {tab === 'login' && 'Welcome Back'}
            {tab === 'signup' && 'Create Your AI Account'}
            {tab === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {tab === 'login' && 'Sign in to access your personal dashboard & experiments'}
            {tab === 'signup' && 'Start learning LLM concepts and building real AI projects'}
            {tab === 'forgot' && 'Enter your email to receive recovery instructions'}
          </p>
        </div>

        {/* Tab switch for Login / Signup */}
        {tab !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 bg-[#161f33] rounded-xl mb-6 border border-[#232f48]">
            <button
              onClick={() => handleSwitchTab('login')}
              className={`py-2 text-sm font-semibold rounded-lg transition ${
                tab === 'login'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleSwitchTab('signup')}
              className={`py-2 text-sm font-semibold rounded-lg transition ${
                tab === 'signup'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Error notification */}
        {(localError || error) && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs mb-4">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{localError || error}</span>
          </div>
        )}

        {/* Reset success notification */}
        {resetSent && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs mb-4">
            <Check className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Password reset email instructions have been sent!</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Turing"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#161f33] border border-[#232f48] focus:border-sky-500 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#161f33] border border-[#232f48] focus:border-sky-500 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition"
              />
            </div>
          </div>

          {tab !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">Password</label>
                {tab === 'login' && (
                  <button
                    type="button"
                    onClick={() => handleSwitchTab('forgot')}
                    className="text-xs text-sky-400 hover:text-sky-300 transition"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#161f33] border border-[#232f48] focus:border-sky-500 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition"
                />
              </div>
            </div>
          )}

          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#161f33] border border-[#232f48] focus:border-sky-500 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {tab === 'login' && 'Sign In to Dashboard'}
                  {tab === 'signup' && 'Create Account'}
                  {tab === 'forgot' && 'Send Reset Link'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {tab !== 'forgot' && (
          <>
            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#232f48]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#101624] px-2 text-slate-500 font-medium">Or continue with</span>
              </div>
            </div>

            {/* Social & Guest Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#161f33] hover:bg-[#1d2943] border border-[#232f48] text-xs font-semibold text-slate-200 transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16c1.9 3.8 5.8 7 10.4 7z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={handleGuestLogin}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/30 text-xs font-semibold text-emerald-300 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant Student Demo</span>
              </button>
            </div>
          </>
        )}

        {/* Back to login option in forgot view */}
        {tab === 'forgot' && (
          <div className="mt-4 text-center">
            <button
              onClick={() => handleSwitchTab('login')}
              className="text-xs text-sky-400 hover:text-sky-300 transition"
            >
              ← Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
