import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';
import type { Guardian } from '@/types';

type Role = 'admin' | 'professor' | 'aluno' | null;

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Guardian | null;
  role: Role;
  setRole: (role: Role) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Guardian | null>(null);
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // If user is logged in, fetch their guardian profile (for student portal)
          const { data: guardianProfile } = await supabase
            .from('guardians')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (guardianProfile) {
            setProfile(guardianProfile);
          } else {
            setProfile(null);
          }
        } else {
          // User signed out
          setProfile(null);
          handleSetRole(null); // Clear role on sign out
        }
      }
    );

    // Set initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
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