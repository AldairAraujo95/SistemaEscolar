import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Activity, Class, Discipline } from "@/types";

interface ActivityListProps {
  activities: Activity[];
  classes: Class[];
  disciplines: Discipline[];
}

export const ActivityList = ({ activities, classes, disciplines }: ActivityListProps) => {
  const getClassName = (id: string) => classes.find(c => c.id === id)?.name || "N/A";
  const getDisciplineName = (id: string) => disciplines.find(d => d.id === id)?.name || "N/A";

  const sortedActivities = [...activities].sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
        <CardDescription>Lista das últimas atividades postadas.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedActivities.length > 0 ? (
            sortedActivities.map((activity) => (
              <div key={activity.id} className="flex items-start justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm bg-secondary text-secondary-foreground px-2 py-1 rounded-md">{getClassName(activity.classId)}</span>
                    <span className="font-semibold text-sm bg-secondary text-secondary-foreground px-2 py-1 rounded-md">{getDisciplineName(activity.disciplineId)}</span>
                  </div>
                  <p className="text-base pt-2">{activity.description}</p>
                  <p className="text-sm text-muted-foreground">
                    Data de Entrega: {format(activity.dueDate, "PPP", { locale: ptBR })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p>Nenhuma atividade postada ainda.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};