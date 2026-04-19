import React from 'react';
import { Users, Target, Zap, Bot, Sparkles, LucideIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface Faction {
  id: string;
  name: string;
  color: string;
  bg: string;
  border: string;
  icon: LucideIcon;
  description: string;
}

interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

import { seedDatabase } from '../lib/seeddata';
import { useState } from 'react';

export default function DashboardPage() {
  const { user, factions, stats: liveStats, refreshGroups, refreshStats, showToast } = useAppContext();
  const [isSeeding, setIsSeeding] = useState(false);
  
  if (!user) return null;

  const handleSeed = async () => {
    setIsSeeding(true);
    const result = await seedDatabase(user);
    if (result.success) {
      showToast('Database seeded with campus data!', 'success');
      if (refreshGroups) await refreshGroups();
      if (refreshStats) await refreshStats();
    } else {
      showToast(result.error || 'Seeding failed. Ensure SQL tables are created.', 'error');
    }
    setIsSeeding(false);
  };
  
  const faction: Faction = factions[user.faction as keyof typeof factions] || factions.innovators;

  const stats: Stat[] = [
    { label: 'Active Groups', value: liveStats.activeGroups.toString(), icon: Users, color: 'text-gs-cyan' },
    { label: 'Open Hackathons', value: liveStats.openHackathons.toString(), icon: Target, color: 'text-gs-amber' },
    { label: 'Members Online', value: liveStats.onlineMembers.toString(), icon: Zap, color: 'text-gs-green' },
    { label: 'AI Matches', value: liveStats.aiMatches.toString(), icon: Bot, color: 'text-gs-violet' },
  ];

  return (
    <div className="space-y-8 animate-[slideIn_0.3s_ease-out]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">Welcome back, {user.name}</h1>
          <p className="text-gs-text-muted mt-2">Here is what's happening on campus today.</p>
        </div>
        {/* UI-4 FIX: Only show seed button in development mode */}
        {import.meta.env.DEV && liveStats.activeGroups === 0 && (
          <button 
            onClick={handleSeed}
            disabled={isSeeding}
            className="px-6 py-3 bg-[var(--color-gs-bg)] border border-[var(--color-gs-cyan)]/50 text-[var(--color-gs-cyan)] font-bold rounded-xl hover:bg-[var(--color-gs-cyan)]/10 transition-all flex items-center gap-2"
          >
            {isSeeding ? 'Seeding...' : 'Seed Mock Data'} <Sparkles size={18} />
          </button>
        )}

      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
             <div key={i} className="group relative rounded-[2rem] p-px overflow-hidden cursor-default transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.12)] hover:-translate-y-1">
                {/* Gradient Border Base */}
                <div className="absolute inset-0 bg-gradient-to-br from-gs-border via-transparent to-gs-border opacity-60 group-hover:opacity-100 group-hover:from-[var(--color-gs-primary)] group-hover:via-[#a855f7] group-hover:to-[var(--color-gs-primary)] transition-all duration-500" />
                
                <div className="relative h-full bg-white/5 rounded-[calc(2rem-1px)] border border-white/5 p-7 backdrop-blur-xl flex flex-col justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                  <div className="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-300 transform group-hover:scale-125 group-hover:rotate-12 pointer-events-none">
                     <Icon size={140} />
                  </div>
                  
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center border border-gs-border bg-gs-bg shadow-inner transition-all duration-500 group-hover:border-current group-hover:shadow-[0_0_20px_currentColor] group-hover:bg-opacity-20 ${s.color}`}>
                      <Icon size={26} className="group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <span className="text-4xl lg:text-5xl font-black font-heading text-gs-text-main drop-shadow-sm tracking-tight">{s.value}</span>
                  </div>
                  <p className="text-gs-text-muted font-bold text-[13px] uppercase tracking-widest group-hover:text-gs-text-main transition-colors duration-300 relative z-10">
                    {s.label}
                  </p>
                </div>
             </div>
          );
        })}
      </div>

      {/* Skill Tree */}
      <div className="bg-gs-card border border-gs-border rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group/tree mt-10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        <div className={`absolute inset-0 opacity-[0.02] group-hover/tree:opacity-[0.06] pointer-events-none transition-opacity duration-1000 bg-gradient-to-tr from-${faction.color.split('-')[2] || 'cyan-500'} to-transparent`} />
        
        {/* Dynamic Glowing Mesh Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
           <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-gs-primary)]/15 blur-[120px] rounded-full opacity-0 group-hover/tree:opacity-100 transition-opacity duration-1000`} />
        </div>

        <h2 className="text-3xl font-black mb-8 flex items-center gap-3 relative z-10 tracking-tight text-gs-text-main drop-shadow-sm">
          <Sparkles className={`w-8 h-8 ${faction.color}`} /> 
          Skill Tree Synergy
        </h2>
        
        <div className="relative h-80 flex items-center justify-center rounded-3xl border border-gs-border/40 bg-gs-bg/40 backdrop-blur-md mt-6 p-4 shadow-[inset_0_2px_15px_rgba(0,0,0,0.2)] overflow-hidden">
          {/* Grid Background Pattern */}
          <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

          {/* SVG Animated Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_8px_currentColor]" style={{ zIndex: 0 }}>
            <defs>
               <linearGradient id="laserGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-gs-primary)" stopOpacity="0" />
                  <stop offset="50%" stopColor="var(--color-gs-primary)" stopOpacity="1" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
               </linearGradient>
            </defs>

            {/* Base Lines */}
            <line x1="50%" y1="28%" x2="32%" y2="72%" stroke="currentColor" className="text-gs-border group-hover/tree:text-[var(--color-gs-primary)]/50 transition-colors duration-1000" strokeWidth="2.5" strokeDasharray="6 6" strokeLinecap="round" />
            <line x1="50%" y1="28%" x2="50%" y2="72%" stroke="currentColor" className="text-gs-border group-hover/tree:text-[var(--color-gs-primary)]/50 transition-colors duration-1000" strokeWidth="2.5" strokeDasharray="6 6" strokeLinecap="round" />
            <line x1="50%" y1="28%" x2="68%" y2="72%" stroke="currentColor" className="text-gs-border group-hover/tree:text-[var(--color-gs-primary)]/50 transition-colors duration-1000" strokeWidth="2.5" strokeDasharray="6 6" strokeLinecap="round" />
            
            {/* Animated Laser Pulses (Fake Dash with Pulse) */}
            <line x1="50%" y1="28%" x2="32%" y2="72%" stroke="url(#laserGradient)" strokeWidth="3" className="opacity-0 group-hover/tree:opacity-100 transition-opacity duration-700 animate-pulse" strokeLinecap="round" />
            <line x1="50%" y1="28%" x2="50%" y2="72%" stroke="url(#laserGradient)" strokeWidth="3" className="opacity-0 group-hover/tree:opacity-100 transition-opacity duration-[1500ms] animate-pulse" strokeLinecap="round" />
            <line x1="50%" y1="28%" x2="68%" y2="72%" stroke="url(#laserGradient)" strokeWidth="3" className="opacity-0 group-hover/tree:opacity-100 transition-opacity duration-[2000ms] animate-pulse" strokeLinecap="round" />
          </svg>
          
          {/* Core Node */}
          <div className={`absolute top-[16%] left-1/2 -translate-x-1/2 z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-[2rem] rotate-45 flex flex-col items-center justify-center border-2 border-gs-border bg-gs-card shadow-[0_10px_30px_rgba(0,0,0,0.08)] group-hover/tree:border-[var(--color-gs-primary)] group-hover/tree:shadow-[0_0_35px_rgba(0,212,255,0.35)] ${faction.color} transition-all duration-700 backdrop-blur-xl`}>
            <div className="-rotate-45 flex flex-col items-center">
               <span className="text-4xl mb-1.5 drop-shadow-lg scale-110">{user.avatar}</span>
               <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gs-text-main px-2.5 py-1 rounded-full bg-gs-bg border border-gs-border shadow-inner">Lvl 3</span>
            </div>
          </div>
          
          {/* Branch Nodes */}
          {user.skills && (user.skills as string[]).slice(0, 3).map((skill: string, i: number) => {
            const positions = ['left-[32%]', 'left-[50%]', 'left-[68%]'];
            return (
              <div key={skill} className={`absolute bottom-[16%] -translate-x-1/2 z-10 w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-[1.5rem] flex items-center justify-center border border-gs-border bg-gs-card hover:border-[var(--color-gs-primary)] hover:shadow-[0_0_25px_rgba(0,212,255,0.4)] shadow-[0_5px_20px_rgba(0,0,0,0.06)] transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group/node ${positions[i % 3]}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-gs-primary)]/10 to-transparent opacity-0 group-hover/node:opacity-100 rounded-[calc(1.5rem-2px)] transition-opacity duration-300 pointer-events-none" />
                <span className="text-xs sm:text-sm font-black text-center px-2 text-gs-text-main group-hover/node:text-[var(--color-gs-primary)] transition-colors relative z-10 drop-shadow-sm line-clamp-2">{skill}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
