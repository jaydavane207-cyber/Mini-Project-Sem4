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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black font-heading text-gs-text-main tracking-tight drop-shadow-sm flex items-center gap-3">
              Browse Groups
            </h1>
            <p className="text-gs-text-muted mt-2 text-lg font-medium">Find your next team or start your own vanguard.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-gradient-to-r from-gs-primary to-gs-secondary text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center gap-2">
            <Sparkles size={20} className="drop-shadow-[0_0_8px_currentColor]" /> Create Group
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-gs-card border border-gs-border p-3 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative z-10">
          <div className="flex-1 w-full pl-5 pr-3 py-2 flex items-center gap-3">
            <Compass className="text-gs-text-muted" size={24} />
            <input 
              type="text" 
              placeholder="Search groups or events..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full bg-transparent border-none outline-none text-gs-text-main placeholder-opacity-50 placeholder-gs-text-muted font-medium text-lg"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 px-2">
            {['All', 'Hackathon', 'Technical', 'Cultural'].map(type => (
              <button 
                key={type} 
                onClick={() => setFilterType(type)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] ${filterType === type ? 'bg-gs-primary/20 text-gs-primary border border-gs-primary/50 shadow-[0_0_20px_rgba(0,240,255,0.2)]' : 'bg-gs-bg text-gs-text-muted hover:text-gs-text-main border border-gs-border hover:border-white/20'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Group Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {filteredGroups.map(group => {
            const typeColors = {
              'Hackathon': 'text-gs-cyan bg-gs-cyan/10 border-gs-cyan/30',
              'Technical': 'text-gs-violet bg-gs-violet/10 border-gs-violet/30',
              'Cultural': 'text-gs-amber bg-gs-amber/10 border-gs-amber/30'
            };
            const badgeClass = typeColors[group.type] || typeColors['Technical'];
            const isFull = group.members >= group.maxMembers;

            return (
              <div key={group.id} className="group relative rounded-[2.5rem] p-[1.5px] overflow-hidden cursor-pointer transition-all duration-500 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:-translate-y-2 flex flex-col h-full bg-gs-card">
                <div className="absolute inset-0 bg-gradient-to-br from-gs-border via-transparent to-gs-border opacity-50 group-hover:opacity-100 group-hover:from-gs-primary group-hover:via-gs-secondary group-hover:to-gs-primary transition-all duration-700" />
                
                <div className="relative h-full bg-gs-bg backdrop-blur-xl rounded-[calc(2.5rem-1px)] border border-gs-border p-6 md:p-8 flex flex-col shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden">
                   {/* Background Decorative Mesh */}
                   <div className="absolute -top-10 -right-10 w-48 h-48 bg-gs-primary/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-gs-primary/20 transition-all duration-700" />
                   
                   <div className="relative z-10 flex-1 flex flex-col h-full">
                     <div className="flex justify-between items-start mb-5">
                       <div>
                         <h3 className="text-2xl font-black font-heading text-gs-text-main mb-1 line-clamp-1">{group.name}</h3>
                         <p className="text-sm font-bold text-gs-primary tracking-wide uppercase">{group.event}</p>
                       </div>
                       <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                         {group.privacy === 'private' && (
                           <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-black border border-gs-border bg-gs-bg text-gs-text-muted uppercase tracking-widest shadow-inner">Private</span>
                         )}
                         <span className={"px-3 py-1 rounded-full text-[10px] sm:text-xs font-black border uppercase tracking-widest shadow-inner " + badgeClass}>{group.type}</span>
                       </div>
                     </div>

                     {group.poster_url && (
                       <div className="w-full h-56 shrink-0 mb-6 rounded-2xl overflow-hidden border border-gs-border/50 bg-black/40 relative group-hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all basis-auto">
                         <img 
                           src={group.poster_url} 
                           alt={`${group.name} poster`} 
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                       </div>
                     )}

                     <p className="text-gs-text-muted text-sm md:text-base font-medium mb-6 flex-1 line-clamp-3">{group.description}</p>
                     
                     <div className="mb-8">
                       <p className="text-[10px] sm:text-xs text-gs-text-muted/70 uppercase font-black mb-3 tracking-widest">Target Skills</p>
                       <div className="flex flex-wrap gap-2">
                         {group.skills.map(skill => (
                           <span key={skill} className="px-3 py-1.5 bg-gs-card border border-gs-border rounded-lg text-[11px] sm:text-xs font-bold text-gs-text-muted shadow-inner group-hover:border-gs-primary/30 group-hover:text-gs-text-main transition-colors">
                             {skill}
                           </span>
                         ))}
                       </div>
                     </div>

                     <div className="mt-auto">
                       <div className="flex justify-between items-center mb-4">
                         <span className="text-xs sm:text-sm font-bold text-gs-text-muted uppercase tracking-wider">{`Occupancy (${group.members}${group.maxMembers ? '/' + group.maxMembers : ''})`}</span>
                         <div className="flex -space-x-3">
                           {Array.from({length: Math.min(group.members, 5)}).map((_, i) => (
                             <div key={i} className="w-10 h-10 rounded-full bg-gs-bg border-2 border-white/10 flex items-center justify-center text-sm shadow-md drop-shadow-md z-10 hover:z-20 hover:scale-110 transition-transform">
                               {ONBOARDING_AVATARS[i % ONBOARDING_AVATARS.length]}
                             </div>
                           ))}
                           {group.members > 5 && (
                             <div className="w-10 h-10 rounded-full bg-gs-border border-2 border-white/10 flex items-center justify-center text-xs font-bold shadow-md z-10 text-gs-text-main">
                               +{group.members - 5}
                             </div>
                           )}
                         </div>
                       </div>
                       
                       <div className="w-full h-2.5 bg-gs-card rounded-full overflow-hidden mb-6 shadow-inner border border-white/5">
                         <div className="h-full bg-gradient-to-r from-gs-primary to-gs-secondary transition-all shadow-[0_0_10px_currentColor] relative" style={{ width: ((group.members / group.maxMembers) * 100) + '%' }}>
                            <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
                         </div>
                       </div>
                       
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           if (group.isFallback) {
                             showToast('This is a sample group. Create or join a real group!', 'info');
                             return;
                           }
                           setSelectedGroupId(group.id);
                           navigate(`/group/${group.id}`);
                         }}
                         className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all bg-gs-card shadow-inner border border-gs-border text-gs-text-main group-hover:border-gs-primary group-hover:text-gs-primary group-hover:bg-gs-primary/5 hover:scale-[1.02] active:scale-95"
                       >
                         {group.isFallback ? 'Sample Preview' : 'Initiate Sync'}
                       </button>
                     </div>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Group Modal via Portal */}
      {isModalOpen && ReactDOM.createPortal(
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[9999] flex items-center justify-center p-4 sm:p-6 animate-[slideInUp_0.2s_ease-out]"
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <div className="bg-gs-card border border-gs-border rounded-[2.5rem] p-6 sm:p-10 max-w-xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar relative shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gs-primary/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="flex justify-between items-center mb-8 relative z-10">
              <h2 className="text-3xl font-black font-heading text-gs-text-main tracking-tight flex items-center gap-3">
                 <Sparkles className="text-gs-primary" /> Create Vanguard
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-10 h-10 rounded-full bg-gs-bg border border-gs-border flex items-center justify-center text-gs-text-muted hover:text-gs-primary hover:border-gs-primary transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateGroup} className="space-y-6 relative z-10">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gs-text-muted mb-2 font-black">Group Name</label>
                <input required type="text" value={newGroup.name} onChange={e => setNewGroup({...newGroup, name: e.target.value})} className="w-full bg-gs-bg border border-gs-border shadow-inner rounded-xl p-4 outline-none focus:border-gs-primary focus:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all text-gs-text-main font-medium" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gs-text-muted mb-2 font-black">Event / Scope</label>
                  <input required type="text" value={newGroup.event} onChange={e => setNewGroup({...newGroup, event: e.target.value})} className="w-full bg-gs-bg border border-gs-border shadow-inner rounded-xl p-4 outline-none focus:border-gs-primary focus:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all text-gs-text-main font-medium placeholder-gs-text-muted/50" placeholder="e.g. Meta Hackathon" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gs-text-muted mb-2 font-black">Category Type</label>
                  <select value={newGroup.type} onChange={e => setNewGroup({...newGroup, type: e.target.value})} className="w-full bg-gs-bg border border-gs-border shadow-inner rounded-xl p-4 outline-none focus:border-gs-primary transition-all text-gs-text-main font-medium appearance-none">
                    <option value="Hackathon">Hackathon</option>
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gs-text-muted mb-2 font-black">Privacy Protocol</label>
                <select value={newGroup.privacy} onChange={e => setNewGroup({...newGroup, privacy: e.target.value})} className="w-full bg-gs-bg border border-gs-border shadow-inner rounded-xl p-4 outline-none focus:border-gs-primary transition-all text-gs-text-main font-medium appearance-none">
                  <option value="public">Public (Open Requests)</option>
                  <option value="private">Private (Invite Only)</option>
                  <option value="password">Password Encrypted</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gs-text-muted mb-2 font-black">Mission Description</label>
                <textarea required rows="4" value={newGroup.description} onChange={e => setNewGroup({...newGroup, description: e.target.value})} className="w-full bg-gs-bg border border-gs-border shadow-inner rounded-xl p-4 outline-none focus:border-gs-primary focus:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all text-gs-text-main font-medium resize-none leading-relaxed" />
              </div>
              <div className="bg-gs-bg/50 p-6 rounded-2xl border border-gs-border/50">
                <div className="flex justify-between items-center mb-4">
                   <label className="block text-xs uppercase tracking-widest text-gs-text-muted font-black">Max Unit Capacity</label>
                   <span className="px-3 py-1 bg-gs-primary/20 text-gs-primary rounded-lg font-black">{newGroup.maxMembers}</span>
                </div>
                <input type="range" min="2" max="10" value={newGroup.maxMembers} onChange={e => setNewGroup({...newGroup, maxMembers: parseInt(e.target.value)})} className="w-full accent-gs-primary cursor-ew-resize" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gs-text-muted mb-3 font-black">Required Skill Vectors (Max 5)</label>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
                  {ONBOARDING_SKILLS.map(s => (
                    <button type="button" key={s} onClick={() => toggleModalSkill(s)} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${newGroup.skills.includes(s) ? "bg-gs-primary/20 border-gs-primary text-gs-primary shadow-[0_0_15px_rgba(0,240,255,0.2)]" : "bg-gs-bg border-gs-border text-gs-text-muted hover:border-gs-border/80 hover:text-gs-text-main shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Poster / Image Upload */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-gs-text-muted mb-3 font-black">Visual Asset / Poster <span className="opacity-60 text-[10px]">(Optional)</span></label>
                {posterPreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-gs-cyan/40 group shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                    <img src={posterPreview} alt="Event poster preview" className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <button
                        type="button"
                        onClick={removePoster}
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                      >
                        <Trash2 size={16} /> Delete Asset
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    className={`flex flex-col items-center justify-center gap-4 w-full h-40 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                      isDragOver
                        ? 'border-gs-primary bg-gs-primary/10 scale-[1.02]'
                        : 'border-gs-border bg-gs-bg shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-gs-primary/50 hover:bg-gs-primary/5'
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
                    <div className={`p-4 rounded-full transition-colors ${ isDragOver ? 'bg-gs-primary/20 shadow-[0_0_15px_rgba(0,240,255,0.2)]' : 'bg-gs-card border border-gs-border shadow-sm' }`}>
                      <ImagePlus size={24} className={isDragOver ? 'text-gs-primary' : 'text-gs-text-muted'} />
                    </div>
                    <div className="text-center px-4">
                      <p className="text-sm font-bold text-gs-text-main mb-1">
                        {isDragOver ? 'Drop protocol asset here!' : 'Click to select or drag & drop'}
                      </p>
                      <p className="text-xs text-gs-text-muted font-medium">Supported formats: PNG, JPG, WEBP (Max 5MB)</p>
                    </div>
                  </label>
                )}
              </div>
              
              <div className="pt-6 relative z-10">
                <button type="submit" className="w-full py-4 bg-gradient-to-r from-gs-primary to-gs-secondary text-white font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] flex justify-center items-center gap-2">
                  <Sparkles size={20} /> Initialize Vanguard Protocol
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
