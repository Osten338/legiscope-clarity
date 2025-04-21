
import { Check, FileText, Users } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import DisplayCards from "@/components/ui/display-cards";

const features = [
  {
    title: "Compliance Assessment",
    description: "Automate your process to spot compliance gaps and risks at a glance.",
    icon: <Check className="size-4 text-blue-300" />,
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    title: "Automated Reporting",
    description: "Generate audit trails and reports with just one click—no more manual red tape.",
    icon: <FileText className="size-4 text-blue-300" />,
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    className: "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    title: "User Roles",
    description: "Granular access for every role, from legal to leadership. Teamwork made simple.",
    icon: <Users className="size-4 text-blue-300" />,
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    className: "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
  },
];

export const FeatureCards = () => {
  return (
    <section className="py-16 px-4 md:px-8 lg:px-20 bg-black" id="features">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-3 text-white">
              Streamline Your Compliance Process
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Our platform provides all the tools you need to manage regulatory requirements with ease.
            </p>
          </div>
        </ScrollReveal>
        
        <ScrollReveal>
          <div className="flex min-h-[300px] w-full items-center justify-center">
            <div className="w-full max-w-3xl">
              <DisplayCards cards={features} />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

