import type { Grade } from "@/types";

// Dados de notas iniciais para alguns alunos
export const grades: Grade[] = [
  // Notas para Lucas Silva (s1) - 1ª Unidade
  { id: "gr1", studentId: "s1", disciplineId: "d1", grade: 8.5, unit: 1 }, // Matemática
  { id: "gr2", studentId: "s1", disciplineId: "d2", grade: 9.0, unit: 1 }, // Português
  { id: "gr3", studentId: "s1", disciplineId: "d3", grade: 7.0, unit: 1 }, // História

  // Notas para Beatriz Souza (s2) - 1ª Unidade
  { id: "gr4", studentId: "s2", disciplineId: "d1", grade: 9.5, unit: 1 }, // Matemática
  { id: "gr5", studentId: "s2", disciplineId: "d4", grade: 8.0, unit: 1 }, // Física

  // Notas para Pedro Silva (s3) - 1ª Unidade
  { id: "gr6", studentId: "s3", disciplineId: "d2", grade: 6.5, unit: 1 }, // Português
  { id: "gr7", studentId: "s3", disciplineId: "d3", grade: 7.5, unit: 1 }, // História
  
  // Notas para Lucas Silva (s1) - 2ª Unidade
  { id: "gr8", studentId: "s1", disciplineId: "d1", grade: 7.5, unit: 2 }, // Matemática
];