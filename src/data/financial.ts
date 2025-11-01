import type { Boleto } from "@/types";

const generateBoletos = (): Boleto[] => {
  const boletos: Boleto[] = [];
  const statuses: Boleto['status'][] = ['pago', 'a vencer', 'vencido'];
  
  for (let i = 1; i <= 50; i++) {
    const guardianId = `g${i}`;
    // Gerar 3 boletos por responsável
    for (let j = 0; j < 3; j++) {
      const month = 7 + j; // Julho, Agosto, Setembro
      const status = statuses[(i + j) % 3];
      let day = 10;
      if (status === 'vencido') day = 5;
      if (status === 'pago' && month === 8) day = 2;

      boletos.push({
        id: `b${boletos.length + 1}`,
        guardianId: guardianId,
        amount: 550.00 + (i % 5) * 25, // Variar um pouco o valor
        dueDate: `2024-0${month}-${day}`,
        status: status,
      });
    }
  }
  return boletos;
};

export const boletos: Boleto[] = generateBoletos();