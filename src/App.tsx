import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Page Imports
import RoleSelection from "./pages/RoleSelection";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import UserManagement from "./pages/UserManagement";
import AcademicManagement from "./pages/AcademicManagement";
import FinancialManagement from "./pages/FinancialManagement";
import SchoolCalendar from "./pages/SchoolCalendar";
import ActivityFeed from "./pages/ActivityFeed";
import AlunoGrades from "./pages/aluno/AlunoGrades";

// Layout and Route Protection
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import ProfessorLayout from "./components/professor/ProfessorLayout";
import AlunoLayout from "./components/aluno/AlunoLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<RoleSelection />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Index />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="academic" element={<AcademicManagement />} />
              <Route path="financial" element={<FinancialManagement />} />
              <Route path="calendar" element={<SchoolCalendar />} />
              <Route path="feed" element={<ActivityFeed />} />
            </Route>
          </Route>

          {/* Professor Routes */}
          <Route element={<ProtectedRoute allowedRoles={['professor']} />}>
            <Route path="/professor" element={<ProfessorLayout />}>
              <Route index element={<AcademicManagement />} />
              <Route path="academic" element={<AcademicManagement />} />
              <Route path="feed" element={<ActivityFeed />} />
              <Route path="calendar" element={<SchoolCalendar />} />
            </Route>
          </Route>

          {/* Aluno/Responsável Routes */}
          <Route element={<ProtectedRoute allowedRoles={['aluno']} />}>
            <Route path="/aluno" element={<AlunoLayout />}>
              <Route index element={<FinancialManagement />} />
              <Route path="financial" element={<FinancialManagement />} />
              <Route path="feed" element={<ActivityFeed />} />
              <Route path="calendar" element={<SchoolCalendar />} />
              <Route path="grades" element={<AlunoGrades />} />
            </Route>
          </Route>

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;