import type { Activity } from "@/types";

export const initialActivities: Activity[] = [
  {
    id: "act1",
    classId: "c1", // 3º Ano A
    disciplineId: "d2", // Português
    description: "Ler o livro 'Dom Casmurro' e fazer um resumo de 2 páginas.",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 14)), // 2 weeks from now
  },
  {
    id: "act2",
    classId: "c2", // 5º Ano A
    disciplineId: "d1", // Matemática
    description: "Resolver os exercícios da página 50 a 55 do livro didático.",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // 1 week from now
  },
];