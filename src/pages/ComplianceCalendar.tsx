import { DashboardLayout } from "@/components/dashboard/new-ui"
import { FullScreenCalendar } from "@/components/ui/fullscreen-calendar"
import { UpcomingEvents } from "@/components/compliance/UpcomingEvents"

// Updated mock data with new fields
const mockEvents = [
  {
    day: new Date("2025-04-30"),
    events: [
      {
        id: 1,
        name: "GDPR Annual Review Due",
        time: "End of Day",
        datetime: "2025-04-30T23:59",
        description: "Annual review of GDPR compliance policies and procedures. Ensure all documentation is up to date and any necessary updates are implemented.",
        source: "EU Data Protection Board",
        referenceLink: "https://edpb.europa.eu/our-work-tools/our-documents/guidelines_en"
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
        description: "Internal audit of information security management system (ISMS) to ensure continued compliance with ISO 27001 standards.",
        source: "Internal Compliance Team",
      },
      {
        id: 3,
        name: "Policy Update Review",
        time: "2:00 PM",
        datetime: "2025-05-15T14:00",
        description: "Review and update of internal policies to reflect recent regulatory changes.",
        source: "Compliance Department",
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
        description: "Team meeting to discuss implementation strategy for the new data protection requirements.",
        source: "Legal Department",
        referenceLink: "https://example.com/data-protection-law"
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
