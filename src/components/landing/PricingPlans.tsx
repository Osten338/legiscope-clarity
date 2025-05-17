
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Starter",
    price: "$99",
    description: "Essential compliance tools for small businesses with limited regulatory exposure.",
    features: [
      "Law applicability assessment",
      "Basic policy vault (5 documents)",
      "Monthly regulatory updates",
      "5 user accounts"
    ],
    buttonText: "Get Started",
    buttonAction: "/auth",
    popular: false
  },
  {
    name: "Professional",
    price: "$299",
    description: "Comprehensive compliance management for growing organizations with moderate regulatory needs.",
    features: [
      "Advanced law applicability analysis",
      "Extended policy vault (25 documents)",
      "Weekly regulatory updates",
      "Interactive legal chatbot",
      "Compliance checklists & reporting",
      "20 user accounts"
    ],
    buttonText: "Get Started",
    buttonAction: "/auth",
    popular: true
  },
  {
    name: "Enterprise",
    price: "$799",
    description: "Complete compliance solution for large organizations with complex regulatory requirements.",
    features: [
      "Custom compliance dashboard",
      "Unlimited policy vault storage",
      "Real-time regulatory monitoring",
      "Advanced legal chatbot with custom training",
      "Custom compliance reporting",
      "Audit trail & documentation",
      "Unlimited user accounts",
      "Priority support & legal consultations"
    ],
    buttonText: "Contact Sales",
    buttonAction: "#contact",
    popular: false
  }
];

export const PricingPlans = () => {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-black" id="pricing">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-3">Compliance solutions for every business</h2>
        <p className="text-white/80">Transparent pricing with no hidden costs</p>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className="border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm p-6 relative hover:bg-white/10 transition-all duration-300">
              {plan.popular && (
                <Badge className="absolute top-4 right-4 bg-brand-blue text-white border-none">
                  Most Popular
                </Badge>
              )}
              <h3 className="text-xl font-medium mb-2 text-white">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-white/70">/month</span>
              </div>
              <p className="text-white/70 text-sm mb-6">{plan.description}</p>
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2 text-sm">
                    <Check className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className={`w-full ${plan.popular ? 'bg-brand-blue hover:bg-brand-blue/90' : 'bg-white/10 hover:bg-white/20 border border-white/10'} transition-colors duration-300`}
                asChild
              >
                <a href={plan.buttonAction}>{plan.buttonText}</a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
