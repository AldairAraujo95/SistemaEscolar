import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { grades } from "@/data/grades";
import { disciplines } from "@/data/academic";
import { students } from "@/data/users";

// Simula o aluno logado
const LOGGED_IN_STUDENT_ID = "s1";

const AlunoGrades = () => {
  const student = students.find(s => s.id === LOGGED_IN_STUDENT_ID);
  const studentGrades = grades.filter(g => g.studentId === LOGGED_IN_STUDENT_ID);
  const getDisciplineName = (id: string) => disciplines.find(d => d.id === id)?.name || "N/A";

  const gradesByUnit = studentGrades.reduce((acc, grade) => {
    const unit = `Unidade ${grade.unit}`;
    if (!acc[unit]) {
      acc[unit] = [];
    }
    acc[unit].push(grade);
    return acc;
  }, {} as Record<string, typeof studentGrades>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Minhas Notas</h1>
        <p className="text-gray-500 mt-2">Acompanhe seu desempenho acadêmico, {student?.name}.</p>
      </div>

      {Object.entries(gradesByUnit).map(([unit, grades]) => (
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
                {grades.map((grade) => (
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