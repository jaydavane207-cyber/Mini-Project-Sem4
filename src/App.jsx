import React from 'react';
import { CheckCircle } from 'lucide-react';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import BrowseGroups from './components/BrowseGroups';
import AISuggestions from './components/AISuggestions';
import CampusChat from './components/CampusChat';
import Leaderboard from './components/Leaderboard';
import OnboardingFlow from './components/OnboardingFlow';
import GroupDetails from './components/GroupDetails';
import UserProfile from './components/UserProfile';
import { useAppContext } from './context/AppContext';

export default function GroupSyncApp() {
  const { currentPage, setCurrentPage, user, setUser, toast, showToast, theme } = useAppContext();

  return (
    <div className="min-h-screen text-[var(--color-gs-text-main)] font-sans selection:bg-[var(--color-gs-cyan)] selection:text-[var(--color-gs-text-main)] flex bg-[var(--color-gs-bg)]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-[slideIn_0.3s_ease-out] bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] p-4 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center gap-3">
          <CheckCircle className="text-[var(--color-gs-green)] w-5 h-5" />
          <p>{toast.message}</p>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 10px currentColor; }
          50% { box-shadow: 0 0 25px currentColor; }
        }
        @keyframes fill-bar {
          from { width: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}} />

      {currentPage === 'signup' ? (
        <Signup onNavigate={setCurrentPage} />
      ) : currentPage === 'login' ? (
        <Login 
          onNavigate={setCurrentPage} 
          onLogin={() => {
            setCurrentPage('onboarding');
            showToast('Login successful! Let\'s build your profile.', 'success');
          }} 
        />
      ) : currentPage === 'onboarding' ? (
        <OnboardingFlow onComplete={(userData) => {
          setUser(userData);
          setCurrentPage('dashboard');
          showToast('Welcome to GroupSync!', 'success');
        }} />
      ) : (
        <React.Fragment>
          <Sidebar />
          <main className="flex-1 overflow-y-auto min-h-screen p-8 ml-0 md:ml-56">
            <div className="max-w-7xl mx-auto backdrop-blur-sm rounded-3xl pb-10">
              {currentPage === 'dashboard' && <Dashboard />}
              {currentPage === 'browse' && <BrowseGroups />}
              {currentPage === 'ai' && <AISuggestions />}
              {currentPage === 'chat' && <CampusChat />}
              {currentPage === 'leaderboard' && <Leaderboard />}
              {currentPage === 'groupDetails' && <GroupDetails />}
              {currentPage === 'profile' && <UserProfile />}
            </div>
          </main>
        </React.Fragment>
      )}
    </div>
  );
}
