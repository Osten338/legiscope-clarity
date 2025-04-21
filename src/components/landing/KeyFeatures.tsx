
import { BarChart3, Search, Bell } from "lucide-react";

const keyFeatures = [
  {
    icon: <BarChart3 className="h-6 w-6 text-sage-600" />,
    title: "Compliance Dashboard",
    description: "Track regulations relevant to your business in a single, modern dashboard.",
  },
  {
    icon: <Search className="h-6 w-6 text-sage-600" />,
    title: "Smart Search",
    description: "Filter compliance requirements by industry and location in seconds.",
  },
  {
    icon: <Bell className="h-6 w-6 text-sage-600" />,
    title: "Regulatory Feed",
    description: "Receive live updates when new laws or regulations impact you.",
  },
];

export const KeyFeatures = () => {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-0 bg-sage-50">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <div className="text-sm font-semibold text-sage-600 mb-4 tracking-wider uppercase">
          Key Features
        </div>
        <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-3">
          Everything you need for compliance management
        </h2>
        <p className="text-slate-600 text-lg">
          LegisScope provides a suite of modern tools to help you stay ahead.
        </p>
      </div>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {keyFeatures.map((feature, index) => (
            <div
              key={index}
              className="border rounded-2xl bg-white p-8 text-center shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-center mb-5">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
