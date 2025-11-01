import { useState, useEffect } from "react";
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
  const [selectedUnit, setSelectedUnit] = useState<number>(1);
  const [currentGrades, setCurrentGrades] = useState<{ [disciplineId: string]: string }>({});

  const studentsInClass = students.filter(student => {
    const selectedClassName = classes.find(c => c.id === selectedClassId)?.name;
    return student.class === selectedClassName;
  });

  useEffect(() => {
    if (selectedStudentId) {
      const studentGradesForUnit = grades.filter(g => g.studentId === selectedStudentId && g.unit === selectedUnit);
      const gradesMap: { [disciplineId: string]: string } = {};
      disciplines.forEach(discipline => {
        const grade = studentGradesForUnit.find(g => g.disciplineId === discipline.id);
        gradesMap[discipline.id] = grade?.grade?.toString() ?? "";
      });
      setCurrentGrades(gradesMap);
    } else {
      setCurrentGrades({});
    }
  }, [selectedStudentId, selectedUnit, grades, disciplines]);


  const handleSaveGrades = () => {
    if (!selectedStudentId) return;

    let updatedGrades = [...grades];

    disciplines.forEach(discipline => {
      const gradeValueStr = currentGrades[discipline.id];
      const gradeValue = gradeValueStr ? parseFloat(gradeValueStr) : null;
      const existingGradeIndex = updatedGrades.findIndex(g => g.studentId === selectedStudentId && g.disciplineId === discipline.id && g.unit === selectedUnit);

      if (existingGradeIndex !== -1) {
        updatedGrades[existingGradeIndex] = { ...updatedGrades[existingGradeIndex], grade: isNaN(gradeValue as number) ? null : gradeValue };
      } else if (gradeValue !== null && !isNaN(gradeValue)) {
        updatedGrades.push({
          id: uuidv4(),
          studentId: selectedStudentId,
          disciplineId: discipline.id,
          grade: gradeValue,
          unit: selectedUnit,
        });
      }
    });

    onGradesChange(updatedGrades);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div className="w-full">
          <Label htmlFor="class-select">Turma</Label>
          <Select onValueChange={value => {
            setSelectedClassId(value);
            setSelectedStudentId(null);
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
        <div className="w-full">
          <Label htmlFor="student-select">Aluno</Label>
          <Select
            onValueChange={setSelectedStudentId}
            disabled={!selectedClassId || studentsInClass.length === 0}
            value={selectedStudentId ?? ""}
          >
            <SelectTrigger id="student-select">
              <SelectValue placeholder={selectedClassId ? "Selecione um aluno" : "Selecione uma turma"} />
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
        <div className="w-full">
          <Label htmlFor="unit-select">Unidade</Label>
          <Select
            value={selectedUnit.toString()}
            onValueChange={value => setSelectedUnit(parseInt(value))}
            disabled={!selectedStudentId}
          >
            <SelectTrigger id="unit-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1ª Unidade</SelectItem>
              <SelectItem value="2">2ª Unidade</SelectItem>
              <SelectItem value="3">3ª Unidade</SelectItem>
              <SelectItem value="4">4ª Unidade</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedStudentId && (
        <div>
          <h3 className="text-lg font-medium mb-2 mt-4">
            Notas de {students.find(s => s.id === selectedStudentId)?.name} - {selectedUnit}ª Unidade
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
                        onChange={(e) => setCurrentGrades(prev => ({ ...prev, [discipline.id]: e.target.value }))}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleSaveGrades}>Salvar Notas da {selectedUnit}ª Unidade</Button>
          </div>
        </div>
      )}
    </div>
  );
};