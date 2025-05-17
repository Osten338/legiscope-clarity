
import { User, Book, MessageSquare, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function Feature() {
  return <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-start">
            <div>
              <Badge variant="outline" className="rounded-full px-4 py-1">AI-Powered Compliance</Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
                Simplify Regulatory Compliance
              </h2>
              <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
                Our AI-driven platform transforms complex legal requirements into actionable insights, saving your business time and reducing compliance risks.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-muted rounded-md h-full lg:col-span-2 p-6 aspect-square lg:aspect-auto flex justify-between flex-col">
              <Eye className="w-8 h-8 stroke-1" />
              <div className="flex flex-col">
                <h3 className="text-xl tracking-tight">Applicability of Laws Tool</h3>
                <p className="text-muted-foreground max-w-xs text-base">
                  Our intelligent system analyzes your business profile to identify which regulations apply to you. Using advanced RAG technology, we deliver precise, expert-authored compliance checklists tailored to your specific needs.
                </p>
              </div>
            </div>
            <div className="bg-muted rounded-md aspect-square p-6 flex justify-between flex-col">
              <Book className="w-8 h-8 stroke-1" />
              <div className="flex flex-col">
                <h3 className="text-xl tracking-tight">Policy Vault</h3>
                <p className="text-muted-foreground max-w-xs text-base">
                  Transform your static policy documents into a dynamic, searchable knowledge base. Our system analyzes your policies and automatically maps them to compliance requirements, highlighting gaps and opportunities.
                </p>
              </div>
            </div>
            <div className="bg-muted rounded-md aspect-square p-6 flex justify-between flex-col">
              <MessageSquare className="w-8 h-8 stroke-1" />
              <div className="flex flex-col">
                <h3 className="text-xl tracking-tight">Curated Legal Chatbot</h3>
                <p className="text-muted-foreground max-w-xs text-base">
                  Get reliable legal guidance without the guesswork. Our chatbot draws from verified legal sources and understands your organization's unique context to deliver accurate, actionable compliance advice.
                </p>
              </div>
            </div>
            <div className="bg-muted rounded-md h-full lg:col-span-2 p-6 aspect-square lg:aspect-auto flex justify-between flex-col">
              <User className="w-8 h-8 stroke-1" />
              <div className="flex flex-col">
                <h3 className="text-xl tracking-tight">Horizon Spotter</h3>
                <p className="text-muted-foreground max-w-xs text-base">
                  Never be caught off-guard by regulatory changes again. Our system monitors trusted legal sources and filters updates based on your business profile, giving you early warnings about relevant changes to your compliance landscape.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
export { Feature };
