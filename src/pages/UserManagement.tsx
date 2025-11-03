import { useState, useEffect, useCallback } from "react";
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
import { EditGuardianPasswordDialog } from "@/components/user-management/EditGuardianPasswordDialog";
import { EditTeacherPasswordDialog } from "@/components/user-management/EditTeacherPasswordDialog";
import type { Student, Guardian, Teacher, Class, Discipline } from "@/types";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";

const UserManagement = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);

  // --- Data Fetching ---
  const fetchData = useCallback(async () => {
    const { data: studentsData, error: studentsError } = await supabase.from('students').select('*').order('name');
    const { data: guardiansData, error: guardiansError } = await supabase.from('guardians').select('*').order('name');
    const { data: teachersData, error: teachersError } = await supabase.from('teachers').select('*').order('name');
    const { data: classesData, error: classesError } = await supabase.from('classes').select('*').order('name');
    const { data: disciplinesData, error: disciplinesError } = await supabase.from('disciplines').select('*').order('name');

    if (studentsError || guardiansError || teachersError || classesError || disciplinesError) {
      showError("Erro ao carregar os dados.");
    } else {
      setStudents(studentsData.map(s => ({
        id: s.id,
        name: s.name,
        cpf: s.cpf,
        guardianId: s.guardian_id,
        class: s.class_name,
      })));
      setGuardians(guardiansData.map(g => ({
        id: g.id,
        name: g.name,
        email: g.email,
        phone: g.phone,
        dueDateDay: g.due_date_day,
      })));
      setTeachers(teachersData);
      setClasses(classesData);
      setDisciplines(disciplinesData);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Student state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);

  // Guardian state
  const [editingGuardian, setEditingGuardian] = useState<Guardian | null>(null);
  const [deletingGuardianId, setDeletingGuardianId] = useState<string | null>(null);
  const [changingPasswordGuardian, setChangingPasswordGuardian] = useState<Guardian | null>(null);

  // Teacher state
  const [deletingTeacherId, setDeletingTeacherId] = useState<string | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [changingPasswordTeacher, setChangingPasswordTeacher] = useState<Teacher | null>(null);

  const handleAddUser = async (type: string, data: any) => {
    if (type === "student") {
      const { error } = await supabase.from('students').insert({
        name: data.name,
        cpf: data.cpf,
        class_name: data.class,
        guardian_id: data.guardianId,
      });
      if (error) {
        showError("Erro ao adicionar aluno.");
        console.error(error);
      } else {
        showSuccess("Aluno adicionado com sucesso!");
      }
    } else if (type === "guardian") {
      const guardianData = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        dueDateDay: parseInt(data.dueDateDay, 10) || 10,
      };

      const { error } = await supabase.functions.invoke('create-guardian', {
        body: { guardian: guardianData, students: data.students },
      });

      if (error) {
        showError(error.message);
        console.error("Function invoke error:", error);
      } else {
        showSuccess("Responsável e conta de acesso criados com sucesso!");
      }
    } else if (type === "teacher") {
      const professorData = {
        name: data.name,
        email: data.email,
        password: data.password,
        subjects: data.subjects,
        classes: data.classes,
      };

      const { error } = await supabase.functions.invoke('create-professor', {
        body: { professor: professorData },
      });

      if (error) {
        showError(error.message);
        console.error("Function invoke error:", error);
      } else {
        showSuccess("Professor e conta de acesso criados com sucesso!");
      }
    }
    fetchData();
  };

  // --- Student Handlers ---
  const handleUpdateStudent = async (updatedStudent: Student) => {
    const { error } = await supabase.from('students').update({
      name: updatedStudent.name,
      cpf: updatedStudent.cpf,
      class_name: updatedStudent.class,
      guardian_id: updatedStudent.guardianId,
    }).eq('id', updatedStudent.id);

    if (error) showError("Erro ao atualizar aluno."); else showSuccess("Aluno atualizado com sucesso!");
    setEditingStudent(null);
    fetchData();
  };

  const confirmDeleteStudent = async () => {
    if (deletingStudentId) {
      const { error } = await supabase.from('students').delete().eq('id', deletingStudentId);
      if (error) showError("Erro ao excluir aluno."); else showSuccess("Aluno excluído com sucesso!");
      setDeletingStudentId(null);
      fetchData();
    }
  };

  // --- Guardian Handlers ---
  const handleUpdateGuardian = async (updatedGuardian: Guardian) => {
    const { error } = await supabase.from('guardians').update({
      name: updatedGuardian.name,
      email: updatedGuardian.email,
      phone: updatedGuardian.phone,
      due_date_day: updatedGuardian.dueDateDay,
    }).eq('id', updatedGuardian.id);

    if (error) showError("Erro ao atualizar responsável."); else showSuccess("Responsável atualizado com sucesso!");
    setEditingGuardian(null);
    fetchData();
  };

  const handleUpdateGuardianPassword = async (guardianId: string, newPassword: string) => {
    const { data, error } = await supabase.functions.invoke('update-user-password', {
      body: { userId: guardianId, password: newPassword },
    });

    if (error || data?.error) {
      showError("Erro ao atualizar a senha.");
      console.error("Function invoke error:", error || data?.error);
    } else {
      showSuccess("Senha do responsável atualizada com sucesso!");
    }
    setChangingPasswordGuardian(null);
  };

  const confirmDeleteGuardian = async () => {
    if (deletingGuardianId) {
      const { error } = await supabase.from('guardians').delete().eq('id', deletingGuardianId);
      if (error) showError("Erro ao excluir responsável."); else showSuccess("Responsável excluído com sucesso!");
      setDeletingGuardianId(null);
      fetchData();
    }
  };

  // --- Teacher Handlers ---
  const handleUpdateTeacher = async (updatedTeacher: Teacher) => {
    const { error } = await supabase.from('teachers').update({
      name: updatedTeacher.name,
      email: updatedTeacher.email,
      subjects: updatedTeacher.subjects,
      classes: updatedTeacher.classes,
    }).eq('id', updatedTeacher.id);

    if (error) showError("Erro ao atualizar professor."); else showSuccess("Professor atualizado com sucesso!");
    setEditingTeacher(null);
    fetchData();
  };

  const handleUpdateTeacherPassword = async (teacherId: string, newPassword: string) => {
    const { data, error } = await supabase.functions.invoke('update-user-password', {
      body: { userId: teacherId, password: newPassword },
    });

    if (error || data?.error) {
      showError("Erro ao atualizar a senha.");
      console.error("Function invoke error:", error || data?.error);
    } else {
      showSuccess("Senha do professor atualizada com sucesso!");
    }
    setChangingPasswordTeacher(null);
  };

  const confirmDeleteTeacher = async () => {
    if (deletingTeacherId) {
      const { error } = await supabase.from('teachers').delete().eq('id', deletingTeacherId);
      if (error) showError("Erro ao excluir professor."); else showSuccess("Professor excluído com sucesso!");
      setDeletingTeacherId(null);
      fetchData();
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
                onEdit={setEditingStudent}
                onDelete={setDeletingStudentId}
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
                onEdit={setEditingGuardian}
                onDelete={setDeletingGuardianId}
                onChangePassword={setChangingPasswordGuardian}
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
              <TeachersTable
                teachers={teachers}
                onEdit={setEditingTeacher}
                onDelete={setDeletingTeacherId}
                onChangePassword={setChangingPasswordTeacher}
              />
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
      <EditGuardianPasswordDialog
        guardian={changingPasswordGuardian}
        open={!!changingPasswordGuardian}
        onOpenChange={(open) => !open && setChangingPasswordGuardian(null)}
        onSave={handleUpdateGuardianPassword}
      />
      <DeleteConfirmationDialog
        open={!!deletingGuardianId}
        onOpenChange={(open) => !open && setDeletingGuardianId(null)}
        onConfirm={confirmDeleteGuardian}
        title="Confirmar Exclusão"
        description="Tem certeza que deseja excluir este responsável? A conta de acesso associada também será removida. Esta ação não pode ser desfeita."
      />

      <EditTeacherDialog
        teacher={editingTeacher}
        open={!!editingTeacher}
        onOpenChange={(open) => !open && setEditingTeacher(null)}
        onSave={handleUpdateTeacher}
      />
      <EditTeacherPasswordDialog
        teacher={changingPasswordTeacher}
        open={!!changingPasswordTeacher}
        onOpenChange={(open) => !open && setChangingPasswordTeacher(null)}
        onSave={handleUpdateTeacherPassword}
      />
      <DeleteConfirmationDialog
        open={!!deletingTeacherId}
        onOpenChange={(open) => !open && setDeletingTeacherId(null)}
        onConfirm={confirmDeleteTeacher}
        title="Confirmar Exclusão"
        description="Tem certeza que deseja excluir este professor? A conta de acesso associada também será removida. Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default UserManagement;