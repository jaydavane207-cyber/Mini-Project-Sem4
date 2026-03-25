import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import supabase from '../lib/supabase';
import { MOCK_FACTIONS } from '../data/mockData';

const AppContext = createContext();

const getInitialTheme = () => {
  const saved = localStorage.getItem('gs-theme');
  if (saved) return saved;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  return 'dark';
};

export const AppProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeGroups: 0,
    openHackathons: 0,
    onlineMembers: 0,
    aiMatches: 0
  });
  const [theme, setThemeState] = useState(getInitialTheme);
  const [toast, setToast] = useState(null);
  const [isInitializingAuth, setIsInitializingAuth] = useState(true);

  const fetchGroups = useCallback(async () => {
    // Fetch groups and their members using a join or separate query
    const { data: groupsData, error: groupsError } = await supabase.from('groups').select('*, group_members(profile_id)');
    
    if (!groupsError) {
      const mappedGroups = groupsData.map(g => ({
        ...g,
        adminId: g.admin_id,
        maxMembers: g.max_members || g.maxMembers,
        memberIds: g.group_members?.map(m => m.profile_id) || []
      }));
      setGroups(mappedGroups.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)));
    } else {
      console.error('Error fetching groups:', groupsError);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    const { data, error } = await supabase.from('profiles').select('*');
    if (!error) setStudents(data);
    else console.error('Error fetching students:', error);
  }, []);

  const fetchStats = useCallback(async () => {
    const { count: groupCount } = await supabase.from('groups').select('*', { count: 'exact', head: true });
    const { count: hackathonCount } = await supabase.from('groups').select('*', { count: 'exact', head: true }).eq('type', 'Hackathon');
    const { count: onlineCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('online', true);
    
    setStats({
      activeGroups: groupCount || 0,
      openHackathons: hackathonCount || 0,
      onlineMembers: onlineCount || 0,
      aiMatches: 3
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchGroups(), fetchStudents(), fetchStats()]).finally(() => setLoading(false));
  }, [fetchGroups, fetchStudents, fetchStats]);

  // Handle Authentication Session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (data?.session) {
          const authUser = data.session.user;
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          if (profileData) {
            setUserState({ ...profileData, onboardingComplete: true });
          } else {
            // User authenticated but no profile -> needs onboarding
            setUserState({ id: authUser.id, email: authUser.email, onboardingComplete: false });
          }
        } else {
          setUserState(null);
        }
      } catch (err) {
        console.error("Auth session check error:", err);
      } finally {
        setIsInitializingAuth(false);
      }
    };

    checkSession();
  }, []);

  // Apply theme class to <html> element
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('theme-dark', 'theme-light');
    html.classList.add(`theme-${theme}`);
    localStorage.setItem('gs-theme', theme);
  }, [theme]);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
  };

  const handleSetUser = async (userData) => {
    const userId = user?.id || userData.id;
    if (!userId) return;
    
    const profile = {
      id: userId,
      name: userData.name || userData.fullName,
      avatar: userData.avatar,
      skills: userData.skills || [],
      interests: userData.interests || [],
      faction: userData.faction,
      online: true,
      college: userData.college || '',
      course: userData.course || '',
      branch: userData.branch || '',
      year: userData.year || '',
      email: user?.email || userData.email || ''
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile)
      .select()
      .single();

    if (!error) {
      setUserState({ ...data, onboardingComplete: true });
      fetchStudents();
    } else {
      console.error('Error saving profile:', error);
      showToast('Error saving profile', 'error');
    }
  };

  const logout = async () => {
    if (user && user.onboardingComplete) {
      try {
        await supabase.from('profiles').update({ online: false }).eq('id', user.id);
      } catch (e) { /* ignore */ }
    }
    await supabase.auth.signOut();
    setUserState(null);
    showToast('Logged out successfully.', 'success');
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const checkAuth = async () => {
    setIsInitializingAuth(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        const authUser = data.session.user;
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profileData) {
          setUserState({ ...profileData, onboardingComplete: true });
        } else {
          setUserState({ id: authUser.id, email: authUser.email, onboardingComplete: false });
        }
      } else {
        setUserState(null);
      }
    } catch (err) {
      console.error("Auth check error:", err);
    } finally {
      setIsInitializingAuth(false);
    }
  };

  return (
    <AppContext.Provider value={{
      user, setUser: handleSetUser,
      selectedGroupId, setSelectedGroupId,
      groups, setGroups,
      theme, setTheme,
      toast, showToast,
      logout,
      checkAuth,
      loading,
      isInitializingAuth,
      refreshGroups: fetchGroups,
      students,
      stats,
      refreshStats: fetchStats,
      factions: MOCK_FACTIONS
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
