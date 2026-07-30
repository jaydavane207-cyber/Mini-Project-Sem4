'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, Wifi, WifiOff, Activity } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import supabase from '../lib/supabase';

// ─────────────────────────────────────────────────────────────
// XP award config — must match xp_system_migration.sql
// ─────────────────────────────────────────────────────────────
export const XP_VALUES = {
  '1st': 500,
  '2nd': 300,
  '3rd': 150,
  'participant': 50,
};

// ─────────────────────────────────────────────────────────────
// useCountUp – smooth number count-up animation
// ─────────────────────────────────────────────────────────────
function useCountUp(target, duration = 1000) {
  const [value, setValue] = useState(target);
  const animRef = useRef(null);
  const prevRef = useRef(target);

  useEffect(() => {
    if (prevRef.current === target) return;
    const start = prevRef.current;
    const startTime = performance.now();
    prevRef.current = target;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const p = Math.min((now - startTime) / duration, 1);
      setValue(Math.round(start + (target - start) * ease(p)));
      if (p < 1) animRef.current = requestAnimationFrame(tick);
    };
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [target, duration]);

  return value;
}

// ─────────────────────────────────────────────────────────────
// FactionCard
// ─────────────────────────────────────────────────────────────
function FactionCard({ faction, idx, maxXP, onXPIncrease }) {
  const { key, name, icon: FactionIcon, color, totalXP, topUsers } = faction;
  const isRank1 = idx === 0;
  const animatedXP = useCountUp(totalXP, 1000);
  const progressPct = maxXP > 0 ? (animatedXP / maxXP) * 100 : 0;
  const [isPulsing, setIsPulsing] = useState(false);
  const prevXPRef = useRef(totalXP);

  useEffect(() => {
    if (totalXP > prevXPRef.current) {
      setIsPulsing(true);
      onXPIncrease?.(key, totalXP - prevXPRef.current);
      const t = setTimeout(() => setIsPulsing(false), 900);
      prevXPRef.current = totalXP;
      return () => clearTimeout(t);
    }
    prevXPRef.current = totalXP;
  }, [totalXP, key, onXPIncrease]);

  return (
    <div
      className={`group relative rounded-[2.5rem] p-px overflow-hidden cursor-default transition-all duration-500
        shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:-translate-y-2`}
      style={{
        transform: isPulsing ? 'scale(1.025)' : 'scale(1)',
        transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.5s ease',
      }}
    >
      {/* Gradient border */}
      <div className={`absolute inset-0 bg-gradient-to-br from-gs-border via-transparent to-gs-border opacity-50
        group-hover:opacity-100 transition-all duration-700
        ${isRank1 ? 'group-hover:from-gs-primary group-hover:via-gs-secondary group-hover:to-gs-primary'
          : 'group-hover:from-gs-primary/40 group-hover:to-gs-secondary/40'}`}
      />

      {/* XP pulse flash */}
      {isPulsing && (
        <div className="absolute inset-0 rounded-[2.5rem] pointer-events-none z-20"
          style={{ background: 'radial-gradient(ellipse at center, rgba(0,240,255,0.18) 0%, transparent 70%)', animation: 'xp-pulse-flash 0.9s ease-out forwards' }}
        />
      )}

      <div className="relative h-full bg-gs-card rounded-[calc(2.5rem-1px)] border border-gs-border p-6 md:p-8 backdrop-blur-xl flex flex-col shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden">
        <div className={`absolute -top-10 -right-10 w-64 h-64 opacity-[0.05] group-hover:opacity-[0.1] rounded-full blur-[100px] pointer-events-none transition-all duration-700 ${isRank1 ? 'bg-gs-primary scale-150' : 'bg-gs-text-muted'}`} />
        <div className="absolute right-0 top-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500 rotate-12 scale-150 pointer-events-none">
          <FactionIcon size={180} />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-5 mb-8">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border border-gs-border bg-gs-bg shadow-inner transition-all duration-500 group-hover:border-current group-hover:shadow-[0_0_20px_currentColor] ${color}`}>
              <FactionIcon size={32} className="group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black font-heading text-gs-text-main tracking-tight">{name}</h2>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border
                  ${isRank1 ? 'bg-gs-primary/20 border-gs-primary text-gs-primary shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'bg-gs-bg border-gs-border text-gs-text-muted'}`}>
                  Rank #{idx + 1}
                </span>
                {isRank1 && <Trophy size={14} className="text-gs-primary animate-pulse" />}
              </div>
            </div>
            {/* Live XP counter */}
            <div className="ml-auto text-right">
              <div className={`text-3xl font-black font-heading tracking-tight transition-colors duration-300 ${isPulsing ? 'text-gs-primary drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]' : 'text-gs-text-main'}`}>
                {animatedXP.toLocaleString()}
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gs-text-muted">Total XP</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gs-bg/60 h-3 rounded-full mb-10 overflow-hidden border border-gs-border/50 relative shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gs-primary to-gs-secondary relative"
              style={{
                width: `${progressPct}%`,
                transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
                boxShadow: isPulsing ? '0 0 20px rgba(0,240,255,0.8)' : '0 0 6px rgba(0,240,255,0.3)',
              }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          {/* Top contributors */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gs-text-muted mb-4 opacity-70">Top Contributors</h3>
            <div className="grid gap-3">
              {topUsers.length === 0 ? (
                <p className="text-xs text-gs-text-muted opacity-50 text-center py-4">No XP earned yet — be the first!</p>
              ) : topUsers.map((u, i) => {
                const badge = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
                return (
                  <div key={u.id || i} className="flex items-center gap-4 bg-gs-bg/40 border border-gs-border rounded-[1.25rem] p-4 hover:bg-gs-bg/60 hover:border-gs-primary/50 transition-all duration-300">
                    <span className="text-2xl w-8 text-center">{badge}</span>
                    <div className="w-11 h-11 rounded-full border border-gs-border bg-gs-card flex items-center justify-center text-xl shadow-inner">
                      {u.avatar || '👤'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gs-text-main truncate tracking-tight">{u.name || 'Anonymous'}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gs-text-muted opacity-60">
                        {u.faction ? `The ${u.faction.charAt(0).toUpperCase() + u.faction.slice(1)}` : 'Member'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-gs-primary tracking-tight">{(u.xp || 0).toLocaleString()}</span>
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
}

// ─────────────────────────────────────────────────────────────
// LiveTicker — fed by real activity_logs from Supabase
// ─────────────────────────────────────────────────────────────
function LiveTicker({ events }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const intervalRef = useRef(null);

  const typeColors = { xp: 'text-[#00ff88]', rank: 'text-[#00f0ff]', achievement: 'text-[#f59e0b]' };
  const typeDots   = { xp: 'bg-[#00ff88]',   rank: 'bg-[#00f0ff]',   achievement: 'bg-[#f59e0b]' };

  useEffect(() => {
    if (events.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setActiveIdx(p => (p + 1) % events.length); setVisible(true); }, 400);
    }, 4500);
    return () => clearInterval(intervalRef.current);
  }, [events.length]);

  const current = events[activeIdx] ?? events[0];
  if (!current) return null;

  return (
    <div className="relative z-10 flex items-center gap-3 rounded-2xl border border-gs-border overflow-hidden"
      style={{ background: 'linear-gradient(135deg,rgba(0,20,30,.85),rgba(10,10,25,.9))', backdropFilter: 'blur(12px)', boxShadow: '0 0 30px rgba(0,240,255,.06),inset 0 1px 0 rgba(255,255,255,.04)' }}>
      {/* LIVE label */}
      <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 border-r border-gs-border/60" style={{ background: 'rgba(0,240,255,.05)' }}>
        <Activity size={14} className="text-gs-primary animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-[.2em] text-gs-primary whitespace-nowrap">Live</span>
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${typeDots[current.type] || 'bg-gs-primary'}`} />
      </div>
      {/* Scrolling message */}
      <div className="flex-1 overflow-hidden px-4 py-3">
        <div key={activeIdx} className={`text-sm font-semibold tracking-tight ${typeColors[current.type] || 'text-gs-primary'}`}
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-8px)', transition: 'opacity .4s ease, transform .4s ease' }}>
          {current.message}
        </div>
      </div>
      {/* Timestamp + dots */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-l border-gs-border/60">
        <span className="text-[10px] text-gs-text-muted font-mono whitespace-nowrap">
          {current.created_at ? new Date(current.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
        </span>
        <div className="flex gap-1">
          {events.slice(0, 8).map((_, i) => (
            <button key={i} onClick={() => { setVisible(false); setTimeout(() => { setActiveIdx(i); setVisible(true); }, 200); }}
              className={`h-1 rounded-full transition-all duration-300 ${i === activeIdx ? 'w-3 bg-gs-primary' : 'w-1 bg-gs-text-muted/40'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Connection badge
// ─────────────────────────────────────────────────────────────
function ConnectionBadge({ status }) {
  const map = {
    SUBSCRIBED:    { label: 'Live',         Icon: Wifi,    cls: 'text-[#00ff88] border-[#00ff88]/40 bg-[#00ff88]/10', dot: 'bg-[#00ff88]' },
    CONNECTING:    { label: 'Connecting…',  Icon: Wifi,    cls: 'text-[#f59e0b] border-[#f59e0b]/40 bg-[#f59e0b]/10', dot: 'bg-[#f59e0b]' },
    CLOSED:        { label: 'Offline',      Icon: WifiOff, cls: 'text-red-400 border-red-400/40 bg-red-400/10',       dot: 'bg-red-400' },
    CHANNEL_ERROR: { label: 'Error',        Icon: WifiOff, cls: 'text-red-400 border-red-400/40 bg-red-400/10',       dot: 'bg-red-400' },
  };
  const cfg = map[status] ?? map['CONNECTING'];
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-widest ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${cfg.dot}`} />
      <cfg.Icon size={13} />
      {cfg.label}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Leaderboard
// ─────────────────────────────────────────────────────────────
export default function Leaderboard() {
  const { factions } = useAppContext();

  const [factionScores, setFactionScores] = useState([]);
  const [realtimeStatus, setRealtimeStatus] = useState('CONNECTING');
  const [tickerEvents, setTickerEvents] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const channelRef = useRef(null);

  // ── Fetch real leaderboard data from DB ─────────────────────
  const fetchLeaderboard = useCallback(async () => {
    setDataLoading(true);
    // Fetch all profiles with XP, ordered descending
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, name, avatar, faction, xp')
      .order('xp', { ascending: false });

    if (error) { console.error('Leaderboard fetch error:', error); setDataLoading(false); return; }

    // Group by faction
    const grouped = {};
    Object.keys(factions).forEach(fKey => { grouped[fKey] = []; });

    (profiles || []).forEach(p => {
      if (p.faction && grouped[p.faction]) {
        grouped[p.faction].push(p);
      }
    });

    // Build faction score objects
    const scores = Object.keys(factions).map(fKey => {
      const members = grouped[fKey];
      const totalXP = members.reduce((sum, m) => sum + (m.xp || 0), 0);
      const topUsers = members.slice(0, 3); // already sorted desc by DB
      return { key: fKey, ...factions[fKey], totalXP, topUsers };
    }).sort((a, b) => b.totalXP - a.totalXP);

    setFactionScores(scores);
    setDataLoading(false);
  }, [factions]);

  // ── Fetch recent activity logs ──────────────────────────────
  const fetchActivity = useCallback(async () => {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    if (!error && data) setTickerEvents(data);
  }, []);

  useEffect(() => {
    fetchLeaderboard();
    fetchActivity();
  }, [fetchLeaderboard, fetchActivity]);

  const maxXP = Math.max(...factionScores.map(f => f.totalXP), 1);

  // ── Supabase Realtime ───────────────────────────────────────
  useEffect(() => {
    setRealtimeStatus('CONNECTING');

    const channel = supabase
      .channel('leaderboard-xp-realtime')
      // When a profile's XP changes (trigger updates it)
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles' },
        (payload) => {
          const updated = payload.new;
          setFactionScores(prev =>
            prev.map(faction => {
              if (faction.key !== updated.faction) return faction;
              // Recalculate total XP for this faction
              const newTopUsers = faction.topUsers.map(u =>
                u.id === updated.id ? { ...u, xp: updated.xp } : u
              );
              // If user wasn't in top 3 but should be now, re-sort
              const isTracked = newTopUsers.some(u => u.id === updated.id);
              const allMembers = isTracked ? newTopUsers : [...newTopUsers, updated];
              const sorted = allMembers.sort((a, b) => (b.xp || 0) - (a.xp || 0));
              const top3 = sorted.slice(0, 3);
              const newTotalXP = faction.totalXP + ((updated.xp || 0) - (payload.old?.xp || 0));
              return { ...faction, topUsers: top3, totalXP: Math.max(newTotalXP, 0) };
            }).sort((a, b) => b.totalXP - a.totalXP)
          );
        }
      )
      // When a new activity log is created by the DB trigger
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activity_logs' },
        (payload) => {
          setTickerEvents(prev => [payload.new, ...prev].slice(0, 10));
        }
      )
      // When a new event result is awarded (for instant UI feedback)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'event_results' },
        () => {
          // Re-fetch to get accurate faction totals
          fetchLeaderboard();
        }
      )
      .subscribe(setRealtimeStatus);

    channelRef.current = channel;
    return () => { if (channelRef.current) { supabase.removeChannel(channelRef.current); channelRef.current = null; } };
  }, [fetchLeaderboard]);

  // ── XP increase → inject ticker event ──────────────────────
  const handleXPIncrease = useCallback((factionKey, delta) => {
    const faction = factionScores.find(f => f.key === factionKey);
    if (!faction) return;
    setTickerEvents(prev => [{
      id: Date.now(),
      message: `⚡ ${faction.name} gained +${delta.toLocaleString()} XP! Rankings are shifting…`,
      type: 'rank',
      created_at: new Date().toISOString(),
    }, ...prev].slice(0, 10));
  }, [factionScores]);

  return (
    <>
      <style>{`@keyframes xp-pulse-flash { 0%{opacity:.9} 50%{opacity:.5} 100%{opacity:0} }`}</style>

      <div className="space-y-8 animate-page-load">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black font-heading text-gs-text-main tracking-tight drop-shadow-sm">
              Campus Leaderboard
            </h1>
            <p className="text-gs-text-muted mt-2 text-lg font-medium">Compete for glory. Which faction will rise?</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <ConnectionBadge status={realtimeStatus} />
            <div className="flex items-center gap-2 px-6 py-3 bg-gs-card border border-gs-border rounded-2xl text-gs-primary font-black uppercase tracking-widest text-sm shadow-inner shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              <Trophy size={20} className="drop-shadow-[0_0_8px_currentColor]" />
              Season resets in 14 days
            </div>
          </div>
        </div>

        {/* Live Ticker */}
        {tickerEvents.length > 0 && <LiveTicker events={tickerEvents} />}

        {/* Skeleton / Cards */}
        {dataLoading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-72 rounded-[2.5rem] bg-gs-card border border-gs-border animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 relative z-10">
            {factionScores.map((f, idx) => (
              <FactionCard key={f.key} faction={f} idx={idx} maxXP={maxXP} onXPIncrease={handleXPIncrease} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
