import React, { useState } from 'react';
import { Zap, Mail, Lock, ArrowRight, X } from 'lucide-react';
import supabase from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Login({ onNavigate, onLogin }) {
  const navigate = useNavigate();
  const { checkAuth, showToast } = useAppContext();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (authError) {
        // Friendly messages for common errors
        const msg = authError.message?.toLowerCase() || '';
        if (msg.includes('email not confirmed')) {
          setError('Your email is not confirmed yet. Please check your inbox and click the confirmation link.');
        } else if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
          setError('Incorrect email or password. Please try again.');
        } else if (msg.includes('user not found')) {
          setError('No account found with this email. Please sign up first.');
        } else {
          setError(authError.message || 'Sign in failed. Please try again.');
        }
        setIsSubmitting(false);
        return;
      }

      if (data?.user) {
        onLogin();
        // Refresh auth state to determine onboarding status, then redirect
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id;
        if (userId) {
          // BUG-1 FIX: Must select college and skills, not just name
          const { data: profileData } = await supabase
            .from('profiles')
            .select('name, college, skills')
            .eq('id', userId)
            .single();
          const isProfileComplete = !!(
            profileData?.name?.trim() && 
            profileData?.college?.trim() && 
            (profileData?.skills && Array.isArray(profileData.skills) && profileData.skills.length > 0)
          );
          navigate(isProfileComplete ? '/dashboard' : '/onboarding', { replace: true });
        } else {
          navigate('/onboarding', { replace: true });
        }
      }
    } catch (err) {
      setIsSubmitting(false);
      // "Failed to fetch" is a network-level error (no connection / Supabase unreachable)
      if (err.message?.toLowerCase().includes('failed to fetch') || err.name === 'TypeError') {
        setError('Network error: Unable to reach the server. Please check your internet connection and try again.');
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) setError(error.message);
    } catch (err) {
      setError('An unexpected error occurred during Google sign-in.');
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail.trim()) {
      showToast('Please enter your email address.', 'error');
      return;
    }
    setIsSendingReset(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
        redirectTo: `${window.location.origin}/login`
      });
      if (error) throw error;
      showToast('Password reset email sent! Check your inbox.', 'success');
      setShowForgotPassword(false);
      setForgotEmail('');
    } catch (err) {
      showToast(err.message || 'Failed to send reset email.', 'error');
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-transparent p-4 relative overflow-hidden">
      <div className="w-full max-w-md backdrop-blur-xl bg-[#050810]/60 border border-white/5 rounded-3xl p-8 z-10 shadow-[0_0_40px_rgba(0,0,0,0.3)] animate-page-load">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/20 shadow-[0_0_20px_rgba(0,240,255,0.2)] flex items-center justify-center text-[#00f0ff] mb-6">
             <Zap size={28} />
          </div>
          <h2 className="text-3xl font-bold font-heading text-white text-center">Welcome Back</h2>
          <p className="text-[var(--color-gs-text-muted)] mt-2 text-center">Sign in to continue to GroupSync.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--color-gs-text-muted)] mb-2 font-medium">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-[var(--color-gs-text-muted)]" />
              </div>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 p-3 outline-none focus:border-[#00f0ff] focus:bg-white/10 transition-colors text-white placeholder-white/30" 
                placeholder="john@example.com" 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm text-[var(--color-gs-text-muted)] font-medium">Password</label>
              <button type="button" onClick={() => setShowForgotPassword(true)} className="text-xs text-[#00f0ff] hover:underline">Forgot password?</button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-[var(--color-gs-text-muted)]" />
              </div>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 p-3 outline-none focus:border-[#00f0ff] focus:bg-white/10 transition-colors text-white placeholder-white/30" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-4 mt-8 bg-gradient-to-r from-[#00f0ff] to-[#a855f7] text-white font-bold rounded-xl hover:opacity-90 btn-scale transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? 'Signing In...' : 'Sign In'} {!isSubmitting && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="my-6 flex items-center opacity-50">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink-0 mx-4 text-[var(--color-gs-text-muted)] text-sm">or</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <button 
          type="button"
          onClick={handleGoogleLogin} 
          className="w-full py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 hover:border-white/30 transition-colors flex items-center justify-center gap-3 mb-4 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-[var(--color-gs-text-muted)] mt-6 text-sm">
          Don't have an account?{' '}
          <button onClick={() => onNavigate('signup')} className="text-[#00f0ff] hover:underline font-medium hover:text-[#00f0ff]/80 transition-colors">
            Sign up
          </button>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-page-load">
          <div className="glass-card border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <div className="flex justify-between items-center mb-4 relative z-10">
              <h3 className="text-xl font-bold font-heading text-white">Reset Password</h3>
              <button onClick={() => setShowForgotPassword(false)} className="text-[var(--color-gs-text-muted)] hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <p className="text-[var(--color-gs-text-muted)] text-sm mb-5 relative z-10">Enter your email and we'll send a reset link.</p>
            <div className="relative mb-6 z-10">
              <Mail size={18} className="absolute left-3 top-3.5 text-[var(--color-gs-text-muted)]" />
              <input
                type="email"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleForgotPassword()}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 p-3 outline-none focus:border-[#00f0ff] focus:bg-white/10 transition-colors text-white placeholder-white/30"
                placeholder="your@email.com"
                autoFocus
              />
            </div>
            <button
              onClick={handleForgotPassword}
              disabled={isSendingReset}
              className="w-full py-3 bg-gradient-to-r from-[#00f0ff] to-[#a855f7] text-white font-bold rounded-xl hover:opacity-90 btn-scale transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,240,255,0.3)] relative z-10"
            >
              {isSendingReset ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
