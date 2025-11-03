import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Grade, Discipline, Student } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { useAuth } from "@/context/AuthContext";

const AlunoGrades = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const fetchStudentsAndDisciplines = useCallback(async () => {
    if (!user) return;

    const { data: studentsData, error: studentsError } = await supabase
      .from('students')
      .select('*')
      .eq('guardian_id', user.id);

    const { data: disciplinesData, error: disciplinesError } = await supabase
      .from('disciplines')
      .select('*');

    if (studentsError || disciplinesError) {
      showError("Erro ao carregar dados.");
    } else {
      const formattedStudents = studentsData.map(s => ({ ...s, class: s.class_name, guardianId: s.guardian_id, id: s.id, name: s.name, cpf: s.cpf }));
      setStudents(formattedStudents);
      setDisciplines(disciplinesData);
      if (formattedStudents.length > 0) {
        setSelectedStudentId(formattedStudents[0].id);
      }
    }
  }, [user]);

  const fetchGradesForStudent = useCallback(async () => {
    if (!selectedStudentId) {
      setGrades([]);
      return;
    }

    const { data: gradesData, error: gradesError } = await supabase
      .from('grades')
      .select('*')
      .eq('student_id', selectedStudentId);

    if (gradesError) {
      showError("Erro ao carregar as notas do aluno.");
      setGrades([]);
    } else {
      setGrades(gradesData.map(g => ({ ...g, studentId: g.student_id, disciplineId: g.discipline_id })));
    }
  }, [selectedStudentId]);

  useEffect(() => {
    fetchStudentsAndDisciplines();
  }, [fetchStudentsAndDisciplines]);

  useEffect(() => {
    fetchGradesForStudent();
  }, [fetchGradesForStudent]);

  const getDisciplineName = (id: string) => disciplines.find(d => d.id === id)?.name || "N/A";

  const gradesByUnit = grades.reduce((acc, grade) => {
    const unit = `Unidade ${grade.unit}`;
    if (!acc[unit]) {
      acc[unit] = [];
    }
    acc[unit].push(grade);
    return acc;
  }, {} as Record<string, Grade[]>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Minhas Notas</h1>
        <p className="text-gray-500 mt-2">
          Acompanhe o desempenho acadêmico dos seus filhos.
        </p>
      </div>

      {students.length > 1 && (
        <div className="max-w-xs">
          <Label htmlFor="student-selector">Selecione o Aluno</Label>
          <Select value={selectedStudentId ?? ""} onValueChange={setSelectedStudentId}>
            <SelectTrigger id="student-selector">
              <SelectValue placeholder="Selecione um aluno" />
            </SelectTrigger>
            <SelectContent>
              {students.map(student => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedStudent ? (
        Object.keys(gradesByUnit).length > 0 ? (
          Object.entries(gradesByUnit).map(([unit, unitGrades]) => (
            <Card key={unit}>
              <CardHeader>
                <CardTitle>{unit} - {selectedStudent.name}</CardTitle>
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
                    {disciplines.map(discipline => {
                      const grade = unitGrades.find(g => g.disciplineId === discipline.id);
                      return (
                        <TableRow key={discipline.id}>
                          <TableCell className="font-medium">{discipline.name}</TableCell>
                          <TableCell className="text-right font-bold">
                            {grade ? grade.grade?.toFixed(1) : "N/L"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Nenhuma nota lançada para {selectedStudent.name} ainda.</p>
            </CardContent>
          </Card>
        )
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Nenhum aluno vinculado a esta conta.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AlunoGrades;