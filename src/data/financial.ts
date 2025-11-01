import type { Boleto } from "@/types";

export const boletos: Boleto[] = [
  { id: "b1", guardianId: "g1", amount: 550.00, dueDate: "2024-08-10", status: "pago" },
  { id: "b2", guardianId: "g1", amount: 550.00, dueDate: "2024-09-10", status: "a vencer" },
  { id: "b3", guardianId: "g2", amount: 600.00, dueDate: "2024-07-10", status: "vencido" },
  { id: "b4", guardianId: "g2", amount: 600.00, dueDate: "2024-08-10", status: "pago" },
  { id: "b5", guardianId: "g1", amount: 550.00, dueDate: "2024-07-10", status: "pago" },
  { id: "b6", guardianId: "g2", amount: 600.00, dueDate: "2024-09-10", status: "a vencer" },
];