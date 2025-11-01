import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Student, Class, Discipline, Grade } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface StudentGradesManagerProps {
  students: Student[];
  classes: Class[];
  disciplines: Discipline[];
  grades: Grade[];
  onGradesChange: (newGrades: Grade[]) => void;
}

export const StudentGradesManager = ({
  students,
  classes,
  disciplines,
  grades,
  onGradesChange,
}: StudentGradesManagerProps) => {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [currentGrades, setCurrentGrades] = useState<{ [disciplineId: string]: string }>({});

  const studentsInClass = useMemo(() => {
    if (!selectedClassId) return [];
    const selectedClassName = classes.find(c => c.id === selectedClassId)?.name;
    return students.filter((student) => student.class === selectedClassName);
  }, [selectedClassId, students, classes]);

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudentId(studentId);
    const studentGrades = grades.filter(g => g.studentId === studentId);
    const gradesMap: { [disciplineId: string]: string } = {};
    disciplines.forEach(discipline => {
      const grade = studentGrades.find(g => g.disciplineId === discipline.id);
      gradesMap[discipline.id] = grade?.grade?.toString() ?? "";
    });
    setCurrentGrades(gradesMap);
  };

  const handleGradeInputChange = (disciplineId: string, value: string) => {
    setCurrentGrades(prev => ({ ...prev, [disciplineId]: value }));
  };

  const handleSaveGrades = () => {
    if (!selectedStudentId) return;

    let updatedGrades = [...grades];

    disciplines.forEach(discipline => {
      const gradeValueStr = currentGrades[discipline.id];
      const gradeValue = gradeValueStr ? parseFloat(gradeValueStr) : null;
      const existingGradeIndex = updatedGrades.findIndex(g => g.studentId === selectedStudentId && g.disciplineId === discipline.id);

      if (existingGradeIndex !== -1) {
        // Update existing grade
        updatedGrades[existingGradeIndex] = { ...updatedGrades[existingGradeIndex], grade: isNaN(gradeValue as number) ? null : gradeValue };
      } else if (gradeValue !== null && !isNaN(gradeValue)) {
        // Add new grade if it doesn't exist and a value was entered
        updatedGrades.push({
          id: uuidv4(),
          studentId: selectedStudentId,
          disciplineId: discipline.id,
          grade: gradeValue,
        });
      }
    });

    onGradesChange(updatedGrades);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="w-full sm:w-1/2">
          <Label htmlFor="class-select">Turma</Label>
          <Select onValueChange={value => {
            setSelectedClassId(value);
            setSelectedStudentId(null);
            setCurrentGrades({});
          }}>
            <SelectTrigger id="class-select">
              <SelectValue placeholder="Selecione uma turma" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-1/2">
          <Label htmlFor="student-select">Aluno</Label>
          <Select
            onValueChange={handleStudentSelect}
            disabled={!selectedClassId || studentsInClass.length === 0}
            value={selectedStudentId ?? ""}
          >
            <SelectTrigger id="student-select">
              <SelectValue placeholder={selectedClassId ? "Selecione um aluno" : "Selecione uma turma primeiro"} />
            </SelectTrigger>
            <SelectContent>
              {studentsInClass.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedStudentId && (
        <div>
          <h3 className="text-lg font-medium mb-2 mt-4">
            Notas de {students.find(s => s.id === selectedStudentId)?.name}
          </h3>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Disciplina</TableHead>
                  <TableHead className="w-[120px] text-right">Nota</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disciplines.map((discipline) => (
                  <TableRow key={discipline.id}>
                    <TableCell className="font-medium">{discipline.name}</TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        placeholder="-"
                        className="text-right"
                        value={currentGrades[discipline.id] ?? ""}
                        onChange={(e) => handleGradeInputChange(discipline.id, e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleSaveGrades}>Salvar Notas</Button>
          </div>
        </div>
      )}
    </div>
  );
};