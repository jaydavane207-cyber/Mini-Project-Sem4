import React, { useState } from 'react';
import { Zap, Mail, Lock, ArrowRight } from 'lucide-react';
import insforge from '../lib/insforge';

export default function Login({ onNavigate, onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      setIsSubmitting(true);
      setError('');
      try {
        const { data, error: authError } = await insforge.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (authError) throw authError;

        if (data) {
          onLogin(); 
        }
      } catch (err) {
        setError(err.message || 'Failed to sign in.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setError('Please fill in all fields.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await insforge.auth.signInWithOAuth({
        provider: 'google',
        redirectTo: window.location.origin
      });
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('An unexpected error occurred during Google sign-in.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[var(--color-gs-bg)] p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[var(--color-gs-cyan)]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[var(--color-gs-violet)]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md bg-[var(--color-gs-card)]/80 backdrop-blur-xl border border-[var(--color-gs-border)] rounded-3xl p-8 z-10 shadow-2xl animate-[slideIn_0.3s_ease-out]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-gs-bg)] border border-[var(--color-gs-cyan)] shadow-[0_0_15px_rgba(0,212,255,0.4)] flex items-center justify-center text-[var(--color-gs-cyan)] mb-4">
             <Zap size={24} />
          </div>
          <h2 className="text-3xl font-bold text-[var(--color-gs-text-main)] text-center">Welcome Back</h2>
          <p className="text-[var(--color-gs-text-muted)] mt-2 text-center">Sign in to continue to GroupSync.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--color-gs-text-muted)] mb-2">Email</label>
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
                className="w-full bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded-lg pl-10 p-3 outline-none focus:border-[var(--color-gs-cyan)] transition-colors text-[var(--color-gs-text-main)]" 
                placeholder="john@example.com" 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm text-[var(--color-gs-text-muted)]">Password</label>
              <button type="button" className="text-xs text-[var(--color-gs-cyan)] hover:underline">Forgot password?</button>
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
                className="w-full bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded-lg pl-10 p-3 outline-none focus:border-[var(--color-gs-cyan)] transition-colors text-[var(--color-gs-text-main)]" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-3 mt-6 bg-[var(--color-gs-cyan)] text-[#0f172a] font-bold rounded-lg hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(0,212,255,0.3)] hover:shadow-[0_0_25px_rgba(0,212,255,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? 'Signing In...' : 'Sign In'} {!isSubmitting && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-[var(--color-gs-border)]"></div>
          <span className="flex-shrink-0 mx-4 text-[var(--color-gs-text-muted)] text-sm">or</span>
          <div className="flex-grow border-t border-[var(--color-gs-border)]"></div>
        </div>

        <button 
          type="button"
          onClick={handleGoogleLogin} 
          className="w-full py-3 bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] text-[var(--color-gs-text-main)] font-medium rounded-lg hover:bg-[var(--color-gs-border)] transition-colors flex items-center justify-center gap-3 mb-4"
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
          <button onClick={() => onNavigate('signup')} className="text-[var(--color-gs-cyan)] hover:underline font-medium">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
