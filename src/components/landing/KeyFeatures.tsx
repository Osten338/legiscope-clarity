
import { BarChart3, Search, Bell } from "lucide-react";

const keyFeatures = [
  {
    icon: <BarChart3 className="h-6 w-6 text-sage-600" />,
    title: "Compliance Dashboard",
    description: "Track regulations relevant to your business with a centralized dashboard."
  },
  {
    icon: <Search className="h-6 w-6 text-sage-600" />,
    title: "Smart Search",
    description: "Filter regulations by industry, region, and risk level with advanced search capabilities."
  },
  {
    icon: <Bell className="h-6 w-6 text-sage-600" />,
    title: "Regulatory Feed",
    description: "Stay updated on new, updated, or upcoming rules and laws with a dynamic feed."
  }
];

export const KeyFeatures = () => {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <div className="text-sm font-medium text-sage-600 mb-4">
          Key Features
        </div>
        <h2 className="text-3xl font-serif font-medium mb-3">Everything you need for compliance management</h2>
        <p className="text-slate-600">
          LegisScope provides a comprehensive suite of tools to help businesses stay compliant with
          regulations across industries and jurisdictions.
        </p>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {keyFeatures.map((feature, index) => (
            <div key={index} className="border rounded-lg p-6 text-center">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
