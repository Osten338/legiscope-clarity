
import { TestimonialsSection } from "@/components/ui/testimonials-section"

const testimonials = [
  {
    author: {
      name: "Sarah Mitchell",
      handle: "Corporate Law Partner",
      avatar: "/placeholder.svg"
    },
    text: "CompliAI has revolutionized how we handle regulatory compliance. The AI-driven insights have saved us countless hours of manual review.",
  },
  {
    author: {
      name: "David Chen",
      handle: "Tech Law Specialist",
      avatar: "/placeholder.svg"
    },
    text: "Finally, a compliance tool that understands the nuances of technology law. The real-time updates and analysis are game-changing.",
  },
  {
    author: {
      name: "Elena Rodriguez",
      handle: "Privacy Law Expert",
      avatar: "/placeholder.svg"
    },
    text: "The depth of privacy law coverage is impressive. It's like having a dedicated compliance team working 24/7.",
  },
  {
    author: {
      name: "James Wilson",
      handle: "Managing Partner",
      avatar: "/placeholder.svg"
    },
    text: "This platform has transformed our firm's approach to compliance. The automated updates and risk assessments are invaluable.",
  }
]

export function LandingTestimonials() {
  return (
    <TestimonialsSection
      title="Trusted by Legal Professionals"
      description="See what lawyers and compliance experts are saying about CompliAI"
      testimonials={testimonials}
    />
  )
}
