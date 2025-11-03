import { useState, useMemo, useEffect, useCallback } from "react";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { EventDialog } from "@/components/calendar/EventDialog";
import { DeleteConfirmationDialog } from "@/components/user-management/DeleteConfirmationDialog";
import type { CalendarEvent } from "@/types";
import { showSuccess, showError } from "@/utils/toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const SchoolCalendar = () => {
  const { role } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<CalendarEvent> | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    const { data, error } = await supabase.from('calendar_events').select('*').order('date');
    if (error) {
      showError("Erro ao carregar eventos.");
    } else {
      setEvents(data.map(e => ({ ...e, date: new Date(e.date) })));
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const eventsForSelectedDay = useMemo(() => {
    return selectedDate
      ? events.filter((event) => isSameDay(event.date, selectedDate)).sort((a, b) => a.date.getTime() - b.date.getTime())
      : [];
  }, [events, selectedDate]);

  const handleAddEvent = () => {
    setEditingEvent({ date: selectedDate || new Date() });
    setIsDialogOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setIsDialogOpen(true);
  };

  const handleSaveEvent = async (eventData: Partial<CalendarEvent>) => {
    const dataToSave = {
      title: eventData.title!,
      date: format(eventData.date!, 'yyyy-MM-dd'),
      description: eventData.description!,
      type: eventData.type!,
    };

    if (eventData.id) {
      const { error } = await supabase.from('calendar_events').update(dataToSave).eq('id', eventData.id);
      if (error) showError("Erro ao atualizar evento."); else showSuccess("Evento atualizado com sucesso!");
    } else {
      const { error } = await supabase.from('calendar_events').insert(dataToSave);
      if (error) showError("Erro ao adicionar evento."); else showSuccess("Evento adicionado com sucesso!");
    }
    setEditingEvent(null);
    fetchEvents();
  };

  const confirmDeleteEvent = async () => {
    if (deletingEventId) {
      const { error } = await supabase.from('calendar_events').delete().eq('id', deletingEventId);
      if (error) showError("Erro ao excluir evento."); else showSuccess("Evento excluído com sucesso!");
      setDeletingEventId(null);
      fetchEvents();
    }
  };

  const eventTypeStyles: { [key in CalendarEvent['type']]: string } = {
    event: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300",
    holiday: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300",
    exam: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300",
    reminder: "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-300",
  };

  const eventTypeLabels: { [key in CalendarEvent['type']]: string } = {
    event: "Evento",
    holiday: "Feriado",
    exam: "Prova",
    reminder: "Lembrete",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agenda Escolar</h1>
          <p className="text-gray-500 mt-2">
            {role === 'aluno'
              ? "Visualize os eventos importantes da escola."
              : "Crie, edite e visualize os eventos da escola."}
          </p>
        </div>
        {role !== 'aluno' && (
          <Button onClick={handleAddEvent}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Evento
          </Button>
        )}
      </div>

      <div className="flex flex-col items-center gap-6">
        <Card>
          <CardContent className="p-0 flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="p-3"
              locale={ptBR}
              modifiers={{
                hasEvent: events.map(e => e.date),
              }}
              modifiersStyles={{
                hasEvent: {
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                },
              }}
            />
          </CardContent>
        </Card>

        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle>
              Eventos para {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : "Nenhuma data selecionada"}
            </CardTitle>
            <CardDescription>
              {eventsForSelectedDay.length > 0
                ? `Você tem ${eventsForSelectedDay.length} evento(s) neste dia.`
                : "Nenhum evento para este dia."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {eventsForSelectedDay.length > 0 ? (
                eventsForSelectedDay.map((event) => (
                  <div key={event.id} className="flex items-start justify-between rounded-lg border p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{event.title}</h3>
                        <Badge variant="outline" className={`border-transparent font-semibold ${eventTypeStyles[event.type]}`}>
                          {eventTypeLabels[event.type]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                    {role !== 'aluno' && (
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditEvent(event)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => setDeletingEventId(event.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>Selecione uma data no calendário para ver os eventos ou adicione um novo evento.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {role !== 'aluno' && (
        <>
          <EventDialog
            event={editingEvent}
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) setEditingEvent(null);
            }}
            onSave={handleSaveEvent}
          />

          <DeleteConfirmationDialog
            open={!!deletingEventId}
            onOpenChange={(open) => !open && setDeletingEventId(null)}
            onConfirm={confirmDeleteEvent}
            title="Confirmar Exclusão"
            description="Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita."
          />
        </>
      )}
    </div>
  );
};

export default SchoolCalendar;