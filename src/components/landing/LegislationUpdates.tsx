
import { LegislationFeed } from "@/components/legislation/LegislationFeed";

export const LegislationUpdates = () => {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-medium mb-4">Stay Updated</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Keep track of the latest regulatory changes directly from the source.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <LegislationFeed />
        </div>
      </div>
    </section>
  );
};
