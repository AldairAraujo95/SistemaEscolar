import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
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
import { disciplines as initialDisciplines, classes as initialClasses } from "@/data/academic";
import { students as initialStudents } from "@/data/users";
import { grades as initialGrades } from "@/data/grades";
import type { Discipline, Class, Student, Grade } from "@/types";
import { showSuccess } from "@/utils/toast";

const AcademicManagement = () => {
  const [disciplines, setDisciplines] = useState<Discipline[]>(initialDisciplines);
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [grades, setGrades] = useState<Grade[]>(initialGrades);

  const [editingDiscipline, setEditingDiscipline] = useState<Discipline | null>(null);
  const [deletingDisciplineId, setDeletingDisciplineId] = useState<string | null>(null);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [deletingClassId, setDeletingClassId] = useState<string | null>(null);

  // Discipline Handlers
  const handleAddDiscipline = (name: string) => {
    const newDiscipline: Discipline = { id: uuidv4(), name };
    setDisciplines([...disciplines, newDiscipline]);
    showSuccess("Disciplina adicionada com sucesso!");
  };

  const handleUpdateDiscipline = (updatedDiscipline: Discipline) => {
    setDisciplines(disciplines.map(d => d.id === updatedDiscipline.id ? updatedDiscipline : d));
    setEditingDiscipline(null);
    showSuccess("Disciplina atualizada com sucesso!");
  };

  const confirmDeleteDiscipline = () => {
    if (deletingDisciplineId) {
      setDisciplines(disciplines.filter(d => d.id !== deletingDisciplineId));
      setDeletingDisciplineId(null);
      showSuccess("Disciplina excluída com sucesso!");
    }
  };

  // Class Handlers
  const handleAddClass = (name: string) => {
    const newClass: Class = { id: uuidv4(), name };
    setClasses([...classes, newClass]);
    showSuccess("Turma adicionada com sucesso!");
  };

  const handleUpdateClass = (updatedClass: Class) => {
    setClasses(classes.map(c => c.id === updatedClass.id ? updatedClass : c));
    setEditingClass(null);
    showSuccess("Turma atualizada com sucesso!");
  };

  const confirmDeleteClass = () => {
    if (deletingClassId) {
      setClasses(classes.filter(c => c.id !== deletingClassId));
      setDeletingClassId(null);
      showSuccess("Turma excluída com sucesso!");
    }
  };

  // Grade Handler
  const handleGradesChange = (newGrades: Grade[]) => {
    setGrades(newGrades);
    showSuccess("Notas salvas com sucesso!");
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