import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquare, Hash, Paperclip, Smile, Archive, Slash, Send, Reply, X, ChevronDown, Image, File, Search } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// ─── Emoji Data ───────────────────────────────────────────────────────────────
const EMOJI_CATEGORIES = {
  '😀 Smileys': ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','😊','😇','🥰','😍','🤩','😘','😗','😙','😚','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','😐','😑','😶','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','😈','👿','💀','☠️','💩','🤡','👹','👺','👻','👽','👾','🤖'],
  '👋 Gestures': ['👋','🤚','🖐️','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','🤲','🤝','🙏'],
  '❤️ Hearts': ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','☮️','✝️','☪️','🕉️','✡️','🔯'],
  '🎉 Celebration': ['🎉','🎊','🎈','🎁','🎀','🎗️','🎟️','🎫','🏆','🥇','🥈','🥉','🎖️','🏅','🎗','🎠','🎡','🎢','🎪','🎭','🎨','🎬','🎤','🎧','🎷','🎸','🎹','🎺','🎻','🥁','🪘'],
  '🐶 Animals': ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🙈','🙉','🙊','🐔','🐧','🐦','🐤','🦆','🦅','🦉','🦇','🐺','🐗','🦝','🦨'],
  '🍕 Food': ['🍕','🍔','🌮','🌯','🥗','🥘','🍲','🍜','🍝','🍛','🍣','🍱','🍤','🍙','🍚','🍘','🍥','🥮','🍡','🧆','🧇','🧈','🍳','🥞','🧇','🥓','🍖','🍗','🥩','🍠'],
  '⚽ Sports': ['⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱','🏓','🏸','🥊','🥋','🎯','⛳','🏹','🎣','🤿','🎽','🎿','🛷','🥌','⛸️','🏂','🪂'],
  '💻 Tech': ['💻','🖥️','🖨️','⌨️','🖱️','💾','💿','📀','📱','☎️','📞','📟','📺','📷','📸','🎮','🕹️','🎲','🃏','🎭','🔭','🔬','💡','🔋','🔌','💰','💳','📊','📈','📉'],
};

// ─── Emoji Picker Component ───────────────────────────────────────────────────
function EmojiPicker({ onSelect, onClose }) {
  const [activeCategory, setActiveCategory] = useState(Object.keys(EMOJI_CATEGORIES)[0]);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const filtered = search
    ? Object.values(EMOJI_CATEGORIES).flat().filter(e => e.includes(search)).slice(0, 40)
    : EMOJI_CATEGORIES[activeCategory] || [];

  return (
    <div ref={ref} className="absolute bottom-full left-0 mb-2 w-80 bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-2xl shadow-2xl z-30 overflow-hidden animate-[slideIn_0.15s_ease-out]">
      {/* Search */}
      <div className="p-3 border-b border-[var(--color-gs-border)]">
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search emoji..."
          className="w-full bg-[var(--color-gs-bg)] rounded-xl px-3 py-2 text-sm outline-none text-[var(--color-gs-text-main)] placeholder-[var(--color-gs-text-muted)]"
          autoFocus
        />
      </div>

      {/* Categories */}
      {!search && (
        <div className="flex gap-1 px-3 py-2 border-b border-[var(--color-gs-border)] overflow-x-auto">
          {Object.keys(EMOJI_CATEGORIES).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={"px-2 py-1 rounded-lg text-xs whitespace-nowrap transition-colors " + (activeCategory === cat ? 'bg-[var(--color-gs-cyan)]/20 text-[var(--color-gs-cyan)]' : 'text-[var(--color-gs-text-muted)] hover:bg-[var(--color-gs-bg)]')}
            >{cat.split(' ')[0]}</button>
          ))}
        </div>
      )}

      {/* Emojis Grid */}
      <div className="grid grid-cols-8 gap-0.5 p-3 max-h-48 overflow-y-auto">
        {filtered.map((emoji, i) => (
          <button
            key={i}
            onClick={() => { onSelect(emoji); onClose(); }}
            className="text-xl p-1.5 rounded-lg hover:bg-[var(--color-gs-bg)] transition-colors hover:scale-125"
          >{emoji}</button>
        ))}
      </div>
    </div>
  );
}

// ─── Message Reactions ─────────────────────────────────────────────────────────
const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

// ─── Main CampusChat ───────────────────────────────────────────────────────────
export default function CampusChat() {
  const { user, students, factions, showToast } = useAppContext();
  const [activeChat, setActiveChat] = useState('general');
  const [inputVal, setInputVal] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimer, setTypingTimer] = useState(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({ general: 0 });
  const [userSearch, setUserSearch] = useState('');
  const chatEndRef = useRef(null);
  const chatAreaRef = useRef(null);
  const fileInputRef = useRef(null);

  const [generalMessages, setGeneralMessages] = useState([
    { id: 1, text: "Anyone forming a team for the upcoming game jam?", senderId: 2, timestamp: "10:00 AM", reactions: { '👍': [4] }, replyTo: null },
    { id: 2, text: "Yeah! We need a UI designer. DM me 🎨", senderId: 4, timestamp: "10:02 AM", reactions: {}, replyTo: null },
    { id: 3, text: "I'm in! I've got React + Figma skills.", senderId: 1, timestamp: "10:05 AM", reactions: { '🔥': [2, 4] }, replyTo: null },
  ]);

  const [dmMessages, setDmMessages] = useState({
    2: [{ id: 101, text: "Hey, are you still looking for a game jam team?", senderId: 2, timestamp: "10:30 AM", reactions: {}, replyTo: null }]
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [generalMessages, dmMessages, activeChat]);

  const handleScroll = () => {
    const el = chatAreaRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 100);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollBtn(false);
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputVal.trim() && !mediaPreview) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage = {
      id: Date.now(),
      text: inputVal,
      senderId: 'ME',
      timestamp: timeString,
      reactions: {},
      replyTo: replyTo ? { text: replyTo.text, sender: replyTo.senderId } : null,
      media: mediaPreview,
    };

    if (activeChat === 'general') {
      setGeneralMessages(prev => [...prev, newMessage]);
    } else {
      setDmMessages(prev => ({ ...prev, [activeChat]: [...(prev[activeChat] || []), newMessage] }));
    }

    setInputVal('');
    setReplyTo(null);
    setMediaPreview(null);
    setIsTyping(false);
  };

  const handleInputChange = (e) => {
    setInputVal(e.target.value);
    setIsTyping(true);
    clearTimeout(typingTimer);
    setTypingTimer(setTimeout(() => setIsTyping(false), 1500));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) { showToast('File too large (max 25MB)', 'error'); return; }
    const isImage = file.type.startsWith('image/');
    if (isImage) {
      const reader = new FileReader();
      reader.onload = (ev) => setMediaPreview({ type: 'image', url: ev.target.result, name: file.name });
      reader.readAsDataURL(file);
    } else {
      setMediaPreview({ type: 'file', name: file.name, size: (file.size / 1024).toFixed(1) + ' KB' });
    }
    e.target.value = '';
  };

  const toggleReaction = (msgId, emoji) => {
    const updateMsg = (msgs) => msgs.map(m => {
      if (m.id !== msgId) return m;
      const r = { ...m.reactions };
      if (!r[emoji]) r[emoji] = [];
      const myIdx = r[emoji].indexOf('ME');
      if (myIdx === -1) r[emoji] = [...r[emoji], 'ME'];
      else r[emoji] = r[emoji].filter(id => id !== 'ME');
      if (r[emoji].length === 0) delete r[emoji];
      return { ...m, reactions: r };
    });

    if (activeChat === 'general') setGeneralMessages(prev => updateMsg(prev));
    else setDmMessages(prev => ({ ...prev, [activeChat]: updateMsg(prev[activeChat] || []) }));
  };

  const getMessages = () => activeChat === 'general' ? generalMessages : (dmMessages[activeChat] || []);
  const activeUser = activeChat !== 'general' ? students.find(s => s.id === activeChat) : null;
  const onlineStudents = students.filter(s => s.online);
  const dmHistoryIds = Object.keys(dmMessages).map(Number);
  const sidebarStudents = [...students].sort((a, b) => {
    const aH = dmHistoryIds.includes(a.id), bH = dmHistoryIds.includes(b.id);
    if (aH && !bH) return -1; if (!aH && bH) return 1;
    return b.online - a.online;
  }).filter(s => !userSearch || s.name.toLowerCase().includes(userSearch.toLowerCase()));

  const getSenderInfo = (msg) => {
    if (msg.senderId === 'ME') return { sender: user, isMe: true };
    const sender = activeChat === 'general' ? students.find(s => s.id === msg.senderId) : activeUser;
    return { sender, isMe: false };
  };

  const messages = getMessages();

  return (
    <div className="flex h-[85vh] bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-3xl overflow-hidden animate-[slideIn_0.3s_ease-out]">

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <div className="w-72 border-r border-[var(--color-gs-border)] flex flex-col bg-[var(--color-gs-bg)]/50 shrink-0">
        <div className="p-4 border-b border-[var(--color-gs-border)] space-y-3">
          <h2 className="text-lg font-bold">Messages</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gs-text-muted)]" />
            <input
              type="text"
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded-xl pl-9 pr-3 py-2 text-sm outline-none focus:border-[var(--color-gs-cyan)] text-[var(--color-gs-text-main)] placeholder-[var(--color-gs-text-muted)]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* General Channel */}
          <button
            onClick={() => setActiveChat('general')}
            className={"w-full flex items-center gap-3 p-4 border-b border-[var(--color-gs-border)] transition-colors text-left border-l-4 " + (activeChat === 'general' ? 'bg-[var(--color-gs-cyan)]/10 border-l-[var(--color-gs-cyan)]' : 'border-l-transparent hover:bg-[var(--color-gs-bg)]')}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--color-gs-cyan)] to-[var(--color-gs-violet)] flex items-center justify-center text-white shadow-lg shrink-0">
              <Hash size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">Campus General</h3>
                {unreadCounts.general > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">{unreadCounts.general}</span>
                )}
              </div>
              <p className="text-xs text-[var(--color-gs-text-muted)] truncate">{onlineStudents.length + 1} online</p>
            </div>
          </button>

          <div className="px-4 pt-4 pb-2 text-xs font-bold text-[var(--color-gs-text-muted)] uppercase tracking-wider">Direct Messages</div>

          {sidebarStudents.map(student => (
            <button
              key={student.id}
              onClick={() => setActiveChat(student.id)}
              className={"w-full flex items-center gap-3 p-4 border-b border-[var(--color-gs-border)] transition-colors text-left group border-l-4 " + (activeChat === student.id ? 'bg-[var(--color-gs-cyan)]/5 border-l-[var(--color-gs-cyan)]' : 'border-l-transparent hover:bg-[var(--color-gs-bg)]')}
            >
              <div className="relative shrink-0">
                <div className={"w-11 h-11 rounded-full border-2 flex items-center justify-center text-lg bg-[var(--color-gs-card)] " + factions[student.faction]?.border}>
                  {student.avatar}
                </div>
                {student.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-[var(--color-gs-green)] rounded-full border-2 border-[var(--color-gs-bg)]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm text-[var(--color-gs-text-main)] truncate group-hover:text-[var(--color-gs-cyan)] transition-colors">{student.name}</h3>
                  <span className="text-[10px] text-[var(--color-gs-text-muted)] shrink-0 ml-1">{student.online ? 'Online' : 'Offline'}</span>
                </div>
                <p className="text-xs text-[var(--color-gs-text-muted)] truncate">
                  {dmMessages[student.id] ? dmMessages[student.id][dmMessages[student.id].length - 1]?.text : 'Start a conversation'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Chat Area ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-[var(--color-gs-border)] bg-[var(--color-gs-card)] flex items-center justify-between px-5 shrink-0">
          {activeChat === 'general' ? (
            <div className="flex items-center gap-3">
              <Hash size={20} className="text-[var(--color-gs-cyan)]" />
              <div>
                <h1 className="font-bold">Campus General</h1>
                <p className="text-xs text-[var(--color-gs-text-muted)]">{onlineStudents.length + 1} students online</p>
              </div>
            </div>
          ) : activeUser ? (
            <div className="flex items-center gap-3">
              <div className={"w-9 h-9 rounded-full border-2 flex items-center justify-center bg-[var(--color-gs-bg)] " + factions[activeUser.faction]?.border}>
                {activeUser.avatar}
              </div>
              <div>
                <h1 className="font-bold">{activeUser.name}</h1>
                <p className={"text-xs " + factions[activeUser.faction]?.color}>{factions[activeUser.faction]?.name}</p>
              </div>
            </div>
          ) : null}

          {activeChat !== 'general' && activeUser && (
            <div className="flex gap-1">
              <button onClick={() => showToast('Conversation archived')} className="p-2 text-[var(--color-gs-text-muted)] hover:text-[var(--color-gs-amber)] hover:bg-[var(--color-gs-bg)] rounded-xl transition-colors"><Archive size={18} /></button>
              <button onClick={() => showToast('User blocked')} className="p-2 text-[var(--color-gs-text-muted)] hover:text-red-400 hover:bg-[var(--color-gs-bg)] rounded-xl transition-colors"><Slash size={18} /></button>
            </div>
          )}
        </header>

        {/* Messages Area */}
        <div ref={chatAreaRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 relative">
          {messages.map(msg => {
            const { sender, isMe } = getSenderInfo(msg);
            if (!sender) return null;
            const hasFaction = !isMe ? factions[sender.faction] : factions[user?.faction];

            return (
              <div key={msg.id} className={"flex gap-3 w-full max-w-2xl group " + (isMe ? "self-end flex-row-reverse" : "self-start")}>
                {/* Avatar */}
                <div className={"w-9 h-9 shrink-0 rounded-full border-2 flex items-center justify-center text-base bg-[var(--color-gs-card)] mt-1 " + (hasFaction?.border || 'border-[var(--color-gs-border)]')}>
                  {sender.avatar || '🎓'}
                </div>

                <div className={"flex flex-col " + (isMe ? "items-end" : "items-start")}>
                  {/* Sender name + time */}
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className={"text-xs font-bold " + (hasFaction?.color || 'text-[var(--color-gs-text-muted)]')}>
                      {isMe ? 'You' : sender.name}
                    </span>
                    <span className="text-[10px] text-[var(--color-gs-text-muted)]">{msg.timestamp}</span>
                  </div>

                  {/* Reply preview */}
                  {msg.replyTo && (
                    <div className="mb-1.5 px-3 py-1.5 bg-[var(--color-gs-bg)] border-l-2 border-[var(--color-gs-cyan)] rounded-r-lg text-xs text-[var(--color-gs-text-muted)] max-w-xs truncate">
                      ↩ {msg.replyTo.text}
                    </div>
                  )}

                  {/* Media */}
                  {msg.media?.type === 'image' && (
                    <img src={msg.media.url} alt="shared" className="max-w-xs rounded-xl mb-1.5 border border-[var(--color-gs-border)]" />
                  )}
                  {msg.media?.type === 'file' && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded-xl mb-1.5 text-xs">
                      <File size={14} className="text-[var(--color-gs-cyan)]" />
                      <span className="text-[var(--color-gs-text-main)]">{msg.media.name}</span>
                      <span className="text-[var(--color-gs-text-muted)]">{msg.media.size}</span>
                    </div>
                  )}

                  {/* Bubble */}
                  {msg.text && (
                    <div className={"px-4 py-3 rounded-2xl text-sm leading-relaxed " + (isMe ? "bg-gradient-to-br from-[var(--color-gs-cyan)] to-[var(--color-gs-violet)] text-white rounded-tr-none shadow-[0_4px_15px_rgba(0,212,255,0.2)]" : "bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] text-[var(--color-gs-text-main)] rounded-tl-none")}>
                      {msg.text}
                    </div>
                  )}

                  {/* Reaction bar (hover) */}
                  <div className={"flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity " + (isMe ? "flex-row-reverse" : "")}>
                    {QUICK_REACTIONS.map(emoji => (
                      <button key={emoji} onClick={() => toggleReaction(msg.id, emoji)}
                        className="text-base w-7 h-7 rounded-full hover:bg-[var(--color-gs-border)] transition-colors flex items-center justify-center hover:scale-125">
                        {emoji}
                      </button>
                    ))}
                    <button onClick={() => setReplyTo(msg)}
                      className="p-1 rounded-full hover:bg-[var(--color-gs-border)] transition-colors text-[var(--color-gs-text-muted)] hover:text-[var(--color-gs-cyan)]">
                      <Reply size={14} />
                    </button>
                  </div>

                  {/* Existing Reactions */}
                  {Object.keys(msg.reactions).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(msg.reactions).map(([emoji, users]) => (
                        <button key={emoji} onClick={() => toggleReaction(msg.id, emoji)}
                          className={"flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors " + (users.includes('ME') ? 'bg-[var(--color-gs-cyan)]/15 border-[var(--color-gs-cyan)]/40 text-[var(--color-gs-cyan)]' : 'bg-[var(--color-gs-card)] border-[var(--color-gs-border)] text-[var(--color-gs-text-muted)] hover:border-[var(--color-gs-cyan)]/40')}>
                          {emoji} {users.length}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {!messages.find(m => m.senderId === 'ME') === false && isTyping && (
            <div className="self-start flex gap-3">
              <div className="w-9 h-9 rounded-full bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] flex items-center justify-center text-base">
                {activeUser?.avatar || '?'}
              </div>
              <div className="px-4 py-3 bg-[var(--color-gs-card)] border border-[var(--color-gs-border)] rounded-2xl rounded-tl-none flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[var(--color-gs-text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-[var(--color-gs-text-muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-[var(--color-gs-text-muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-[var(--color-gs-text-muted)] py-20">
              <MessageSquare size={48} className="mb-4 opacity-40" />
              <p className="text-sm">No messages yet. Say hello! 👋</p>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Scroll to bottom button */}
        {showScrollBtn && (
          <button onClick={scrollToBottom}
            className="absolute bottom-24 right-8 w-9 h-9 bg-[var(--color-gs-cyan)] text-[#0f172a] rounded-full flex items-center justify-center shadow-lg hover:bg-cyan-400 transition-colors z-20">
            <ChevronDown size={18} />
          </button>
        )}

        {/* ── Input Area ───────────────────────────────────────────────────── */}
        <div className="p-4 border-t border-[var(--color-gs-border)] bg-[var(--color-gs-card)] shrink-0">
          {/* Reply Preview */}
          {replyTo && (
            <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded-xl text-xs">
              <Reply size={12} className="text-[var(--color-gs-cyan)] shrink-0" />
              <span className="text-[var(--color-gs-text-muted)] flex-1 truncate">Replying to: {replyTo.text}</span>
              <button onClick={() => setReplyTo(null)} className="text-[var(--color-gs-text-muted)] hover:text-red-400 transition-colors"><X size={14} /></button>
            </div>
          )}

          {/* Media Preview */}
          {mediaPreview && (
            <div className="flex items-center gap-3 mb-2 p-2 bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded-xl">
              {mediaPreview.type === 'image' ? (
                <img src={mediaPreview.url} alt="preview" className="w-16 h-16 rounded-lg object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-[var(--color-gs-cyan)]/10 flex items-center justify-center"><File size={20} className="text-[var(--color-gs-cyan)]" /></div>
              )}
              <span className="text-sm text-[var(--color-gs-text-muted)] flex-1 truncate">{mediaPreview.name}</span>
              <button onClick={() => setMediaPreview(null)} className="text-[var(--color-gs-text-muted)] hover:text-red-400 transition-colors"><X size={16} /></button>
            </div>
          )}

          <div className="relative">
            {/* Emoji Picker */}
            {showEmoji && <EmojiPicker onSelect={e => setInputVal(prev => prev + e)} onClose={() => setShowEmoji(false)} />}

            <form onSubmit={handleSend} className="flex gap-2 items-center bg-[var(--color-gs-bg)] border border-[var(--color-gs-border)] rounded-2xl p-2 focus-within:border-[var(--color-gs-cyan)] transition-colors">
              {/* File upload */}
              <input ref={fileInputRef} type="file" accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx" className="hidden" onChange={handleFileSelect} />
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="p-2 text-[var(--color-gs-text-muted)] hover:text-[var(--color-gs-cyan)] transition-colors rounded-xl hover:bg-[var(--color-gs-card)]">
                <Paperclip size={20} />
              </button>

              {/* Emoji */}
              <button type="button" onClick={() => setShowEmoji(prev => !prev)}
                className={"p-2 transition-colors rounded-xl hover:bg-[var(--color-gs-card)] " + (showEmoji ? 'text-[var(--color-gs-amber)]' : 'text-[var(--color-gs-text-muted)] hover:text-[var(--color-gs-amber)]')}>
                <Smile size={20} />
              </button>

              <input
                type="text" value={inputVal} onChange={handleInputChange}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={activeChat === 'general' ? "Message #Campus General..." : `Message @${activeUser?.name || ''}...`}
                className="flex-1 bg-transparent border-none px-2 py-2 outline-none text-[var(--color-gs-text-main)] placeholder-[var(--color-gs-text-muted)] text-sm"
              />

              <button type="submit" disabled={!inputVal.trim() && !mediaPreview}
                className="p-2.5 bg-[var(--color-gs-cyan)] text-[#0f172a] font-bold rounded-xl hover:bg-cyan-400 transition-colors flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(0,212,255,0.3)]">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
