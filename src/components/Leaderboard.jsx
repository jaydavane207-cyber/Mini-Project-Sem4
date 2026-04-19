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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black font-heading text-gs-text-main tracking-tight drop-shadow-sm flex items-center gap-3">
            Campus Leaderboard
          </h1>
          <p className="text-gs-text-muted mt-2 text-lg font-medium">Compete for glory. Which faction will rise?</p>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 bg-gs-card border border-gs-border rounded-2xl text-gs-primary font-black uppercase tracking-widest text-sm shadow-inner shadow-[0_0_15px_rgba(0,240,255,0.1)]">
          <Trophy size={20} className="drop-shadow-[0_0_8px_currentColor]" /> Season resets in 14 days
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 relative z-10">
        {factionScores.map((f, idx) => {
          const FactionIcon = f.icon;
          const progressPct = (f.totalXP / maxXP) * 100;
          
          const isRank1 = idx === 0;

          return (
            <div key={f.key} className="group relative rounded-[2.5rem] p-px overflow-hidden cursor-default transition-all duration-500 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:-translate-y-2">
              {/* Gradient Border Base */}
              <div className={`absolute inset-0 bg-gradient-to-br from-gs-border via-transparent to-gs-border opacity-50 group-hover:opacity-100 transition-all duration-700 ${isRank1 ? 'group-hover:from-gs-primary group-hover:via-gs-secondary group-hover:to-gs-primary' : 'group-hover:from-gs-primary/40 group-hover:to-gs-secondary/40'}`} />
              
              <div className="relative h-full bg-gs-card rounded-[calc(2.5rem-1px)] border border-gs-border p-6 md:p-8 backdrop-blur-xl flex flex-col shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden">
                {/* Background Decorative Mesh */}
                <div className={`absolute -top-10 -right-10 w-64 h-64 opacity-[0.05] group-hover:opacity-[0.1] rounded-full blur-[100px] pointer-events-none transition-all duration-700 ${isRank1 ? 'bg-gs-primary scale-150' : 'bg-gs-text-muted'}`} />
                <div className="absolute right-0 top-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500 rotate-12 scale-150 pointer-events-none">
                  <FactionIcon size={180} />
                </div>
              
                <div className="relative z-10">
                  <div className="flex items-center gap-5 mb-8">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border border-gs-border bg-gs-bg shadow-inner transition-all duration-500 group-hover:border-current group-hover:shadow-[0_0_20px_currentColor] group-hover:bg-opacity-20 ${f.color}`}>
                      <FactionIcon size={32} className="group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black font-heading text-gs-text-main tracking-tight line-clamp-1">{f.name}</h2>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${isRank1 ? 'bg-gs-primary/20 border-gs-primary text-gs-primary shadow-[0_0_10px_rgba(0,240,255,0.2)]' : 'bg-gs-bg border-gs-border text-gs-text-muted'}`}>
                          Rank #{idx + 1}
                        </span>
                        {isRank1 && <Trophy size={14} className="text-gs-primary animate-pulse" />}
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-3xl font-black font-heading text-gs-text-main tracking-tight">{f.totalXP.toLocaleString()}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-gs-text-muted">Total XP</div>
                    </div>
                  </div>

                  {/* Animated XP Bar */}
                  <div className="w-full bg-gs-bg/60 h-3 rounded-full mb-10 overflow-hidden border border-gs-border/50 relative shadow-inner">
                    <div 
                      className="h-full rounded-full transition-all duration-[1.5s] ease-out bg-gradient-to-r from-gs-primary to-gs-secondary relative" 
                      style={{ width: `${progressPct}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
                      <div className="absolute inset-0 shadow-[0_0_15px_currentColor]" />
                    </div>
                  </div>

                  {/* Top Users */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gs-text-muted mb-4 opacity-70">Top Vanguard Contributors</h3>
                    <div className="grid gap-3">
                      {f.topUsers.map((u, i) => {
                        const badge = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
                        return (
                          <div key={i} className="flex items-center gap-4 bg-gs-bg/40 border border-gs-border rounded-[1.25rem] p-4 hover:bg-gs-bg/60 hover:border-gs-primary/50 transition-all duration-300 group/user cursor-pointer">
                            <span className="text-2xl w-8 text-center drop-shadow-lg group-hover/user:scale-110 transition-transform">{badge}</span>
                            <div className="w-11 h-11 rounded-full border border-gs-border bg-gs-card flex items-center justify-center text-xl shadow-inner group-hover/user:border-gs-primary/30 transition-colors">
                              {u.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gs-text-main truncate tracking-tight">{u.name}</p>
                              <p className="text-[10px] font-black uppercase tracking-widest text-gs-text-muted opacity-60">Field Agent</p>
                            </div>
                            <div className="text-right">
                              <span className="font-black text-gs-primary tracking-tight">{u.xp.toLocaleString()}</span>
                              <span className="text-[9px] font-black text-gs-text-muted ml-1 uppercase">XP</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
