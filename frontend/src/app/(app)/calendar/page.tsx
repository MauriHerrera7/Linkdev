"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { mockCalendarEvents, STATUS_LABELS } from "@/lib/mock-data";
import type { CalendarEvent, PostStatus } from "@/lib/types";

const STATUS_COLORS: Record<PostStatus, string> = {
  draft: "bg-zinc-500/20 border-zinc-500/30 text-zinc-300",
  scheduled: "bg-blue-500/20 border-blue-500/30 text-blue-300",
  published: "bg-green-500/20 border-green-500/30 text-green-300",
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events] = useState<CalendarEvent[]>(mockCalendarEvents);
  const [draggedEvent, setDraggedEvent] = useState<string | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDayOfWeek = monthStart.getDay();
  const paddingDays = Array.from({ length: startDayOfWeek === 0 ? 6 : startDayOfWeek - 1 });

  function getEventsForDay(day: Date) {
    return events.filter((e) => isSameDay(new Date(e.scheduled_at), day));
  }

  function handleDragStart(eventId: string) {
    setDraggedEvent(eventId);
  }

  function handleDrop() {
    if (!draggedEvent) return;
    // Integration point: PATCH /api/posts/:id { scheduled_at }
    setDraggedEvent(null);
  }

  return (
    <AppShell title="Calendario de contenido" description="Organizá y programá tus publicaciones">
      <div className="space-y-6">
        {/* Legend */}
        <div className="flex flex-wrap gap-4">
          {(["draft", "scheduled", "published"] as PostStatus[]).map((status) => (
            <div key={status} className="flex items-center gap-2 text-sm">
              <div className={cn("h-3 w-3 rounded-full", STATUS_COLORS[status].split(" ")[0])} />
              {STATUS_LABELS[status]}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle>{format(currentDate, "MMMM yyyy", { locale: es })}</CardTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())}>
                Hoy
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Weekday headers */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
                <div key={day} className="py-2 text-center text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {paddingDays.map((_, i) => (
                <div key={`pad-${i}`} className="min-h-[100px]" />
              ))}
              {days.map((day) => {
                const dayEvents = getEventsForDay(day);
                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "min-h-[100px] rounded-lg border border-border p-1.5 transition-colors",
                      !isSameMonth(day, currentDate) && "opacity-40",
                      isToday(day) && "border-primary/50 bg-primary/5",
                      draggedEvent && "hover:border-primary/50 hover:bg-accent/50"
                    )}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop()}
                  >
                    <span
                      className={cn(
                        "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                        isToday(day) && "bg-primary text-primary-foreground font-semibold"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    <div className="mt-1 space-y-1">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          draggable
                          onDragStart={() => handleDragStart(event.id)}
                          className={cn(
                            "cursor-grab rounded border px-1.5 py-0.5 text-[10px] leading-tight truncate active:cursor-grabbing",
                            STATUS_COLORS[event.status]
                          )}
                          title={event.content}
                        >
                          {event.content.slice(0, 30)}...
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming list */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Próximas publicaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {events
              .filter((e) => e.status === "scheduled")
              .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
              .map((event) => (
                <div key={event.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant={event.status}>{STATUS_LABELS[event.status]}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(event.scheduled_at), "d MMM, HH:mm", { locale: es })}
                      </span>
                    </div>
                    <p className="mt-1 text-sm line-clamp-1">{event.content}</p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

/**
 * Backend endpoints:
 * GET  /api/calendar?month=2025-07 → CalendarEvent[]
 * PATCH /api/posts/:id → { scheduled_at: ISO8601 }
 */
