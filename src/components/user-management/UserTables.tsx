import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Student, Guardian, Teacher } from "@/types";

interface StudentsTableProps {
  students: Student[];
  guardians: Guardian[];
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
}

export const StudentsTable = ({ students, guardians, onEdit, onDelete }: StudentsTableProps) => {
  const getGuardianName = (guardianId: string) => {
    return guardians.find((g) => g.id === guardianId)?.name || "N/A";
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome do Aluno</TableHead>
          <TableHead>CPF</TableHead>
          <TableHead>Responsável</TableHead>
          <TableHead>Turma</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell className="font-medium">{student.name}</TableCell>
            <TableCell>{student.cpf}</TableCell>
            <TableCell>{getGuardianName(student.guardianId)}</TableCell>
            <TableCell>{student.class}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(student)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(student.id)} className="text-red-600">
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
  );
};

interface GuardiansTableProps {
  guardians: Guardian[];
  onEdit: (guardian: Guardian) => void;
  onDelete: (guardianId: string) => void;
}

export const GuardiansTable = ({ guardians, onEdit, onDelete }: GuardiansTableProps) => (
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(guardian)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(guardian.id)} className="text-red-600">
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
);

interface TeachersTableProps {
  teachers: Teacher[];
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacherId: string) => void;
}

export const TeachersTable = ({ teachers, onEdit, onDelete }: TeachersTableProps) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Nome do Professor</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Disciplinas</TableHead>
        <TableHead>Turmas</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {teachers.map((teacher) => (
        <TableRow key={teacher.id}>
          <TableCell className="font-medium">{teacher.name}</TableCell>
          <TableCell>{teacher.email}</TableCell>
          <TableCell>{teacher.subjects.join(", ")}</TableCell>
          <TableCell>{teacher.classes.join(", ")}</TableCell>
          <TableCell className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(teacher)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(teacher.id)} className="text-red-600">
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
);