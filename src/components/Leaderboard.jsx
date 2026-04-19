'use client'
import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Leaderboard() {
  const { factions, students } = useAppContext();

  // Generate mock XP data on the fly based on factions
  const factionScores = Object.keys(factions).map(fKey => {
    const fStudents = students.filter(s => s.faction === fKey);
    const [randNum] = useState(() => Math.random());
    // Assign random high XP to top 3 and calc total
    const topUsers = [...fStudents, ...fStudents].slice(0, 3).map((s, i) => ({
      ...s,
      xp: Math.floor(Math.random() * 5000) + (3 - i) * 2000
    })).sort((a, b) => b.xp - a.xp);
    
    const totalXP = topUsers.reduce((sum, u) => sum + u.xp, Math.floor(randNum * 20000) + 10000);
    
    return {
      key: fKey,
      ...factions[fKey],
      totalXP,
      topUsers
    };
  }).sort((a, b) => b.totalXP - a.totalXP);

  const maxXP = Math.max(...factionScores.map(f => f.totalXP));

  return (
    <div className="space-y-8 animate-page-load">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold font-heading text-white">Campus Leaderboard</h1>
          <p className="text-[var(--color-gs-text-muted)] mt-2">Compete for glory. Which faction will rise?</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg text-[#00f0ff] font-bold shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <Trophy size={20} /> Season resets in 14 days
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {factionScores.map((f, idx) => {
          const FactionIcon = f.icon;
          const progressPct = (f.totalXP / maxXP) * 100;
          
          const isRank1 = idx === 0;

          return (
            <div key={f.key} className={`relative rounded-3xl transition-transform duration-500 hover:-translate-y-2 group ${isRank1 ? 'p-[2px] shadow-[0_0_40px_rgba(0,240,255,0.2)]' : ''}`}>
              {/* Spinning Border Wrapper for Rank 1 */}
              {isRank1 && (
                <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                  <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_70%,#00f0ff_80%,#a855f7_100%)] animate-[spin_3s_linear_infinite]" />
                </div>
              )}
              
              <div className={`glass-card p-6 h-full w-full rounded-[23px] relative overflow-hidden flex flex-col z-10 ${isRank1 ? 'bg-[#050810]/95 backdrop-blur-[40px]' : ''}`}>
               {/* Faction Background Logo */}
               <div className="absolute -right-6 -top-6 opacity-[0.05] pointer-events-none scale-150 text-white mix-blend-overlay">
                 <FactionIcon size={160} />
               </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center border border-white/20 bg-white/5 text-white shadow-[0_0_15px_currentColor]">
                    <FactionIcon size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-heading text-white shadow-black drop-shadow-md">{f.name}</h2>
                    <p className={`text-sm font-bold ${isRank1 ? 'text-[#00f0ff] uppercase tracking-widest text-glow-cyan' : 'text-[#a855f7]'}`}>Rank #{idx + 1}</p>
                  </div>
                  <div className="ml-auto text-3xl font-bold font-heading text-white">
                    {f.totalXP.toLocaleString()} <span className="text-lg text-[var(--color-gs-text-muted)]">XP</span>
                  </div>
                </div>

                {/* Animated XP Bar */}
                <div className="w-full bg-black/40 h-3 rounded-full mb-8 overflow-hidden border border-white/5 relative">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-[#00f0ff] to-[#a855f7] shadow-[0_0_10px_#00f0ff] relative overflow-hidden group-hover:scale-y-[1.1] transform origin-left" 
                    style={{ width: `${progressPct}%` }}
                  >
                    <div className="absolute inset-0 w-[200%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-[pulse-ring_2s_infinite]" />
                  </div>
                </div>

                {/* Top Users */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-[var(--color-gs-text-muted)] uppercase tracking-wider mb-3">Top Contributors</h3>
                  {f.topUsers.map((u, i) => {
                    const badge = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
                    return (
                      <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 hover:border-[#00f0ff] transition-colors cursor-pointer text-white">
                        <span className="text-2xl w-8 text-center drop-shadow-lg">{badge}</span>
                        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-lg bg-black/20 shadow-inner">
                          {u.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate group-hover:text-[#00f0ff] transition-colors">{u.name}</p>
                        </div>
                        <span className="font-bold text-[#00f0ff]">{u.xp.toLocaleString()} XP</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
