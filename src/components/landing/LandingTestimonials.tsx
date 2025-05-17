
import { TestimonialsSection } from "@/components/ui/testimonials-section"

const testimonials = [
  {
    author: {
      name: "Sarah Mitchell",
      handle: "Compliance Director, Enterprise Corp",
      avatar: "/placeholder.svg"
    },
    text: "CompliAI has transformed our compliance operations. The AI-powered law applicability tool saved us hundreds of hours of legal consultation and gave us confidence in our regulatory approach.",
  },
  {
    author: {
      name: "David Chen",
      handle: "General Counsel, TechInnovate",
      avatar: "/placeholder.svg"
    },
    text: "The Policy Vault feature is revolutionary. Being able to query our own policies alongside regulatory requirements gives us a comprehensive view of our compliance posture.",
  },
  {
    author: {
      name: "Elena Rodriguez",
      handle: "Data Protection Officer",
      avatar: "/placeholder.svg"
    },
    text: "As a privacy professional, the accuracy of CompliAI's legal chatbot is impressive. I can trust the responses because they're based on verified legal sources, not AI hallucinations.",
  },
  {
    author: {
      name: "James Wilson",
      handle: "CEO, Financial Services Inc",
      avatar: "/placeholder.svg"
    },
    text: "The Horizon Spotter has already helped us prepare for three major regulatory changes before our competitors even knew about them. It's like having an early warning system for compliance risks.",
  }
]

export function LandingTestimonials() {
  return (
    <TestimonialsSection
      title="Trusted by Compliance Professionals"
      description="See how our platform is revolutionizing regulatory compliance across industries"
      testimonials={testimonials}
    />
  )
}
