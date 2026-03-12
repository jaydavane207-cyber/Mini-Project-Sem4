import React, { useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import insforge from '../lib/insforge';

export default function AISuggestions() {
  const { user, groups, factions } = useAppContext();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMatches = async () => {
    setLoading(true);
    setError('');
    
    try {
      const prompt = `You are an AI matching agent for a college collaboration platform.
Student Profile:
- Name: ${user.name}
- Skills: ${user.skills.join(', ')}
- Interests: ${user.interests.join(', ')}
- Faction: ${user.faction}

Available Groups:
${groups.map(g => `- ${g.name} (ID: ${g.id}): ${g.description}. Skills needed: ${g.skills.join(', ')}`).join('\n')}

Return exactly 3 group recommendations. Format the response as PURE JSON matching this schema, nothing else:
[{"groupId": number, "groupName": string, "score": number, "reason": "1-sentence reason"}]`;

      const completion = await insforge.ai.chat.completions.create({
        model: 'anthropic/claude-3.5-haiku',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2
      });

      const content = completion.choices[0].message.content;
      // Clean content if model includes markdown braces
      const jsonStr = content.substring(content.indexOf('['), content.lastIndexOf(']') + 1);
      const parsedMatches = JSON.parse(jsonStr);
      setMatches(parsedMatches);
    } catch (err) {
      console.error('AI Matching failed:', err);
      setError('Failed to analyze matches. Please try again.');
      // generateMockMatches removed to ensure we use real AI
    } finally {
      setLoading(false);
    }
  };

  const getOverlapScore = (group) => {
    const overlap = group.skills.filter(s => user.skills.includes(s)).length;
    return Math.min(100, (overlap / Math.max(1, group.skills.length)) * 100);
  };

  const FactionIcon = factions[user.faction]?.icon || Bot;

  return (
    <div className="space-y-8 animate-[slideIn_0.3s_ease-out]">
      {/* Banner */}
      <div className={"bg-[var(--color-gs-card)] border-2 rounded-3xl p-8 relative overflow-hidden " + factions[user.faction]?.border}>
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none scale-150 -translate-y-1/4 translate-x-1/4">
          <FactionIcon size={300} className={factions[user.faction]?.color} />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bot className="text-[var(--color-gs-cyan)]" size={32} /> AI Matchmaker
          </h1>
          <p className="mt-2 text-[var(--color-gs-text-muted)] max-w-2xl">
            We use Claude 4 to analyze your profile ({user.skills.length} skills, {user.interests.length} interests) and find the perfect team dynamics.
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
        <div className="py-20 flex flex-col items-center justify-center text-[var(--color-gs-cyan)] space-y-4">
          <div className="w-16 h-16 border-4 border-[var(--color-gs-bg)] border-t-[var(--color-gs-cyan)] rounded-full animate-spin shadow-[0_0_20px_rgba(0,212,255,0.5)]" />
          <p className="font-bold animate-pulse">Running neural heuristics...</p>
        </div>
      ) : matches.length > 0 ? (
        <div className="space-y-6 animate-[slideIn_0.3s_ease-out]">
          <h2 className="text-2xl font-bold">Top Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {matches.map((m, i) => (
              <div key={i} className={"bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform bg-gradient-to-b from-transparent to-[var(--color-gs-bg)]"}>
                <div className={"absolute top-0 left-0 w-full h-1 " + factions[user.faction]?.bg} />
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-xl">{m.groupName}</h3>
                  <div className={"w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg bg-[var(--color-gs-bg)] border-2 shadow-[0_0_15px_currentColor] " + factions[user.faction]?.color + " " + factions[user.faction]?.border}>
                    {m.score}%
                  </div>
                </div>
                <p className="text-sm text-[var(--color-gs-text-muted)] italic">"{m.reason}"</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Skill Match View */}
      <div className="bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-3xl p-8">
        <h2 className="text-xl font-bold mb-6">All Groups: Skill Overlap</h2>
        <div className="space-y-6">
          {groups.map(group => {
            const overlap = getOverlapScore(group);
            return (
              <div key={group.id}>
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">{group.name}</p>
                  <p className="text-sm text-[var(--color-gs-cyan)] font-bold">{Math.round(overlap)}% Match</p>
                </div>
                <div className="w-full h-2 bg-[var(--color-gs-border)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[var(--color-gs-cyan)] shadow-[0_0_10px_rgba(0,212,255,0.6)]" 
                    style={{ width: overlap + '%' }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
