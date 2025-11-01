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
import type { Discipline } from "@/types";

interface EditDisciplineDialogProps {
  discipline: Discipline | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedDiscipline: Discipline) => void;
}

export const EditDisciplineDialog = ({ discipline, open, onOpenChange, onSave }: EditDisciplineDialogProps) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (discipline) {
      setName(discipline.name);
    }
  }, [discipline]);

  const handleSave = () => {
    if (discipline && name.trim()) {
      onSave({ ...discipline, name: name.trim() });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Disciplina</DialogTitle>
          <DialogDescription>
            Atualize o nome da disciplina.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-discipline-name" className="text-right">
              Nome
            </Label>
            <Input
              id="edit-discipline-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
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