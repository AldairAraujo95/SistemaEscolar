import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Boleto } from "@/types";

interface StatusBadgeProps {
  status: Boleto['status'];
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusStyles = {
    pago: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300",
    'a vencer': "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300",
    vencido: "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300",
  };

  const statusText = {
    pago: "Pago",
    'a vencer': "A Vencer",
    vencido: "Vencido",
  };

  return (
    <Badge variant="outline" className={cn("border-transparent font-semibold", statusStyles[status])}>
      {statusText[status]}
    </Badge>
  );
};