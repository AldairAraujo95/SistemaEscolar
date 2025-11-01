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
import type { Teacher } from "@/types";

interface EditTeacherDialogProps {
  teacher: Teacher | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedTeacher: Teacher) => void;
}

export const EditTeacherDialog = ({ teacher, open, onOpenChange, onSave }: EditTeacherDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subjects, setSubjects] = useState("");
  const [classes, setClasses] = useState("");

  useEffect(() => {
    if (teacher) {
      setName(teacher.name);
      setEmail(teacher.email);
      setSubjects(teacher.subjects.join(", "));
      setClasses(teacher.classes.join(", "));
    }
  }, [teacher]);

  const handleSave = () => {
    if (teacher) {
      const updatedTeacher: Teacher = {
        ...teacher,
        name,
        email,
        subjects: subjects.split(",").map(s => s.trim()),
        classes: classes.split(",").map(s => s.trim()),
      };
      onSave(updatedTeacher);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Professor</DialogTitle>
          <DialogDescription>
            Atualize os dados do professor abaixo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-teacher-name" className="text-right">Nome</Label>
            <Input id="edit-teacher-name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-teacher-email" className="text-right">Email</Label>
            <Input id="edit-teacher-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-subjects" className="text-right">Disciplinas</Label>
            <Input id="edit-subjects" value={subjects} onChange={(e) => setSubjects(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-classes" className="text-right">Turmas</Label>
            <Input id="edit-classes" value={classes} className="col-span-3" value={classes} onChange={(e) => setClasses(e.target.value)} />
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