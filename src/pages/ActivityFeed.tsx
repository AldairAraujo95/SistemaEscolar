import { useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { AddActivityForm } from "@/components/activity-feed/AddActivityForm";
import { ActivityList } from "@/components/activity-feed/ActivityList";
import { classes as initialClasses, disciplines as initialDisciplines } from "@/data/academic";
import { students as initialStudents } from "@/data/users";
import { initialActivities } from "@/data/activities";
import type { Activity, Class, Discipline } from "@/types";
import { showSuccess } from "@/utils/toast";
import { useAuth } from "@/context/AuthContext";

// Simula o aluno logado
const LOGGED_IN_STUDENT_ID = "s1";

const ActivityFeed = () => {
  const { role } = useAuth();
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [classes] = useState<Class[]>(initialClasses);
  const [disciplines] = useState<Discipline[]>(initialDisciplines);

  const handleAddActivity = (activityData: { classId: string; disciplineId: string; description: string; dueDate: Date }) => {
    const newActivity: Activity = {
      id: uuidv4(),
      ...activityData,
    };
    setActivities([newActivity, ...activities]);
    showSuccess("Atividade postada com sucesso!");
  };

  const visibleActivities = useMemo(() => {
    if (role === 'aluno') {
      const student = initialStudents.find(s => s.id === LOGGED_IN_STUDENT_ID);
      const studentClass = initialClasses.find(c => c.name === student?.class);
      if (studentClass) {
        return activities.filter(a => a.classId === studentClass.id);
      }
      return [];
    }
    return activities;
  }, [activities, role]);

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