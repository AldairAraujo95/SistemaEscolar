export interface Guardian {
  id: string;
  name: string;
  email: string;
  phone: string;
  dueDateDay: number; // Dia do mês para vencimento do boleto
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

export interface Discipline {
  id: string;
  name: string;
}

export interface Class {
  id: string;
  name: string;
}

export interface Grade {
  id: string;
  studentId: string;
  disciplineId: string;
  grade: number | null;
  unit: number; // 1ª Unidade, 2ª Unidade, etc.
}

export interface Boleto {
  id: string;
  guardianId: string;
  amount: number;
  dueDate: string; // Formato YYYY-MM-DD
  status: 'pago' | 'a vencer' | 'vencido';
}