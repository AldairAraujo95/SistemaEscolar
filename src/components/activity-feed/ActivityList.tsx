import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Activity, Class, Discipline } from "@/types";

interface ActivityListProps {
  activities: Activity[];
  classes: Class[];
  disciplines: Discipline[];
  role: 'admin' | 'professor' | 'aluno' | null;
  onEdit: (activity: Activity) => void;
  onDelete: (activityId: string) => void;
}

export const ActivityList = ({ activities, classes, disciplines, role, onEdit, onDelete }: ActivityListProps) => {
  const getClassName = (id: string) => classes.find(c => c.id === id)?.name || "N/A";
  const getDisciplineName = (id: string) => disciplines.find(d => d.id === id)?.name || "N/A";

  const sortedActivities = [...activities].sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

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
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm bg-secondary text-secondary-foreground px-2 py-1 rounded-md">{getClassName(activity.classId)}</span>
                    <span className="font-semibold text-sm bg-secondary text-secondary-foreground px-2 py-1 rounded-md">{getDisciplineName(activity.disciplineId)}</span>
                  </div>
                  <p className="text-base pt-2">{activity.description}</p>
                  <p className="text-sm text-muted-foreground">
                    Data de Entrega: {format(new Date(activity.dueDate), "PPP", { locale: ptBR })}
                  </p>
                </div>
                {role !== 'aluno' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="ml-2">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(activity)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(activity.id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p>Nenhuma atividade encontrada para os filtros selecionados.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};