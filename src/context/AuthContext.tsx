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
      if (currentRole === 'aluno') {
        const { data } = await supabase.from('guardians').select('*').eq('id', userId).single();
        setProfile(data);
      } else if (currentRole === 'professor') {
        const { data } = await supabase.from('teachers').select('*').eq('id', userId).single();
        setProfile(data);
      } else {
        setProfile(null);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        const currentRole = localStorage.getItem('userRole') as Role;

        if (currentUser && currentRole) {
          await fetchProfile(currentUser.id, currentRole);
        } else {
          setProfile(null);
          if (_event === 'SIGNED_OUT') {
            handleSetRole(null);
          }
        }
      }
    );

    // Set initial session and profile
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      const currentRole = localStorage.getItem('userRole') as Role;
      if (currentUser && currentRole) {
        await fetchProfile(currentUser.id, currentRole);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    // The onAuthStateChange listener will handle clearing role and profile
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