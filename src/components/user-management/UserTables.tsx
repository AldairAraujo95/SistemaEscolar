import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import type { Student, Guardian, Teacher } from "@/types";

interface StudentsTableProps {
  students: Student[];
  guardians: Guardian[];
}

export const StudentsTable = ({ students, guardians }: StudentsTableProps) => {
  const getGuardianName = (guardianId: string) => {
    return guardians.find((g) => g.id === guardianId)?.name || "N/A";
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome do Aluno</TableHead>
          <TableHead>Responsável</TableHead>
          <TableHead>Turma</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell className="font-medium">{student.name}</TableCell>
            <TableCell>{getGuardianName(student.guardianId)}</TableCell>
            <TableCell>{student.class}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

interface GuardiansTableProps {
  guardians: Guardian[];
}

export const GuardiansTable = ({ guardians }: GuardiansTableProps) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Nome do Responsável</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Telefone</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {guardians.map((guardian) => (
        <TableRow key={guardian.id}>
          <TableCell className="font-medium">{guardian.name}</TableCell>
          <TableCell>{guardian.email}</TableCell>
          <TableCell>{guardian.phone}</TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

interface TeachersTableProps {
  teachers: Teacher[];
}

export const TeachersTable = ({ teachers }: TeachersTableProps) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Nome do Professor</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Disciplina</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {teachers.map((teacher) => (
        <TableRow key={teacher.id}>
          <TableCell className="font-medium">{teacher.name}</TableCell>
          <TableCell>{teacher.email}</TableCell>
          <TableCell>{teacher.subject}</TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);