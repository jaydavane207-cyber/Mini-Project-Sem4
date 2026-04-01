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

  const factionColor = user?.faction ? factions[user.faction].color : 'text-gs-text-muted';
  const factionBorder = user?.faction ? factions[user.faction].border : 'border-gs-border';

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
      <aside className="w-56 fixed left-0 top-0 h-screen border-r border-gs-border bg-gs-card flex-col justify-between hidden md:flex transition-all duration-300 z-40">
        <div>
          {/* Logo */}
          <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-gs-bg border border-gs-cyan shadow-[0_0_10px_rgba(0,212,255,0.3)] flex flex-col items-center justify-center text-gs-cyan">
              <Zap size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gs-text-main">
              Group<span className="text-gs-cyan text-glow-cyan">Sync</span>
            </h1>
          </div>

          {/* Nav Links */}
          <nav className="mt-4 px-3 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={"flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative group w-full text-left " + (isActive ? 'bg-gs-bg shadow-md' : 'hover:bg-gs-bg')}
                >
                  {isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-gs-cyan rounded-r-md shadow-[0_0_8px_rgba(0,212,255,0.6)]" />
                  )}
                  <Icon size={20} className={(isActive ? 'text-gs-cyan' : 'text-gs-text-muted group-hover:text-gs-text-main') + ' transition-colors'} />
                  <span className={"font-medium transition-colors text-sm " + (isActive ? 'text-gs-text-main' : 'text-gs-text-muted group-hover:text-gs-text-main')}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-2 pb-4">
          {/* Theme Toggle */}
          <div className="px-5 mb-1">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gs-bg border border-gs-border hover:border-gs-cyan transition-colors group"
            >
              <div className="flex items-center gap-3">
                {theme === 'dark'
                  ? <Moon size={18} className="text-gs-cyan" />
                  : <Sun size={18} className="text-gs-amber" />
                }
                <span className="text-sm font-medium text-gs-text-muted group-hover:text-gs-text-main transition-colors capitalize">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              <div className={"relative w-10 h-5 rounded-full transition-colors duration-300 " + (theme === 'dark' ? 'bg-gs-cyan/30' : 'bg-gs-amber/30')}>
                <div className={"absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 " + (theme === 'dark' ? 'left-0.5 bg-gs-cyan' : 'left-[22px] bg-gs-amber')} />
              </div>
            </button>
          </div>

          {/* User Info Bottom */}
          {user && (
            <div className="px-4 relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full flex items-center gap-3 p-2 rounded-xl bg-gs-bg border border-gs-border hover:border-gs-cyan transition-colors cursor-pointer group"
              >
                <div className={"w-10 h-10 rounded-lg bg-gs-card flex items-center justify-center text-xl border " + factionBorder}>
                  {user.avatar || '🎓'}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold text-gs-text-main truncate group-hover:text-gs-cyan transition-colors">{user.name}</p>
                  <p className={"text-xs truncate " + factionColor}>
                    {factions[user.faction]?.name || 'Student'}
                  </p>
                </div>
                <ChevronDown size={14} className={"text-gs-text-muted transition-transform duration-200 " + (showUserMenu ? 'rotate-180' : '')} />
              </button>

              {/* Dropdown */}
              {showUserMenu && (
                <div className="absolute bottom-full left-4 right-4 mb-2 bg-gs-card border border-gs-border rounded-xl overflow-hidden shadow-2xl z-50">
                  <button
                    onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gs-text-main hover:bg-gs-bg transition-colors"
                  >
                    <UserCircle size={16} className="text-gs-cyan" />
                    View Profile
                  </button>
                  <button
                    onClick={() => { setShowLogoutModal(true); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-gs-border"
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

      {/* ── Mobile Bottom Tab Bar (UI-3 FIX) ─────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gs-card/95 backdrop-blur-md border-t border-gs-border shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
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
                <div className={`p-1.5 rounded-lg transition-all duration-200 ${isActive ? 'bg-gs-cyan/15 shadow-[0_0_8px_rgba(0,212,255,0.3)]' : ''}`}>
                  <Icon
                    size={20}
                    className={`transition-colors ${isActive ? 'text-gs-cyan' : 'text-gs-text-muted'}`}
                  />
                </div>
                <span className={`text-[9px] font-semibold truncate w-full text-center transition-colors ${isActive ? 'text-gs-cyan' : 'text-gs-text-muted'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gs-card border border-gs-border rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-[slideIn_0.2s_ease-out]">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
                <LogOut size={28} className="text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-gs-text-main mb-2">Logout?</h2>
              <p className="text-gs-text-muted text-sm mb-6">Are you sure you want to log out of GroupSync?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 rounded-xl border border-gs-border text-gs-text-main hover:bg-gs-bg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]"
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
