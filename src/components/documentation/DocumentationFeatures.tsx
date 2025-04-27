import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react";

const features = [
  {
    title: "Policies and Procedures",
    description: "Access and review your organization's internal policies, standard operating procedures, and compliance guidelines.",
    icon: <IconTerminal2 className="h-6 w-6" />,
    href: "/documents"
  },
  {
    title: "Risk Assessments",
    description: "View detailed risk assessment reports, mitigation strategies, and ongoing monitoring documentation.",
    icon: <IconEaseInOut className="h-6 w-6" />,
  },
  {
    title: "Training Materials",
    description: "Access compliance training resources, educational materials, and certification tracking documents.",
    icon: <IconHelp className="h-6 w-6" />,
  },
  {
    title: "Incident Reports",
    description: "Review historical incident reports, resolution documentation, and preventive measures implemented.",
    icon: <IconCloud className="h-6 w-6" />,
  },
  {
    title: "Compliance Checklists",
    description: "Access comprehensive checklists for regular compliance audits and self-assessments.",
    icon: <IconRouteAltLeft className="h-6 w-6" />,
  },
  {
    title: "Audit Reports",
    description: "View internal and external audit findings, recommendations, and action plans.",
    icon: <IconAdjustmentsBolt className="h-6 w-6" />,
  },
  {
    title: "Regulatory Updates",
    description: "Stay informed with the latest regulatory changes and their impact on your compliance program.",
    icon: <IconCurrencyDollar className="h-6 w-6" />,
  },
  {
    title: "Best Practices",
    description: "Access guides and documentation on industry-standard compliance practices and implementation strategies.",
    icon: <IconHeart className="h-6 w-6" />,
  },
];

const Feature = ({
  title,
  description,
  icon,
  index,
  href,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
  href?: string;
}) => {
  const Content = () => (
    <>
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </>
  );

  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800",
        href && "cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {href ? (
        <Link to={href} className="h-full">
          <Content />
        </Link>
      ) : (
        <Content />
      )}
    </div>
  );
};

export function DocumentationFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}
