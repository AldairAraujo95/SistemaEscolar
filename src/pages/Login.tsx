import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { session, setRole, role } = useAuth();
  const roleParam = searchParams.get('role') as 'admin' | 'professor' | 'aluno' | null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session && role) {
      navigate(`/${role}`);
    }
  }, [session, role, navigate]);

  if (!roleParam) {
    navigate('/');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setRole(roleParam); // Set role optimistically

    if (roleParam === 'admin') {
      if (email === 'escola@email.com' && password === '123456') {
        // This is a mock login for admin
        navigate('/admin');
      } else {
        setError('Email ou senha de administrador inválidos.');
        setRole(null); // Revert role if login fails
      }
    } else {
      // Real Supabase login for professors and guardians/aluno
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setRole(null); // Revert role if login fails
      } else {
        // On success, the AuthContext listener will handle the session
        // and the useEffect above will redirect.
      }
    }
    setLoading(false);
  };

  const roleNames = {
    admin: 'Administrador',
    professor: 'Professor',
    aluno: 'Responsável/Aluno',
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login de {roleNames[roleParam]}</CardTitle>
          <CardDescription>Digite seu email e senha para continuar.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="grid gap-4">
            {error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Erro de Acesso</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;