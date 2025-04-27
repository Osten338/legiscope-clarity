
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { CalendarClock } from "lucide-react";

interface Event {
  id: number;
  name: string;
  time: string;
  datetime: string;
}

interface CalendarData {
  day: Date;
  events: Event[];
}

interface UpcomingEventsProps {
  events: CalendarData[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  const sortedEvents = events
    .flatMap(day => day.events.map(event => ({
      ...event,
      day: day.day
    })))
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
    .slice(0, 5);

  return (
    <Card className="border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-brand" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedEvents.map(event => (
            <div
              key={event.id}
              className="flex items-center justify-between p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors duration-300 group"
            >
              <div>
                <h4 className="font-medium text-foreground">{event.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(event.day), 'MMM d')} at {event.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
