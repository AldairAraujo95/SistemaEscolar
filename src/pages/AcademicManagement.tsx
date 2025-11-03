import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddDisciplineDialog } from "@/components/academic-management/AddDisciplineDialog";
import { AddClassDialog } from "@/components/academic-management/AddClassDialog";
import { EditDisciplineDialog } from "@/components/academic-management/EditDisciplineDialog";
import { EditClassDialog } from "@/components/academic-management/EditClassDialog";
import { DeleteConfirmationDialog } from "@/components/user-management/DeleteConfirmationDialog";
import { StudentGradesManager } from "@/components/academic-management/StudentGradesManager";
import type { Discipline, Class, Student, Grade } from "@/types";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";

const AcademicManagement = () => {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);

  const [editingDiscipline, setEditingDiscipline] = useState<Discipline | null>(null);
  const [deletingDisciplineId, setDeletingDisciplineId] = useState<string | null>(null);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [deletingClassId, setDeletingClassId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const { data: disciplinesData, error: disciplinesError } = await supabase.from('disciplines').select('*').order('name');
    const { data: classesData, error: classesError } = await supabase.from('classes').select('*').order('name');
    const { data: studentsData, error: studentsError } = await supabase.from('students').select('*').order('name');
    const { data: gradesData, error: gradesError } = await supabase.from('grades').select('*');

    if (disciplinesError || classesError || studentsError || gradesError) {
      showError("Erro ao carregar dados acadêmicos.");
    } else {
      setDisciplines(disciplinesData);
      setClasses(classesData);
      setStudents(studentsData.map(s => ({
        id: s.id,
        name: s.name,
        cpf: s.cpf,
        guardianId: s.guardian_id,
        class: s.class_name,
      })));
      setGrades(gradesData.map(g => ({
        id: g.id,
        studentId: g.student_id,
        disciplineId: g.discipline_id,
        grade: g.grade,
        unit: g.unit,
      })));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Discipline Handlers
  const handleAddDiscipline = async (name: string) => {
    const { error } = await supabase.from('disciplines').insert({ name });
    if (error) showError("Erro ao adicionar disciplina."); else showSuccess("Disciplina adicionada com sucesso!");
    fetchData();
  };

  const handleUpdateDiscipline = async (updatedDiscipline: Discipline) => {
    const { error } = await supabase.from('disciplines').update({ name: updatedDiscipline.name }).eq('id', updatedDiscipline.id);
    if (error) showError("Erro ao atualizar disciplina."); else showSuccess("Disciplina atualizada com sucesso!");
    setEditingDiscipline(null);
    fetchData();
  };

  const confirmDeleteDiscipline = async () => {
    if (deletingDisciplineId) {
      const { error } = await supabase.from('disciplines').delete().eq('id', deletingDisciplineId);
      if (error) showError("Erro ao excluir disciplina."); else showSuccess("Disciplina excluída com sucesso!");
      setDeletingDisciplineId(null);
      fetchData();
    }
  };

  // Class Handlers
  const handleAddClass = async (name: string) => {
    const { error } = await supabase.from('classes').insert({ name });
    if (error) showError("Erro ao adicionar turma."); else showSuccess("Turma adicionada com sucesso!");
    fetchData();
  };

  const handleUpdateClass = async (updatedClass: Class) => {
    const { error } = await supabase.from('classes').update({ name: updatedClass.name }).eq('id', updatedClass.id);
    if (error) showError("Erro ao atualizar turma."); else showSuccess("Turma atualizada com sucesso!");
    setEditingClass(null);
    fetchData();
  };

  const confirmDeleteClass = async () => {
    if (deletingClassId) {
      const { error } = await supabase.from('classes').delete().eq('id', deletingClassId);
      if (error) showError("Erro ao excluir turma."); else showSuccess("Turma excluída com sucesso!");
      setDeletingClassId(null);
      fetchData();
    }
  };

  // Grade Handler
  const handleGradesChange = async (gradesToUpsert: Grade[]) => {
    const payload = gradesToUpsert.map(g => ({
      student_id: g.studentId,
      discipline_id: g.disciplineId,
      grade: g.grade,
      unit: g.unit,
    }));
    const { error } = await supabase.from('grades').upsert(
      payload,
      { onConflict: 'student_id,discipline_id,unit' }
    );
    if (error) {
      showError("Erro ao salvar as notas.");
      console.error(error);
    } else {
      showSuccess("Notas salvas com sucesso!");
      fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestão Acadêmica</h1>
        <p className="text-gray-500 mt-2">Crie e gerencie turmas, disciplinas e notas dos alunos.</p>
      </div>

      <Tabs defaultValue="classes">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="classes">Turmas</TabsTrigger>
          <TabsTrigger value="disciplines">Disciplinas</TabsTrigger>
          <TabsTrigger value="grades">Notas dos Alunos</TabsTrigger>
        </TabsList>

        <TabsContent value="classes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Turmas</CardTitle>
                <CardDescription>Lista de todas as turmas cadastradas.</CardDescription>
              </div>
              <AddClassDialog onSave={handleAddClass} />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome da Turma</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingClass(c)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDeletingClassId(c.id)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disciplines">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Disciplinas</CardTitle>
                <CardDescription>Lista de todas as disciplinas cadastradas.</CardDescription>
              </div>
              <AddDisciplineDialog onSave={handleAddDiscipline} />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome da Disciplina</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disciplines.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingDiscipline(d)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDeletingDisciplineId(d.id)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades">
          <Card>
            <CardHeader>
              <CardTitle>Notas dos Alunos</CardTitle>
              <CardDescription>Selecione uma turma e um aluno para lançar as notas.</CardDescription>
            </CardHeader>
            <CardContent>
              <StudentGradesManager
                students={students}
                classes={classes}
                disciplines={disciplines}
                grades={grades}
                onGradesChange={handleGradesChange}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs for Classes */}
      <EditClassDialog
        classItem={editingClass}
        open={!!editingClass}
        onOpenChange={(open) => !open && setEditingClass(null)}
        onSave={handleUpdateClass}
      />
      <DeleteConfirmationDialog
        open={!!deletingClassId}
        onOpenChange={(open) => !open && setDeletingClassId(null)}
        onConfirm={confirmDeleteClass}
        title="Confirmar Exclusão"
        description="Tem certeza que deseja excluir esta turma? Esta ação não pode ser desfeita."
      />

      {/* Dialogs for Disciplines */}
      <EditDisciplineDialog
        discipline={editingDiscipline}
        open={!!editingDiscipline}
        onOpenChange={(open) => !open && setEditingDiscipline(null)}
        onSave={handleUpdateDiscipline}
      />
      <DeleteConfirmationDialog
        open={!!deletingDisciplineId}
        onOpenChange={(open) => !open && setDeletingDisciplineId(null)}
        onConfirm={confirmDeleteDiscipline}
        title="Confirmar Exclusão"
        description="Tem certeza que deseja excluir esta disciplina? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default AcademicManagement;