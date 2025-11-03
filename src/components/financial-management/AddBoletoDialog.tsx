import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
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

interface AddBoletoDialogProps {
  guardians: Guardian[];
  onSave: (data: { guardianId: string; amount: number; dueDate: Date; file: File | null }) => void;
}

export const AddBoletoDialog = ({ guardians, onSave }: AddBoletoDialogProps) => {
  const [open, setOpen] = useState(false);
  const [guardianId, setGuardianId] = useState("");
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const currentYear = new Date().getFullYear();
  const [day, setDay] = useState("");
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(currentYear);

  const months = [
    { value: 1, label: "Jan" }, { value: 2, label: "Fev" },
    { value: 3, label: "Mar" }, { value: 4, label: "Abr" },
    { value: 5, label: "Mai" }, { value: 6, label: "Jun" },
    { value: 7, label: "Jul" }, { value: 8, label: "Ago" },
    { value: 9, label: "Set" }, { value: 10, label: "Out" },
    { value: 11, label: "Nov" }, { value: 12, label: "Dez" },
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  const handleSave = () => {
    if (guardianId && amount && day && month && year && file) {
      // Using UTC to avoid timezone issues
      const dueDate = new Date(Date.UTC(year, month - 1, parseInt(day)));
      onSave({
        guardianId,
        amount: parseFloat(amount),
        dueDate,
        file,
      });
      setGuardianId("");
      setAmount("");
      setDay("");
      setFile(null);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar Boleto</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Boleto</DialogTitle>
          <DialogDescription>
            Preencha os dados para gerar um novo boleto.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="guardian" className="text-right">
              Responsável
            </Label>
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Valor (R$)
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
              placeholder="550.00"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="due-date-day" className="text-right">
              Vencimento
            </Label>
            <div className="col-span-3 grid grid-cols-3 gap-2">
              <Input
                id="due-date-day"
                type="number"
                placeholder="Dia"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                min="1"
                max="31"
              />
              <Select value={String(month)} onValueChange={(value) => setMonth(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m.value} value={String(m.value)}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={String(year)} onValueChange={(value) => setYear(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              Arquivo
            </Label>
            <Input
              id="file"
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!guardianId || !amount || !day || !file}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};