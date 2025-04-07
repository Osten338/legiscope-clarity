
import { Check, BarChart3, FileText, Users } from "lucide-react";

const features = [
  {
    title: "Compliance Assessment",
    description: "Assess business processes or documents for compliance gaps with automated tools.",
    icon: <Check className="h-6 w-6 text-sage-600" />
  },
  {
    title: "Automated Reporting",
    description: "Generate compliance reports and maintain audit trails automatically.",
    icon: <FileText className="h-6 w-6 text-sage-600" />
  },
  {
    title: "User Roles",
    description: "Manage access with customizable roles for compliance officers, legal teams, and managers.",
    icon: <Users className="h-6 w-6 text-sage-600" />
  }
];

export const FeatureCards = () => {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-white" id="features">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="border rounded-lg p-6 text-center flex flex-col items-center"
            >
              <div className="mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-serif font-medium mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
