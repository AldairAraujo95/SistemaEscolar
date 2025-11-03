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
  loading: boolean;
  setRole: (role: Role) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<Role>(() => localStorage.getItem('userRole') as Role);
  const [loading, setLoading] = useState(true);

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
      if (!currentRole || currentRole === 'admin') {
        setProfile(null);
        return;
      }
      try {
        const tableName = currentRole === 'aluno' ? 'guardians' : 'teachers';
        const { data, error } = await supabase.from(tableName).select('*').eq('id', userId).single();
        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      }
    };

    // Check user session on initial load
    const checkUser = async () => {
      setLoading(true);
      const currentRole = localStorage.getItem('userRole') as Role;

      if (currentRole === 'admin') {
        setSession(null);
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user && currentRole) {
        await fetchProfile(session.user.id, currentRole);
      } else {
        setProfile(null);
      }
      setLoading(false);
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        const currentRole = localStorage.getItem('userRole') as Role;

        if (session?.user && currentRole) {
          await fetchProfile(session.user.id, currentRole);
        } else {
          setProfile(null);
        }
        
        if (_event === 'SIGNED_OUT') {
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
    localStorage.removeItem('userRole');
    setSession(null);
    setUser(null);
    setProfile(null);
    setRole(null);
  };

  const value = {
    session,
    user,
    profile,
    role,
    loading,
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