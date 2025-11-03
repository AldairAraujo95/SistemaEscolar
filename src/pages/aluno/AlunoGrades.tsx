import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Grade, Discipline, Student } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

// Simula o aluno logado
const LOGGED_IN_STUDENT_ID = "s1"; // This should be replaced with actual logged-in user logic

const AlunoGrades = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);

  const fetchData = useCallback(async () => {
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id', LOGGED_IN_STUDENT_ID)
      .single();

    const { data: gradesData, error: gradesError } = await supabase
      .from('grades')
      .select('*')
      .eq('student_id', LOGGED_IN_STUDENT_ID);

    const { data: disciplinesData, error: disciplinesError } = await supabase
      .from('disciplines')
      .select('*');

    if (studentError || gradesError || disciplinesError) {
      showError("Erro ao carregar suas notas.");
    } else {
      setStudent({ ...studentData, class: studentData.class_name });
      setGrades(gradesData);
      setDisciplines(disciplinesData);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getDisciplineName = (id: string) => disciplines.find(d => d.id === id)?.name || "N/A";

  const gradesByUnit = grades.reduce((acc, grade) => {
    const unit = `Unidade ${grade.unit}`;
    if (!acc[unit]) {
      acc[unit] = [];
    }
    acc[unit].push(grade);
    return acc;
  }, {} as Record<string, typeof grades>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Minhas Notas</h1>
        <p className="text-gray-500 mt-2">Acompanhe seu desempenho acadêmico, {student?.name}.</p>
      </div>

      {Object.entries(gradesByUnit).map(([unit, unitGrades]) => (
        <Card key={unit}>
          <CardHeader>
            <CardTitle>{unit}</CardTitle>
            <CardDescription>Notas lançadas para esta unidade.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Disciplina</TableHead>
                  <TableHead className="text-right">Nota</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unitGrades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell className="font-medium">{getDisciplineName(grade.disciplineId)}</TableCell>
                    <TableCell className="text-right font-bold">{grade.grade?.toFixed(1) ?? "N/L"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AlunoGrades;