'use client'
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Compass, Sparkles, X, ImagePlus, Trash2 } from 'lucide-react';
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
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handlePosterSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setPosterFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPosterPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handlePosterDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handlePosterSelect(file);
  };

  const removePoster = () => {
    setPosterFile(null);
    setPosterPreview(null);
  };

  // BUG-2/3 FIX: Fallback groups shown ONLY when the database has no groups yet.
  // These use IDs that won't conflict with real Supabase rows (which are integers),
  // and the 'View Group' button routes to /browse instead of /group/:id for dummies.
  const FALLBACK_GROUPS = groups.length === 0 ? [
    {
       id: '__fallback-1',
       name: 'AI Innovators',
       event: 'Tech Fest 2026',
       type: 'Technical',
       description: 'A group for AI enthusiasts to collaborate on cutting edge projects.',
       skills: ['Python', 'Machine Learning', 'AI & ML'],
       members: 2,
       maxMembers: 5,
       privacy: 'public',
       isFallback: true
    },
    {
       id: '__fallback-2',
       name: 'Design Mavericks',
       event: 'UI/UX Hackathon',
       type: 'Cultural',
       description: 'Looking for creative minds to design the next big thing in EdTech.',
       skills: ['Figma', 'UI/UX', 'Graphic Design'],
       members: 1,
       maxMembers: 4,
       privacy: 'public',
       isFallback: true
    },
    {
       id: '__fallback-3',
       name: 'Blockchain Builders',
       event: 'Web3 Summit',
       type: 'Hackathon',
       description: 'Building decentralized tracking applications for logistics.',
       skills: ['Solidity', 'Web3', 'React'],
       members: 3,
       maxMembers: 6,
       privacy: 'public',
       isFallback: true
    }
  ] : [];

  const allGroups = [...FALLBACK_GROUPS, ...groups];

  const filteredGroups = allGroups.filter(g => 
    g.privacy !== 'private' &&
    (filterType === 'All' || g.type === filterType) &&
    (g.name.toLowerCase().includes(searchTerm.toLowerCase()) || g.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroup.name || !newGroup.description) return;

    try {
      // Upload poster image to Supabase Storage if provided
      let posterUrl = null;
      if (posterFile) {
        const fileExt = posterFile.name.split('.').pop();
        const fileName = `group-posters/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('group-assets')
          .upload(fileName, posterFile, { upsert: true });
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('group-assets').getPublicUrl(fileName);
          posterUrl = urlData?.publicUrl || null;
        } else {
          console.warn('Poster upload failed:', uploadError.message);
        }
      }

      const dbGroup = {
        name: newGroup.name,
        event: newGroup.event || 'Hackathon',
        type: newGroup.type,
        description: newGroup.description,
        skills: newGroup.skills,
        members: 1, 
        max_members: newGroup.maxMembers,
        privacy: newGroup.privacy,
        admin_id: user?.id || null,
        ...(posterUrl && { poster_url: posterUrl })
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
      setPosterFile(null);
      setPosterPreview(null);
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
      <div className="space-y-8 animate-page-load">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold font-heading text-white">Browse Groups</h1>
          <p className="text-[var(--color-gs-text-muted)] mt-2">Find your next team or start your own.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-gradient-to-r from-[#00f0ff] to-[#a855f7] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] btn-scale flex items-center gap-2">
          <Sparkles size={18} /> Create Group
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center glass-card p-2 rounded-2xl">
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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filterType === type ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]' : 'bg-transparent text-[var(--color-gs-text-muted)] hover:text-white border border-transparent hover:border-white/10 hover:bg-white/5'}`}
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
            <div key={group.id} className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:translate-y-[-4px] hover:border-[#00f0ff]/30 hover:shadow-[0_10px_30px_rgba(0,240,255,0.1)] flex flex-col h-full group">
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold font-heading text-white">{group.name}</h3>
                    <p className="text-sm text-[var(--color-gs-text-muted)]">{group.event}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0 ml-2">
                    {group.privacy === 'private' && (
                      <span className={"px-3 py-1 rounded-full text-xs font-bold border border-gray-600 text-gray-400"}>Private</span>
                    )}
                    <span className={"px-3 py-1 rounded-full text-xs font-bold " + badgeClass}>{group.type}</span>
                  </div>
                </div>

                {group.poster_url && (
                  <div className="w-full h-56 shrink-0 mb-6 rounded-xl overflow-hidden border border-white/5 bg-black/40 relative group-hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-shadow">
                    <img 
                      src={group.poster_url} 
                      alt={`${group.name} poster`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050810]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}

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
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-gradient-to-r from-[#00f0ff] to-[#a855f7] transition-all" style={{ width: ((group.members / group.maxMembers) * 100) + '%' }} />
                </div>
                
                <button 
                  onClick={() => {
                    if (group.isFallback) {
                      showToast('This is a sample group. Create or join a real group!', 'info');
                      return;
                    }
                    setSelectedGroupId(group.id);
                    navigate(`/group/${group.id}`);
                  }}
                  className="w-full py-3 rounded-xl font-bold transition-all bg-white/5 border border-white/10 hover:border-[#00f0ff] hover:text-[#00f0ff] hover:bg-[#00f0ff]/5 btn-scale text-white"
                >
                  {group.isFallback ? 'Sample Group' : 'View Group'}
                </button>
              </div>
              </div>{/* end inner content wrapper */}
            </div>
          );
        })}
      </div>
      </div>

      {/* Create Group Modal via Portal - renders at document.body to escape layout containers */}
      {isModalOpen && ReactDOM.createPortal(
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-[slideInUp_0.2s_ease-out]"
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <div className="glass-card border border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto custom-scrollbar relative">
            <div className="absolute top-0 right-0 p-6 pointer-events-none">
               <div className="w-32 h-32 bg-[#00f0ff]/10 rounded-full blur-3xl" />
            </div>
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h2 className="text-2xl font-bold font-heading text-white">Create Group</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[var(--color-gs-text-muted)] hover:text-white transition-colors pointer-events-auto"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--color-gs-text-muted)] mb-1 font-medium">Group Name</label>
                <input required type="text" value={newGroup.name} onChange={e => setNewGroup({...newGroup, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-[#00f0ff] focus:bg-white/10 transition-colors text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--color-gs-text-muted)] mb-1 font-medium">Event</label>
                  <input required type="text" value={newGroup.event} onChange={e => setNewGroup({...newGroup, event: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-[#00f0ff] focus:bg-white/10 transition-colors text-white placeholder-white/30" placeholder="e.g. Hackathon" />
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-gs-text-muted)] mb-1 font-medium">Type</label>
                  <select value={newGroup.type} onChange={e => setNewGroup({...newGroup, type: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-[#00f0ff] focus:bg-white/10 transition-colors text-white appearance-none">
                    <option value="Hackathon">Hackathon</option>
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-[var(--color-gs-text-muted)] mb-1 font-medium">Privacy</label>
                <select value={newGroup.privacy} onChange={e => setNewGroup({...newGroup, privacy: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-[#00f0ff] focus:bg-white/10 transition-colors text-white appearance-none">
                  <option value="public">Public (Anyone can request)</option>
                  <option value="private">Private (Invite only / Hidden)</option>
                  <option value="password">Password Protected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[var(--color-gs-text-muted)] mb-1 font-medium">Description</label>
                <textarea required rows="3" value={newGroup.description} onChange={e => setNewGroup({...newGroup, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-[#00f0ff] focus:bg-white/10 transition-colors text-white resize-none" />
              </div>
              <div>
                <label className="block text-sm text-[var(--color-gs-text-muted)] mb-1 font-medium">Max Members: {newGroup.maxMembers}</label>
                <input type="range" min="2" max="10" value={newGroup.maxMembers} onChange={e => setNewGroup({...newGroup, maxMembers: parseInt(e.target.value)})} className="w-full accent-[#00f0ff]" />
              </div>
              <div>
                <label className="block text-sm text-[var(--color-gs-text-muted)] mb-2 font-medium">Skills Needed (Select up to 5)</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar p-1">
                  {ONBOARDING_SKILLS.map(s => (
                    <button type="button" key={s} onClick={() => toggleModalSkill(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${newGroup.skills.includes(s) ? "bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.2)]" : "bg-white/5 border-white/10 text-[var(--color-gs-text-muted)] hover:border-white/30 hover:text-white"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Poster / Image Upload */}
              <div>
                <label className="block text-sm text-[var(--color-gs-text-muted)] mb-2">Event Poster / Banner <span className="text-xs opacity-60">(optional)</span></label>
                {posterPreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-[var(--color-gs-cyan)]/40 group">
                    <img src={posterPreview} alt="Event poster preview" className="w-full h-40 object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={removePoster}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-xs text-white/80 truncate">{posterFile?.name}</p>
                    </div>
                  </div>
                ) : (
                  <label
                    className={`flex flex-col items-center justify-center gap-3 w-full h-36 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                      isDragOver
                        ? 'border-[#00f0ff] bg-[#00f0ff]/10 scale-[1.01]'
                        : 'border-white/10 bg-white/5 hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/5'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handlePosterDrop}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePosterSelect(e.target.files[0])}
                    />
                    <div className={`p-3 rounded-full transition-colors ${ isDragOver ? 'bg-[#00f0ff]/20' : 'bg-white/5' }`}>
                      <ImagePlus size={22} className={isDragOver ? 'text-[#00f0ff]' : 'text-white/50'} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-white/70">
                        {isDragOver ? 'Drop it here!' : 'Click to upload or drag & drop'}
                      </p>
                      <p className="text-xs text-white/40 mt-1">PNG, JPG, WEBP up to 5 MB</p>
                    </div>
                  </label>
                )}
              </div>
              
              <div className="pt-4 relative z-10">
                <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#00f0ff] to-[#a855f7] text-white font-bold rounded-xl hover:opacity-90 btn-scale transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]">
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
