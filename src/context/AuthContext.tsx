import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

type Role = 'admin' | 'professor' | 'aluno' | null;
type UserProfile = { id: string; name: string; [key: string]: any };

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  role: Role;
  setRole: (role: Role) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<Role>(() => localStorage.getItem('userRole') as Role);

  const handleSetRole = (newRole: Role) => {
    setRole(newRole);
    if (newRole) {
      localStorage.setItem('userRole', newRole);
    } else {
      localStorage.removeItem('userRole');
    }
  };

  useEffect(() => {
    const fetchProfile = async (userId: string, currentRole: Role) => {
      if (!currentRole) {
        setProfile(null);
        return;
      }
      try {
        let profileData = null;
        if (currentRole === 'aluno') {
          const { data, error } = await supabase.from('guardians').select('*').eq('id', userId).single();
          if (error) throw error;
          profileData = data;
        } else if (currentRole === 'professor') {
          const { data, error } = await supabase.from('teachers').select('*').eq('id', userId).single();
          if (error) throw error;
          profileData = data;
        }
        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      const currentRole = localStorage.getItem('userRole') as Role;
      if (session?.user && currentRole) {
        fetchProfile(session.user.id, currentRole);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        const currentRole = localStorage.getItem('userRole') as Role;

        if (_event === 'SIGNED_IN' && session?.user && currentRole) {
          await fetchProfile(session.user.id, currentRole);
        } else if (_event === 'SIGNED_OUT') {
          setProfile(null);
          handleSetRole(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    // Manually clear state to prevent race conditions
    setSession(null);
    setUser(null);
    setProfile(null);
    handleSetRole(null);
  };

  const value = {
    session,
    user,
    profile,
    role,
    setRole: handleSetRole,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};