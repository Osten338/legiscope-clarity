
import { Gallery4, type Gallery4Item } from "@/components/ui/gallery4";

const galleryItems: Gallery4Item[] = [
  {
    id: "compliance-overview",
    title: "Compliance Overview",
    description: "Get a comprehensive view of your organization's compliance status across all relevant regulations.",
    href: "/compliance-overview",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxMjN8fHx8fHwyfHwxNzIzODA2OTM5fA&ixlib=rb-4.0.3&q=80&w=1080"
  },
  {
    id: "risk-assessment",
    title: "Risk Assessment",
    description: "Identify, analyze, and evaluate potential compliance risks within your business operations.",
    href: "/risk-assessment",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxMjN8fHx8fHwyfHwxNzIzODA2OTM5fA&ixlib=rb-4.0.3&q=80&w=1080"
  },
  {
    id: "documentation-center",
    title: "Documentation Center",
    description: "Access and manage all your compliance documentation in one centralized location.",
    href: "/documentation",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxMjN8fHx8fHwyfHwxNzIzODA2OTM5fA&ixlib=rb-4.0.3&q=80&w=1080"
  },
  {
    id: "compliance-chat",
    title: "Compliance Assistant",
    description: "Get instant answers to your compliance questions with our AI-powered compliance assistant.",
    href: "/compliance-chat",
    image: "https://images.unsplash.com/photo-1551250928-e4a05afaed1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxMjR8fHx8fHwyfHwxNzIzODA2OTM5fA&ixlib=rb-4.0.3&q=80&w=1080"
  },
  {
    id: "upcoming-reviews",
    title: "Upcoming Reviews",
    description: "Stay ahead of compliance deadlines with a clear view of upcoming regulatory reviews.",
    href: "/upcoming-reviews",
    image: "https://images.unsplash.com/photo-1536735561749-fc87494598cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxNzd8fHx8fHwyfHwxNzIzODA2OTM5fA&ixlib=rb-4.0.3&q=80&w=1080"
  }
];

export const QuickActions = () => {
  return (
    <div className="mb-8">
      <Gallery4 
        title="Quick Actions"
        description="Common tasks and actions to help manage your compliance"
        items={galleryItems}
        titleClassName="text-black"
        descriptionClassName="text-gray-600"
      />
    </div>
  );
};
