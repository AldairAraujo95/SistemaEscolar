import { Outlet } from "react-router-dom";
import AlunoSidebar from "@/components/aluno/AlunoSidebar";

const AlunoLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-background">
      <AlunoSidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AlunoLayout;