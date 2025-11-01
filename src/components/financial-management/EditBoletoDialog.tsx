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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Boleto } from "@/types";

interface EditBoletoDialogProps {
  boleto: Boleto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedBoleto: Boleto) => void;
}

export const EditBoletoDialog = ({ boleto, open, onOpenChange, onSave }: EditBoletoDialogProps) => {
  const [status, setStatus] = useState<Boleto['status']>('a vencer');

  useEffect(() => {
    if (boleto) {
      setStatus(boleto.status);
    }
  }, [boleto]);

  const handleSave = () => {
    if (boleto) {
      onSave({ ...boleto, status });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Status do Boleto</DialogTitle>
          <DialogDescription>
            Selecione o novo status para o boleto.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={status} onValueChange={(value: Boleto['status']) => setStatus(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="a vencer">A Vencer</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
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