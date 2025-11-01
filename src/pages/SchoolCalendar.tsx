import { useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { EventDialog } from "@/components/calendar/EventDialog";
import { DeleteConfirmationDialog } from "@/components/user-management/DeleteConfirmationDialog";
import { initialEvents } from "@/data/calendar";
import type { CalendarEvent } from "@/types";
import { showSuccess } from "@/utils/toast";

const SchoolCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<CalendarEvent> | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

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

  const handleSaveEvent = (eventData: Partial<CalendarEvent>) => {
    if (eventData.id) {
      // Update existing event
      setEvents(events.map(e => e.id === eventData.id ? { ...e, ...eventData } as CalendarEvent : e));
      showSuccess("Evento atualizado com sucesso!");
    } else {
      // Create new event
      const newEvent: CalendarEvent = {
        id: uuidv4(),
        title: eventData.title!,
        date: eventData.date!,
        description: eventData.description!,
        type: eventData.type!,
      };
      setEvents([...events, newEvent]);
      showSuccess("Evento adicionado com sucesso!");
    }
    setEditingEvent(null);
  };

  const confirmDeleteEvent = () => {
    if (deletingEventId) {
      setEvents(events.filter(e => e.id !== deletingEventId));
      setDeletingEventId(null);
      showSuccess("Evento excluído com sucesso!");
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
          <p className="text-gray-500 mt-2">Crie, edite e visualize os eventos da escola.</p>
        </div>
        <Button onClick={handleAddEvent}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Evento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
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

        <Card className="md:col-span-2">
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
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditEvent(event)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => setDeletingEventId(event.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
    </div>
  );
};

export default SchoolCalendar;