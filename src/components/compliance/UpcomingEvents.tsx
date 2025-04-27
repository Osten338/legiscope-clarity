
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="font-medium">Event</TableCell>
              <TableCell className="font-medium">Date & Time</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEvents.map(event => (
              <TableRow key={event.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{event.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(event.day), 'MMM d')} at {event.time}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
