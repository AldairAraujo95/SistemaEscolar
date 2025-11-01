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
import type { Guardian } from "@/types";

interface AddUserDialogProps {
  guardians: Guardian[];
}

export const AddUserDialog = ({ guardians }: AddUserDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Here you would handle form submission
    console.log("Form submitted");
    setOpen(false); // Close dialog on submit
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar Novo Usuário</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os detalhes abaixo para criar um novo usuário.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="student">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="student">Aluno</TabsTrigger>
            <TabsTrigger value="guardian">Responsável</TabsTrigger>
            <TabsTrigger value="teacher">Professor</TabsTrigger>
          </TabsList>
          <form onSubmit={handleSubmit}>
            <TabsContent value="student">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="student-name" className="text-right">Nome</Label>
                  <Input id="student-name" placeholder="Nome do Aluno" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="class" className="text-right">Turma</Label>
                  <Input id="class" placeholder="Ex: 5º Ano A" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="guardian" className="text-right">Responsável</Label>
                  <Select>
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
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="guardian-name" className="text-right">Nome</Label>
                  <Input id="guardian-name" placeholder="Nome do Responsável" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="guardian-email" className="text-right">Email</Label>
                  <Input id="guardian-email" type="email" placeholder="email@example.com" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="guardian-phone" className="text-right">Telefone</Label>
                  <Input id="guardian-phone" placeholder="(00) 90000-0000" className="col-span-3" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="teacher">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="teacher-name" className="text-right">Nome</Label>
                  <Input id="teacher-name" placeholder="Nome do Professor" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="teacher-email" className="text-right">Email</Label>
                  <Input id="teacher-email" type="email" placeholder="email@school.com" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subject" className="text-right">Disciplina</Label>
                  <Input id="subject" placeholder="Ex: Matemática" className="col-span-3" />
                </div>
              </div>
            </TabsContent>
            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};