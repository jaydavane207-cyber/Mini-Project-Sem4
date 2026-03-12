import React, { useState } from 'react';
import { LayoutDashboard, Users, Bot, MessageSquare, Trophy, Zap, Sun, Moon, UserCircle, LogOut, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Sidebar() {
  const { user, currentPage, setCurrentPage, theme, setTheme, factions, logout } = useAppContext();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'browse', label: 'Browse Groups', icon: Users },
    { id: 'ai', label: 'AI Suggestions', icon: Bot },
    { id: 'chat', label: 'Campus Chat', icon: MessageSquare },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'profile', label: 'My Profile', icon: UserCircle },
  ];

  const factionColor = user?.faction ? factions[user.faction].color : 'text-[var(--color-gs-text-muted)]';
  const factionBorder = user?.faction ? factions[user.faction].border : 'border-gray-600';

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    setShowUserMenu(false);
    logout();
  };

  return (
    <>
      <aside className="w-56 fixed left-0 top-0 h-screen border-r border-[var(--color-gs-border)] bg-[var(--color-gs-card)] flex flex-col justify-between hidden md:flex transition-all duration-300 z-40">
        <div>
          {/* Logo */}
          <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-[var(--color-gs-bg)] border border-[var(--color-gs-cyan)] shadow-[0_0_10px_rgba(0,212,255,0.3)] flex flex-col items-center justify-center text-[var(--color-gs-cyan)]">
              <Zap size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--color-gs-text-main)]">
              Group<span className="text-[var(--color-gs-cyan)] text-glow-cyan">Sync</span>
            </h1>
          </div>

          {/* Nav Links */}
          <nav className="mt-4 px-3 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={"flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative group w-full text-left " + (isActive ? 'bg-[var(--color-gs-bg)] shadow-md' : 'hover:bg-[var(--color-gs-bg)]')}
                >
                  {isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-[var(--color-gs-cyan)] rounded-r-md shadow-[0_0_8px_rgba(0,212,255,0.6)]" />
                  )}
                  <Icon size={20} className={(isActive ? 'text-[var(--color-gs-cyan)]' : 'text-[var(--color-gs-text-muted)] group-hover:text-[var(--color-gs-text-main)]') + ' transition-colors'} />
                  <span className={"font-medium transition-colors text-sm " + (isActive ? 'text-[var(--color-gs-text-main)]' : 'text-[var(--color-gs-text-muted)] group-hover:text-[var(--color-gs-text-main)]')}>
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
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] hover:border-[var(--color-gs-cyan)] transition-colors group"
            >
              <div className="flex items-center gap-3">
                {theme === 'dark'
                  ? <Moon size={18} className="text-[var(--color-gs-cyan)]" />
                  : <Sun size={18} className="text-[var(--color-gs-amber)]" />
                }
                <span className="text-sm font-medium text-[var(--color-gs-text-muted)] group-hover:text-[var(--color-gs-text-main)] transition-colors capitalize">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              <div className={"relative w-10 h-5 rounded-full transition-colors duration-300 " + (theme === 'dark' ? 'bg-[var(--color-gs-cyan)]/30' : 'bg-[var(--color-gs-amber)]/30')}>
                <div className={"absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 " + (theme === 'dark' ? 'left-0.5 bg-[var(--color-gs-cyan)]' : 'left-[22px] bg-[var(--color-gs-amber)]')} />
              </div>
            </button>
          </div>

          {/* User Info Bottom */}
          {user && (
            <div className="px-4 relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full flex items-center gap-3 p-2 rounded-xl bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] hover:border-[var(--color-gs-cyan)] transition-colors cursor-pointer group"
              >
                <div className={"w-10 h-10 rounded-lg bg-[var(--color-gs-card)] flex items-center justify-center text-xl border " + factionBorder}>
                  {user.avatar || '🎓'}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold text-[var(--color-gs-text-main)] truncate group-hover:text-[var(--color-gs-cyan)] transition-colors">{user.name}</p>
                  <p className={"text-xs truncate " + factionColor}>
                    {factions[user.faction]?.name || 'Student'}
                  </p>
                </div>
                <ChevronDown size={14} className={"text-[var(--color-gs-text-muted)] transition-transform duration-200 " + (showUserMenu ? 'rotate-180' : '')} />
              </button>

              {/* Dropdown */}
              {showUserMenu && (
                <div className="absolute bottom-full left-4 right-4 mb-2 bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-xl overflow-hidden shadow-2xl z-50">
                  <button
                    onClick={() => { setCurrentPage('profile'); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--color-gs-text-main)] hover:bg-[var(--color-gs-bg)] transition-colors"
                  >
                    <UserCircle size={16} className="text-[var(--color-gs-cyan)]" />
                    View Profile
                  </button>
                  <button
                    onClick={() => { setShowLogoutModal(true); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-[var(--color-gs-border)]"
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

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-[slideIn_0.2s_ease-out]">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
                <LogOut size={28} className="text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-[var(--color-gs-text-main)] mb-2">Logout?</h2>
              <p className="text-[var(--color-gs-text-muted)] text-sm mb-6">Are you sure you want to log out of GroupSync?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 rounded-xl border border-[var(--color-gs-border)] text-[var(--color-gs-text-main)] hover:bg-[var(--color-gs-bg)] transition-colors font-medium"
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
