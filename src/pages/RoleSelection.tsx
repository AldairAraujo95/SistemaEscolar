import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Shield, User, GraduationCap } from 'lucide-react';

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: string) => {
    navigate(`/login?role=${role}`);
  };

  const roles = [
    { name: 'Administrador', icon: <Shield className="h-12 w-12" />, role: 'admin' },
    { name: 'Professor', icon: <GraduationCap className="h-12 w-12" />, role: 'professor' },
    { name: 'Responsável/Aluno', icon: <User className="h-12 w-12" />, role: 'aluno' },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-background">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Bem-vindo ao Sys Scolar</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Selecione seu perfil para continuar</p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {roles.map((role) => (
          <Card
            key={role.role}
            className="w-72 cursor-pointer transition-transform hover:scale-105 hover:shadow-xl"
            onClick={() => handleRoleSelect(role.role)}
          >
            <CardHeader className="items-center">
              <CardTitle>{role.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4">
              {role.icon}
              <CardDescription>Clique para fazer login</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoleSelection;