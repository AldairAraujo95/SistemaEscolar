import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Guardian, Class } from "@/types";
import { PlusCircle, X } from "lucide-react";

interface AddUserDialogProps {
  guardians: Guardian[];
  classes: Class[];
  onAddUser: (type: string, data: any) => void;
}

export const AddUserDialog = ({ guardians, classes, onAddUser }: AddUserDialogProps) => {
  const [open, setOpen] = useState(false);
  const [newStudents, setNewStudents] = useState([{ name: "", class: "" }]);

  const handleStudentChange = (index: number, field: 'name' | 'class', value: string) => {
    const updatedStudents = [...newStudents];
    updatedStudents[index][field] = value;
    setNewStudents(updatedStudents);
  };

  const addStudentField = () => {
    setNewStudents([...newStudents, { name: "", class: "" }]);
  };

  const removeStudentField = (index: number) => {
    const updatedStudents = newStudents.filter((_, i) => i !== index);
    setNewStudents(updatedStudents);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const activeTab = formData.get("activeTab");

    let data = {};
    if (activeTab === "student") {
      data = {
        name: formData.get("student-name"),
        cpf: formData.get("student-cpf"),
        class: formData.get("class"),
        guardianId: formData.get("guardian"),
      };
    } else if (activeTab === "guardian") {
      data = {
        name: formData.get("guardian-name"),
        email: formData.get("guardian-email"),
        phone: formData.get("guardian-phone"),
        dueDateDay: formData.get("due-date-day"),
        students: newStudents.filter(s => s.name && s.class),
      };
    } else if (activeTab === "teacher") {
      data = {
        name: formData.get("teacher-name"),
        email: formData.get("teacher-email"),
        subjects: (formData.get("subjects") as string).split(",").map(s => s.trim()),
        classes: (formData.get("classes") as string).split(",").map(s => s.trim()),
      };
    }
    
    onAddUser(activeTab as string, data);
    setOpen(false);
    setNewStudents([{ name: "", class: "" }]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar Novo Usuário</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os detalhes abaixo para criar um novo usuário.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="student">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="student">Aluno</TabsTrigger>
              <TabsTrigger value="guardian">Responsável</TabsTrigger>
              <TabsTrigger value="teacher">Professor</TabsTrigger>
            </TabsList>
            <TabsContent value="student">
              <input type="hidden" name="activeTab" value="student" />
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="student-name" className="text-right">Nome</Label>
                  <Input id="student-name" name="student-name" placeholder="Nome do Aluno" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="student-cpf" className="text-right">CPF</Label>
                  <Input id="student-cpf" name="student-cpf" placeholder="000.000.000-00" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="class" className="text-right">Turma</Label>
                  <Select name="class">
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
                  <Label htmlFor="guardian" className="text-right">Responsável</Label>
                  <Select name="guardian">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione um responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      {guardians.map((guardian) => (
                        <SelectItem key={guardian.id} value={guardian.id}>
                          {guardian.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="guardian">
              <input type="hidden" name="activeTab" value="guardian" />
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="guardian-name" className="text-right">Nome</Label>
                  <Input id="guardian-name" name="guardian-name" placeholder="Nome do Responsável" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="guardian-email" className="text-right">Email</Label>
                  <Input id="guardian-email" name="guardian-email" type="email" placeholder="email@example.com" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="guardian-phone" className="text-right">Telefone</Label>
                  <Input id="guardian-phone" name="guardian-phone" placeholder="(00) 90000-0000" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="due-date-day" className="text-right">Vencimento</Label>
                  <Select name="due-date-day" defaultValue="10">
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
                <div className="col-span-4 space-y-2 mt-4">
                  <Label>Alunos Vinculados</Label>
                  {newStudents.map((student, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input placeholder="Nome do Aluno" value={student.name} onChange={(e) => handleStudentChange(index, 'name', e.target.value)} />
                      <Select value={student.class} onValueChange={(value) => handleStudentChange(index, 'class', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a Turma" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((c) => (
                            <SelectItem key={c.id} value={c.name}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeStudentField(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addStudentField}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Aluno
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="teacher">
              <input type="hidden" name="activeTab" value="teacher" />
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="teacher-name" className="text-right">Nome</Label>
                  <Input id="teacher-name" name="teacher-name" placeholder="Nome do Professor" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="teacher-email" className="text-right">Email</Label>
                  <Input id="teacher-email" name="teacher-email" type="email" placeholder="email@school.com" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subjects" className="text-right">Disciplinas</Label>
                  <Input id="subjects" name="subjects" placeholder="Matemática, Português..." className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="classes" className="text-right">Turmas</Label>
                  <Input id="classes" name="classes" placeholder="5º A, 6º B, ..." className="col-span-3" />
                </div>
              </div>
            </TabsContent>
            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  );
};