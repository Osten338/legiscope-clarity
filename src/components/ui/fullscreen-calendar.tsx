import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { enUS } from "date-fns/locale";

interface Event {
  id: number;
  name: string;
  time: string;
}

interface CalendarData {
  day: Date;
  events: Event[];
}

interface FullScreenCalendarProps {
  data: CalendarData[];
}

export function FullScreenCalendar({ data }: FullScreenCalendarProps) {
  const [date, setDate] = useState<Date>(new Date());

  const eventsForDate = (date: Date) => {
    return data.find(item => item.day.toDateString() === date.toDateString())?.events || [];
  };

  return (
    <Card className="border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-2xl font-semibold text-foreground">
          {format(date, "MMMM yyyy", { locale: enUS })}
        </CardTitle>
        <div className="flex space-x-2">
          <ChevronLeft
            className="h-6 w-6 cursor-pointer hover:opacity-80"
            onClick={() => setDate(prevDate => {
              const newDate = new Date(prevDate);
              newDate.setMonth(prevDate.getMonth() - 1);
              return newDate;
            })}
          />
          <ChevronRight
            className="h-6 w-6 cursor-pointer hover:opacity-80"
            onClick={() => setDate(prevDate => {
              const newDate = new Date(prevDate);
              newDate.setMonth(prevDate.getMonth() + 1);
              return newDate;
            })}
          />
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Events for {format(date, "PPP", { locale: enUS })}</h3>
          <ul>
            {eventsForDate(date).map(event => (
              <li key={event.id} className="py-2">
                {event.name} at {event.time}
              </li>
            ))}
            {eventsForDate(date).length === 0 && (
              <li className="py-2 text-muted-foreground">No events for this day.</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
