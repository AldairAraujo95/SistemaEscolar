import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { AddActivityForm } from "@/components/activity-feed/AddActivityForm";
import { ActivityList } from "@/components/activity-feed/ActivityList";
import { classes as initialClasses, disciplines as initialDisciplines } from "@/data/academic";
import { initialActivities } from "@/data/activities";
import type { Activity, Class, Discipline } from "@/types";
import { showSuccess } from "@/utils/toast";

const ActivityFeed = () => {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Feed de Atividades</h1>
        <p className="text-gray-500 mt-2">Monitore e poste atividades para as turmas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AddActivityForm
            classes={classes}
            disciplines={disciplines}
            onAddActivity={handleAddActivity}
          />
        </div>
        <div className="lg:col-span-2">
          <ActivityList
            activities={activities}
            classes={classes}
            disciplines={disciplines}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;