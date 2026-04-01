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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-gs-card border border-gs-border p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-gray-500 group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-gs-bg ${s.color} group-hover:animate-pulse-glow`}>
                  <Icon size={24} />
                </div>
                <span className="text-3xl font-bold">{s.value}</span>
              </div>
              <p className="text-gs-text-muted font-medium">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Skill Tree */}
      <div className="bg-gs-card border border-gs-border rounded-3xl p-8 relative overflow-hidden">
        <div className={`absolute inset-0 opacity-5 pointer-events-none ${faction.bg}`} />
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Sparkles className={faction.color} /> Your Skill Tree
        </h2>
        <div className="relative h-64 flex items-center justify-center">
          {/* SVG Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <line x1="50%" y1="20%" x2="25%" y2="80%" stroke="var(--color-gs-border)" strokeWidth="2" strokeDasharray="4" />
            <line x1="50%" y1="20%" x2="50%" y2="80%" stroke="var(--color-gs-border)" strokeWidth="2" strokeDasharray="4" />
            <line x1="50%" y1="20%" x2="75%" y2="80%" stroke="var(--color-gs-border)" strokeWidth="2" strokeDasharray="4" />
          </svg>
          
          {/* Core Node */}
          <div className={`absolute top-[10%] left-1/2 -translate-x-1/2 z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center border-2 bg-gs-card shadow-[0_0_15px_currentColor] ${faction.color} ${faction.border}`}>
            <span className="text-2xl">{user.avatar}</span>
            <span className="text-[10px] font-bold mt-1 text-gs-text-main">Lvl 3</span>
          </div>
          
          {/* Branch Nodes */}
          {user.skills && (user.skills as string[]).slice(0, 3).map((skill: string, i: number) => {
            const positions = ['left-[25%]', 'left-[50%]', 'left-[75%]'];
            return (
              <div key={skill} className={`absolute bottom-[10%] -translate-x-1/2 z-10 w-16 h-16 rounded-full flex items-center justify-center border-2 border-gs-border bg-gs-bg hover:border-gs-cyan hover:shadow-[0_0_10px_rgba(0,212,255,0.5)] transition-all cursor-crosshair ${positions[i % 3]}`}>
                <span className="text-xs font-bold text-center px-1">{skill}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
