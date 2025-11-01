import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  StudentsTable,
  GuardiansTable,
  TeachersTable,
} from "@/components/user-management/UserTables";
import { AddUserDialog } from "@/components/user-management/AddUserDialog";
import { students as initialStudents, guardians as initialGuardians, teachers as initialTeachers } from "@/data/users";

const UserManagement = () => {
  const [students, setStudents] = useState(initialStudents);
  const [guardians, setGuardians] = useState(initialGuardians);
  const [teachers, setTeachers] = useState(initialTeachers);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Usuários</h1>
          <p className="text-gray-500 mt-2">
            Crie e gerencie alunos, responsáveis e professores.
          </p>
        </div>
        <AddUserDialog guardians={guardians} />
      </div>

      <Tabs defaultValue="students">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students">Alunos</TabsTrigger>
          <TabsTrigger value="guardians">Responsáveis</TabsTrigger>
          <TabsTrigger value="teachers">Professores</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Alunos</CardTitle>
              <CardDescription>Lista de todos os alunos cadastrados.</CardDescription>
            </CardHeader>
            <CardContent>
              <StudentsTable students={students} guardians={guardians} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guardians">
          <Card>
            <CardHeader>
              <CardTitle>Responsáveis</CardTitle>
              <CardDescription>Lista de todos os responsáveis cadastrados.</CardDescription>
            </CardHeader>
            <CardContent>
              <GuardiansTable guardians={guardians} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers">
          <Card>
            <CardHeader>
              <CardTitle>Professores</CardTitle>
              <CardDescription>Lista de todos os professores cadastrados.</CardDescription>
            </CardHeader>
            <CardContent>
              <TeachersTable teachers={teachers} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;