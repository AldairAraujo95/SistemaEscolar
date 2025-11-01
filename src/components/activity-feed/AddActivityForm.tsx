import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Class, Discipline } from "@/types";

interface AddActivityFormProps {
  classes: Class[];
  disciplines: Discipline[];
  onAddActivity: (activity: { classId: string; disciplineId: string; description: string; dueDate: Date }) => void;
}

export const AddActivityForm = ({ classes, disciplines, onAddActivity }: AddActivityFormProps) => {
  const [classId, setClassId] = useState<string>("");
  const [disciplineId, setDisciplineId] = useState<string>("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>();

  const handleSubmit = () => {
    if (classId && disciplineId && description && dueDate) {
      onAddActivity({ classId, disciplineId, description, dueDate });
      // Reset form
      setClassId("");
      setDisciplineId("");
      setDescription("");
      setDueDate(undefined);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Postar Nova Atividade</CardTitle>
        <CardDescription>Selecione a turma, disciplina e descreva a atividade.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="class">Turma</Label>
            <Select value={classId} onValueChange={setClassId}>
              <SelectTrigger id="class">
                <SelectValue placeholder="Selecione a turma" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="discipline">Disciplina</Label>
            <Select value={disciplineId} onValueChange={setDisciplineId}>
              <SelectTrigger id="discipline">
                <SelectValue placeholder="Selecione a disciplina" />
              </SelectTrigger>
              <SelectContent>
                {disciplines.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="description">Descrição da Atividade</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva a atividade para os alunos..."
          />
        </div>
        <div>
          <Label htmlFor="due-date">Data de Entrega</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="due-date"
                variant={"outline"}
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit}>Postar Atividade</Button>
        </div>
      </CardContent>
    </Card>
  );
};