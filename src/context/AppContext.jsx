import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import insforge from '../lib/insforge';
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
  const [currentPage, setCurrentPage] = useState('signup');
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

  // Apply theme class to <html> element so ALL panels, fixed modals, and body inherit it
  const fetchGroups = useCallback(async () => {
    const { data, error } = await insforge.database.from('groups').select('*');
    if (!error) setGroups(data);
    else console.error('Error fetching groups:', error);
  }, []);

  const fetchStudents = useCallback(async () => {
    const { data, error } = await insforge.database.from('profiles').select('*');
    if (!error) setStudents(data);
    else console.error('Error fetching students:', error);
  }, []);

  const fetchStats = useCallback(async () => {
    // This is a bit advanced for a single query, so we'll do a few simple ones
    const { count: groupCount } = await insforge.database.from('groups').select('*', { count: 'exact', head: true });
    const { count: hackathonCount } = await insforge.database.from('groups').select('*', { count: 'exact', head: true }).eq('type', 'Hackathon');
    const { count: onlineCount } = await insforge.database.from('profiles').select('*', { count: 'exact', head: true }).eq('online', true);
    
    setStats({
      activeGroups: groupCount || 0,
      openHackathons: hackathonCount || 0,
      onlineMembers: onlineCount || 0,
      aiMatches: 3 // Mocked for now
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
        const { data, error } = await insforge.auth.getCurrentSession();
        
        if (data?.session) {
          const authUser = data.session.user;
          // Check if this user exists in our profiles table
          const { data: profileData, error: profileError } = await insforge.database
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          if (profileData) {
            setUserState(profileData);
            setCurrentPage('dashboard');
          } else {
            // User authenticated but no profile yet.
            // Check if this is a Google OAuth login by looking at user_metadata
            const metadata = authUser.user_metadata || {};
            const isGoogleOAuth = authUser.app_metadata?.provider === 'google' || metadata.full_name || metadata.avatar_url;

            if (isGoogleOAuth) {
              // Auto-construct profile from Google data
              const newProfile = {
                id: authUser.id,
                email: authUser.email,
                name: metadata.full_name || metadata.name || '',
                avatar: metadata.avatar_url || '👤',
                // Set default empty fields so it adheres to schema
                dob: '',
                college: '', course: '', branch: '', cgpa: '',
                bio: 'Google authenticated user.',
                skills: [], interests: [],
                social_links: {},
                online: true,
                faction: null
              };

              // Insert directly into DB
              const { error: insertError } = await insforge.database
                .from('profiles')
                .insert([newProfile]);

              if (!insertError) {
                setUserState(newProfile);
                setCurrentPage('dashboard');
                showToast('Google profile synced successfully!', 'success');
              } else {
                console.error("Error auto-creating OAuth profile:", insertError);
                // Fallback to onboarding if insertion fails
                setUserState({ id: authUser.id, email: authUser.email, isNew: true });
                setCurrentPage('onboarding');
              }
            } else {
              // Regular email/password empty profile -> send to onboarding
              setUserState({ id: authUser.id, email: authUser.email, isNew: true });
              setCurrentPage('onboarding');
            }
          }
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
    // Generate a fixed ID for the current session user if not provided (for public prototyping)
    // If we have an auth user from the session, use that ID instead!
    const userId = user?.id || userData.id || '00000000-0000-0000-0000-000000000001'; 
    
    const profile = {
      id: userId,
      name: userData.name || userData.fullName,
      avatar: userData.avatar,
      skills: userData.skills || [],
      interests: userData.interests || [],
      faction: userData.faction,
      online: true
    };

    const { data, error } = await insforge.database
      .from('profiles')
      .upsert(profile)
      .select()
      .single();

    if (!error) {
      setUserState(data);
      fetchStudents(); // Refresh student list
    } else {
      console.error('Error saving profile:', error);
      showToast('Error saving profile to backend', 'error');
    }
  };

  const logout = async () => {
    if (user && !user.isNew) {
      await insforge.database.from('profiles').update({ online: false }).eq('id', user.id);
    }
    await insforge.auth.signOut();
    setUserState(null);
    setCurrentPage('signup');
    showToast('Logged out successfully.', 'success');
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <AppContext.Provider value={{
      user, setUser: handleSetUser,
      currentPage, setCurrentPage,
      selectedGroupId, setSelectedGroupId,
      groups, setGroups,
      theme, setTheme,
      toast, showToast,
      logout,
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
