import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UserManagement from "./pages/UserManagement";
import AcademicManagement from "./pages/AcademicManagement";
import FinancialManagement from "./pages/FinancialManagement";
import SchoolCalendar from "./pages/SchoolCalendar";
import ActivityFeed from "./pages/ActivityFeed";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/academic" element={<AcademicManagement />} />
            <Route path="/financial" element={<FinancialManagement />} />
            <Route path="/calendar" element={<SchoolCalendar />} />
            <Route path="/feed" element={<ActivityFeed />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;