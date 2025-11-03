import { useState, useMemo, useEffect, useCallback } from "react";
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
import { MoreHorizontal, Edit, TrendingUp, TrendingDown, CircleDollarSign, Download, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/financial-management/StatusBadge";
import { EditBoletoDialog } from "@/components/financial-management/EditBoletoDialog";
import { AddBoletoDialog } from "@/components/financial-management/AddBoletoDialog";
import { BatchBoletoDialog } from "@/components/financial-management/BatchBoletoDialog";
import { FinancialChart } from "@/components/financial-management/FinancialChart";
import { DeleteConfirmationDialog } from "@/components/user-management/DeleteConfirmationDialog";
import type { Boleto, Guardian } from "@/types";
import { showSuccess, showError } from "@/utils/toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const FinancialManagement = () => {
  const { role, user } = useAuth();
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [selectedGuardian, setSelectedGuardian] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<Boleto['status'] | 'all'>('all');
  const [editingBoleto, setEditingBoleto] = useState<Boleto | null>(null);
  const [deletingBoleto, setDeletingBoleto] = useState<Boleto | null>(null);

  const fetchData = useCallback(async () => {
    const { data: boletosData, error: boletosError } = await supabase
      .from('boletos')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: guardiansData, error: guardiansError } = await supabase
      .from('guardians')
      .select('*')
      .order('name');

    if (boletosError || guardiansError) {
      showError("Erro ao buscar dados financeiros.");
    } else {
      const formattedBoletos = boletosData.map(item => ({
        id: item.id,
        guardianId: item.guardian_id,
        amount: item.amount,
        dueDate: item.due_date,
        status: item.status as Boleto['status'],
        filePath: item.file_path,
      }));
      setBoletos(formattedBoletos);
      setGuardians(guardiansData.map(g => ({ ...g, dueDateDay: g.due_date_day })));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const visibleBoletos = useMemo(() => {
    if (role === 'aluno' && user) {
      return boletos.filter(b => b.guardianId === user.id);
    }
    return boletos;
  }, [boletos, role, user]);

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

  const handleUpdateBoleto = async (updatedBoleto: Boleto) => {
    const { error } = await supabase
      .from('boletos')
      .update({ status: updatedBoleto.status })
      .eq('id', updatedBoleto.id);

    if (error) {
      showError("Erro ao atualizar o boleto.");
    } else {
      showSuccess("Status do boleto atualizado com sucesso!");
      fetchData();
    }
    setEditingBoleto(null);
  };

  const handleAddBoleto = async (data: { guardianId: string; amount: number; dueDate: Date; file: File | null }) => {
    if (!data.file) {
      showError("Nenhum arquivo selecionado.");
      return;
    }

    const filePath = `${data.guardianId}/${uuidv4()}-${data.file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('boletos')
      .upload(filePath, data.file);

    if (uploadError) {
      showError("Erro ao fazer upload do arquivo.");
      console.error(uploadError);
      return;
    }

    const { error: insertError } = await supabase.from('boletos').insert({
      guardian_id: data.guardianId,
      amount: data.amount,
      due_date: data.dueDate.toISOString().split('T')[0],
      status: 'a vencer',
      file_path: filePath,
    });

    if (insertError) {
      showError("Erro ao adicionar o boleto.");
      console.error(insertError);
    } else {
      showSuccess("Boleto adicionado com sucesso!");
      fetchData();
    }
  };

  const handleBatchGenerateBoletos = async ({ month, year, amount }: { month: number; year: number; amount: number }) => {
    const guardiansWithoutBoleto = guardians.filter(guardian => {
      return !boletos.some(boleto =>
        boleto.guardianId === guardian.id &&
        new Date(boleto.dueDate).getUTCFullYear() === year &&
        new Date(boleto.dueDate).getUTCMonth() === month - 1
      );
    });

    if (guardiansWithoutBoleto.length === 0) {
      showSuccess("Todos os responsáveis já possuem boletos para este mês.");
      return;
    }

    const boletosToInsert = guardiansWithoutBoleto.map(guardian => {
      const dueDate = new Date(year, month - 1, guardian.dueDateDay);
      return {
        guardian_id: guardian.id,
        amount: amount,
        due_date: dueDate.toISOString().split('T')[0],
        status: 'a vencer',
      };
    });

    const { error } = await supabase.from('boletos').insert(boletosToInsert);

    if (error) {
      showError("Erro ao gerar boletos em lote.");
      console.error(error);
    } else {
      showSuccess(`${boletosToInsert.length} boleto(s) gerado(s) com sucesso!`);
      fetchData();
    }
  };

  const confirmDeleteBoleto = async () => {
    if (!deletingBoleto) return;

    if (deletingBoleto.filePath) {
      const { error: storageError } = await supabase.storage
        .from('boletos')
        .remove([deletingBoleto.filePath]);
      
      if (storageError) {
        showError("Erro ao remover o arquivo do boleto. A exclusão foi abortada.");
        setDeletingBoleto(null);
        return;
      }
    }

    const { error } = await supabase
      .from('boletos')
      .delete()
      .eq('id', deletingBoleto.id);

    if (error) {
      showError("Erro ao excluir o boleto.");
    } else {
      showSuccess("Boleto excluído com sucesso!");
      fetchData();
    }
    setDeletingBoleto(null);
  };

  const handleDownload = async (filePath: string) => {
    const { data, error } = await supabase.storage.from('boletos').download(filePath);
    if (error) {
      showError("Erro ao baixar o arquivo.");
      console.error(error);
      return;
    }
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filePath.split('/').pop() || 'boleto.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Histórico Financeiro Detalhado</CardTitle>
            <CardDescription>Visualize e gerencie todos os boletos.</CardDescription>
          </div>
          {role !== 'aluno' && (
            <div className="flex gap-2">
              <BatchBoletoDialog onSave={handleBatchGenerateBoletos} />
              <AddBoletoDialog guardians={guardians} onSave={handleAddBoleto} />
            </div>
          )}
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
                  <TableHead>Arquivo</TableHead>
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
                    <TableCell>
                      {boleto.filePath ? (
                        <Button variant="outline" size="icon" onClick={() => handleDownload(boleto.filePath!)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      ) : (
                        "-"
                      )}
                    </TableCell>
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
                            <DropdownMenuItem onClick={() => setDeletingBoleto(boleto)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
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

      <DeleteConfirmationDialog
        open={!!deletingBoleto}
        onOpenChange={(open) => !open && setDeletingBoleto(null)}
        onConfirm={confirmDeleteBoleto}
        title="Confirmar Exclusão"
        description="Tem certeza que deseja excluir este boleto? O arquivo associado também será removido. Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default FinancialManagement;