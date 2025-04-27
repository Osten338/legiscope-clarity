
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { format } from "date-fns";
import { CalendarClock, ExternalLink } from "lucide-react";

interface Event {
  id: number;
  name: string;
  time: string;
  datetime: string;
  description?: string;
  source?: string;
  referenceLink?: string;
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
        <Accordion type="single" collapsible className="space-y-2">
          {sortedEvents.map(event => (
            <AccordionItem
              key={event.id}
              value={event.id.toString()}
              className="border rounded-lg px-4"
            >
              <AccordionTrigger className="hover:bg-muted/50 rounded-lg py-3">
                <div className="flex justify-between items-center w-full pr-4">
                  <span className="font-medium">{event.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(event.day), 'MMM d')} at {event.time}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                {event.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {event.description}
                  </p>
                )}
                {(event.source || event.referenceLink) && (
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-1">Source:</p>
                    <div className="flex items-center gap-2">
                      <span>{event.source}</span>
                      {event.referenceLink && (
                        <a
                          href={event.referenceLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand hover:underline inline-flex items-center gap-1"
                        >
                          View Reference
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

