export interface Guardian {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  classes: string[];
}

export interface Student {
  id: string;
  name: string;
  cpf: string;
  guardianId: string;
  class: string; // Turma
}