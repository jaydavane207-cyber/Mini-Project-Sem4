import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Bot, MessageSquare, Trophy, Zap, Sun, Moon, UserCircle, LogOut, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Sidebar() {
  const { user, theme, setTheme, factions, logout } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/browse', label: 'Browse Groups', icon: Users },
    { path: '/ai', label: 'AI', icon: Bot },
    { path: '/chat', label: 'Chat', icon: MessageSquare },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/profile', label: 'Profile', icon: UserCircle },
  ];

  const factionColor = user?.faction ? factions[user.faction].color : 'text-gray-400';

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    setShowUserMenu(false);
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
      <aside className="w-56 fixed left-0 top-0 h-screen border-r border-white/5 bg-[#050810]/95 flex-col justify-between hidden md:flex transition-all duration-300 z-40 relative backdrop-blur-[20px]">
        <div>
          {/* Logo */}
          <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-transparent border border-[var(--color-gs-primary)] shadow-[0_0_10px_rgba(0,240,255,0.3)] flex flex-col items-center justify-center text-[var(--color-gs-primary)]">
              <Zap size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white font-heading">
              Group<span className="text-[var(--color-gs-primary)] text-glow-cyan">Sync</span>
            </h1>
          </div>

          {/* Nav Links */}
          <nav className="mt-4 px-3 flex flex-col gap-2 relative">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative group w-full text-left overflow-hidden ${
                    isActive ? 'bg-[var(--color-gs-primary)]/10 text-[var(--color-gs-primary)]' : 'text-[var(--color-gs-text-muted)] hover:bg-white/4 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--color-gs-primary)] shadow-[0_0_8px_rgba(0,240,255,0.6)] animate-[slide-in-left_0.2s_ease-out]" />
                  )}
                  <Icon size={20} className="relative z-10" />
                  <span className="font-medium text-sm relative z-10 w-full truncate">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-2 pb-4">
          {/* User Info Bottom */}
          {user && (
            <div className="px-4 relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full flex items-center gap-3 p-3 glass-card hover:border-[#00f0ff] transition-colors cursor-pointer group text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl border border-white/10 group-hover:border-[#00f0ff] transition-colors">
                  {user.avatar || '🎓'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate group-hover:text-[#00f0ff] transition-colors">{user.name}</p>
                  <p className="text-[10px] font-bold text-[#00f0ff] uppercase tracking-wider truncate">
                    {factions[user.faction]?.name || 'Student'}
                  </p>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {showUserMenu && (
                <div className="absolute bottom-full left-4 right-4 mb-2 glass-card overflow-hidden shadow-2xl z-50">
                  <button
                    onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors"
                  >
                    <UserCircle size={16} className="text-[var(--color-gs-primary)]" />
                    View Profile
                  </button>
                  <button
                    onClick={() => { setShowLogoutModal(true); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/10"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* ── Mobile Bottom Tab Bar ─────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050810]/95 backdrop-blur-[20px] border-t border-white/10">
        <div className="flex items-center justify-around px-1 py-1.5 safe-area-pb">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-0 flex-1"
              >
                <div className={`p-1.5 rounded-lg transition-all duration-200 ${isActive ? 'bg-[var(--color-gs-primary)]/10 shadow-[0_0_8px_rgba(0,240,255,0.3)]' : ''}`}>
                  <Icon
                    size={20}
                    className={`transition-colors ${isActive ? 'text-[var(--color-gs-primary)]' : 'text-gray-500'}`}
                  />
                </div>
                <span className={`text-[9px] font-semibold truncate w-full text-center transition-colors ${isActive ? 'text-[var(--color-gs-primary)]' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card p-8 max-w-sm w-full shadow-2xl animate-[slideInUp_0.2s_ease-out]">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
                <LogOut size={28} className="text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2 font-heading">Logout?</h2>
              <p className="text-gray-400 text-sm mb-6">Are you sure you want to log out of GroupSync?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-colors font-medium btn-scale"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)] btn-scale"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
