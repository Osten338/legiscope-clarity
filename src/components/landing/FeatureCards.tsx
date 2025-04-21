
import { Check, FileText, Users } from "lucide-react";

const features = [
  {
    title: "Compliance Assessment",
    description: "Automate your process to spot compliance gaps and risks at a glance.",
    iconBg: "bg-purple-100 text-purple-700",
    icon: <Check className="h-7 w-7" />,
  },
  {
    title: "Automated Reporting",
    description: "Generate audit trails and reports with just one click—no more manual red tape.",
    iconBg: "bg-green-100 text-green-600",
    icon: <FileText className="h-7 w-7" />,
  },
  {
    title: "User Roles",
    description: "Granular access for every role, from legal to leadership. Teamwork made simple.",
    iconBg: "bg-blue-100 text-blue-600",
    icon: <Users className="h-7 w-7" />,
  },
];

export const FeatureCards = () => {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-0 bg-white" id="features">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="relative overflow-hidden bg-gradient-to-br from-white to-sage-50 rounded-2xl p-8 border border-slate-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center group"
            >
              <div className={`mb-6 rounded-full p-4 ${feature.iconBg} shadow-lg flex items-center justify-center`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-serif font-semibold mb-2 text-slate-900">{feature.title}</h3>
              <p className="text-slate-600 text-base text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
