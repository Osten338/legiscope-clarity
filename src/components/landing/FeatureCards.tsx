
import { Check, FileText, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    title: "Compliance Assessment",
    description: "Automate your process to spot compliance gaps and risks at a glance.",
    iconBg: "bg-blue-100 text-brand-blue",
    icon: <Check className="h-6 w-6" />,
  },
  {
    title: "Automated Reporting",
    description: "Generate audit trails and reports with just one click—no more manual red tape.",
    iconBg: "bg-green-100 text-green-600",
    icon: <FileText className="h-6 w-6" />,
  },
  {
    title: "User Roles",
    description: "Granular access for every role, from legal to leadership. Teamwork made simple.",
    iconBg: "bg-indigo-100 text-indigo-600",
    icon: <Users className="h-6 w-6" />,
  },
];

export const FeatureCards = () => {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-20 bg-white" id="features">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 font-ibm-plex-sans">Streamline Your Compliance Process</h2>
          <p className="text-lg text-brand-slate max-w-2xl mx-auto">
            Our platform provides all the tools you need to manage regulatory requirements with ease.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="relative overflow-hidden bg-white rounded-xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center group"
            >
              <div className={`mb-6 rounded-full p-4 ${feature.iconBg} shadow-sm flex items-center justify-center`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium mb-2 text-slate-900">{feature.title}</h3>
              <p className="text-slate-600 text-base text-center">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
