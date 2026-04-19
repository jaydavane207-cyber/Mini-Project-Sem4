import React, { useState, useEffect, useRef } from 'react';
import { Users, Target, Zap, Bot, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

function AnimatedCounter({ value }) {
  const [count, setCount] = useState(0);
  const target = parseInt(value, 10);
  
  useEffect(() => {
    if (isNaN(target)) return;
    let startTimestamp = null;
    const duration = 1500;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    window.requestAnimationFrame(step);
  }, [target]);
  
  return isNaN(target) ? value : count;
}

export default function Dashboard() {
  const { user, students, factions, stats: liveStats } = useAppContext();
  if (!user) return null;
  const f = factions[user.faction];

  const stats = [
    { label: 'Active Groups', value: (liveStats?.activeGroups ?? 0).toString(), icon: Users, color: 'text-[#00f0ff]', bgHover: 'group-hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]', borderLeft: 'border-l-[#00f0ff]' },
    { label: 'Open Hackathons', value: (liveStats?.openHackathons ?? 0).toString(), icon: Target, color: 'text-[#a855f7]', bgHover: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]', borderLeft: 'border-l-[#a855f7]' },
    { label: 'Members Online', value: (liveStats?.onlineMembers ?? 0).toString(), icon: Zap, color: 'text-[#ec4899]', bgHover: 'group-hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]', borderLeft: 'border-l-[#ec4899]' },
    { label: 'AI Matches', value: (liveStats?.aiMatches ?? 0).toString(), icon: Bot, color: 'text-[#f59e0b]', bgHover: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]', borderLeft: 'border-l-[#f59e0b]' },
  ];

  return (
    <div className="space-y-8 animate-page-load">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-heading text-white">Welcome back, {user.name}</h1>
        <p className="text-[var(--color-gs-text-muted)] mt-2">Here is what's happening on campus today.</p>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`glass-card p-6 border-l-4 ${s.borderLeft} transition-all duration-300 hover:-translate-y-2 relative overflow-hidden group hover:border-y-white/20 hover:border-r-white/20 ${s.bgHover}`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-white/5 ${s.color}`}>
                  <Icon size={24} />
                </div>
                <span className="text-3xl font-bold font-heading text-white">
                  <AnimatedCounter value={s.value} />
                </span>
              </div>
              <p className="text-[var(--color-gs-text-muted)] font-medium">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Skill Tree */}
      <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 font-heading text-white">
          <Sparkles className="text-[var(--color-gs-primary)]" /> Your Skill Tree
        </h2>
        <div className="relative h-64 flex items-center justify-center">
          
          <style>{`
            @keyframes dash {
              to { stroke-dashoffset: -20; }
            }
          `}</style>
          
          {/* SVG Connecting Lines - Dashed Cyan Animation */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <line x1="50%" y1="20%" x2="25%" y2="80%" stroke="#00f0ff" strokeWidth="2" strokeDasharray="10 5" style={{ animation: 'dash 1s linear infinite' }} />
            <line x1="50%" y1="20%" x2="50%" y2="80%" stroke="#00f0ff" strokeWidth="2" strokeDasharray="10 5" style={{ animation: 'dash 1s linear infinite' }} />
            <line x1="50%" y1="20%" x2="75%" y2="80%" stroke="#00f0ff" strokeWidth="2" strokeDasharray="10 5" style={{ animation: 'dash 1s linear infinite' }} />
          </svg>
          
          {/* Core Node */}
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center border-2 border-[#00f0ff] bg-[#050810] shadow-[0_0_15px_#00f0ff] text-[#00f0ff]">
            {/* Pulsing ring behind node */}
            <div className="absolute inset-0 rounded-full border-2 border-[#00f0ff] opacity-0 animate-[pulse-ring_2s_infinite]" />
            <span className="text-2xl relative z-10">{user.avatar}</span>
            <span className="text-[10px] font-bold mt-1 text-white relative z-10">Lvl 3</span>
          </div>
          
          {/* Branch Nodes */}
          {(user.skills || []).slice(0, 3).map((skill, i) => {
            const positions = ['left-[25%]', 'left-[50%]', 'left-[75%]'];
            const delay = `${i * 0.5}s`;
            return (
              <div key={skill} className={`absolute bottom-[10%] -translate-x-1/2 z-10 w-16 h-16 rounded-full flex items-center justify-center border border-[#00f0ff]/50 bg-[#050810] transition-all cursor-crosshair text-white hover:text-[#a855f7] hover:border-[#a855f7] hover:shadow-[0_0_15px_#a855f7] ${positions[i % 3]}`}>
                <div className="absolute inset-0 rounded-full bg-[#00f0ff] opacity-10 animate-[pulse-ring_2s_infinite]" style={{ animationDelay: delay }} />
                <span className="text-xs font-bold text-center px-1 relative z-10">{skill}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
