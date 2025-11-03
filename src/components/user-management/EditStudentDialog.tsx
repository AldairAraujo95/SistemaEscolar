import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Student, Guardian, Class } from "@/types";

interface EditStudentDialogProps {
  student: Student | null;
  guardians: Guardian[];
  classes: Class[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedStudent: Student) => void;
}

export const EditStudentDialog = ({ student, guardians, classes, open, onOpenChange, onSave }: EditStudentDialogProps) => {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [className, setClassName] = useState("");
  const [guardianId, setGuardianId] = useState("");

  useEffect(() => {
    if (student) {
      setName(student.name);
      setCpf(student.cpf);
      setClassName(student.class);
      setGuardianId(student.guardianId);
    }
  }, [student]);

  const handleSave = () => {
    if (student) {
      const updatedStudent: Student = {
        ...student,
        name,
        cpf,
        class: className,
        guardianId,
      };
      onSave(updatedStudent);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Aluno</DialogTitle>
          <DialogDescription>
            Atualize os dados do aluno abaixo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-student-name" className="text-right">Nome</Label>
            <Input id="edit-student-name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-student-cpf" className="text-right">CPF</Label>
            <Input id="edit-student-cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-student-class" className="text-right">Turma</Label>
            <Select value={className} onValueChange={setClassName}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione uma turma" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-student-guardian" className="text-right">Responsável</Label>
            <Select value={guardianId} onValueChange={setGuardianId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione um responsável" />
              </SelectTrigger>
              <SelectContent>
                {guardians.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};