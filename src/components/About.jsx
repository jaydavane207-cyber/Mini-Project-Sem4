import React from 'react';
import { Target, AlertTriangle, Lightbulb, Combine } from 'lucide-react';

export default function About() {
  const sections = [
    {
      icon: Target,
      title: 'Our Mission',
      color: 'text-[var(--color-gs-cyan)]',
      bg: 'bg-[var(--color-gs-cyan)]/10',
      border: 'border-[var(--color-gs-cyan)]/30',
      content: 'To empower student developers, designers, and visionaries by breaking down the barriers to collaboration. We believe that the best products are built by diverse minds coming together harmoniously.'
    },
    {
      icon: AlertTriangle,
      title: 'The Problem',
      color: 'text-[var(--color-gs-red)]',
      bg: 'bg-[var(--color-gs-red)]/10',
      border: 'border-[var(--color-gs-red)]/30',
      content: 'During hackathons, finding teammates with the right skill sets is often chaotic and stressful. Brilliant ideas fall apart simply because a frontend developer couldn\'t find a backend partner, or a group lacked a UI designer to polish their presentation.'
    },
    {
      icon: Lightbulb,
      title: 'The Solution',
      color: 'text-[var(--color-gs-amber)]',
      bg: 'bg-[var(--color-gs-amber)]/10',
      border: 'border-[var(--color-gs-amber)]/30',
      content: 'GroupSync provides a structured, skill-oriented ecosystem. By building profiles that highlight exact proficiencies and utilizing tailored search parameters, students can precisely discover and connect with the exact missing links their projects desperately need.'
    },
    {
      icon: Combine,
      title: 'Our Vision',
      color: 'text-[var(--color-gs-violet)]',
      bg: 'bg-[var(--color-gs-violet)]/10',
      border: 'border-[var(--color-gs-violet)]/30',
      content: 'We foresee a thriving, global collaborative developer ecosystem where no student has to build alone. By fostering these early-stage connections, we aim to accelerate campus innovation and prepare students for real-world cross-functional teamwork.'
    }
  ];

  return (
    <div className="w-full flex justify-center pb-20 pt-32 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-4xl w-full">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--color-gs-text-main)] mb-6">
            About Group<span className="text-[var(--color-gs-cyan)] glow-text">Sync</span>
          </h1>
          <p className="text-xl text-[var(--color-gs-text-muted)] leading-relaxed max-w-2xl mx-auto">
            We are redefining how students collaborate, form teams, and engineer the future together.
          </p>
        </div>

        {/* Content Structure */}
        <div className="space-y-8 relative">
          
          {/* Subtle background track line */}
          <div className="hidden md:block absolute left-8 top-10 bottom-10 w-px bg-[var(--color-gs-border)] z-0" />

          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <div key={i} className="flex flex-col md:flex-row gap-6 md:gap-10 relative z-10 hover:-translate-y-1 transition-transform duration-300">
                
                {/* Visual Node */}
                <div className="shrink-0 flex items-start">
                  <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center shadow-lg ${section.bg} ${section.color} ${section.border} z-10`}>
                    <Icon size={28} />
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] p-8 rounded-3xl shadow-sm hover:border-[var(--color-gs-cyan)]/50 transition-colors">
                  <h2 className="text-2xl font-bold text-[var(--color-gs-text-main)] mb-4">{section.title}</h2>
                  <p className="text-[var(--color-gs-text-muted)] leading-relaxed text-lg">
                    {section.content}
                  </p>
                </div>

              </div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}
