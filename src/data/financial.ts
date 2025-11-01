import type { Boleto } from "@/types";
import { guardians } from "./users";

const generateBoletos = (): Boleto[] => {
  const boletos: Boleto[] = [];
  const currentMonth = new Date().getMonth() + 1; // Mês atual (1-12)

  guardians.forEach(guardian => {
    const guardianId = guardian.id;
    const dueDateDay = guardian.dueDateDay;
    
    // Loop através dos meses de Janeiro (1) a Novembro (11)
    for (let month = 1; month <= 11; month++) {
      let status: Boleto['status'];

      // Define o status com base no mês atual
      if (month < currentMonth) {
        // Para meses passados, a maioria está paga, mas alguns estão vencidos para realismo
        const guardianNumericId = parseInt(guardian.id.replace('g', ''));
        if (guardianNumericId % 7 === 0 && month === currentMonth - 1) {
          status = 'vencido';
        } else {
          status = 'pago';
        }
      } else {
        // Para o mês atual e futuros, os boletos estão "a vencer"
        status = 'a vencer';
      }

      boletos.push({
        id: `b${boletos.length + 1}`,
        guardianId: guardianId,
        amount: 550.00 + (parseInt(guardian.id.replace('g', '')) % 5) * 25, // Varia um pouco o valor
        dueDate: `2024-${String(month).padStart(2, '0')}-${String(dueDateDay).padStart(2, '0')}`,
        status: status,
      });
    }
  });
  return boletos;
};

export const boletos: Boleto[] = generateBoletos();