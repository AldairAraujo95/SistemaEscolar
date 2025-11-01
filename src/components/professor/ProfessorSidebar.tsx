import { NavLink, useNavigate } from "react-router-dom";
import { BookOpen, Calendar, Activity, School, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { MadeWithDyad } from "../made-with-dyad";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const ProfessorSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: "/professor/academic", icon: BookOpen, label: "Gestão Acadêmica" },
    { to: "/professor/feed", icon: Activity, label: "Feed de Atividades" },
    { to: "/professor/calendar", icon: Calendar, label: "Agenda Escolar" },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <School className="h-7 w-7" />
          <span>Portal do Professor</span>
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                isActive && "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
      <div className="mt-auto">
        <MadeWithDyad />
      </div>
    </aside>
  );
};

export default ProfessorSidebar;