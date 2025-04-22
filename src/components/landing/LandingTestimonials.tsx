
import { TestimonialsSection } from "@/components/ui/testimonials-section";

const testimonials = [
  {
    text: "CompliAI has transformed how we handle regulatory compliance. The automated assessments have saved us countless hours of manual review.",
    author: {
      name: "Sarah Chen",
      role: "General Counsel",
      companyName: "Tech Innovations Legal",
    },
  },
  {
    text: "The real-time updates on regulatory changes have been invaluable for our practice. This platform is a game-changer for legal compliance.",
    author: {
      name: "Michael Rodriguez",
      role: "Senior Partner",
      companyName: "Rodriguez & Associates",
    },
  },
  {
    text: "Incredibly intuitive platform that simplifies complex compliance requirements. The AI-powered insights have helped us stay ahead of regulatory changes.",
    author: {
      name: "Emma Thompson",
      role: "Compliance Director",
      companyName: "Global Law Partners",
    },
  },
  {
    text: "The automated reporting features have revolutionized how we manage compliance documentation. Highly recommended for any legal team.",
    author: {
      name: "David Park",
      role: "Legal Operations Manager",
      companyName: "Park Legal Solutions",
    },
  },
];

export function LandingTestimonials() {
  return (
    <TestimonialsSection
      title="Trusted by legal professionals worldwide"
      description="See what lawyers and compliance officers are saying about our platform"
      testimonials={testimonials}
      className="bg-neutral-900"
    />
  );
}
