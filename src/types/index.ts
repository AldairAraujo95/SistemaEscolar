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
  subject: string;
}

export interface Student {
  id: string;
  name: string;
  guardianId: string;
  class: string; // Turma
}