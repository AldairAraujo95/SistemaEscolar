import { useState } from "react";
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
import type { Guardian } from "@/types";

interface EditGuardianPasswordDialogProps {
  guardian: Guardian | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (guardianId: string, newPassword: string) => void;
}

export const EditGuardianPasswordDialog = ({ guardian, open, onOpenChange, onSave }: EditGuardianPasswordDialogProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (guardian) {
      onSave(guardian.id, password);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setPassword("");
      setConfirmPassword("");
      setError("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alterar Senha de {guardian?.name}</DialogTitle>
          <DialogDescription>
            Digite a nova senha para o responsável.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-password" className="text-right">Nova Senha</Label>
            <Input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirm-password" className="text-right">Confirmar Senha</Label>
            <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="col-span-3" />
          </div>
          {error && <p className="col-span-4 text-center text-sm text-red-500">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!password || !confirmPassword}>Salvar Nova Senha</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};