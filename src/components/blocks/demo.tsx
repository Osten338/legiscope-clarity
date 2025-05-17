
import { HeroSection } from "@/components/blocks/hero-section-1"
import { FeatureDemo } from "@/components/ui/feature-demo"
import { AnimatedTestimonialsDemo } from "@/components/ui/animated-testimonials-demo"

export function Demo() {
    return (
        <>
            <HeroSection />
            <div className="container mx-auto">
                <FeatureDemo />
                <AnimatedTestimonialsDemo />
            </div>
        </>
    )
}
