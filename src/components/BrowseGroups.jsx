'use client'
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Compass, Sparkles, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ONBOARDING_SKILLS, ONBOARDING_AVATARS } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase';

export default function BrowseGroups() {
  const navigate = useNavigate();
  const { user, groups, setGroups, showToast, setSelectedGroupId, refreshGroups } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', event: '', type: 'Hackathon', description: '', maxMembers: 4, skills: [], privacy: 'public' });

  const filteredGroups = groups.filter(g => 
    g.privacy !== 'private' &&
    (filterType === 'All' || g.type === filterType) &&
    (g.name.toLowerCase().includes(searchTerm.toLowerCase()) || g.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroup.name || !newGroup.description) return;

    try {
      const dbGroup = {
        name: newGroup.name,
        event: newGroup.event || 'Hackathon',
        type: newGroup.type,
        description: newGroup.description,
        skills: newGroup.skills,
        members: 1, 
        max_members: newGroup.maxMembers,
        privacy: newGroup.privacy,
        admin_id: user?.id || null
      };

      const { data: insertedGroup, error: groupError } = await supabase
        .from('groups')
        .insert([dbGroup])
        .select()
        .single();

      if (groupError) {
        throw groupError;
      }

      // 🚨 CRITICAL: Add the creator as the first member!
      if (user?.id && insertedGroup) {
        const { error: memberError } = await supabase
          .from('group_members')
          .insert({
            group_id: insertedGroup.id,
            profile_id: user.id
          });
          
        if (memberError) {
          console.error('Error adding creator as member:', memberError);
          // We still created the group, but this might cause UI issues
        }
      }

      // Refresh data via context
      if (refreshGroups) {
        await refreshGroups();
      } else {
        const finalGroup = {
          ...insertedGroup,
          adminId: insertedGroup.admin_id,
          maxMembers: insertedGroup.max_members,
          memberIds: [user.id]
        };
        setGroups([finalGroup, ...groups]);
      }

      setIsModalOpen(false);
      showToast('Group created successfully!');
      setNewGroup({ name: '', event: '', type: 'Hackathon', description: '', maxMembers: 4, skills: [], privacy: 'public' });
    } catch (err) {
      console.error('Error creating group:', err);
      showToast(`Group Creation Failed: ${err.message || 'Check connection'}`, 'error');
    }
  };

  const toggleModalSkill = (skill) => {
    if (newGroup.skills.includes(skill)) {
      setNewGroup({ ...newGroup, skills: newGroup.skills.filter(s => s !== skill) });
    } else {
      setNewGroup({ ...newGroup, skills: [...newGroup.skills, skill] });
    }
  };

  return (
    <>
      <div className="space-y-8 animate-[slideIn_0.3s_ease-out]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">Browse Groups</h1>
          <p className="text-[var(--color-gs-text-muted)] mt-2">Find your next team or start your own.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-[var(--color-gs-cyan)] text-[#0f172a] font-bold rounded-xl hover:bg-cyan-400 transition-colors flex items-center gap-2">
          <Sparkles size={18} /> Create Group
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] p-2 rounded-2xl">
        <div className="flex-1 w-full pl-4 pr-2 py-2 flex items-center gap-3">
          <Compass className="text-[var(--color-gs-text-muted)]" size={20} />
          <input 
            type="text" 
            placeholder="Search groups or events..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full bg-transparent border-none outline-none text-[var(--color-gs-text-main)] placeholder-gray-500"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 px-2">
          {['All', 'Hackathon', 'Technical', 'Cultural'].map(type => (
            <button 
              key={type} 
              onClick={() => setFilterType(type)}
              className={"px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap " + (filterType === type ? 'bg-[var(--color-gs-bg)] text-[var(--color-gs-cyan)] border border-[var(--color-gs-cyan)]/50' : 'bg-transparent text-[var(--color-gs-text-muted)] hover:text-[var(--color-gs-text-main)] border border-transparent hover:border-gray-700')}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Group Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGroups.map(group => {
          const typeColors = {
            'Hackathon': 'text-[var(--color-gs-cyan)] bg-[var(--color-gs-cyan)]/10 border border-[var(--color-gs-cyan)]/30',
            'Technical': 'text-[var(--color-gs-violet)] bg-[var(--color-gs-violet)]/10 border border-[var(--color-gs-violet)]/30',
            'Cultural': 'text-[var(--color-gs-amber)] bg-[var(--color-gs-amber)]/10 border border-[var(--color-gs-amber)]/30'
          };
          const badgeClass = typeColors[group.type] || typeColors['Technical'];
          const isFull = group.members >= group.maxMembers;

          return (
            <div key={group.id} className="bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-2xl p-6 transition-all duration-300 hover:border-gray-500 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{group.name}</h3>
                  <p className="text-sm text-[var(--color-gs-text-muted)]">{group.event}</p>
                </div>
                <div className="flex items-center gap-2">
                  {group.privacy === 'private' && (
                    <span className={"px-3 py-1 rounded-full text-xs font-bold border border-gray-600 text-gray-400"}>Private</span>
                  )}
                  <span className={"px-3 py-1 rounded-full text-xs font-bold " + badgeClass}>{group.type}</span>
                </div>
              </div>
              
              <p className="text-[var(--color-gs-text-muted)] text-sm mb-6 flex-1">{group.description}</p>
              
              <div className="mb-6">
                <p className="text-xs text-[var(--color-gs-text-muted)] uppercase font-bold mb-2 tracking-wider">Skills Needed</p>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map(skill => (
                    <span key={skill} className="px-2 py-1 bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded-md text-xs text-[var(--color-gs-text-muted)]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[var(--color-gs-text-muted)]">{`Members (${group.members}${group.maxMembers ? '/' + group.maxMembers : ''})`}</span>
                  <div className="flex -space-x-2">
                    {Array.from({length: group.members}).map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-[var(--color-gs-border)] border-2 border-[var(--color-gs-card)] flex items-center justify-center text-xs">
                        {ONBOARDING_AVATARS[i % ONBOARDING_AVATARS.length]}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full h-2 bg-[var(--color-gs-border)] rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-[var(--color-gs-cyan)] transition-all" style={{ width: ((group.members / group.maxMembers) * 100) + '%' }} />
                </div>
                
                <button 
                  onClick={() => {
                    setSelectedGroupId(group.id);
                    navigate(`/group/${group.id}`);
                  }}
                  className={"w-full py-3 rounded-xl font-bold transition-all bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] hover:border-[var(--color-gs-cyan)] hover:text-[var(--color-gs-cyan)]"}
                >
                  View Group
                </button>
              </div>
            </div>
          );
        })}
      </div>
      </div>

      {/* Create Group Modal via Portal - renders at document.body to escape layout containers */}
      {isModalOpen && ReactDOM.createPortal(
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <div className="bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create Group</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[var(--color-gs-text-muted)] hover:text-[var(--color-gs-text-main)]"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--color-gs-text-muted)] mb-1">Group Name</label>
                <input required type="text" value={newGroup.name} onChange={e => setNewGroup({...newGroup, name: e.target.value})} className="w-full bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded-lg p-3 outline-none focus:border-[var(--color-gs-cyan)] text-[var(--color-gs-text-main)]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--color-gs-text-muted)] mb-1">Event</label>
                  <input required type="text" value={newGroup.event} onChange={e => setNewGroup({...newGroup, event: e.target.value})} className="w-full bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded-lg p-3 outline-none focus:border-[var(--color-gs-cyan)] text-[var(--color-gs-text-main)] placeholder-gray-500" placeholder="e.g. Hackathon" />
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-gs-text-muted)] mb-1">Type</label>
                  <select value={newGroup.type} onChange={e => setNewGroup({...newGroup, type: e.target.value})} className="w-full bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded-lg p-3 outline-none focus:border-[var(--color-gs-cyan)] text-[var(--color-gs-text-main)] appearance-none">
                    <option value="Hackathon">Hackathon</option>
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-[var(--color-gs-text-muted)] mb-1">Privacy</label>
                <select value={newGroup.privacy} onChange={e => setNewGroup({...newGroup, privacy: e.target.value})} className="w-full bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded-lg p-3 outline-none focus:border-[var(--color-gs-cyan)] text-[var(--color-gs-text-main)] appearance-none">
                  <option value="public">Public (Anyone can request)</option>
                  <option value="private">Private (Invite only / Hidden)</option>
                  <option value="password">Password Protected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[var(--color-gs-text-muted)] mb-1">Description</label>
                <textarea required rows="3" value={newGroup.description} onChange={e => setNewGroup({...newGroup, description: e.target.value})} className="w-full bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded-lg p-3 outline-none focus:border-[var(--color-gs-cyan)] text-[var(--color-gs-text-main)] resize-none" />
              </div>
              <div>
                <label className="block text-sm text-[var(--color-gs-text-muted)] mb-1">Max Members: {newGroup.maxMembers}</label>
                <input type="range" min="2" max="10" value={newGroup.maxMembers} onChange={e => setNewGroup({...newGroup, maxMembers: parseInt(e.target.value)})} className="w-full accent-[var(--color-gs-cyan)]" />
              </div>
              <div>
                <label className="block text-sm text-[var(--color-gs-text-muted)] mb-2">Skills Needed (Select up to 5)</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar p-1">
                  {ONBOARDING_SKILLS.map(s => (
                    <button type="button" key={s} onClick={() => toggleModalSkill(s)} className={"px-3 py-1 rounded-md text-xs font-medium border transition-colors " + (newGroup.skills.includes(s) ? "bg-[var(--color-gs-cyan)]/20 border-[var(--color-gs-cyan)] text-[var(--color-gs-cyan)]" : "bg-[var(--color-gs-bg)] border-[var(--color-gs-border)] text-[var(--color-gs-text-muted)] hover:border-gray-500")}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="pt-4">
                <button type="submit" className="w-full py-4 bg-[var(--color-gs-cyan)] text-[#0f172a] font-bold rounded-xl hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(0,212,255,0.3)] hover:shadow-[0_0_25px_rgba(0,212,255,0.5)]">
                  Launch Group
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
