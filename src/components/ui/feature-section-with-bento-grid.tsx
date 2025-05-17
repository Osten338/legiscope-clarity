
import { User, Book, MessageSquare, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function Feature() {
  return <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-start">
            <div>
              <Badge variant="outline" className="rounded-full px-4 py-1">Compliance Tools</Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
                Smart Compliance Management
              </h2>
              <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
                Navigate complex regulatory landscapes with AI-powered solutions designed for modern businesses.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-muted rounded-md h-full lg:col-span-2 p-6 aspect-square lg:aspect-auto flex justify-between flex-col">
              <Eye className="w-8 h-8 stroke-1" />
              <div className="flex flex-col">
                <h3 className="text-xl tracking-tight">Applicability of Laws Tool</h3>
                <p className="text-muted-foreground max-w-xs text-base">
                  Determine which laws apply to your business through our RAG model trained on specific regulations. Receive expert-written legal checklists for precise compliance.
                </p>
              </div>
            </div>
            <div className="bg-muted rounded-md aspect-square p-6 flex justify-between flex-col">
              <Book className="w-8 h-8 stroke-1" />
              <div className="flex flex-col">
                <h3 className="text-xl tracking-tight">Policy Vault</h3>
                <p className="text-muted-foreground max-w-xs text-base">
                  Upload your internal policies for AI processing, enabling interactive queries and automatic matching against compliance checklists.
                </p>
              </div>
            </div>
            <div className="bg-muted rounded-md aspect-square p-6 flex justify-between flex-col">
              <MessageSquare className="w-8 h-8 stroke-1" />
              <div className="flex flex-col">
                <h3 className="text-xl tracking-tight">Curated Legal Chatbot</h3>
                <p className="text-muted-foreground max-w-xs text-base">
                  Access accurate legal insights from professionally vetted sources, tailored to your organization's specific framework and policies.
                </p>
              </div>
            </div>
            <div className="bg-muted rounded-md h-full lg:col-span-2 p-6 aspect-square lg:aspect-auto flex justify-between flex-col">
              <User className="w-8 h-8 stroke-1" />
              <div className="flex flex-col">
                <h3 className="text-xl tracking-tight">Horizon Spotter</h3>
                <p className="text-muted-foreground max-w-xs text-base">
                  Stay ahead of regulatory changes with curated updates from reliable legal sources, filtered for relevance to your business profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
export { Feature };
