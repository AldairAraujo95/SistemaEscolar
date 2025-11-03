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
import type { Guardian } from "@/types";

interface EditGuardianDialogProps {
  guardian: Guardian | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedGuardian: Guardian) => void;
}

export const EditGuardianDialog = ({ guardian, open, onOpenChange, onSave }: EditGuardianDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dueDateDay, setDueDateDay] = useState(10);

  useEffect(() => {
    if (guardian) {
      setName(guardian.name);
      setEmail(guardian.email || "");
      setPhone(guardian.phone || "");
      setDueDateDay(guardian.dueDateDay);
    }
  }, [guardian]);

  const handleSave = () => {
    if (guardian) {
      const updatedGuardian: Guardian = {
        ...guardian,
        name,
        email,
        phone,
        dueDateDay,
      };
      onSave(updatedGuardian);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Responsável</DialogTitle>
          <DialogDescription>
            Atualize os dados do responsável abaixo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-guardian-name" className="text-right">Nome</Label>
            <Input id="edit-guardian-name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-guardian-email" className="text-right">Email</Label>
            <Input id="edit-guardian-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-guardian-phone" className="text-right">Telefone</Label>
            <Input id="edit-guardian-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-due-date-day" className="text-right">Vencimento</Label>
            <Select value={String(dueDateDay)} onValueChange={(value) => setDueDateDay(parseInt(value))}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Dia do vencimento" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                  <SelectItem key={day} value={String(day)}>
                    Dia {day}
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