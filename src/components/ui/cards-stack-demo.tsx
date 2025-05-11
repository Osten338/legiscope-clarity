import { ContainerScroll, CardSticky } from "@/components/ui/cards-stack";
const PROCESS_PHASES = [{
  id: "process-1",
  title: "Research and Analysis",
  description: "With your vision in mind, we enter the Research and Analysis phase. Here, we examine your competitors, industry trends, and user preferences. This informed approach ensures your website stands out and provides an excellent user experience."
}, {
  id: "process-2",
  title: "Wireframing and Prototyping",
  description: "We move on to Wireframing and Prototyping, where we create skeletal representations of your website's pages. These visual indigoprints allow us to test and refine the user experience before diving into design."
}, {
  id: "process-3",
  title: "Design Creation",
  description: "Now, it's time for the Design Creation phase. Our talented designers bring your vision to life. We focus on aesthetics, ensuring your website not only looks stunning but also aligns perfectly with your brand identity."
}, {
  id: "process-4",
  title: "Development and Testing",
  description: "In the Development and Testing phase, our skilled developers turn designs into a fully functional website. Rigorous testing ensures everything works seamlessly, providing an exceptional user experience."
}, {
  id: "process-5",
  title: "Launch and Support",
  description: "Our commitment continues beyond launch. We offer post-launch support to address questions, provide assistance, and ensure your website remains updated and optimized. The Website Design Process isn't just about creating a website; it's about crafting a digital experience that resonates, engages, and converts."
}];
const WORK_PROJECTS = [{
  id: "work-project-3",
  title: "YCF DEV",
  services: ["Portfolio", "Partnership", "UI UX Design"],
  imageUrl: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
}, {
  id: "work-project-1",
  title: "Stridath Ecommerce",
  services: ["E-Commerce", "Branding", "UI UX Design", "Development"],
  imageUrl: "https://images.unsplash.com/photo-1688561808434-886a6dd97b8c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
}, {
  id: "work-project-2",
  title: "Marketing Agency",
  services: ["Partnership", "UI UX Design", "Development"],
  imageUrl: "https://images.unsplash.com/photo-1683803055067-1ca1c17cb2b9?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
}];
const ACHIEVEMENTS = [{
  id: "achivement-1",
  title: "4",
  description: "site of the day",
  bg: "rgb(58,148,118)"
}, {
  id: "achivement-2",
  title: "60+",
  description: "website created",
  bg: "rgb(195,97,158)"
}, {
  id: "achivement-3",
  title: "5+",
  description: "years of experience",
  bg: "rgb(202,128,53)"
}, {
  id: "achivement-4",
  title: "6+",
  description: "component created",
  bg: "rgb(135,95,195)"
}];
const Process = () => {
  return <div className="container min-h-svh place-content-center bg-stone-50 px-6 text-stone-900 xl:px-12">
      <div className="grid md:grid-cols-2 md:gap-8 xl:gap-12">
        <div className="left-0 top-0 md:sticky md:h-svh md:py-12">
          <h5 className=" text-xs uppercase tracking-wide">our process</h5>
          <h2 className="mb-6 mt-4 text-4xl font-bold tracking-tight">
            Planning your{" "}
            <span className="text-black">project development</span> journey
          </h2>
          <p className="max-w-prose text-sm">
            Our journey begins with a deep dive into your vision. In the
            Discovery phase, we engage in meaningful conversations to grasp your
            brand identity, goals, and the essence you want to convey. This
            phase sets the stage for all that follows.
          </p>
        </div>
        <ContainerScroll className="min-h-[400vh] space-y-8 py-12">
          {PROCESS_PHASES.map((phase, index) => <CardSticky key={phase.id} index={index + 2} className="rounded-2xl border p-8 shadow-md backdrop-blur-md">
              <div className="flex items-center justify-between gap-4">
                <h2 className="my-6 text-2xl font-bold tracking-tighter">
                  {phase.title}
                </h2>
                <h3 className="text-2xl font-bold text-black">
                  {String(index + 1).padStart(2, "0")}
                </h3>
              </div>

              <p className="text-foreground">{phase.description}</p>
            </CardSticky>)}
        </ContainerScroll>
      </div>
    </div>;
};
const Work = () => {
  return;
};
const Achievements = () => {
  return <div className="container min-h-svh place-content-center bg-stone-50 px-6 text-stone-900 xl:px-12 py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h5 className="text-xs uppercase tracking-wide">our achievements</h5>
        <h2 className="mb-6 mt-4 text-4xl font-bold tracking-tight">
          What we've <span className="text-black">accomplished</span> so far
        </h2>
        <p className="max-w-prose mx-auto text-sm">
          Our journey has been marked by notable achievements that reflect our dedication and expertise in delivering exceptional solutions.
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {ACHIEVEMENTS.map(achievement => <div key={achievement.id} className="p-8 rounded-2xl flex flex-col items-center justify-center text-center aspect-square" style={{
        backgroundColor: achievement.bg,
        color: 'white'
      }}>
            <h3 className="text-4xl md:text-5xl font-bold mb-2">{achievement.title}</h3>
            <p className="text-sm opacity-90">{achievement.description}</p>
          </div>)}
      </div>
    </div>;
};
export { Process, Work, Achievements };