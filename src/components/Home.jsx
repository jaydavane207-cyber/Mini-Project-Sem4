import React, { useEffect, useState } from 'react';
import { ArrowRight, Users, Zap, Shield, Sparkles, Filter, Code } from 'lucide-react';

export default function Home({ onNavigate }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate random particles matching the design spec
    const p = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 4 + 6,
      delay: Math.random() * 5,
      color: Math.random() > 0.5 ? '#00f0ff' : '#a855f7'
    }));
    setParticles(p);
  }, []);

  const features = [
    {
      icon: Users,
      title: 'Discover Skilled Teammates',
      desc: 'Browse hundreds of student profiles based on precise technical skills like React, Python, or UI/UX design.',
      color: 'text-[#00f0ff]',
      bg: 'bg-[#00f0ff]/10',
      border: 'border-[#00f0ff]/30'
    },
    {
      icon: Zap,
      title: 'Build Teams Faster',
      desc: 'Skip the networking anxiety. Find exactly who you need to complete your hackathon team instantly.',
      color: 'text-[#a855f7]',
      bg: 'bg-[#a855f7]/10',
      border: 'border-[#a855f7]/30'
    },
    {
      icon: Filter,
      title: 'Skill-Based Matching',
      desc: 'Our AI matching engine pairs you with groups lacking your specific skill set for the perfect dynamic.',
      color: 'text-[#f59e0b]',
      bg: 'bg-[#f59e0b]/10',
      border: 'border-[#f59e0b]/30'
    },
    {
      icon: Code,
      title: 'Cross-Discipline Collab',
      desc: 'Connect frontend developers with designers, AI researchers, and backend engineers all in one place.',
      color: 'text-[#ec4899]',
      bg: 'bg-[#ec4899]/10',
      border: 'border-[#ec4899]/30'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Create Your Profile',
      desc: 'Sign up and list your technical skills, interests, and past projects.',
    },
    {
      step: '02',
      title: 'Discover Developers',
      desc: 'Use our advanced filters to find teammates with the exact skills your project requires.',
    },
    {
      step: '03',
      title: 'Form & Build',
      desc: 'Invite members to your group, lock in your team, and start building the future.',
    }
  ];

  return (
    <div className="w-full flex justify-center pb-20 overflow-x-hidden bg-[radial-gradient(circle_at_center,#0d1528_0%,#050810_100%)] min-h-screen">
      {/* Particles Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full opacity-50 shadow-[0_0_10px_currentColor]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              color: p.color,
              animation: `float-particle ${p.duration}s ease-in-out ${p.delay}s infinite alternate`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 space-y-32 z-10">
        
        {/* --- Hero Section --- */}
        <section className="relative pt-32 pb-10 md:pt-48 md:pb-20 flex flex-col items-center text-center animate-page-load">
          {/* Abstract glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-gs-primary)]/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/3 w-[500px] h-[500px] bg-[var(--color-gs-secondary)]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-gs-primary)]/30 bg-[var(--color-gs-primary)]/10 text-[var(--color-gs-primary)] text-sm font-medium mb-8">
            <Sparkles size={14} /> The Ultimate Student Collaboration Hub
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white max-w-4xl tracking-tight leading-tight mb-8 font-heading">
            <span className="inline-block opacity-0 animate-[load-fade-up_0.5s_ease-out_0.2s_forwards]">Find</span>{' '}
            <span className="inline-block opacity-0 animate-[load-fade-up_0.5s_ease-out_0.4s_forwards]">the</span>{' '}
            <span className="inline-block opacity-0 animate-[load-fade-up_0.5s_ease-out_0.6s_forwards]">Perfect</span>
            <br className="hidden md:block"/>
            <span className="inline-block opacity-0 animate-[load-fade-up_0.5s_ease-out_0.8s_forwards] text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#a855f7]">
              Hackathon Teammates
            </span>
          </h1>
          
          <p className="text-[18px] text-[var(--color-gs-text-muted)] max-w-2xl mb-10 leading-relaxed opacity-0 animate-[load-fade-up_0.5s_ease-out_1s_forwards]">
            Stop struggling to form a team. Connect with developers, 
            designers, and innovators. Build your dream squad in seconds, 
            and focus entirely on creating your product.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-[load-fade-up_0.5s_ease-out_1.2s_forwards] relative z-10">
            <button 
              onClick={() => onNavigate('signup')}
              className="px-8 py-4 bg-gradient-to-br from-[#00f0ff] to-[#a855f7] text-[#050810] text-lg font-bold rounded-full btn-scale flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => onNavigate('login')}
              className="px-8 py-4 bg-transparent border border-white/20 text-lg font-bold rounded-full text-white hover:border-[#00f0ff] transition-colors btn-scale flex items-center justify-center gap-2"
            >
              Login to Account
            </button>
          </div>
        </section>

        {/* --- Features Grid --- */}
        <section className="relative z-10" id="features">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-heading">Why GroupSync?</h2>
             <p className="text-[var(--color-gs-text-muted)] max-w-2xl mx-auto text-[18px]">
               Everything you need to seamlessly form or join a group without the friction.
             </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} style={{ animationDelay: `${i * 0.1}s` }} className="glass-card glass-card-hover p-8 relative overflow-hidden group opacity-0 animate-[load-fade-up_0.5s_ease-out_forwards]">
                  <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full opacity-20 transition-opacity group-hover:opacity-50 ${feature.bg} translate-x-10 -translate-y-10`} />
                  
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${feature.bg} ${feature.color} ${feature.border}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 font-heading">{feature.title}</h3>
                  <p className="text-[var(--color-gs-text-muted)] text-sm leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* --- How it Works --- */}
        <section className="relative z-10" id="how-it-works">
           <div className="glass-card p-8 md:p-16 relative overflow-hidden">
             
             {/* decorative accents */}
             <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-[var(--color-gs-secondary)]/10 to-transparent pointer-events-none rounded-tl-full" />
             
             <div className="text-center mb-16 relative z-10">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-heading">How it works</h2>
               <p className="text-[var(--color-gs-text-muted)] max-w-2xl mx-auto text-[18px]">
                 Three simple steps to go from solo hacker to a fully-equipped team.
               </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
               {steps.map((step, i) => (
                 <div key={i} className="flex gap-4">
                   <div className="text-5xl font-extrabold text-white/10 select-none font-heading">
                     {step.step}
                   </div>
                   <div className="pt-2">
                     <h3 className="text-xl font-bold text-white mb-2 font-heading">{step.title}</h3>
                     <p className="text-[var(--color-gs-text-muted)] text-sm">{step.desc}</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="relative z-10 text-center flex flex-col items-center pb-20">
          <Shield size={48} className="text-[#00f0ff] mb-6 opacity-80" />
          <h2 className="text-4xl font-bold text-white mb-6 max-w-2xl font-heading">
            Ready to build your dream hackathon team?
          </h2>
          <p className="text-lg text-[var(--color-gs-text-muted)] mb-10 max-w-xl">
            Join thousands of students who have already connected and launched award-winning projects at top universities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => onNavigate('signup')}
              className="px-8 py-4 bg-gradient-to-br from-[#00f0ff] to-[#a855f7] text-[#050810] text-lg font-bold rounded-full btn-scale"
            >
              Join Now
            </button>
            <button 
              onClick={() => onNavigate('login')}
              className="px-8 py-4 bg-transparent border border-white/20 text-lg font-bold rounded-full text-white hover:border-[#00f0ff] transition-colors btn-scale"
            >
              Login To Continue
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
