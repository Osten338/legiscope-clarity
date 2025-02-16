
import { DocumentationCard } from "@/components/documentation/DocumentationCard";
import { Separator } from "@/components/ui/separator";
import { Layout } from "@/components/dashboard/Layout";

const Documentation = () => {
  return (
    <Layout>
      <div className="p-8 overflow-y-auto bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-sage-900">Documentation</h1>
            <p className="text-slate-600 mt-2">
              Comprehensive guide to risk assessment and compliance management
            </p>
          </div>

          <Separator />

          <DocumentationCard title="Risk Assessment Overview">
            <div className="space-y-4">
              <p>
                Risk assessment is a systematic process of evaluating potential risks that could affect your organization's compliance and operations. Our risk assessment methodology focuses on four key aspects:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Likelihood (1-5 scale):</strong> The probability of a risk occurring</li>
                <li><strong>Impact (1-5 scale):</strong> The potential consequences if the risk materializes</li>
                <li><strong>Risk Level:</strong> Calculated based on likelihood and impact scores</li>
                <li><strong>Categories:</strong> Compliance, Operational, Financial, and Reputational risks</li>
              </ul>
            </div>
          </DocumentationCard>

          <DocumentationCard title="Using the Risk Matrix">
            <div className="space-y-4">
              <p>
                The risk matrix is a visual tool that helps you understand and prioritize risks based on their likelihood and impact scores.
              </p>
              <h4 className="text-lg font-medium text-sage-900">Color Coding:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="text-green-600 font-medium">Green (Low Risk):</span> Minimal attention required, monitor periodically</li>
                <li><span className="text-yellow-600 font-medium">Yellow (Medium Risk):</span> Regular monitoring and mitigation plans needed</li>
                <li><span className="text-red-600 font-medium">Red (High Risk):</span> Immediate attention and action required</li>
              </ul>
            </div>
          </DocumentationCard>

          <DocumentationCard title="Risk Management Process">
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-sage-900">Step-by-Step Guide:</h4>
              <ol className="list-decimal pl-6 space-y-3">
                <li>
                  <strong>Risk Identification</strong>
                  <p className="mt-1 text-slate-600">Start with auto-generated risks based on your compliance requirements, then add custom risks specific to your organization.</p>
                </li>
                <li>
                  <strong>Risk Assessment</strong>
                  <p className="mt-1 text-slate-600">Evaluate each risk's likelihood and impact using the 1-5 scale.</p>
                </li>
                <li>
                  <strong>Mitigation Planning</strong>
                  <p className="mt-1 text-slate-600">Develop and document specific actions to reduce or eliminate identified risks.</p>
                </li>
                <li>
                  <strong>Regular Review</strong>
                  <p className="mt-1 text-slate-600">Schedule periodic reviews to ensure risk assessments remain current and effective.</p>
                </li>
              </ol>
            </div>
          </DocumentationCard>

          <DocumentationCard title="Integration with Compliance">
            <div className="space-y-4">
              <p>
                Risk assessment is closely tied to your compliance efforts. Here's how they work together:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Auto-generated risks are created based on your applicable regulations</li>
                <li>Risk levels help prioritize compliance efforts and resource allocation</li>
                <li>Regular risk reviews ensure alignment with compliance requirements</li>
                <li>Documentation of risk assessments supports compliance reporting</li>
              </ul>
              <div className="bg-sage-50 p-4 rounded-lg mt-4">
                <p className="text-sage-900 font-medium">Best Practice Tip:</p>
                <p className="text-sage-700 mt-1">
                  Maintain detailed records of all risk assessments, including dates, participants, and rationale for risk ratings. This documentation is valuable for both internal decision-making and external audits.
                </p>
              </div>
            </div>
          </DocumentationCard>
        </div>
      </div>
    </Layout>
  );
};

export default Documentation;
