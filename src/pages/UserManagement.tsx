import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  StudentsTable,
  GuardiansTable,
  TeachersTable,
} from "@/components/user-management/UserTables";
import { AddUserDialog } from "@/components/user-management/AddUserDialog";
import { DeleteConfirmationDialog } from "@/components/user-management/DeleteConfirmationDialog";
import { EditTeacherDialog } from "@/components/user-management/EditTeacherDialog";
import { EditStudentDialog } from "@/components/user-management/EditStudentDialog";
import { EditGuardianDialog } from "@/components/user-management/EditGuardianDialog";
import { students as initialStudents, guardians as initialGuardians, teachers as initialTeachers } from "@/data/users";
import { classes as initialClasses, disciplines as initialDisciplines } from "@/data/academic";
import type { Student, Guardian, Teacher, Class, Discipline } from "@/types";
import { showSuccess } from "@/utils/toast";

const UserManagement = () => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [guardians, setGuardians] = useState<Guardian[]>(initialGuardians);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [classes] = useState<Class[]>(initialClasses);
  const [disciplines] = useState<Discipline[]>(initialDisciplines);

  // Student state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);

  // Guardian state
  const [editingGuardian, setEditingGuardian] = useState<Guardian | null>(null);
  const [deletingGuardianId, setDeletingGuardianId] = useState<string | null>(null);

  // Teacher state
  const [deletingTeacherId, setDeletingTeacherId] = useState<string | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const handleAddUser = (type: string, data: any) => {
    if (type === "student") {
      const newStudent: Student = { id: uuidv4(), ...data };
      setStudents([...students, newStudent]);
    } else if (type === "guardian") {
      const newGuardianId = uuidv4();
      const newGuardian: Guardian = {
        id: newGuardianId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        dueDateDay: parseInt(data.dueDateDay, 10) || 10,
      };
      const newStudents: Student[] = data.students.map((s: any) => ({
        id: uuidv4(),
        name: s.name,
        class: s.class,
        cpf: '', // CPF should be added when creating student individually for now
        guardianId: newGuardianId,
      }));
      setGuardians([...guardians, newGuardian]);
      setStudents([...students, ...newStudents]);
    } else if (type === "teacher") {
      const newTeacher: Teacher = { id: uuidv4(), ...data };
      setTeachers([...teachers, newTeacher]);
    }
    showSuccess("Usuário adicionado com sucesso!");
  };

  // --- Student Handlers ---
  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    setEditingStudent(null);
    showSuccess("Aluno atualizado com sucesso!");
  };

  const handleDeleteStudent = (studentId: string) => {
    setDeletingStudentId(studentId);
  };

  const confirmDeleteStudent = () => {
    if (deletingStudentId) {
      setStudents(students.filter((s) => s.id !== deletingStudentId));
      setDeletingStudentId(null);
      showSuccess("Aluno excluído com sucesso!");
    }
  };

  // --- Guardian Handlers ---
  const handleEditGuardian = (guardian: Guardian) => {
    setEditingGuardian(guardian);
  };

  const handleUpdateGuardian = (updatedGuardian: Guardian) => {
    setGuardians(guardians.map(g => g.id === updatedGuardian.id ? updatedGuardian : g));
    setEditingGuardian(null);
    showSuccess("Responsável atualizado com sucesso!");
  };

  const handleDeleteGuardian = (guardianId: string) => {
    setDeletingGuardianId(guardianId);
  };

  const confirmDeleteGuardian = () => {
    if (deletingGuardianId) {
      setStudents(students.filter(s => s.guardianId !== deletingGuardianId));
      setGuardians(guardians.filter((g) => g.id !== deletingGuardianId));
      setDeletingGuardianId(null);
      showSuccess("Responsável e alunos associados foram excluídos com sucesso!");
    }
  };

  // --- Teacher Handlers ---
  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
  };

  const handleUpdateTeacher = (updatedTeacher: Teacher) => {
    setTeachers(teachers.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
    setEditingTeacher(null);
    showSuccess("Professor atualizado com sucesso!");
  };

  const handleDeleteTeacher = (teacherId: string) => {
    setDeletingTeacherId(teacherId);
  };

  const confirmDeleteTeacher = () => {
    if (deletingTeacherId) {
      setTeachers(teachers.filter((t) => t.id !== deletingTeacherId));
      setDeletingTeacherId(null);
      showSuccess("Professor excluído com sucesso!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Usuários</h1>
          <p className="text-gray-500 mt-2">
            Crie e gerencie alunos, responsáveis e professores.
          </p>
        </div>
        <AddUserDialog guardians={guardians} classes={classes} disciplines={disciplines} onAddUser={handleAddUser} />
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
              <StudentsTable
                students={students}
                guardians={guardians}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
              />
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
              <GuardiansTable
                guardians={guardians}
                onEdit={handleEditGuardian}
                onDelete={handleDeleteGuardian}
              />
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
              <TeachersTable teachers={teachers} onEdit={handleEditTeacher} onDelete={handleDeleteTeacher} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* --- Dialogs --- */}
      <EditStudentDialog
        student={editingStudent}
        guardians={guardians}
        classes={classes}
        open={!!editingStudent}
        onOpenChange={(open) => !open && setEditingStudent(null)}
        onSave={handleUpdateStudent}
      />
      <DeleteConfirmationDialog
        open={!!deletingStudentId}
        onOpenChange={(open) => !open && setDeletingStudentId(null)}
        onConfirm={confirmDeleteStudent}
        title="Confirmar Exclusão"
        description="Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita."
      />

      <EditGuardianDialog
        guardian={editingGuardian}
        open={!!editingGuardian}
        onOpenChange={(open) => !open && setEditingGuardian(null)}
        onSave={handleUpdateGuardian}
      />
      <DeleteConfirmationDialog
        open={!!deletingGuardianId}
        onOpenChange={(open) => !open && setDeletingGuardianId(null)}
        onConfirm={confirmDeleteGuardian}
        title="Confirmar Exclusão"
        description="Tem certeza que deseja excluir este responsável? Todos os alunos associados também serão removidos. Esta ação não pode ser desfeita."
      />

      <EditTeacherDialog
        teacher={editingTeacher}
        open={!!editingTeacher}
        onOpenChange={(open) => !open && setEditingTeacher(null)}
        onSave={handleUpdateTeacher}
      />
      <DeleteConfirmationDialog
        open={!!deletingTeacherId}
        onOpenChange={(open) => !open && setDeletingTeacherId(null)}
        onConfirm={confirmDeleteTeacher}
        title="Confirmar Exclusão"
        description="Tem certeza que deseja excluir este professor? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default UserManagement;