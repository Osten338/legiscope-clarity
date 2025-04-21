
import { Check, FileText, Users } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import DisplayCards from "@/components/ui/display-cards";

const features = [
  {
    title: "Compliance Assessment",
    description: "Automate your process to spot compliance gaps and risks at a glance.",
    icon: <Check className="size-4 text-blue-300" />,
    iconClassName: "text-blue-500",
  },
  {
    title: "Automated Reporting",
    description: "Generate audit trails and reports with just one click—no more manual red tape.",
    icon: <FileText className="size-4 text-blue-300" />,
    iconClassName: "text-blue-500",
  },
  {
    title: "User Roles",
    description: "Granular access for every role, from legal to leadership. Teamwork made simple.",
    icon: <Users className="size-4 text-blue-300" />,
    iconClassName: "text-blue-500",
  },
];

export const FeatureCards = () => {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-20 bg-black" id="features">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Streamline Your Compliance Process
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Our platform provides all the tools you need to manage regulatory requirements with ease.
            </p>
          </div>
        </ScrollReveal>
        
        <ScrollReveal>
          <DisplayCards cards={features} />
        </ScrollReveal>
      </div>
    </section>
  );
};

