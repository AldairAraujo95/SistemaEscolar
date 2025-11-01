import type { Boleto } from "@/types";

const generateBoletos = (): Boleto[] => {
  const boletos: Boleto[] = [];
  const currentMonth = new Date().getMonth() + 1; // Mês atual (1-12)

  // Loop através dos 50 responsáveis
  for (let i = 1; i <= 50; i++) {
    const guardianId = `g${i}`;
    
    // Loop através dos meses de Janeiro (1) a Novembro (11)
    for (let month = 1; month <= 11; month++) {
      let status: Boleto['status'];

      // Define o status com base no mês atual
      if (month < currentMonth) {
        // Para meses passados, a maioria está paga, mas alguns estão vencidos para realismo
        // A cada 7 responsáveis, um terá um boleto vencido no mês anterior
        if (i % 7 === 0 && month === currentMonth - 1) {
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
        amount: 550.00 + (i % 5) * 25, // Varia um pouco o valor
        dueDate: `2024-${String(month).padStart(2, '0')}-10`,
        status: status,
      });
    }
  }
  return boletos;
};

export const boletos: Boleto[] = generateBoletos();