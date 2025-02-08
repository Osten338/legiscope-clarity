
import { useState } from "react";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Upload } from "lucide-react";
import { Input } from "./ui/input";
import { motion } from "framer-motion";

export const BusinessDescription = () => {
  const [description, setDescription] = useState("");
  
  return (
    <section className="py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Tell Us About Your Business</h2>
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="guidance" className="text-lg font-semibold text-slate-900">
                What information should you include?
              </Label>
              <ul className="mt-3 list-disc list-inside text-slate-600 space-y-2">
                <li>Your business model and primary activities</li>
                <li>How you interact with customers or clients</li>
                <li>Industry sector and any relevant subsectors</li>
                <li>Geographic areas of operation</li>
                <li>Types of data you collect and process</li>
                <li>Products or services you offer</li>
                <li>Number of employees (approximate)</li>
                <li>Annual revenue range (if applicable)</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="description" className="text-lg font-semibold text-slate-900">
                  Business Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your business here..."
                  className="mt-2 h-48"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="document" className="text-lg font-semibold text-slate-900">
                  Or Upload a Document
                </Label>
                <div className="mt-2">
                  <Input
                    id="document"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    className="w-full border-dashed border-2 h-24 flex flex-col items-center justify-center gap-2"
                    onClick={() => document.getElementById("document")?.click()}
                  >
                    <Upload className="h-6 w-6 text-sage-600" />
                    <span className="text-sage-600">Upload business documentation</span>
                    <span className="text-sm text-slate-500">PDF, DOC, or DOCX up to 10MB</span>
                  </Button>
                </div>
              </div>
            </div>

            <Button 
              className="w-full bg-sage-600 hover:bg-sage-700 text-white"
              onClick={() => {
                // TODO: Handle submission logic
                console.log("Business description:", description);
              }}
            >
              Submit Business Information
            </Button>
          </div>
        </Card>
      </motion.div>
    </section>
  );
};
