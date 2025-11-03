import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, BookOpen, DollarSign, Calendar, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Boleto } from "@/types";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    classes: 0,
    pendingAmount: 0,
    events: 0,
    activities: 0,
  });

  const fetchDashboardData = useCallback(async () => {
    // Fetch counts
    const { count: usersCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
    const { count: guardiansCount } = await supabase.from('guardians').select('*', { count: 'exact', head: true });
    const { count: teachersCount } = await supabase.from('teachers').select('*', { count: 'exact', head: true });
    const { count: classesCount } = await supabase.from('classes').select('*', { count: 'exact', head: true });
    const { count: eventsCount } = await supabase.from('calendar_events').select('*', { count: 'exact', head: true });
    const { count: activitiesCount } = await supabase.from('activities').select('*', { count: 'exact', head: true });

    // Fetch financial data
    const { data: boletosData, error: boletosError } = await supabase
      .from('boletos')
      .select('amount, status');

    if (boletosError) {
      console.error("Erro ao buscar boletos:", boletosError);
    } else {
      const totalPendingAmount = boletosData
        .filter(b => b.status === 'a vencer' || b.status === 'vencido')
        .reduce((sum, boleto) => sum + boleto.amount, 0);

      setStats({
        users: (usersCount ?? 0) + (guardiansCount ?? 0) + (teachersCount ?? 0),
        classes: classesCount ?? 0,
        pendingAmount: totalPendingAmount,
        events: eventsCount ?? 0,
        activities: activitiesCount ?? 0,
      });
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();

    const channel = supabase
      .channel('dashboard-realtime-channel')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchDashboardData]);

  const summaryCards = [
    {
      title: "Gestão de Usuários",
      description: "Alunos, Pais e Professores",
      icon: <Users className="h-6 w-6 text-gray-500" />,
      value: `${stats.users} Usuários`,
      link: "/admin/users",
    },
    {
      title: "Gestão Acadêmica",
      description: "Turmas e Disciplinas",
      icon: <BookOpen className="h-6 w-6 text-gray-500" />,
      value: `${stats.classes} Turmas`,
      link: "/admin/academic",
    },
    {
      title: "Gestão Financeira",
      description: "Total a receber",
      icon: <DollarSign className="h-6 w-6 text-gray-500" />,
      value: stats.pendingAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      link: "/admin/financial",
    },
    {
      title: "Agenda Escolar",
      description: "Próximos Eventos",
      icon: <Calendar className="h-6 w-6 text-gray-500" />,
      value: `${stats.events} Eventos`,
      link: "/admin/calendar",
    },
    {
      title: "Feed de Atividades",
      description: "Últimas Postagens",
      icon: <Activity className="h-6 w-6 text-gray-500" />,
      value: `${stats.activities} Postagens`,
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