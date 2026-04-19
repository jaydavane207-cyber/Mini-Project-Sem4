import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { ONBOARDING_SKILLS, ONBOARDING_INTERESTS, ONBOARDING_AVATARS, ONBOARDING_QUIZ, MOCK_FACTIONS } from '../data/mockData';
import { User, GraduationCap, Phone, Check, ChevronRight, Zap, Trophy, Shield } from 'lucide-react';

// ─── Background Decorations ───────────────────────────────────────────────────


export default function OnboardingFlow({ onComplete }) {
  const { theme } = useAppContext();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({ name: '', college: '', phone: '', year: '1st Year' });
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
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-2">Who are you?</h2>
              <p className="text-[var(--color-gs-text-muted)] text-sm">Complete your digital identity</p>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-gs-text-muted)] block ml-1">Name</label>
                <input 
                  type="text" 
                  value={profile.name} 
                  onChange={e => setProfile({...profile, name: e.target.value})} 
                  className="w-full bg-[#0d1117] border border-white/10 rounded-xl p-4 outline-none focus:border-[var(--color-gs-primary)] transition-all font-medium text-white placeholder:text-gray-600" 
                  placeholder="e.g. Alex" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-gs-text-muted)] block ml-1">College</label>
                <input 
                  type="text" 
                  value={profile.college} 
                  onChange={e => setProfile({...profile, college: e.target.value})} 
                  className="w-full bg-[#0d1117] border border-white/10 rounded-xl p-4 outline-none focus:border-[var(--color-gs-primary)] transition-all font-medium text-white placeholder:text-gray-600" 
                  placeholder="e.g. MIT" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-gs-text-muted)] block ml-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={profile.phone} 
                  onChange={e => setProfile({...profile, phone: e.target.value})} 
                  className="w-full bg-[#0d1117] border border-white/10 rounded-xl p-4 outline-none focus:border-[var(--color-gs-primary)] transition-all font-medium text-white placeholder:text-gray-600" 
                  placeholder="e.g. +1 234 567 8900" 
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-gs-text-muted)] block ml-1">Academic Year</label>
                <div className="flex flex-wrap gap-2">
                  {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Grad'].map(y => (
                    <button 
                      key={y} 
                      onClick={() => setProfile({...profile, year: y})} 
                      className={"px-5 py-2 rounded-full border text-xs font-bold transition-all " + (profile.year === y ? "bg-[var(--color-gs-primary)] border-[var(--color-gs-primary)] text-black" : "bg-transparent border-white/10 text-[var(--color-gs-text-muted)] hover:border-white/30")}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              disabled={!profile.name || !profile.college || !profile.phone} 
              onClick={handleNext} 
              className="w-full py-4 mt-4 bg-[var(--color-gs-primary)] text-black font-black uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              Next
            </button>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-4xl font-black font-heading tracking-tight mb-2">Your Skills</h2>
              <p className="text-[var(--color-gs-text-muted)]">Select what you bring to the table.</p>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              {ONBOARDING_SKILLS.map(s => (
                <button 
                  key={s} 
                  onClick={() => toggleItem(skills, setSkills, s)} 
                  className={"px-6 py-3 rounded-2xl border-2 font-bold transition-all " + (skills.includes(s) ? "bg-[var(--color-gs-violet)]/20 border-[var(--color-gs-violet)] text-[var(--color-gs-violet)] shadow-[0_0_20px_rgba(124,58,237,0.3)] scale-105" : "bg-white/5 border-white/10 text-[var(--color-gs-text-muted)] hover:border-white/30 hover:scale-102")}
                >
                  {s}
                </button>
              ))}
            </div>

            <button 
              disabled={skills.length === 0} 
              onClick={handleNext} 
              className="w-full py-4 mt-6 bg-[var(--color-gs-primary)] text-[#0f172a] font-black uppercase tracking-widest rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(0,240,255,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Next Step <ChevronRight size={18} />
            </button>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-4xl font-black font-heading tracking-tight mb-2">Your Interests</h2>
              <p className="text-[var(--color-gs-text-muted)]">What are you passionate about?</p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {ONBOARDING_INTERESTS.map(i => (
                <button 
                  key={i} 
                  onClick={() => toggleItem(interests, setInterests, i)} 
                  className={"px-6 py-3 rounded-2xl border-2 font-bold transition-all " + (interests.includes(i) ? "bg-[var(--color-gs-amber)]/20 border-[var(--color-gs-amber)] text-[var(--color-gs-amber)] shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-105" : "bg-white/5 border-white/10 text-[var(--color-gs-text-muted)] hover:border-white/30 hover:scale-102")}
                >
                  {i}
                </button>
              ))}
            </div>

            <button 
              disabled={interests.length === 0} 
              onClick={handleNext} 
              className="w-full py-4 mt-6 bg-[var(--color-gs-primary)] text-[#0f172a] font-black uppercase tracking-widest rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(0,240,255,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Next Step <ChevronRight size={18} />
            </button>
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-black font-heading tracking-tight mb-2">Personality Quiz</h2>
              <p className="text-[var(--color-gs-text-muted)]">Let's find your faction alignment.</p>
            </div>

            <div className="space-y-8 max-h-[55vh] overflow-y-auto pr-4 custom-scrollbar px-2">
              {ONBOARDING_QUIZ.map((qObj, idx) => (
                <div key={idx} className="space-y-4">
                  <p className="font-bold text-lg text-white/90 flex items-start gap-3">
                    <span className="bg-white/10 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs">{idx + 1}</span>
                    {qObj.q}
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {qObj.opts.map((opt, oIdx) => (
                      <button 
                        key={oIdx} 
                        onClick={() => {
                          const newAns = [...quizAnswers];
                          newAns[idx] = opt.f;
                          setQuizAnswers(newAns);
                        }} 
                        className={"p-4 text-left rounded-2xl border-2 transition-all flex items-center justify-between group " + (quizAnswers[idx] === opt.f ? "bg-[var(--color-gs-primary)]/10 border-[var(--color-gs-primary)] text-[var(--color-gs-primary)] shadow-[0_0_15px_rgba(0,240,255,0.1)]" : "bg-white/5 border-white/10 text-[var(--color-gs-text-muted)] hover:border-white/30 hover:bg-white/10")}
                      >
                        <span className="font-medium">{opt.t}</span>
                        {quizAnswers[idx] === opt.f && <Check size={18} className="shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button 
              disabled={quizAnswers.includes(null)} 
              onClick={handleNext} 
              className="w-full py-4 mt-6 bg-[var(--color-gs-primary)] text-[#0f172a] font-black uppercase tracking-widest rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(0,240,255,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Reveal Faction <Zap size={18} />
            </button>
          </motion.div>
        );
      case 5:
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="space-y-8 text-center"
          >
            <div>
              <h2 className="text-4xl font-black font-heading tracking-tight mb-2">Choose Avatar</h2>
              <p className="text-[var(--color-gs-text-muted)]">Select your visual representation.</p>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 p-2">
              {ONBOARDING_AVATARS.map(av => (
                <button 
                  key={av} 
                  onClick={() => setAvatar(av)} 
                  className={"text-5xl aspect-square flex items-center justify-center rounded-[2rem] border-2 transition-all hover:scale-110 " + (avatar === av ? "bg-white/10 border-[var(--color-gs-primary)] shadow-[0_0_30px_rgba(0,240,255,0.3)]" : "bg-white/5 border-white/10")}
                >
                  {av}
                </button>
              ))}
            </div>

            <button 
              onClick={handleNext} 
              className="w-full py-5 bg-[var(--color-gs-primary)] text-[#0f172a] font-black uppercase tracking-widest rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(0,240,255,0.4)] text-lg flex items-center justify-center gap-2"
            >
              Final Reveal <Trophy size={20} />
            </button>
          </motion.div>
        );
      case 6:
        const f = MOCK_FACTIONS[assignedFaction];
        const FactionIcon = f.icon;
        return (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8 max-w-lg mx-auto py-4"
          >
            <div>
              <h2 className="text-xl font-bold uppercase tracking-[0.3em] text-[var(--color-gs-text-muted)] mb-2">You belong to...</h2>
              <div className="h-1 w-24 bg-[var(--color-gs-primary)]/30 mx-auto rounded-full" />
            </div>

            <div className="relative">
              <div className={"absolute inset-0 rounded-full blur-[60px] opacity-40 animate-pulse " + f.color.replace('text-', 'bg-')} />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className={"mx-auto w-48 h-48 rounded-full flex items-center justify-center border-2 border-dashed relative z-10 " + f.border + " " + f.color}
              >
                <div className={"w-40 h-40 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_currentColor] " + f.color}>
                  <FactionIcon size={84} />
                </div>
              </motion.div>
            </div>

            <div className="space-y-4">
              <h1 className={"text-6xl font-black font-heading tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-current drop-shadow-2xl " + f.color}>{f.name}</h1>
              <p className="text-xl text-[var(--color-gs-text-muted)] font-medium leading-relaxed italic">"{f.description}"</p>
            </div>

            <div className="pt-6">
              <button 
                onClick={() => onComplete({ ...profile, skills, interests, avatar, faction: assignedFaction })} 
                className="w-full py-5 bg-white text-[#0f172a] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2 group"
              >
                Enter GroupSync <Shield size={20} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-transparent p-4 relative overflow-hidden font-body text-gs-text-main">
      <div className="w-full max-w-md relative animate-page-load z-10">
        {/* Match Dashboard's Premium Glass Card */}
        <div className={`backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-3xl p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] ${theme === 'light' ? 'bg-white/40 border border-white/60' : 'bg-[#050810]/60 border border-white/5'}`}>
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        {/* Minimal Progress Indicator */}
        <div className="mt-10 flex justify-center gap-3">
          {[1,2,3,4,5,6].map(s => (
            <div 
              key={s} 
              className={"h-1 rounded-full transition-all duration-700 " + (step >= s ? "w-10 bg-[var(--color-gs-primary)] shadow-[0_0_10px_var(--color-gs-primary)]" : "w-3 bg-white/5")} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
