import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, BookOpen, DollarSign, Calendar, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { students, guardians, teachers } from "@/data/users";
import { classes } from "@/data/academic";
import { initialEvents } from "@/data/calendar";
import { initialActivities } from "@/data/activities";
import type { Boleto } from "@/types";

const Dashboard = () => {
  const [boletos, setBoletos] = useState<Boleto[]>([]);

  const fetchBoletos = useCallback(async () => {
    const { data, error } = await supabase.from('boletos').select('*');
    if (error) {
      console.error("Erro ao buscar boletos:", error);
    } else {
      const formattedData = data.map(item => ({
        id: item.id,
        guardianId: item.guardian_id,
        amount: item.amount,
        dueDate: item.due_date,
        status: item.status as Boleto['status'],
        filePath: item.file_path,
      }));
      setBoletos(formattedData);
    }
  }, []);

  useEffect(() => {
    fetchBoletos();

    const channel = supabase
      .channel('public:boletos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'boletos' }, () => {
        fetchBoletos();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchBoletos]);

  const totalUsers = students.length + guardians.length + teachers.length;
  const totalPendingAmount = boletos
    .filter(b => b.status === 'a vencer' || b.status === 'vencido')
    .reduce((sum, boleto) => sum + boleto.amount, 0);

  const summaryCards = [
    {
      title: "Gestão de Usuários",
      description: "Alunos, Pais e Professores",
      icon: <Users className="h-6 w-6 text-gray-500" />,
      value: `${totalUsers} Usuários`,
      link: "/admin/users",
    },
    {
      title: "Gestão Acadêmica",
      description: "Turmas e Disciplinas",
      icon: <BookOpen className="h-6 w-6 text-gray-500" />,
      value: `${classes.length} Turmas`,
      link: "/admin/academic",
    },
    {
      title: "Gestão Financeira",
      description: "Total a receber",
      icon: <DollarSign className="h-6 w-6 text-gray-500" />,
      value: totalPendingAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      link: "/admin/financial",
    },
    {
      title: "Agenda Escolar",
      description: "Próximos Eventos",
      icon: <Calendar className="h-6 w-6 text-gray-500" />,
      value: `${initialEvents.length} Eventos`,
      link: "/admin/calendar",
    },
    {
      title: "Feed de Atividades",
      description: "Últimas Postagens",
      icon: <Activity className="h-6 w-6 text-gray-500" />,
      value: `${initialActivities.length} Postagens`,
      link: "/admin/feed",
    },
  ];

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6 text-left">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map((card) => (
          <Link to={card.link} key={card.title} className="no-underline">
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;