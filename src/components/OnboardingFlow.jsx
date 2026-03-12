import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ONBOARDING_SKILLS, ONBOARDING_INTERESTS, ONBOARDING_AVATARS, ONBOARDING_QUIZ, MOCK_FACTIONS } from '../data/mockData';

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({ name: '', college: '', year: '1st Year' });
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState(Array(6).fill(null));
  const [avatar, setAvatar] = useState('🤖');
  const [assignedFaction, setAssignedFaction] = useState(null);

  const handleNext = () => {
    if (step === 4) {
      // Calculate faction
      const counts = quizAnswers.reduce((acc, f) => {
        acc[f] = (acc[f] || 0) + 1;
        return acc;
      }, {});
      const topFaction = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
      setAssignedFaction(topFaction);
    }
    setStep(s => s + 1);
  };

  const toggleItem = (arr, setArr, item) => {
    if (arr.includes(item)) setArr(arr.filter(i => i !== item));
    else setArr([...arr, item]);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-[slideIn_0.3s_ease-out]">
            <h2 className="text-3xl font-bold">Who are you?</h2>
            <div>
              <label className="block text-sm text-[var(--color-gs-text-muted)] mb-2">Name</label>
              <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded-lg p-3 outline-none focus:border-[var(--color-gs-cyan)] transition-colors" placeholder="e.g. Alex" />
            </div>
            <div>
              <label className="block text-sm text-[var(--color-gs-text-muted)] mb-2">College</label>
              <input type="text" value={profile.college} onChange={e => setProfile({...profile, college: e.target.value})} className="w-full bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded-lg p-3 outline-none focus:border-[var(--color-gs-cyan)] transition-colors" placeholder="e.g. MIT" />
            </div>
            <div>
              <label className="block text-sm text-[var(--color-gs-text-muted)] mb-2">Academic Year</label>
              <div className="flex flex-wrap gap-2">
                {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Grad'].map(y => (
                  <button key={y} onClick={() => setProfile({...profile, year: y})} className={"px-4 py-2 rounded-full border transition-colors " + (profile.year === y ? "bg-[var(--color-gs-cyan)]/20 border-[var(--color-gs-cyan)] text-[var(--color-gs-cyan)]" : "bg-[var(--color-gs-bg)] border-[var(--color-gs-border)] text-[var(--color-gs-text-muted)] hover:border-gray-500")}>
                    {y}
                  </button>
                ))}
              </div>
            </div>
            <button disabled={!profile.name || !profile.college} onClick={handleNext} className="w-full py-3 mt-4 bg-[var(--color-gs-cyan)] text-[#0f172a] font-bold rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50">Next</button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-[slideIn_0.3s_ease-out]">
            <h2 className="text-3xl font-bold">Your Skills</h2>
            <p className="text-[var(--color-gs-text-muted)]">Select what you bring to the table.</p>
            <div className="flex flex-wrap gap-3">
              {ONBOARDING_SKILLS.map(s => (
                <button key={s} onClick={() => toggleItem(skills, setSkills, s)} className={"px-4 py-2 rounded-full border transition-colors " + (skills.includes(s) ? "bg-[var(--color-gs-violet)]/20 border-[var(--color-gs-violet)] text-[var(--color-gs-violet)] shadow-[0_0_10px_rgba(124,58,237,0.3)]" : "bg-[var(--color-gs-bg)] border-[var(--color-gs-border)] text-[var(--color-gs-text-muted)] hover:border-gray-500")}>
                  {s}
                </button>
              ))}
            </div>
            <button disabled={skills.length === 0} onClick={handleNext} className="w-full py-3 mt-4 bg-[var(--color-gs-cyan)] text-[#0f172a] font-bold rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50">Next</button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-[slideIn_0.3s_ease-out]">
            <h2 className="text-3xl font-bold">Your Interests</h2>
            <p className="text-[var(--color-gs-text-muted)]">What are you passionate about?</p>
            <div className="flex flex-wrap gap-3">
              {ONBOARDING_INTERESTS.map(i => (
                <button key={i} onClick={() => toggleItem(interests, setInterests, i)} className={"px-4 py-2 rounded-full border transition-colors " + (interests.includes(i) ? "bg-[var(--color-gs-amber)]/20 border-[var(--color-gs-amber)] text-[var(--color-gs-amber)] shadow-[0_0_10px_rgba(245,158,11,0.3)]" : "bg-[var(--color-gs-bg)] border-[var(--color-gs-border)] text-[var(--color-gs-text-muted)] hover:border-gray-500")}>
                  {i}
                </button>
              ))}
            </div>
            <button disabled={interests.length === 0} onClick={handleNext} className="w-full py-3 mt-4 bg-[var(--color-gs-cyan)] text-[#0f172a] font-bold rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50">Next</button>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-[slideIn_0.3s_ease-out]">
            <h2 className="text-3xl font-bold">Personality Quiz</h2>
            <p className="text-[var(--color-gs-text-muted)]">Let's find your faction.</p>
            <div className="space-y-8 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
              {ONBOARDING_QUIZ.map((qObj, idx) => (
                <div key={idx} className="space-y-3">
                  <p className="font-semibold text-lg">{idx + 1}. {qObj.q}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {qObj.opts.map((opt, oIdx) => (
                      <button key={oIdx} onClick={() => {
                        const newAns = [...quizAnswers];
                        newAns[idx] = opt.f;
                        setQuizAnswers(newAns);
                      }} className={"p-3 text-left rounded-lg border transition-all " + (quizAnswers[idx] === opt.f ? "bg-[var(--color-gs-cyan)]/10 border-[var(--color-gs-cyan)] text-[var(--color-gs-cyan)]" : "bg-[var(--color-gs-bg)] border-[var(--color-gs-border)] text-[var(--color-gs-text-muted)] hover:border-gray-500")}>
                        {opt.t}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button disabled={quizAnswers.includes(null)} onClick={handleNext} className="w-full py-3 mt-4 bg-[var(--color-gs-cyan)] text-[#0f172a] font-bold rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50">Reveal Faction</button>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 animate-[slideIn_0.3s_ease-out] text-center w-full max-w-md">
            <h2 className="text-4xl font-bold mb-4">Choose Avatar</h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {ONBOARDING_AVATARS.map(av => (
                <button key={av} onClick={() => setAvatar(av)} className={"text-5xl p-4 rounded-2xl border transition-all hover:scale-105 " + (avatar === av ? "bg-[var(--color-gs-border)] border-[var(--color-gs-cyan)] shadow-[0_0_20px_rgba(0,212,255,0.4)]" : "bg-[var(--color-gs-bg)] border-[var(--color-gs-border)]")}>
                  {av}
                </button>
              ))}
            </div>
            <button onClick={handleNext} className="w-full py-4 mt-8 bg-[var(--color-gs-cyan)] text-[#0f172a] font-bold rounded-lg hover:bg-cyan-400 transition-colors text-lg">See My Faction</button>
          </div>
        );
      case 6:
        const f = MOCK_FACTIONS[assignedFaction];
        const FactionIcon = f.icon;
        return (
          <div className="text-center space-y-8 animate-[slideIn_0.3s_ease-out] max-w-lg">
            <h2 className="text-2xl text-[var(--color-gs-text-muted)]">You belong to...</h2>
            <div className={"mx-auto w-32 h-32 rounded-full flex items-center justify-center border-4 shadow-[0_0_50px_currentColor] animate-pulse-glow " + f.color + " " + f.border + " " + f.bg.replace('bg-', 'bg-opacity-20 ')}>
              <FactionIcon size={64} />
            </div>
            <h1 className={"text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-current " + f.color}>{f.name}</h1>
            <p className="text-xl text-[var(--color-gs-text-muted)]">{f.description}</p>
            <div className="pt-8">
              <button onClick={() => onComplete({ ...profile, skills, interests, avatar, faction: assignedFaction })} className={"px-8 py-4 bg-white text-[#0f172a] font-bold rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"}>
                Enter GroupSync
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[var(--color-gs-bg)] p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-gs-cyan)]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-gs-violet)]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-2xl bg-[var(--color-gs-card)]/80 backdrop-blur-xl border border-[var(--color-gs-border)] rounded-3xl p-8 z-10 shadow-2xl">
        {/* Progress Bar */}
        <div className="w-full bg-[var(--color-gs-border)] h-2 rounded-full mb-8 overflow-hidden">
          <div className="h-full bg-[var(--color-gs-cyan)] shadow-[0_0_10px_rgba(0,212,255,0.6)] transition-all duration-500 ease-out" style={{ width: ((step / 6) * 100) + '%' }} />
        </div>
        
        {renderStep()}
      </div>
    </div>
  );
}
