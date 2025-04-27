import { DashboardLayout } from "@/components/dashboard/new-ui"
import { FullScreenCalendar } from "@/components/ui/fullscreen-calendar"
import { UpcomingEvents } from "@/components/compliance/UpcomingEvents"

// Temporary mock data - will be replaced with real data in phase 2
const mockEvents = [
  {
    day: new Date("2025-04-30"),
    events: [
      {
        id: 1,
        name: "GDPR Annual Review Due",
        time: "End of Day",
        datetime: "2025-04-30T23:59",
      },
    ],
  },
  {
    day: new Date("2025-05-15"),
    events: [
      {
        id: 2,
        name: "ISO 27001 Audit",
        time: "10:00 AM",
        datetime: "2025-05-15T10:00",
      },
      {
        id: 3,
        name: "Policy Update Review",
        time: "2:00 PM",
        datetime: "2025-05-15T14:00",
      },
    ],
  },
  {
    day: new Date("2025-05-20"),
    events: [
      {
        id: 4,
        name: "New Data Protection Law Implementation",
        time: "9:00 AM",
        datetime: "2025-05-20T09:00",
      },
    ],
  },
];

export default function ComplianceCalendar() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-medium text-black">
            Compliance Calendar
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Track important compliance deadlines, upcoming regulation changes, and policy reviews.
          </p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            <FullScreenCalendar data={mockEvents} />
          </div>
          <div className="xl:col-span-1">
            <UpcomingEvents events={mockEvents} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
