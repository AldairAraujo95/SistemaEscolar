import type { CalendarEvent } from "@/types";

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

export const initialEvents: CalendarEvent[] = [
  {
    id: "evt1",
    title: "Reunião de Pais e Mestres",
    date: new Date(currentYear, currentMonth, 15),
    description: "Reunião para discutir o desempenho dos alunos no primeiro semestre.",
    type: "event",
  },
  {
    id: "evt2",
    title: "Feriado Próximo",
    date: new Date(currentYear, currentMonth + 1, 7),
    description: "Não haverá aula devido ao feriado.",
    type: "holiday",
  },
  {
    id: "evt3",
    title: "Prova de Matemática",
    date: new Date(currentYear, currentMonth, 22),
    description: "Prova sobre o conteúdo visto na unidade.",
    type: "exam",
  },
  {
    id: "evt4",
    title: "Entrega do Trabalho de História",
    date: new Date(),
    description: "Data limite para a entrega do trabalho sobre a Revolução Industrial.",
    type: "reminder",
  },
];