
import { motion } from "framer-motion";
import { Shield, Book, CheckCircle } from "lucide-react";
import { Card } from "./ui/card";

const features = [
  {
    icon: <Shield className="h-8 w-8 text-sage-600" />,
    title: "Compliance Assessment",
    description: "Quick evaluation of your business to identify applicable regulations",
  },
  {
    icon: <Book className="h-8 w-8 text-sage-600" />,
    title: "Legislative Database",
    description: "Comprehensive collection of laws and requirements updated regularly",
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-sage-600" />,
    title: "Action Plans",
    description: "Clear steps and requirements to achieve compliance",
  },
];

export const Features = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full glass-panel hover:shadow-xl transition-shadow duration-200">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
