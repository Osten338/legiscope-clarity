
import { BarChart3, Search, Bell } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { TextContainer, SectionTitle } from "@/components/ui/text-container";

const keyFeatures = [
  {
    icon: <BarChart3 className="h-6 w-6 text-brand-blue" />,
    title: "Compliance Dashboard",
    description: "Track regulations relevant to your business in a single, modern dashboard.",
  },
  {
    icon: <Search className="h-6 w-6 text-brand-blue" />,
    title: "Smart Search",
    description: "Filter compliance requirements by industry and location in seconds.",
  },
  {
    icon: <Bell className="h-6 w-6 text-brand-blue" />,
    title: "Regulatory Feed",
    description: "Receive live updates when new laws or regulations impact you.",
  },
];

export const KeyFeatures = () => {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-0 bg-black">
      <ScrollReveal>
        <div className="max-w-5xl mx-auto text-center mb-12">
          <SectionTitle className="text-brand-blue">Key Features</SectionTitle>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            Everything you need for compliance management
          </h2>
          <p className="text-white/80 text-lg">
            Compli AI provides a suite of modern tools to help you stay ahead.
          </p>
        </div>
      </ScrollReveal>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {keyFeatures.map((feature, index) => (
            <ScrollReveal key={index} delay={index * 0.1} direction={index % 2 === 0 ? "left" : "right"}>
              <TextContainer 
                hover
                className="border border-white/10 bg-white/5 backdrop-blur-sm text-center shadow-lg hover:bg-white/10"
              >
                <div className="flex justify-center mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-white/70 text-base">{feature.description}</p>
              </TextContainer>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
