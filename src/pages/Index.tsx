import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, BookOpen, DollarSign, Calendar, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const summaryCards = [
    {
      title: "Gestão de Usuários",
      description: "Pais e Professores",
      icon: <Users className="h-6 w-6 text-gray-500" />,
      value: "1,250",
      link: "/users",
    },
    {
      title: "Gestão Acadêmica",
      description: "Turmas e Disciplinas",
      icon: <BookOpen className="h-6 w-6 text-gray-500" />,
      value: "45 Turmas",
      link: "/academic",
    },
    {
      title: "Gestão Financeira",
      description: "Boletos e Mensalidades",
      icon: <DollarSign className="h-6 w-6 text-gray-500" />,
      value: "R$ 120.5k",
      link: "/financial",
    },
    {
      title: "Agenda Escolar",
      description: "Próximos Eventos",
      icon: <Calendar className="h-6 w-6 text-gray-500" />,
      value: "5 Eventos",
      link: "/calendar",
    },
    {
      title: "Feed de Atividades",
      description: "Últimas Postagens",
      icon: <Activity className="h-6 w-6 text-gray-500" />,
      value: "12 Novas",
      link: "/feed",
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