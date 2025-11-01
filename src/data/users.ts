import type { Guardian, Teacher, Student } from "@/types";

export const guardians: Guardian[] = [
  { id: "g1", name: "Ana Silva", email: "ana.silva@example.com", phone: "(11) 98765-4321" },
  { id: "g2", name: "Carlos Souza", email: "carlos.souza@example.com", phone: "(21) 91234-5678" },
];

export const teachers: Teacher[] = [
  { id: "t1", name: "Prof. Ricardo", email: "ricardo@school.com", subjects: ["Matemática", "Física"], classes: ["5º Ano A", "6º Ano B"] },
  { id: "t2", name: "Profa. Mariana", email: "mariana@school.com", subjects: ["Português", "História"], classes: ["5º Ano A", "3º Ano A"] },
];

export const students: Student[] = [
  { id: "s1", name: "Lucas Silva", cpf: "111.222.333-44", guardianId: "g1", class: "5º Ano A" },
  { id: "s2", name: "Beatriz Souza", cpf: "222.333.444-55", guardianId: "g2", class: "6º Ano B" },
  { id: "s3", name: "Pedro Silva", cpf: "333.444.555-66", guardianId: "g1", class: "3º Ano A" },
];