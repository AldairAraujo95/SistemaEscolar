import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const role = searchParams.get('role') as 'admin' | 'professor' | 'aluno' | null;

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/${role}`);
    }
  }, [isAuthenticated, navigate, role]);

  if (!role) {
    navigate('/');
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
    navigate(`/${role}`);
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
          <CardTitle className="text-2xl">Login de {roleNames[role]}</CardTitle>
          <CardDescription>Digite seu email e senha para continuar.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">Entrar</Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default Login;