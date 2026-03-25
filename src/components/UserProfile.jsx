import React, { useState } from 'react';
import {
  User, Award, Shield, Users, Edit3, LogOut,
  Calendar, BookOpen, GraduationCap, Star, Globe,
  Linkedin, Github, Instagram, Twitter, Bell, Lock,
  Trophy, Zap, Check, Settings,
  ChevronRight, MapPin, Phone, Mail, Eye, EyeOff,
  BarChart2, Clock, CheckCircle, XCircle, Save, X
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import supabase from '../lib/supabase';

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard = ({ value, label, color = 'text-[var(--color-gs-cyan)]' }) => (
  <div className="bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded-xl p-4 text-center">
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
    <div className="text-xs text-[var(--color-gs-text-muted)] mt-1">{label}</div>
  </div>
);

const Toggle = ({ checked, onChange }) => (
  <button type="button" onClick={onChange}
    className={"relative w-12 h-6 rounded-full transition-colors duration-200 " + (checked ? 'bg-[var(--color-gs-cyan)]' : 'bg-[var(--color-gs-border)]')}>
    <div className={"absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200 " + (checked ? 'left-6' : 'left-0.5')} />
  </button>
);

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ user, factions, isEditing, formData, setFormData }) {
  const f = factions[user.faction];
  const FactionIcon = f?.icon || User;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard value="3" label="Groups Joined" color="text-[var(--color-gs-cyan)]" />
        <StatCard value="7" label="Events Attended" color="text-[var(--color-gs-violet)]" />
        <StatCard value="2" label="Badges Earned" color="text-[var(--color-gs-amber)]" />
        <StatCard value="#12" label="Leaderboard" color="text-[var(--color-gs-green)]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Info */}
        <div className="bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-2xl p-6 space-y-3">
          <h3 className="text-lg font-bold flex items-center gap-2"><User size={18} className="text-[var(--color-gs-cyan)]" /> Personal Info</h3>
          {isEditing ? (
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-[var(--color-gs-text-muted)] shrink-0" />
                <input type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded px-2 py-1 text-[var(--color-gs-text-main)]" placeholder="Email" />
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar size={16} className="text-[var(--color-gs-text-muted)] shrink-0" />
                <input type="text" value={formData.dob || ''} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className="w-full bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded px-2 py-1 text-[var(--color-gs-text-main)]" placeholder="Date of Birth" />
              </div>
            </div>
          ) : (
            [
              { icon: Mail, label: user.email || 'student@college.edu' },
              { icon: Calendar, label: user.dob || 'Not specified' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-sm">
                <Icon size={16} className="text-[var(--color-gs-text-muted)] shrink-0" />
                <span className="text-[var(--color-gs-text-muted)]">{label}</span>
              </div>
            ))
          )}
        </div>

        {/* Academic Info */}
        <div className="bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-2xl p-6 space-y-3">
          <h3 className="text-lg font-bold flex items-center gap-2"><GraduationCap size={18} className="text-[var(--color-gs-violet)]" /> Academic Info</h3>
          {isEditing ? (
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-3 text-sm">
                <BookOpen size={16} className="text-[var(--color-gs-text-muted)] shrink-0" />
                <input type="text" value={formData.college || ''} onChange={(e) => setFormData({ ...formData, college: e.target.value })} className="w-full bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded px-2 py-1 text-[var(--color-gs-text-main)]" placeholder="College Name" />
              </div>
              <div className="flex items-center gap-3 text-sm">
                <GraduationCap size={16} className="text-[var(--color-gs-text-muted)] shrink-0" />
                <div className="flex gap-2 w-full">
                  <input type="text" value={formData.course || ''} onChange={(e) => setFormData({ ...formData, course: e.target.value })} className="w-1/2 bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded px-2 py-1 text-[var(--color-gs-text-main)]" placeholder="Course (e.g. B.Tech)" />
                  <input type="text" value={formData.branch || ''} onChange={(e) => setFormData({ ...formData, branch: e.target.value })} className="w-1/2 bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded px-2 py-1 text-[var(--color-gs-text-main)]" placeholder="Branch (e.g. CS)" />
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Star size={16} className="text-[var(--color-gs-text-muted)] shrink-0" />
                <input type="text" value={formData.year || ''} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="w-full bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded px-2 py-1 text-[var(--color-gs-text-main)]" placeholder="Year (e.g. 3rd)" />
              </div>
              <div className="flex items-center gap-3 text-sm">
                <BarChart2 size={16} className="text-[var(--color-gs-text-muted)] shrink-0" />
                <input type="text" value={formData.cgpa || ''} onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })} className="w-full bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded px-2 py-1 text-[var(--color-gs-text-main)]" placeholder="CGPA" />
              </div>
            </div>
          ) : (
            [
              { icon: BookOpen, label: user.college || 'IIT Bombay' },
              { icon: GraduationCap, label: user.course ? `${user.course} - ${user.branch || 'CS'}` : 'B.Tech - Computer Science' },
              { icon: Star, label: user.year ? `${user.year} Year` : user.year || '3rd Year' },
              { icon: BarChart2, label: user.cgpa ? `CGPA: ${user.cgpa}` : 'CGPA: Private' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-sm">
                <Icon size={16} className="text-[var(--color-gs-text-muted)] shrink-0" />
                <span className="text-[var(--color-gs-text-muted)]">{label}</span>
              </div>
            ))
          )}
        </div>

        {/* Social Links */}
        <div className="bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-2xl p-6 space-y-3">
          <h3 className="text-lg font-bold flex items-center gap-2"><Globe size={18} className="text-[var(--color-gs-green)]" /> Social Links</h3>
          {isEditing ? (
            <div className="space-y-3 mt-4">
              {[
                { icon: Linkedin, key: 'linkedin', color: 'text-blue-400', placeholder: 'LinkedIn URL' },
                { icon: Github, key: 'github', color: 'text-[var(--color-gs-text-muted)]', placeholder: 'GitHub URL' },
                { icon: Globe, key: 'portfolio', color: 'text-emerald-400', placeholder: 'Portfolio URL' },
                { icon: Instagram, key: 'instagram', color: 'text-pink-400', placeholder: 'Instagram URL' },
                { icon: Twitter, key: 'twitter', color: 'text-sky-400', placeholder: 'Twitter URL' },
              ].map(({ icon: Icon, key, color, placeholder }) => (
                <div key={key} className="flex items-center gap-3 text-sm">
                  <Icon size={16} className={`${color} shrink-0`} />
                  <input type="text" value={formData.social_links?.[key] || formData.socialLinks?.[key] || ''} 
                         onChange={(e) => setFormData({ ...formData, social_links: { ...(formData.social_links || formData.socialLinks || {}), [key]: e.target.value } })} 
                         className="w-full bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded px-2 py-1 text-[var(--color-gs-text-main)]" 
                         placeholder={placeholder} />
                </div>
              ))}
            </div>
          ) : (
            [
              { icon: Linkedin, label: 'LinkedIn', color: 'text-blue-400', url: user.social_links?.linkedin || user.socialLinks?.linkedin || 'Not linked' },
              { icon: Github, label: 'GitHub', color: 'text-[var(--color-gs-text-muted)]', url: user.social_links?.github || user.socialLinks?.github || 'Not linked' },
              { icon: Globe, label: 'Portfolio', color: 'text-emerald-400', url: user.social_links?.portfolio || user.socialLinks?.portfolio || 'Not linked' },
              { icon: Instagram, label: 'Instagram', color: 'text-pink-400', url: user.social_links?.instagram || user.socialLinks?.instagram || 'Not linked' },
              { icon: Twitter, label: 'Twitter', color: 'text-sky-400', url: user.social_links?.twitter || user.socialLinks?.twitter || 'Not linked' },
            ].map(({ icon: Icon, label, color, url }) => (
              <div key={label} className="flex items-center gap-3 text-sm">
                <Icon size={16} className={`${color} shrink-0`} />
                <span className="text-[var(--color-gs-text-muted)] truncate">{url}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Skills & Interests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4">Skills</h3>
          {isEditing ? (
            <input type="text" value={(formData.skills || []).join(', ')} onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()) })} className="w-full bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded px-3 py-2 text-[var(--color-gs-text-main)]" placeholder="React, Python, UI/UX (Comma separated)" />
          ) : (
            <div className="flex flex-wrap gap-2">
              {(user.skills && user.skills.length > 0 ? user.skills : ['React', 'Python', 'UI/UX']).map(s => (
                <span key={s} className="px-3 py-1.5 bg-[var(--color-gs-violet)]/10 border border-[var(--color-gs-violet)]/30 text-[var(--color-gs-violet)] rounded-full text-sm font-medium">{s}</span>
              ))}
            </div>
          )}
        </div>
        <div className="bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4">Interests</h3>
          {isEditing ? (
            <input type="text" value={(formData.interests || []).join(', ')} onChange={(e) => setFormData({ ...formData, interests: e.target.value.split(',').map(i => i.trim()) })} className="w-full bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded px-3 py-2 text-[var(--color-gs-text-main)]" placeholder="Hackathons, AI, Open Source (Comma separated)" />
          ) : (
            <div className="flex flex-wrap gap-2">
              {(user.interests && user.interests.length > 0 ? user.interests : ['Hackathons', 'AI', 'Open Source']).map(i => (
                <span key={i} className="px-3 py-1.5 bg-[var(--color-gs-amber)]/10 border border-[var(--color-gs-amber)]/30 text-[var(--color-gs-amber)] rounded-full text-sm font-medium">{i}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      <div className="bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-2">About Me</h3>
        {isEditing ? (
          <textarea value={formData.bio || ''} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={4} className="w-full bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded-xl px-4 py-3 text-[var(--color-gs-text-main)] resize-none" placeholder="Tell us about yourself..." />
        ) : (
          <p className="text-[var(--color-gs-text-muted)] leading-relaxed">{user.bio || 'Building the future, one commit at a time. 🚀'}</p>
        )}
      </div>
    </div>
  );
}

// ─── Events Tab ───────────────────────────────────────────────────────────────
const MOCK_EVENTS = [
  { id: 1, name: 'Spring Hackathon 2025', date: 'Mar 15, 2025', type: 'Hackathon', status: 'attended', result: '2nd Place 🥈' },
  { id: 2, name: 'AI Summit', date: 'Feb 10, 2025', type: 'Conference', status: 'attended', result: 'Participant' },
  { id: 3, name: '48h Game Jam', date: 'Jan 20, 2025', type: 'Game Jam', status: 'rsvpd', result: 'RSVP\'d' },
  { id: 4, name: 'UI/UX Workshop', date: 'Dec 5, 2024', type: 'Workshop', status: 'attended', result: 'Completed ✓' },
  { id: 5, name: 'Web3 Weekend', date: 'Nov 12, 2024', type: 'Hackathon', status: 'past', result: 'Did not attend' },
];

function EventsTab() {
  const statusColors = { attended: 'text-emerald-400', rsvpd: 'text-[var(--color-gs-cyan)]', past: 'text-[var(--color-gs-text-muted)]' };
  const statusLabels = { attended: 'Attended', rsvpd: 'RSVP\'d', past: 'Past' };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard value={MOCK_EVENTS.filter(e => e.status === 'rsvpd').length} label="RSVP'd" color="text-[var(--color-gs-cyan)]" />
        <StatCard value={MOCK_EVENTS.filter(e => e.status === 'attended').length} label="Attended" color="text-emerald-400" />
        <StatCard value="1" label="Awards Won" color="text-[var(--color-gs-amber)]" />
      </div>

      {/* Event List */}
      <div className="bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-[var(--color-gs-border)]">
          <h3 className="text-lg font-bold">Event History</h3>
        </div>
        <div className="divide-y divide-[var(--color-gs-border)]">
          {MOCK_EVENTS.map(event => (
            <div key={event.id} className="p-5 flex items-center gap-4 hover:bg-[var(--color-gs-bg)] transition-colors">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${event.status === 'attended' ? 'bg-emerald-500/10' : event.status === 'rsvpd' ? 'bg-[var(--color-gs-cyan)]/10' : 'bg-[var(--color-gs-border)]'}`}>
                {event.status === 'attended' ? <CheckCircle size={20} className="text-emerald-400" /> : event.status === 'rsvpd' ? <Clock size={20} className="text-[var(--color-gs-cyan)]" /> : <XCircle size={20} className="text-[var(--color-gs-text-muted)]" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[var(--color-gs-text-main)] truncate">{event.name}</p>
                <p className="text-xs text-[var(--color-gs-text-muted)]">{event.date} · {event.type}</p>
              </div>
              <div className="text-right shrink-0">
                <span className={`text-sm font-medium ${statusColors[event.status]}`}>{event.result}</span>
                <p className={`text-xs mt-0.5 ${statusColors[event.status]}`}>{statusLabels[event.status]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Teams Tab ────────────────────────────────────────────────────────────────
const MOCK_TEAMS = [
  { id: 1, name: 'Quantum Hackers', event: 'Spring Hackathon', members: 4, role: 'Frontend Lead', status: 'current', emoji: '⚡' },
  { id: 2, name: 'Design Wizards', event: 'UI/UX Challenge', members: 3, role: 'Member', status: 'past', emoji: '🎨' },
];

const MOCK_INVITES = [
  { id: 1, team: 'Chain Breakers', event: 'Web3 Weekend', from: 'Bob', emoji: '🔗' },
];

function TeamsTab({ showToast }) {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard value={MOCK_TEAMS.filter(t => t.status === 'current').length} label="Current Teams" color="text-[var(--color-gs-cyan)]" />
        <StatCard value={MOCK_TEAMS.filter(t => t.status === 'past').length} label="Past Teams" color="text-[var(--color-gs-text-muted)]" />
        <StatCard value={MOCK_INVITES.length} label="Pending Invites" color="text-[var(--color-gs-amber)]" />
      </div>

      {/* Current Teams */}
      <div>
        <h3 className="text-lg font-bold mb-3">Current Teams</h3>
        <div className="space-y-3">
          {MOCK_TEAMS.filter(t => t.status === 'current').map(team => (
            <div key={team.id} className="bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-2xl p-5 flex items-center gap-4 hover:border-[var(--color-gs-cyan)] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] flex items-center justify-center text-2xl">{team.emoji}</div>
              <div className="flex-1">
                <p className="font-bold text-[var(--color-gs-text-main)]">{team.name}</p>
                <p className="text-sm text-[var(--color-gs-text-muted)]">{team.event} · {team.members} members</p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-[var(--color-gs-cyan)]/10 text-[var(--color-gs-cyan)] border border-[var(--color-gs-cyan)]/30 rounded-full text-xs font-medium">{team.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Teams */}
      <div>
        <h3 className="text-lg font-bold mb-3">Past Teams</h3>
        <div className="space-y-3">
          {MOCK_TEAMS.filter(t => t.status === 'past').map(team => (
            <div key={team.id} className="bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-2xl p-5 flex items-center gap-4 opacity-70">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] flex items-center justify-center text-2xl">{team.emoji}</div>
              <div className="flex-1">
                <p className="font-bold text-[var(--color-gs-text-main)]">{team.name}</p>
                <p className="text-sm text-[var(--color-gs-text-muted)]">{team.event} · {team.members} members</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invitations */}
      {MOCK_INVITES.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-3">Pending Invitations</h3>
          <div className="space-y-3">
            {MOCK_INVITES.map(invite => (
              <div key={invite.id} className="bg-[var(--color-gs-amber)]/5 border border-[var(--color-gs-amber)]/30 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] flex items-center justify-center text-2xl">{invite.emoji}</div>
                <div className="flex-1">
                  <p className="font-bold text-[var(--color-gs-text-main)]">{invite.team}</p>
                  <p className="text-sm text-[var(--color-gs-text-muted)]">{invite.event} · Invited by {invite.from}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => showToast('Invitation accepted!')} className="px-4 py-2 bg-[var(--color-gs-green)] text-white rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors">Accept</button>
                  <button onClick={() => showToast('Invitation declined.')} className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl text-sm font-medium hover:bg-red-500/20 transition-colors">Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Achievements Tab ─────────────────────────────────────────────────────────
const BADGES = [
  { emoji: '🏆', label: 'Hack Winner', desc: 'Won Spring Hackathon 2025', unlocked: true, color: 'from-yellow-400/20 to-orange-500/20', border: 'border-yellow-500/50' },
  { emoji: '🤝', label: 'Team Player', desc: 'Joined 3 groups', unlocked: true, color: 'from-blue-400/20 to-cyan-500/20', border: 'border-cyan-500/50' },
  { emoji: '🔥', label: 'On Fire', desc: 'Active 7 days straight', unlocked: false, color: 'from-gray-400/5 to-gray-500/5', border: 'border-gray-600/30' },
  { emoji: '🚀', label: 'Launcher', desc: 'Submit first project', unlocked: false, color: 'from-gray-400/5 to-gray-500/5', border: 'border-gray-600/30' },
  { emoji: '⭐', label: 'Star Contributor', desc: 'Top 10 leaderboard', unlocked: false, color: 'from-gray-400/5 to-gray-500/5', border: 'border-gray-600/30' },
  { emoji: '🎯', label: 'Sharp Focus', desc: 'Complete 5 events', unlocked: false, color: 'from-gray-400/5 to-gray-500/5', border: 'border-gray-600/30' },
];

function AchievementsTab() {
  return (
    <div className="space-y-6">
      {/* Leaderboard Rank */}
      <div className="bg-gradient-to-r from-[var(--color-gs-cyan)]/10 to-[var(--color-gs-violet)]/10 border border-[var(--color-gs-cyan)]/30 rounded-2xl p-6 flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-gs-bg)] border border-[var(--color-gs-cyan)]/40 flex items-center justify-center">
          <Trophy size={32} className="text-[var(--color-gs-cyan)]" />
        </div>
        <div>
          <p className="text-[var(--color-gs-text-muted)] text-sm">Leaderboard Rank</p>
          <p className="text-4xl font-bold text-[var(--color-gs-cyan)]">#12</p>
          <p className="text-xs text-[var(--color-gs-text-muted)] mt-1">Top 15% of all students</p>
        </div>
        <div className="ml-auto text-right">
          <div className="text-2xl font-bold text-[var(--color-gs-text-main)]">480 XP</div>
          <div className="text-xs text-[var(--color-gs-text-muted)]">Total experience</div>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Award size={18} className="text-[var(--color-gs-amber)]" /> Badges</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {BADGES.map(badge => (
            <div key={badge.label} className={`rounded-2xl p-5 bg-gradient-to-br ${badge.color} border ${badge.border} flex flex-col items-center gap-2 text-center transition-all ${badge.unlocked ? 'hover:scale-105 cursor-pointer' : 'opacity-60'}`}>
              <span className={`text-4xl transition-transform ${badge.unlocked ? 'group-hover:scale-125' : 'grayscale'}`}>{badge.emoji}</span>
              <span className="font-bold text-sm text-[var(--color-gs-text-main)]">{badge.label}</span>
              <span className="text-xs text-[var(--color-gs-text-muted)]">{badge.unlocked ? badge.desc : '🔒 Locked'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Certificates */}
      <div>
        <h3 className="text-lg font-bold mb-4">Certificates</h3>
        <div className="space-y-3">
          {[
            { name: 'React Fundamentals', issuer: 'freeCodeCamp', date: 'Jan 2025' },
            { name: 'UI/UX Design Certification', issuer: 'Coursera', date: 'Dec 2024' },
          ].map(cert => (
            <div key={cert.name} className="bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-xl p-4 flex items-center gap-4 hover:border-[var(--color-gs-cyan)] transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-gs-amber)]/10 border border-[var(--color-gs-amber)]/30 flex items-center justify-center">
                <Award size={20} className="text-[var(--color-gs-amber)]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[var(--color-gs-text-main)]">{cert.name}</p>
                <p className="text-xs text-[var(--color-gs-text-muted)]">{cert.issuer} · {cert.date}</p>
              </div>
              <ChevronRight size={16} className="text-[var(--color-gs-text-muted)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────
function SettingsTab({ logout: handleLogout, showToast }) {
  const [notifs, setNotifs] = useState({ events: true, teams: true, messages: true, leaderboard: false });
  const [privacy, setPrivacy] = useState({ publicProfile: true, showSkills: true, showEmail: false });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleNotif = k => setNotifs(p => ({ ...p, [k]: !p[k] }));
  const togglePrivacy = k => setPrivacy(p => ({ ...p, [k]: !p[k] }));

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Notifications */}
      <div className="bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-[var(--color-gs-border)] flex items-center gap-2">
          <Bell size={18} className="text-[var(--color-gs-cyan)]" />
          <h3 className="font-bold">Notification Preferences</h3>
        </div>
        <div className="divide-y divide-[var(--color-gs-border)]">
          {[
            { key: 'events', label: 'Event Announcements', desc: 'New hackathons, workshops, and more' },
            { key: 'teams', label: 'Team Invitations', desc: 'When someone invites you to a group' },
            { key: 'messages', label: 'Direct Messages', desc: 'New DMs from other students' },
            { key: 'leaderboard', label: 'Leaderboard Updates', desc: 'Your rank changes' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-5">
              <div>
                <p className="font-medium text-[var(--color-gs-text-main)]">{label}</p>
                <p className="text-xs text-[var(--color-gs-text-muted)] mt-0.5">{desc}</p>
              </div>
              <Toggle checked={notifs[key]} onChange={() => toggleNotif(key)} />
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-[var(--color-gs-border)] flex items-center gap-2">
          <Shield size={18} className="text-[var(--color-gs-green)]" />
          <h3 className="font-bold">Privacy Settings</h3>
        </div>
        <div className="divide-y divide-[var(--color-gs-border)]">
          {[
            { key: 'publicProfile', label: 'Public Profile', desc: 'Anyone can view your profile' },
            { key: 'showSkills', label: 'Show Skills', desc: 'Display your skills to other students' },
            { key: 'showEmail', label: 'Show Email', desc: 'Share email address on your profile' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-5">
              <div>
                <p className="font-medium text-[var(--color-gs-text-main)]">{label}</p>
                <p className="text-xs text-[var(--color-gs-text-muted)] mt-0.5">{desc}</p>
              </div>
              <Toggle checked={privacy[key]} onChange={() => togglePrivacy(key)} />
            </div>
          ))}
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-[var(--color-gs-border)] flex items-center gap-2">
          <Settings size={18} className="text-[var(--color-gs-text-muted)]" />
          <h3 className="font-bold">Account</h3>
        </div>
        <div className="divide-y divide-[var(--color-gs-border)]">
          {[
            { label: 'Change Password', icon: Lock, action: () => showToast('Password change email sent!') },
            { label: 'Export My Data', icon: Eye, action: () => showToast('Data export started.') },
          ].map(({ label, icon: Icon, action }) => (
            <button key={label} onClick={action} className="w-full flex items-center justify-between p-5 hover:bg-[var(--color-gs-bg)] transition-colors">
              <div className="flex items-center gap-3">
                <Icon size={18} className="text-[var(--color-gs-text-muted)]" />
                <span className="font-medium text-[var(--color-gs-text-main)]">{label}</span>
              </div>
              <ChevronRight size={16} className="text-[var(--color-gs-text-muted)]" />
            </button>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-red-500/20">
          <h3 className="font-bold text-red-400">Danger Zone</h3>
        </div>
        <div className="p-5 space-y-4">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-center gap-3 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(239,68,68,0.25)] hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]"
          >
            <LogOut size={20} />
            Logout of GroupSync
          </button>
          <button
            onClick={() => showToast('Account deletion request submitted.')}
            className="w-full flex items-center justify-center gap-2 py-3 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/10 transition-colors text-sm font-medium"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-[slideIn_0.2s_ease-out]">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
                <LogOut size={28} className="text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-[var(--color-gs-text-main)] mb-2">Logout?</h2>
              <p className="text-[var(--color-gs-text-muted)] text-sm mb-6">Are you sure you want to log out of GroupSync?</p>
              <div className="flex gap-3">
                <button onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 rounded-xl border border-[var(--color-gs-border)] text-[var(--color-gs-text-main)] hover:bg-[var(--color-gs-bg)] transition-colors font-medium">
                  Cancel
                </button>
                <button onClick={() => { setShowLogoutModal(false); handleLogout(); }}
                  className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main UserProfile Component ───────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'teams', label: 'Teams', icon: Users },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function UserProfile() {
  const { user, setUser, factions, showToast, logout } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user || {});
  const [isSaving, setIsSaving] = useState(false);

  // Sync formData with user when user changes (e.g. initial load)
  React.useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const previousUser = { ...user };
    
    // Optimistic update
    setUser({ ...user, ...formData });

    // API Call
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          email: formData.email,
          dob: formData.dob,
          college: formData.college,
          course: formData.course,
          branch: formData.branch,
          cgpa: formData.cgpa,
          bio: formData.bio,
          social_links: formData.social_links || formData.socialLinks,
          skills: formData.skills,
          interests: formData.interests,
          name: formData.name
        })
        .eq('id', user.id);

      if (error) throw error;
      
      showToast('Profile updated successfully!', 'success');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      // Revert optimistic update
      setUser(previousUser);
      setFormData(previousUser);
      showToast('Failed to update profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return (
    <div className="flex items-center justify-center h-64 text-[var(--color-gs-text-muted)]">
      <p>Please log in to view your profile.</p>
    </div>
  );

  const f = factions[user.faction];
  const FactionIcon = f?.icon || User;

  return (
    <div className="space-y-6 animate-[slideIn_0.3s_ease-out]">
      {/* Profile Hero */}
      <div className="bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-3xl p-8 relative overflow-hidden">
        {/* Faction watermark */}
        <div className={`absolute right-0 top-0 opacity-[0.06] pointer-events-none scale-150 -translate-y-1/4 translate-x-1/4 ${f?.color}`}>
          <FactionIcon size={280} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
          {/* Avatar */}
          <div className={`w-24 h-24 md:w-28 md:h-28 rounded-2xl flex items-center justify-center text-5xl bg-[var(--color-gs-bg)] border-4 shadow-[0_0_25px_currentColor] ${f?.border} ${f?.color} shrink-0`}>
            {user.avatar || '🎓'}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              {isEditing ? (
                <input type="text" value={formData.name || formData.fullName || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="text-3xl font-bold bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded-lg px-3 py-1 text-[var(--color-gs-text-main)] max-w-xs" placeholder="Your Name" />
              ) : (
                <h1 className="text-3xl font-bold text-[var(--color-gs-text-main)]">{user.name || user.fullName}</h1>
              )}
              <span className={`px-3 py-1 rounded-full text-xs font-bold border self-start md:self-center ${f?.border} ${f?.color} bg-current/10`}
                style={{ backgroundColor: 'transparent' }}>
                {f?.name}
              </span>
            </div>
            {!isEditing && (
              <>
                <p className="text-[var(--color-gs-text-muted)] mb-4">{user.college || 'College'} · {user.year || '3rd Year'}</p>
                <p className="text-sm text-[var(--color-gs-text-muted)] max-w-lg">{user.bio || 'Building the future, one commit at a time. 🚀'}</p>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-5 justify-center md:justify-start">
              {isEditing ? (
                <>
                  <button onClick={handleSaveProfile} disabled={isSaving}
                    className="px-5 py-2 bg-[var(--color-gs-green)] text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSaving ? <Zap className="animate-pulse" size={15} /> : <Save size={15} />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button onClick={() => { setIsEditing(false); setFormData(user); }} disabled={isSaving}
                    className="px-5 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    <X size={15} /> Cancel
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)}
                  className="px-5 py-2 bg-[var(--color-gs-cyan)] text-[#0f172a] font-bold rounded-xl hover:bg-cyan-400 transition-colors flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(0,212,255,0.3)]">
                  <Edit3 size={15} /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-[var(--color-gs-border)] overflow-x-auto">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 font-medium text-sm rounded-t-xl transition-all whitespace-nowrap border-b-2 -mb-px ${isActive ? 'text-[var(--color-gs-cyan)] border-[var(--color-gs-cyan)] bg-[var(--color-gs-cyan)]/5' : 'text-[var(--color-gs-text-muted)] border-transparent hover:text-[var(--color-gs-text-main)]'}`}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab user={user} factions={factions} isEditing={isEditing} formData={formData} setFormData={setFormData} />}
      {activeTab === 'events' && <EventsTab />}
      {activeTab === 'teams' && <TeamsTab showToast={showToast} />}
      {activeTab === 'achievements' && <AchievementsTab />}
      {activeTab === 'settings' && <SettingsTab logout={logout} showToast={showToast} />}
    </div>
  );
}
