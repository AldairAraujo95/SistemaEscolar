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
import type { Class } from "@/types";

interface EditClassDialogProps {
  classItem: Class | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedClass: Class) => void;
}

export const EditClassDialog = ({ classItem, open, onOpenChange, onSave }: EditClassDialogProps) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (classItem) {
      setName(classItem.name);
    }
  }, [classItem]);

  const handleSave = () => {
    if (classItem && name.trim()) {
      onSave({ ...classItem, name: name.trim() });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Turma</DialogTitle>
          <DialogDescription>
            Atualize o nome da turma.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-class-name" className="text-right">
              Nome
            </Label>
            <Input
              id="edit-class-name"
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