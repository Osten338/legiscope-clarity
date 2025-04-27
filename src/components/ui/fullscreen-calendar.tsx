
import * as React from "react"
import { add, eachDayOfInterval, endOfMonth, endOfWeek, format, getDay, isEqual, isSameDay, isSameMonth, isToday, parse, startOfToday, startOfWeek } from "date-fns"
import { ChevronLeft, ChevronRight, CalendarPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMediaQuery } from "@/hooks/use-media-query"
import { GradientText } from "@/components/ui/gradient-text"

interface Event {
  id: number
  name: string
  time: string
  datetime: string
}

interface CalendarData {
  day: Date
  events: Event[]
}

interface FullScreenCalendarProps {
  data: CalendarData[]
}

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
]

export function FullScreenCalendar({ data }: FullScreenCalendarProps) {
  const today = startOfToday()
  const [selectedDay, setSelectedDay] = React.useState(today)
  const [currentMonth, setCurrentMonth] = React.useState(format(today, "MMM-yyyy"))
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date())
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  })

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  function goToToday() {
    setCurrentMonth(format(today, "MMM-yyyy"))
    setSelectedDay(today)
  }

  return (
    <Card className="border bg-card shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-2xl">
            <GradientText>{format(firstDayCurrentMonth, "MMMM yyyy")}</GradientText>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Compliance events and deadlines
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={previousMonth}
            className="hover:bg-muted/50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={goToToday}
            className="hover:bg-muted/50"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            className="hover:bg-muted/50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button className="ml-2 gap-2" variant="default">
            <CalendarPlus className="h-4 w-4" />
            Add Event
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-px rounded-lg bg-muted text-center text-sm">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="bg-background py-2 font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="mt-px grid grid-cols-7 gap-px rounded-lg bg-muted">
          {days.map((day, dayIdx) => {
            const events = data.filter((event) => isSameDay(event.day, day));
            const isSelected = isEqual(day, selectedDay);
            const isCurrentMonth = isSameMonth(day, firstDayCurrentMonth);

            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "group relative min-h-[120px] bg-background p-2 hover:bg-muted/50 transition-colors",
                  dayIdx === 0 && colStartClasses[getDay(day)],
                  !isCurrentMonth && "bg-muted/5 text-muted-foreground",
                  isSelected && "bg-primary/10"
                )}
              >
                <time
                  dateTime={format(day, "yyyy-MM-dd")}
                  className={cn(
                    "ml-auto flex h-6 w-6 items-center justify-center rounded-full text-sm",
                    isToday(day) && "bg-primary text-primary-foreground font-semibold",
                    isSelected && !isToday(day) && "bg-primary/20 font-semibold"
                  )}
                >
                  {format(day, "d")}
                </time>
                {events.length > 0 && (
                  <div className="mt-2">
                    {events.map((dateData) => (
                      <div key={dateData.day.toString()}>
                        {dateData.events.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className="mb-1 rounded-md bg-primary/5 p-1.5 text-xs hover:bg-primary/10 transition-colors"
                          >
                            <div className="font-medium">{event.name}</div>
                            <div className="text-muted-foreground">{event.time}</div>
                          </div>
                        ))}
                        {dateData.events.length > 2 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            +{dateData.events.length - 2} more
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
