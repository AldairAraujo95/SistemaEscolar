import { useState, useMemo, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AddActivityForm } from "@/components/activity-feed/AddActivityForm";
import { ActivityList } from "@/components/activity-feed/ActivityList";
import { EditActivityDialog } from "@/components/activity-feed/EditActivityDialog";
import { DeleteConfirmationDialog } from "@/components/user-management/DeleteConfirmationDialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Activity, Class, Discipline, Student } from "@/types";
import { showSuccess, showError } from "@/utils/toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const ActivityFeed = () => {
  const { role, user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deletingActivityId, setDeletingActivityId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  const fetchData = useCallback(async () => {
    const { data: activitiesData, error: activitiesError } = await supabase.from('activities').select('*').order('due_date', { ascending: false });
    const { data: classesData, error: classesError } = await supabase.from('classes').select('*');
    const { data: disciplinesData, error: disciplinesError } = await supabase.from('disciplines').select('*');
    const { data: studentsData, error: studentsError } = await supabase.from('students').select('*');

    if (activitiesError || classesError || disciplinesError || studentsError) {
      showError("Erro ao carregar dados do feed.");
    } else {
      setActivities(activitiesData.map(a => ({ ...a, dueDate: new Date(a.due_date), classId: a.class_id, disciplineId: a.discipline_id })));
      setClasses(classesData);
      setDisciplines(disciplinesData);
      setStudents(studentsData.map(s => ({ ...s, class: s.class_name, guardianId: s.guardian_id })));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddActivity = async (activityData: { classId: string; disciplineId: string; description: string; dueDate: Date }) => {
    const { error } = await supabase.from('activities').insert({
      class_id: activityData.classId,
      discipline_id: activityData.disciplineId,
      description: activityData.description,
      due_date: format(activityData.dueDate, 'yyyy-MM-dd'),
    });

    if (error) showError("Erro ao postar atividade."); else showSuccess("Atividade postada com sucesso!");
    fetchData();
  };

  const handleUpdateActivity = async (updatedActivity: Activity) => {
    const { error } = await supabase.from('activities').update({
      class_id: updatedActivity.classId,
      discipline_id: updatedActivity.disciplineId,
      description: updatedActivity.description,
      due_date: format(updatedActivity.dueDate, 'yyyy-MM-dd'),
    }).eq('id', updatedActivity.id);

    if (error) showError("Erro ao atualizar atividade."); else showSuccess("Atividade atualizada com sucesso!");
    setEditingActivity(null);
    fetchData();
  };

  const confirmDeleteActivity = async () => {
    if (deletingActivityId) {
      const { error } = await supabase.from('activities').delete().eq('id', deletingActivityId);
      if (error) showError("Erro ao excluir atividade."); else showSuccess("Atividade excluída com sucesso!");
      setDeletingActivityId(null);
      fetchData();
    }
  };

  const userActivities = useMemo(() => {
    if (role === 'aluno' && user) {
      const myStudents = students.filter(s => s.guardianId === user.id);
      if (myStudents.length > 0) {
        const studentClassNames = myStudents.map(s => s.class).filter((c): c is string => !!c);
        const studentClassIds = classes.filter(c => studentClassNames.includes(c.name)).map(c => c.id);
        return activities.filter(a => studentClassIds.includes(a.classId));
      }
      return [];
    }
    return activities;
  }, [activities, role, user, students, classes]);

  const monthOptions = useMemo(() => {
    const months = new Set<string>();
    userActivities.forEach(activity => {
      months.add(format(new Date(activity.dueDate), 'yyyy-MM'));
    });
    return Array.from(months).sort().reverse().map(monthStr => {
      const [year, month] = monthStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return {
        value: monthStr,
        label: format(date, 'MMMM yyyy', { locale: ptBR }),
      };
    });
  }, [userActivities]);

  const filteredActivities = useMemo(() => {
    if (selectedMonth === "all") {
      return userActivities;
    }
    const [year, month] = selectedMonth.split('-').map(Number);
    return userActivities.filter(activity => {
      const activityDate = new Date(activity.dueDate);
      return activityDate.getFullYear() === year && activityDate.getMonth() === month - 1;
    });
  }, [userActivities, selectedMonth]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Feed de Atividades</h1>
          <p className="text-gray-500 mt-2">
            {role === 'aluno'
              ? "Acompanhe as atividades postadas para sua turma."
              : "Monitore e poste atividades para as turmas."}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 w-full sm:max-w-xs">
          <Label htmlFor="month-filter">Filtrar por Mês</Label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger id="month-filter">
              <SelectValue placeholder="Selecione um mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Meses</SelectItem>
              {monthOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {role !== 'aluno' && (
          <div className="lg:col-span-1">
            <AddActivityForm
              classes={classes}
              disciplines={disciplines}
              onAddActivity={handleAddActivity}
            />
          </div>
        )}
        <div className={role === 'aluno' ? "lg:col-span-3" : "lg:col-span-2"}>
          <ActivityList
            activities={filteredActivities}
            classes={classes}
            disciplines={disciplines}
            role={role}
            onEdit={setEditingActivity}
            onDelete={setDeletingActivityId}
          />
        </div>
      </div>

      {role !== 'aluno' && (
        <>
          <EditActivityDialog
            activity={editingActivity}
            classes={classes}
            disciplines={disciplines}
            open={!!editingActivity}
            onOpenChange={(open) => !open && setEditingActivity(null)}
            onSave={handleUpdateActivity}
          />
          <DeleteConfirmationDialog
            open={!!deletingActivityId}
            onOpenChange={(open) => !open && setDeletingActivityId(null)}
            onConfirm={confirmDeleteActivity}
            title="Confirmar Exclusão"
            description="Tem certeza que deseja excluir esta atividade? Esta ação não pode ser desfeita."
          />
        </>
      )}
    </div>
  );
};

export default ActivityFeed;