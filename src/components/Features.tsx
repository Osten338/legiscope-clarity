
import { motion } from "framer-motion";
import { Shield, Book, CheckCircle } from "lucide-react";
import { TextContainer } from "@/components/ui/text-container";

const features = [
  {
    icon: <Shield className="h-8 w-8 text-neutral-800" />,
    title: "Compliance Assessment",
    description: "Quick evaluation of your business to identify applicable regulations",
  },
  {
    icon: <Book className="h-8 w-8 text-neutral-800" />,
    title: "Legislative Database",
    description: "Comprehensive collection of laws and requirements updated regularly",
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-neutral-800" />,
    title: "Action Plans",
    description: "Clear steps and requirements to achieve compliance",
  },
];

export const Features = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="group h-full"
            >
              <TextContainer hover className="h-full flex flex-col">
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-medium mb-4 text-neutral-900">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </TextContainer>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
