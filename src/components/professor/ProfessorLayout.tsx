import { Outlet } from "react-router-dom";
import ProfessorSidebar from "@/components/professor/ProfessorSidebar";

const ProfessorLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-background">
      <ProfessorSidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ProfessorLayout;