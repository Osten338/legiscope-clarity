import { Check, FileText, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const features = [
  {
    title: "Compliance Assessment",
    description: "Automate your process to spot compliance gaps and risks at a glance.",
    iconBg: "bg-blue-100/10",
    icon: <Check className="h-6 w-6 text-brand-blue" />,
  },
  {
    title: "Automated Reporting",
    description: "Generate audit trails and reports with just one click—no more manual red tape.",
    iconBg: "bg-blue-100/10",
    icon: <FileText className="h-6 w-6 text-brand-blue" />,
  },
  {
    title: "User Roles",
    description: "Granular access for every role, from legal to leadership. Teamwork made simple.",
    iconBg: "bg-blue-100/10",
    icon: <Users className="h-6 w-6 text-brand-blue" />,
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <ScrollReveal key={index} delay={index * 0.1} direction="up">
              <Card className="relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 shadow-lg hover:bg-white/10 transition-all duration-300 flex flex-col items-center group">
                <div className={`mb-6 rounded-full p-4 ${feature.iconBg} shadow-sm flex items-center justify-center`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-3 text-white">{feature.title}</h3>
                <p className="text-white/70 text-base text-center leading-relaxed">{feature.description}</p>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
