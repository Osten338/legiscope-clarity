
import { LegislationFeed } from "@/components/legislation/LegislationFeed";

export const LegislationUpdates = () => {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-sm font-semibold text-brand-blue mb-4 tracking-wider uppercase">
            Stay Updated
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Real-Time Regulatory Intelligence
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Stay ahead with live updates on regulatory changes that impact your business.
          </p>
        </div>
        <div className="max-w-4xl mx-auto backdrop-blur-sm">
          <LegislationFeed />
        </div>
      </div>
    </section>
  );
};
