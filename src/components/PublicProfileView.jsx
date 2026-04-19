import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, ExternalLink, X, GraduationCap,
  Award, Sparkles, Clock, FileText, Eye,
} from 'lucide-react';

const FloatingParticles = () => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    setParticles(
      Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        size: Math.random() * 3 + 2,
        top: Math.random() * 100,
        left: Math.random() * 100,
        color: Math.random() > 0.5 ? '#00f0ff' : '#a855f7',
        opacity: Math.random() * 0.3 + 0.3,
        duration: Math.random() * 4 + 4,
        delay: Math.random() * -8,
        ty: Math.random() * 20 + 20,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <style>
        {`
          @keyframes float-particle {
            from { transform: translateY(0); }
            to { transform: translateY(var(--ty)); }
          }
        `}
      </style>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            top: `${p.top}%`,
            left: `${p.left}%`,
            backgroundColor: p.color,
            opacity: p.opacity,
            '--ty': `-${p.ty}px`,
            animation: `float-particle ${p.duration}s infinite alternate ease-in-out ${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_USER_PROFILE = {
  name: 'Aarav Sharma',
  avatarUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=Aarav&backgroundColor=0a0e1a',
  department: 'Computer Science & Engineering',
  year: '3rd Year',
  bio: 'Full-stack developer passionate about building performant web apps and exploring the boundaries of machine learning. Open-source contributor & hackathon enthusiast. Currently exploring distributed systems and edge computing.',
  skills: [
    {
      name: 'React',
      is_verified: true,
      certificate_url: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800',
      is_certificate_public: true,
    },
    {
      name: 'Python',
      is_verified: true,
      certificate_url: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800',
      is_certificate_public: true,
    },
    {
      name: 'UI/UX',
      is_verified: true,
      certificate_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      is_certificate_public: false, // Private — button must NOT render
    },
    {
      name: 'Node.js',
      is_verified: true,
      certificate_url: null, // No certificate at all
      is_certificate_public: false,
    },
    {
      name: 'AWS',
      is_verified: true,
      certificate_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
      is_certificate_public: true,
    },
    {
      name: 'Machine Learning',
      is_verified: false, // Not verified — must be completely hidden
      certificate_url: null,
      is_certificate_public: false,
    },
    {
      name: 'C++',
      is_verified: true,
      certificate_url: null,
      is_certificate_public: false,
    },
  ],
};

// ─── Skill color palette ──────────────────────────────────────────────────────
const SKILL_COLORS = {
  'React':            { bg: 'rgba(0, 212, 255, 0.08)',   border: 'rgba(0, 212, 255, 0.25)',   text: '#00d4ff' },
  'Python':           { bg: 'rgba(59, 130, 246, 0.08)',  border: 'rgba(59, 130, 246, 0.25)',  text: '#3b82f6' },
  'UI/UX':            { bg: 'rgba(236, 72, 153, 0.08)',  border: 'rgba(236, 72, 153, 0.25)',  text: '#ec4899' },
  'Node.js':          { bg: 'rgba(16, 185, 129, 0.08)',  border: 'rgba(16, 185, 129, 0.25)',  text: '#10b981' },
  'AWS':              { bg: 'rgba(245, 158, 11, 0.08)',  border: 'rgba(245, 158, 11, 0.25)',  text: '#f59e0b' },
  'Machine Learning': { bg: 'rgba(139, 92, 246, 0.08)', border: 'rgba(139, 92, 246, 0.25)', text: '#8b5cf6' },
  'C++':              { bg: 'rgba(99, 102, 241, 0.08)',  border: 'rgba(99, 102, 241, 0.25)',  text: '#6366f1' },
  'Java':             { bg: 'rgba(239, 68, 68, 0.08)',   border: 'rgba(239, 68, 68, 0.25)',   text: '#ef4444' },
  'SQL':              { bg: 'rgba(20, 184, 166, 0.08)',  border: 'rgba(20, 184, 166, 0.25)',  text: '#14b8a6' },
};

const getSkillColor = (name) =>
  SKILL_COLORS[name] || {
    bg: 'rgba(124, 58, 237, 0.08)',
    border: 'rgba(124, 58, 237, 0.25)',
    text: '#7c3aed',
  };

// ─── Helper: normalise a Supabase skill row ───────────────────────────────────
// Supabase relational queries (select with joins) can return nested objects.
// e.g.  { skills: { name, is_verified, ... } }  or flat  { name, is_verified, ... }
// This function always returns a flat, reliable skill object.
function normaliseSkill(raw) {
  if (!raw) return null;

  // Case 1: nested under a "skills" key (join result)
  const inner = raw.skills ?? raw;

  return {
    name:                 inner.skill_name  ?? inner.name                ?? '',
    is_verified:          inner.is_verified ?? false,
    certificate_url:      inner.certificate_url                          ?? null,
    is_certificate_public: inner.is_certificate_public                  ?? false,
  };
}

// ─── Certificate Lightbox (nested modal) ──────────────────────────────────────
// Receives a raw URL string and renders image or PDF iframe accordingly.
function CertificateLightbox({ url, skillName, onClose }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const isPdf = typeof url === 'string' && url.toLowerCase().endsWith('.pdf');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}           // clicking backdrop closes
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative max-w-3xl w-full max-h-[85vh] bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}   // prevent backdrop close
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-gs-border)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-gs-green)]/10 border border-[var(--color-gs-green)]/30 flex items-center justify-center">
              <Award size={16} className="text-[var(--color-gs-green)]" />
            </div>
            <div>
              <p className="font-bold text-[var(--color-gs-text-main)] text-sm">{skillName} Certificate</p>
              <p className="text-xs text-[var(--color-gs-text-muted)]">Verified credential</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] text-[var(--color-gs-text-muted)] hover:text-[var(--color-gs-cyan)] hover:border-[var(--color-gs-cyan)]/30 transition-all"
              title="Open in new tab"
            >
              <ExternalLink size={16} />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] text-[var(--color-gs-text-muted)] hover:text-red-400 hover:border-red-500/30 transition-all"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Document content */}
        <div className="p-4 flex items-center justify-center bg-[var(--color-gs-bg)] overflow-auto max-h-[calc(85vh-64px)]" onContextMenu={(e) => e.preventDefault()}>
          <div className="relative inline-block max-w-full max-h-full flex items-center justify-center">
            {isPdf ? (
              <iframe
                src={`${url}#toolbar=0`}
                title={`${skillName} certificate`}
                className="w-full rounded-lg"
                style={{ minHeight: '60vh', width: '100%', border: 'none' }}
              />
            ) : (
              <img
                src={url}
                alt={`${skillName} certificate`}
                className="max-w-full max-h-full rounded-lg object-contain"
                loading="lazy"
                draggable="false"
                style={{ pointerEvents: 'none' }}
                onContextMenu={(e) => e.preventDefault()}
              />
            )}
            
            {/* Anti-Theft Watermark Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none opacity-30 flex flex-col items-center justify-center overflow-hidden">
              <div className="flex flex-col gap-10 rotate-[-25deg] scale-150">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex gap-10 whitespace-nowrap">
                    {[...Array(4)].map((_, j) => (
                      <span key={j} className="text-2xl font-black text-gray-500 uppercase tracking-widest select-none drop-shadow-md">
                        GroupSync Protected View
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Verified Skill Badge ─────────────────────────────────────────────────────
function SkillBadge({ skill, onViewCert, index }) {
  const color = getSkillColor(skill.name);
  const canViewCert = skill.certificate_url && skill.is_certificate_public;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={[
        'group relative flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300',
        'hover:scale-[1.03] hover:shadow-lg',
        canViewCert
          ? 'cursor-pointer hover:ring-2 hover:ring-blue-500'
          : 'cursor-default',
      ].join(' ')}
      style={{
        backgroundColor: color.bg,
        borderColor:      color.border,
        boxShadow:        `0 0 0 0 ${color.text}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 20px ${color.border}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 0 ${color.text}`;
      }}
      onClick={canViewCert ? () => onViewCert(skill) : undefined}
      role={canViewCert ? 'button' : undefined}
      tabIndex={canViewCert ? 0 : undefined}
      onKeyDown={canViewCert ? (e) => { if (e.key === 'Enter' || e.key === ' ') onViewCert(skill); } : undefined}
    >
      {/* Verified icon */}
      <ShieldCheck size={15} style={{ color: color.text }} className="shrink-0" />

      {/* Skill name */}
      <span className="font-semibold text-sm whitespace-nowrap" style={{ color: color.text }}>
        {skill.name}
      </span>

      {/* Verified label */}
      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[var(--color-gs-green)]/15 text-[var(--color-gs-green)] border border-[var(--color-gs-green)]/25 shrink-0">
        ✓ Verified
      </span>

      {/* Document icon — only when cert is public */}
      {canViewCert && (
        <FileText
          size={13}
          className="shrink-0 text-blue-400 opacity-70 group-hover:opacity-100 transition-opacity ml-0.5"
          title={`View ${skill.name} certificate`}
        />
      )}
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PublicProfileView({ userProfile = MOCK_USER_PROFILE }) {
  // ── State: URL of the certificate currently being viewed ─────────────────
  const [viewingCertificate, setViewingCertificate] = useState(null);
  // Holds { url, skillName } so the lightbox header shows the right title
  const [viewingSkillName, setViewingSkillName]     = useState('');

  // ── Data normalisation — handles Supabase nested/flat responses ───────────
  const safeSkills = Array.isArray(userProfile?.skills)
    ? userProfile.skills.map(normaliseSkill).filter(Boolean)
    : [];

  const verifiedSkills = safeSkills.filter((s) => s.is_verified === true);

  // ── Certificate viewer handler ────────────────────────────────────────────
  const handleViewCert = (url, skillName) => {
    setViewingCertificate(url);
    setViewingSkillName(skillName);
  };

  // Adapter for SkillBadge — badge calls onViewCert(url), we need skillName too
  const handleBadgeClick = (skill) => {
    handleViewCert(skill.certificate_url, skill.name);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050810] overflow-hidden text-white sm:py-10">
      {/* Background Layers */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[rgba(168,85,247,0.15)] rounded-full blur-[120px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[rgba(0,240,255,0.10)] rounded-full blur-[100px] pointer-events-none translate-y-1/4 -translate-x-1/4" />
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(rgba(255,255,255,0.03) 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 40px)' }} />

      {/* Floating Animated Particles */}
      <FloatingParticles />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-2xl mx-auto"
      >
        <div className="relative bg-[#050810]/70 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/80">

          {/* ── Decorative header gradient (Hero Banner) ──────────────────────────── */}
          <div className="relative h-40 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(0,240,255,0.1))' }}>
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")`,
                backgroundSize: '40px 40px',
              }}
            />

            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
              <Eye size={11} className="text-[#00f0ff]" />
              Public Profile
            </div>
          </div>

          {/* ── Avatar (overlapping header) ────────────────────────── */}
          <div className="relative px-8 -mt-16 pb-0 flex items-center">
            {/* Glowing orb behind avatar */}
            <div className="absolute left-8 top-0 -mt-10 w-[200px] h-[200px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.3), transparent 70%)', filter: 'blur(40px)' }} />

            <div className="relative inline-block z-10">
              <style>{`.conic-border { animation: spin-conic 3s linear infinite; } @keyframes spin-conic { 100% { transform: rotate(360deg); } }`}</style>
              
              <div className="relative w-32 h-32 rounded-2xl p-[3px] overflow-hidden shadow-2xl shadow-[rgba(0,240,255,0.2)]">
                <div className="absolute inset-[-50%] conic-border" style={{ background: 'conic-gradient(from 0deg, transparent 0%, #00f0ff 25%, #a855f7 50%, transparent 75%)' }} />
                <div className="absolute inset-[3px] bg-[#050810] rounded-xl z-0" />
                <img
                  src={userProfile.avatarUrl}
                  alt={`${userProfile.name}'s avatar`}
                  className="relative z-10 w-full h-full object-cover rounded-xl"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-[#10b981] border-[3px] border-[#050810] flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)] z-20">
                <ShieldCheck size={14} className="text-[#050810]" />
              </div>
            </div>
          </div>

          {/* ── Identity Block ─────────────────────────────────────── */}
          <div className="px-8 pt-4 pb-6">
            <h1
              className="text-3xl font-extrabold tracking-tight mb-1"
              style={{
                background: 'linear-gradient(135deg, #f0f4ff 0%, #00d4ff 50%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {userProfile.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-gs-text-muted)]">
                <GraduationCap size={14} className="text-[var(--color-gs-violet)]" />
                {userProfile.department}
              </span>
              <span className="w-1 h-1 rounded-full bg-[var(--color-gs-border)]" />
              <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-gs-text-muted)]">
                <Clock size={14} className="text-[var(--color-gs-amber)]" />
                {userProfile.year}
              </span>
            </div>
          </div>

          {/* ── Divider ────────────────────────────────────────────── */}
          <div className="mx-8 h-px bg-gradient-to-r from-transparent via-[var(--color-gs-border)] to-transparent" />

          {/* ── About Me ───────────────────────────────────────────── */}
          <div className="px-8 py-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-gs-text-muted)] mb-3 flex items-center gap-2">
              <Sparkles size={13} className="text-[var(--color-gs-amber)]" />
              About Me
            </h2>
            <p className="text-[var(--color-gs-text-muted)] text-sm leading-relaxed">
              {userProfile.bio}
            </p>
          </div>

          {/* ── Divider ────────────────────────────────────────────── */}
          <div className="mx-8 h-px bg-gradient-to-r from-transparent via-[var(--color-gs-border)] to-transparent" />

          {/* ── Skills Showcase ─────────────────────────────────────── */}
          <div className="px-8 py-6 pb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-gs-text-muted)] flex items-center gap-2">
                <ShieldCheck size={13} className="text-[var(--color-gs-green)]" />
                Verified Skills
              </h2>
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[var(--color-gs-green)]/10 text-[var(--color-gs-green)] border border-[var(--color-gs-green)]/20">
                {verifiedSkills.length} verified
              </span>
            </div>

            {verifiedSkills.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {verifiedSkills.map((skill, idx) => (
                  <SkillBadge
                    key={skill.name || idx}
                    skill={skill}
                    index={idx}
                    onViewCert={handleBadgeClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[var(--color-gs-text-muted)] text-sm">
                No verified skills to display.
              </div>
            )}

            {/* Hover hint */}
            {verifiedSkills.some((s) => s.certificate_url && s.is_certificate_public) && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-[11px] text-[var(--color-gs-text-muted)]/60 mt-4 flex items-center gap-1.5"
              >
                <FileText size={11} />
                Click a skill badge to view its public certificate
              </motion.p>
            )}
          </div>

          {/* ── Bottom accent bar ──────────────────────────────────── */}
          <div className="h-1 bg-gradient-to-r from-[var(--color-gs-cyan)] via-[var(--color-gs-violet)] to-[var(--color-gs-green)]" />
        </div>
      </motion.div>

      {/* ── Certificate Lightbox (nested modal, z-[100]) ──────────── */}
      <AnimatePresence>
        {viewingCertificate && (
          <CertificateLightbox
            url={viewingCertificate}
            skillName={viewingSkillName}
            onClose={() => setViewingCertificate(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
