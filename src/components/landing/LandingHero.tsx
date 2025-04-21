import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Mockup, MockupFrame } from "@/components/ui/mockup";
import { Glow } from "@/components/ui/glow";
import DisplayCards from "@/components/ui/display-cards";
import { Check, FileText, Users } from "lucide-react";

const features = [
  {
    title: "Compliance Assessment",
    description: "Automate your process to spot compliance gaps and risks at a glance.",
    icon: <Check className="size-4 text-blue-300" />,
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    title: "Automated Reporting",
    description: "Generate audit trails and reports with just one click—no more manual red tape.",
    icon: <FileText className="size-4 text-blue-300" />,
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    className: "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    title: "User Roles",
    description: "Granular access for every role, from legal to leadership. Teamwork made simple.",
    icon: <Users className="size-4 text-blue-300" />,
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    className: "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
  },
];

export const LandingHero = () => {
  return (
    <section className="bg-background text-foreground py-12 sm:py-24 md:py-32 px-4 fade-bottom overflow-hidden pb-0">
      <div className="mx-auto flex max-w-container flex-col gap-12 pt-16 sm:gap-24">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          <Badge variant="outline" className="animate-appear gap-2">
            <span className="text-muted-foreground">Your Compliance Operations, Simplified</span>
            <a href="#features" className="flex items-center gap-1">
              See Features
              <ArrowRight className="h-3 w-3" />
            </a>
          </Badge>

          <h1 className="relative z-10 inline-block animate-appear bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-4xl font-semibold leading-tight text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-8xl md:leading-tight">
            Clarity for your compliance operations
          </h1>

          <p className="text-md relative z-10 max-w-[550px] animate-appear font-medium text-muted-foreground opacity-0 delay-100 sm:text-xl">
            Effortlessly manage regulatory requirements with an intuitive platform designed to simplify complex compliance tasks.
          </p>

          <div className="relative z-10 flex animate-appear justify-center gap-4 opacity-0 delay-300">
            <Button size="lg" className="bg-brand-blue hover:bg-brand-blue/90 px-8 py-6 text-base rounded-md shadow-md font-semibold text-white" asChild>
              <a href="/auth" className="flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="text-base bg-transparent border border-white/20 text-white hover:bg-white/10" asChild>
              <a href="#features">See Features</a>
            </Button>
          </div>

          <div className="relative pt-12">
            <MockupFrame className="animate-appear opacity-0 delay-700" size="small">
              <Mockup type="responsive">
                <DisplayCards cards={features} />
              </Mockup>
            </MockupFrame>
            <Glow variant="top" className="animate-appear-zoom opacity-0 delay-1000" />
          </div>
        </div>
      </div>
    </section>
  );
};
