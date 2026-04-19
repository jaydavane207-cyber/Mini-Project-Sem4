import React, { useState } from 'react';
import { Bot, Sparkles, ArrowRight, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function AISuggestions() {
  const { user, groups, factions, setSelectedGroupId } = useAppContext();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMatches = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Small artificial delay to simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Only score groups the user hasn't joined yet, that have open spots, and are real groups (not DMs/General)
      const openGroups = groups.filter(g => {
        const memberCount = g.memberIds?.length || g.members || 1;
        return g.type !== 'DM' &&
          g.type !== 'General' &&
          g.privacy !== 'private' && 
          memberCount < g.maxMembers && 
          !g.memberIds?.includes(user.id);
      });

      const scoredGroups = openGroups.map(g => {
        let score = 0;
        let reasons = [];

        // 1. Skill Match (highest weight — 50pts)
        const userSkills = user.skills || [];
        const skillOverlap = (g.skills || []).filter(s => userSkills.includes(s));
        if (skillOverlap.length > 0) {
          score += (skillOverlap.length / Math.max(1, g.skills.length)) * 50;
          reasons.push(`Skill overlap in ${skillOverlap.slice(0, 2).join(' & ')}`);
        }

        // 2. Interest Match (30pts)
        const userInterests = user.interests || [];
        const interestMatch = userInterests.some(i => 
          g.description?.toLowerCase().includes(i.toLowerCase()) ||
          g.event?.toLowerCase().includes(i.toLowerCase())
        );
        if (interestMatch) {
          score += 30;
          reasons.push('Matches your core interests');
        }

        // 3. Faction / Group Type alignment (20pts)
        const factionTypeMap = {
          innovators: 'Hackathon',
          architects: 'Technical',
          creators: 'Cultural',
          debuggers: 'Technical'
        };
        if (g.type === factionTypeMap[user.faction]) {
          score += 20;
          reasons.push(`Aligns with your ${user.faction} mindset`);
        }

        // Minimum score for diversity
        if (score === 0) score = Math.floor(Math.random() * 20) + 10;
        if (reasons.length === 0) reasons.push('Top pick based on campus trends');

        return {
          groupId: g.id,
          groupName: g.name,
          groupEvent: g.event,
          groupType: g.type,
          spotsLeft: g.maxMembers - (g.memberIds?.length || g.members || 1),
          score: Math.min(100, Math.round(score)),
          reason: reasons[0]
        };
      });

      const topMatches = scoredGroups
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
      
      if (topMatches.length === 0) {
        setError("You've already joined all open groups, or there are no groups available right now.");
      }

      setMatches(topMatches);
    } catch (err) {
      console.error('Matching failed:', err);
      setError('Recommendation service unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const getOverlapScore = (group) => {
    const userSkills = user.skills || [];
    const overlap = (group.skills || []).filter(s => userSkills.includes(s)).length;
    return Math.min(100, (overlap / Math.max(1, (group.skills || []).length)) * 100);
  };

  const handleViewGroup = (groupId) => {
    setSelectedGroupId(groupId);
    navigate(`/group/${groupId}`);
  };

  const FactionIcon = factions[user.faction]?.icon || Bot;
  const factionInfo = factions[user.faction];

  return (
    <div className="space-y-8 animate-[slideIn_0.3s_ease-out]">
      {/* Banner */}
      <div className={`bg-gs-card border-2 rounded-3xl p-8 relative overflow-hidden ${factionInfo?.border}`}>
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none scale-150 -translate-y-1/4 translate-x-1/4">
          <FactionIcon size={300} className={factionInfo?.color} />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bot className="text-gs-cyan" size={32} /> AI Matchmaker
          </h1>
          <p className="mt-2 text-gs-text-muted max-w-2xl">
            AI-powered analysis of your profile ({(user.skills || []).length} skills, {(user.interests || []).length} interests) to find the perfect team. Matches are ranked by skill overlap, interest alignment, and faction compatibility.
          </p>
          <button 
            onClick={fetchMatches} 
            disabled={loading}
            className="mt-6 px-8 py-3 bg-white text-[#0f172a] font-bold rounded-xl hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full" /> : <Sparkles size={20} />}
            {loading ? 'Analyzing...' : (matches.length > 0 ? 'Refresh Matches' : 'Get AI Matches')}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gs-cyan space-y-4">
          <div className="w-16 h-16 border-4 border-gs-bg border-t-gs-cyan rounded-full animate-spin shadow-[0_0_20px_rgba(0,212,255,0.5)]" />
          <p className="font-bold animate-pulse">Running neural heuristics...</p>
        </div>
      ) : error ? (
        <div className="py-10 text-center text-gs-text-muted bg-gs-card border border-gs-border rounded-2xl">
          <Bot size={32} className="mx-auto mb-3 opacity-40" />
          <p>{error}</p>
        </div>
      ) : matches.length > 0 ? (
        <div className="space-y-6 animate-[slideIn_0.3s_ease-out]">
          <h2 className="text-2xl font-bold">Top Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {matches.map((m, i) => (
              <div key={i} className={`bg-gs-card border border-gs-border rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform flex flex-col`}>
                <div className={`absolute top-0 left-0 w-full h-1 ${factionInfo?.bg}`} />
                
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0 pr-3">
                    <h3 className="font-bold text-lg leading-tight">{m.groupName}</h3>
                    <p className="text-xs text-gs-text-muted mt-1">{m.groupEvent} · {m.groupType}</p>
                  </div>
                  <div className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center font-bold text-sm bg-gs-bg border-2 shadow-[0_0_15px_currentColor] ${factionInfo?.color} ${factionInfo?.border}`}>
                    {m.score}%
                  </div>
                </div>

                <p className="text-sm text-gs-text-muted italic flex-1 mb-4">"{m.reason}"</p>

                <div className="flex justify-between items-center mt-auto">
                  <span className="text-xs text-gs-text-muted flex items-center gap-1">
                    <Users size={12} /> {m.spotsLeft} spot{m.spotsLeft !== 1 ? 's' : ''} left
                  </span>
                  <button
                    onClick={() => handleViewGroup(m.groupId)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all bg-gs-bg border border-gs-border hover:border-[var(--color-gs-cyan)] hover:text-[var(--color-gs-cyan)] ${factionInfo?.color}`}
                  >
                    View Group <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* All Groups Skill Match View */}
      <div className="mt-12 animate-[slideIn_0.3s_ease-out] delay-100 fill-mode-both">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Sparkles className="text-[var(--color-gs-primary)]" size={24} /> 
          Skill Overlap Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {groups.filter(g => g.type !== 'DM' && g.type !== 'General').map(group => {
            const overlap = getOverlapScore(group);
            return (
              <div 
                key={group.id} 
                className="bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-2xl p-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group dark:hover:shadow-[0_8px_30px_rgba(0,212,255,0.08)]" 
                onClick={() => handleViewGroup(group.id)}
              >
                <div className="flex items-start justify-between mb-4">
                   <div className="flex-1 pr-4">
                     <h3 className="font-bold text-[var(--color-gs-text-main)] group-hover:text-[var(--color-gs-primary)] transition-colors line-clamp-1">{group.name}</h3>
                     <p className="text-xs text-[var(--color-gs-text-muted)] mt-1 flex items-center gap-1">
                        <Users size={12} /> {group.memberIds?.length || group.members || 1}/{group.maxMembers} Members
                     </p>
                   </div>
                   
                   {/* Circular Progress Indicator */}
                   <div className="w-12 h-12 relative flex items-center justify-center shrink-0">
                      <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                        <path
                          className="text-[var(--color-gs-border)]"
                          fill="none"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={`${overlap > 50 ? 'text-[var(--color-gs-green)]' : overlap >= 20 ? 'text-[var(--color-gs-primary)]' : 'text-[#a855f7]'}`}
                          fill="none"
                          strokeDasharray={`${overlap + 0.1}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-[var(--color-gs-text-main)] drop-shadow-sm">
                         {Math.round(overlap)}%
                      </div>
                   </div>
                </div>

                {/* Skill Chips */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                   {(group.skills || []).slice(0, 3).map((skill, idx) => {
                      const hasSkill = (user.skills || []).includes(skill);
                      return (
                         <span key={idx} className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-full border font-medium ${hasSkill ? 'border-[var(--color-gs-primary)] bg-[var(--color-gs-primary)]/10 text-[var(--color-gs-primary)]' : 'border-[var(--color-gs-border)] text-[var(--color-gs-text-muted)] bg-[var(--color-gs-border)]/20'}`}>
                            {skill}
                         </span>
                      );
                   })}
                   {(group.skills || []).length > 3 && (
                      <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full border border-[var(--color-gs-border)] text-[var(--color-gs-text-muted)] bg-[var(--color-gs-border)]/20 font-medium">
                        +{(group.skills || []).length - 3}
                      </span>
                   )}
                   {(group.skills || []).length === 0 && (
                      <span className="text-xs italic text-[var(--color-gs-text-muted)]">No specific skills listed</span>
                   )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
