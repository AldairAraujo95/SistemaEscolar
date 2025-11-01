import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { CalendarEvent } from "@/types";

interface EventDialogProps {
  event: Partial<CalendarEvent> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (event: Partial<CalendarEvent>) => void;
}

export const EventDialog = ({ event, open, onOpenChange, onSave }: EventDialogProps) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [description, setDescription] = useState("");
  const [type, setType] = useState<CalendarEvent['type']>('event');

  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setDate(event.date || new Date());
      setDescription(event.description || "");
      setType(event.type || 'event');
    } else {
      // Reset form for new event
      setTitle("");
      setDate(new Date());
      setDescription("");
      setType('event');
    }
  }, [event, open]);

  const handleSave = () => {
    if (title && date) {
      onSave({
        id: event?.id,
        title,
        date,
        description,
        type,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{event?.id ? "Editar Evento" : "Adicionar Novo Evento"}</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do evento abaixo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Título</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="col-span-3 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Tipo</Label>
            <Select value={type} onValueChange={(value: CalendarEvent['type']) => setType(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="event">Evento</SelectItem>
                <SelectItem value="holiday">Feriado</SelectItem>
                <SelectItem value="exam">Prova</SelectItem>
                <SelectItem value="reminder">Lembrete</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Detalhes do evento..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};