import type { Grade } from "@/types";

// Dados de notas iniciais para alguns alunos
export const grades: Grade[] = [
  // Notas para Lucas Silva (s1)
  { id: "gr1", studentId: "s1", disciplineId: "d1", grade: 8.5 }, // Matemática
  { id: "gr2", studentId: "s1", disciplineId: "d2", grade: 9.0 }, // Português
  { id: "gr3", studentId: "s1", disciplineId: "d3", grade: 7.0 }, // História

  // Notas para Beatriz Souza (s2)
  { id: "gr4", studentId: "s2", disciplineId: "d1", grade: 9.5 }, // Matemática
  { id: "gr5", studentId: "s2", disciplineId: "d4", grade: 8.0 }, // Física

  // Notas para Pedro Silva (s3)
  { id: "gr6", studentId: "s3", disciplineId: "d2", grade: 6.5 }, // Português
  { id: "gr7", studentId: "s3", disciplineId: "d3", grade: 7.5 }, // História
];