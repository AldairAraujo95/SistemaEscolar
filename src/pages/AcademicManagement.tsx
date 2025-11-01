import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddDisciplineDialog } from "@/components/academic-management/AddDisciplineDialog";
import { AddClassDialog } from "@/components/academic-management/AddClassDialog";
import { disciplines as initialDisciplines, classes as initialClasses } from "@/data/academic";
import type { Discipline, Class } from "@/types";
import { showSuccess } from "@/utils/toast";

const AcademicManagement = () => {
  const [disciplines, setDisciplines] = useState<Discipline[]>(initialDisciplines);
  const [classes, setClasses] = useState<Class[]>(initialClasses);

  const handleAddDiscipline = (name: string) => {
    const newDiscipline: Discipline = { id: uuidv4(), name };
    setDisciplines([...disciplines, newDiscipline]);
    showSuccess("Disciplina adicionada com sucesso!");
  };

  const handleAddClass = (name: string) => {
    const newClass: Class = { id: uuidv4(), name };
    setClasses([...classes, newClass]);
    showSuccess("Turma adicionada com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestão Acadêmica</h1>
        <p className="text-gray-500 mt-2">Crie e gerencie turmas e disciplinas.</p>
      </div>

      <Tabs defaultValue="classes">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="classes">Turmas</TabsTrigger>
          <TabsTrigger value="disciplines">Disciplinas</TabsTrigger>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disciplines.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AcademicManagement;