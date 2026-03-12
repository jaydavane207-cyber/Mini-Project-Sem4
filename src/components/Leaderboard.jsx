import React from 'react';
import { Trophy } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Leaderboard() {
  const { factions, students } = useAppContext();

  // Generate mock XP data on the fly based on factions
  const factionScores = Object.keys(factions).map(fKey => {
    const fStudents = students.filter(s => s.faction === fKey);
    // Assign random high XP to top 3 and calc total
    const topUsers = [...fStudents, ...fStudents].slice(0, 3).map((s, i) => ({
      ...s,
      xp: Math.floor(Math.random() * 5000) + (3 - i) * 2000
    })).sort((a, b) => b.xp - a.xp);
    
    const totalXP = topUsers.reduce((sum, u) => sum + u.xp, Math.floor(Math.random() * 20000) + 10000);
    
    return {
      key: fKey,
      ...factions[fKey],
      totalXP,
      topUsers
    };
  }).sort((a, b) => b.totalXP - a.totalXP);

  const maxXP = Math.max(...factionScores.map(f => f.totalXP));

  return (
    <div className="space-y-8 animate-[slideIn_0.3s_ease-out]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold font-serif">Campus Leaderboard</h1>
          <p className="text-[var(--color-gs-text-muted)] mt-2">Compete for glory. Which faction will rise?</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-lg text-[var(--color-gs-cyan)] font-bold">
          <Trophy size={20} /> Season resets in 14 days
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {factionScores.map((f, idx) => {
          const FactionIcon = f.icon;
          const progressPct = (f.totalXP / maxXP) * 100;
          
          return (
            <div key={f.key} className={"bg-[var(--color-gs-card)] border-2 rounded-3xl p-6 relative overflow-hidden transition-transform hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] " + f.border}>
              <div className={"absolute -right-6 -top-6 opacity-10 pointer-events-none scale-150 " + f.color}>
                <FactionIcon size={160} />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className={"w-16 h-16 rounded-2xl flex items-center justify-center border-2 bg-[var(--color-gs-bg)] shadow-[0_0_15px_currentColor] " + f.color + " " + f.border}>
                    <FactionIcon size={32} />
                  </div>
                  <div>
                    <h2 className={"text-2xl font-bold " + f.color}>{f.name}</h2>
                    <p className="text-[var(--color-gs-text-muted)] font-medium">Rank #{idx + 1}</p>
                  </div>
                  <div className={"ml-auto text-3xl font-bold font-serif " + f.color}>
                    {f.totalXP.toLocaleString()} <span className="text-lg text-[var(--color-gs-text-muted)]">XP</span>
                  </div>
                </div>

                {/* Animated XP Bar */}
                <div className="w-full bg-[var(--color-gs-bg)] h-3 rounded-full mb-8 overflow-hidden shadow-inner border border-[var(--color-gs-border)]">
                  <div 
                    className={"h-full transition-all duration-1000 ease-out animate-[fill-bar_1s_ease-out] shadow-[0_0_10px_currentColor] " + f.bg.replace('bg-', 'bg-').split(' ')[0]} 
                    style={{ width: progressPct + '%', backgroundColor: "var(--color-gs-" + f.color.split('-').pop() + ")" }} 
                  />
                </div>

                {/* Top Users */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-[var(--color-gs-text-muted)] uppercase tracking-wider mb-2">Top Contributors</h3>
                  {f.topUsers.map((u, i) => {
                    const badge = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
                    return (
                      <div key={i} className="flex items-center gap-4 bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded-xl p-3 hover:border-gray-500 transition-colors">
                        <span className="text-2xl w-8 text-center drop-shadow-md">{badge}</span>
                        <div className={"w-10 h-10 rounded-full border flex items-center justify-center text-lg bg-[var(--color-gs-card)] " + f.border}>
                          {u.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[var(--color-gs-text-main)] truncate group-hover:text-[var(--color-gs-text-main)] transition-colors">{u.name}</p>
                        </div>
                        <span className={"font-bold " + f.color}>{u.xp.toLocaleString()} XP</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
