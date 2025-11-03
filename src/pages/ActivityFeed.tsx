import { useState, useMemo, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { AddActivityForm } from "@/components/activity-feed/AddActivityForm";
import { ActivityList } from "@/components/activity-feed/ActivityList";
import type { Activity, Class, Discipline, Student } from "@/types";
import { showSuccess, showError } from "@/utils/toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Simula o aluno logado
const LOGGED_IN_STUDENT_ID = "s1"; // This should be replaced with actual logged-in user logic

const ActivityFeed = () => {
  const { role } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const fetchData = useCallback(async () => {
    const { data: activitiesData, error: activitiesError } = await supabase.from('activities').select('*').order('due_date', { ascending: false });
    const { data: classesData, error: classesError } = await supabase.from('classes').select('*');
    const { data: disciplinesData, error: disciplinesError } = await supabase.from('disciplines').select('*');
    const { data: studentsData, error: studentsError } = await supabase.from('students').select('*');

    if (activitiesError || classesError || disciplinesError || studentsError) {
      showError("Erro ao carregar dados do feed.");
    } else {
      setActivities(activitiesData.map(a => ({ ...a, dueDate: new Date(a.due_date) })));
      setClasses(classesData);
      setDisciplines(disciplinesData);
      setStudents(studentsData.map(s => ({ ...s, class: s.class_name })));
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

    if (error) {
      showError("Erro ao postar atividade.");
    } else {
      showSuccess("Atividade postada com sucesso!");
      fetchData();
    }
  };

  const visibleActivities = useMemo(() => {
    if (role === 'aluno') {
      const student = students.find(s => s.id === LOGGED_IN_STUDENT_ID);
      const studentClass = classes.find(c => c.name === student?.class);
      if (studentClass) {
        return activities.filter(a => a.classId === studentClass.id);
      }
      return [];
    }
    return activities;
  }, [activities, role, students, classes]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Feed de Atividades</h1>
        <p className="text-gray-500 mt-2">
          {role === 'aluno'
            ? "Acompanhe as atividades postadas para sua turma."
            : "Monitore e poste atividades para as turmas."}
        </p>
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
            activities={visibleActivities}
            classes={classes}
            disciplines={disciplines}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;