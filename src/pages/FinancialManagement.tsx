import { useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Edit, TrendingUp, TrendingDown, CircleDollarSign } from "lucide-react";
import { StatusBadge } from "@/components/financial-management/StatusBadge";
import { EditBoletoDialog } from "@/components/financial-management/EditBoletoDialog";
import { AddBoletoDialog } from "@/components/financial-management/AddBoletoDialog";
import { FinancialChart } from "@/components/financial-management/FinancialChart";
import { boletos as initialBoletos } from "@/data/financial";
import { guardians as initialGuardians } from "@/data/users";
import type { Boleto, Guardian } from "@/types";
import { showSuccess } from "@/utils/toast";
import { useAuth } from "@/context/AuthContext";

// Simula o responsável logado
const LOGGED_IN_GUARDIAN_ID = "g1";

const FinancialManagement = () => {
  const { role } = useAuth();
  const [boletos, setBoletos] = useState<Boleto[]>(initialBoletos);
  const [guardians] = useState<Guardian[]>(initialGuardians);
  const [selectedGuardian, setSelectedGuardian] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<Boleto['status'] | 'all'>('all');
  const [editingBoleto, setEditingBoleto] = useState<Boleto | null>(null);

  const visibleBoletos = useMemo(() => {
    if (role === 'aluno') {
      return boletos.filter(b => b.guardianId === LOGGED_IN_GUARDIAN_ID);
    }
    return boletos;
  }, [boletos, role]);

  const financialSummary = useMemo(() => {
    return visibleBoletos.reduce(
      (acc, boleto) => {
        if (boleto.status === 'pago') {
          acc.paid.count += 1;
          acc.paid.total += boleto.amount;
        } else if (boleto.status === 'a vencer') {
          acc.pending.count += 1;
          acc.pending.total += boleto.amount;
        } else if (boleto.status === 'vencido') {
          acc.overdue.count += 1;
          acc.overdue.total += boleto.amount;
        }
        return acc;
      },
      {
        paid: { count: 0, total: 0 },
        pending: { count: 0, total: 0 },
        overdue: { count: 0, total: 0 },
      }
    );
  }, [visibleBoletos]);

  const chartData = [
    { name: 'Pago', value: financialSummary.paid.count },
    { name: 'A Vencer', value: financialSummary.pending.count },
    { name: 'Vencido', value: financialSummary.overdue.count },
  ];

  const getGuardianName = (guardianId: string) => {
    return guardians.find((g) => g.id === guardianId)?.name || "N/A";
  };

  const filteredBoletos = useMemo(() => {
    let filtered = visibleBoletos;
    if (role !== 'aluno' && selectedGuardian !== "all") {
      filtered = filtered.filter((b) => b.guardianId === selectedGuardian);
    }
    if (selectedStatus !== "all") {
      filtered = filtered.filter((b) => b.status === selectedStatus);
    }
    return filtered;
  }, [visibleBoletos, selectedGuardian, selectedStatus, role]);

  const handleUpdateBoleto = (updatedBoleto: Boleto) => {
    setBoletos(boletos.map(b => b.id === updatedBoleto.id ? updatedBoleto : b));
    setEditingBoleto(null);
    showSuccess("Status do boleto atualizado com sucesso!");
  };

  const handleAddBoleto = (data: { guardianId: string; amount: number; dueDate: Date }) => {
    const newBoleto: Boleto = {
      id: uuidv4(),
      guardianId: data.guardianId,
      amount: data.amount,
      dueDate: data.dueDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
      status: 'a vencer',
    };
    setBoletos([newBoleto, ...boletos]);
    showSuccess("Boleto adicionado com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestão Financeira</h1>
        <p className="text-gray-500 mt-2">
          {role === 'aluno'
            ? "Acompanhe os boletos de mensalidade."
            : "Gerencie e suba os boletos das mensalidades dos pais."}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialSummary.paid.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            <p className="text-xs text-muted-foreground">{financialSummary.paid.count} boletos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Receber</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialSummary.pending.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            <p className="text-xs text-muted-foreground">{financialSummary.pending.count} boletos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencido</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialSummary.overdue.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            <p className="text-xs text-muted-foreground">{financialSummary.overdue.count} boletos</p>
          </CardContent>
        </Card>
        <FinancialChart data={chartData} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Histórico Financeiro Detalhado</CardTitle>
            <CardDescription>Visualize e gerencie todos os boletos.</CardDescription>
          </div>
          {role !== 'aluno' && <AddBoletoDialog guardians={guardians} onSave={handleAddBoleto} />}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {role !== 'aluno' && (
              <div className="w-full sm:max-w-sm">
                <Label htmlFor="guardian-filter">Filtrar por Responsável</Label>
                <Select value={selectedGuardian} onValueChange={setSelectedGuardian}>
                  <SelectTrigger id="guardian-filter">
                    <SelectValue placeholder="Selecione um responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Responsáveis</SelectItem>
                    {guardians.map((guardian) => (
                      <SelectItem key={guardian.id} value={guardian.id}>
                        {guardian.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="w-full sm:max-w-xs">
              <Label htmlFor="status-filter">Filtrar por Status</Label>
              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as Boleto['status'] | 'all')}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="a vencer">A Vencer</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  {role !== 'aluno' && <TableHead className="text-right">Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBoletos.map((boleto) => (
                  <TableRow key={boleto.id}>
                    <TableCell className="font-medium">{getGuardianName(boleto.guardianId)}</TableCell>
                    <TableCell>{new Date(boleto.dueDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
                    <TableCell>{boleto.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                    <TableCell><StatusBadge status={boleto.status} /></TableCell>
                    {role !== 'aluno' && (
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingBoleto(boleto)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar Status
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <EditBoletoDialog
        boleto={editingBoleto}
        open={!!editingBoleto}
        onOpenChange={(open) => !open && setEditingBoleto(null)}
        onSave={handleUpdateBoleto}
      />
    </div>
  );
};

export default FinancialManagement;