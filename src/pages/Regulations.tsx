
import { DashboardLayout } from "@/components/dashboard/new-ui";

const Regulations = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-4xl font-medium text-black">Regulations</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Track and manage all relevant regulations affecting your business.
        </p>
        
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-medium text-gray-700 mb-2">No Regulations Saved Yet</h2>
              <p className="text-gray-500 mb-4">Add regulations to start tracking your compliance.</p>
              <button className="bg-primary text-white px-4 py-2 rounded-md">
                Add Regulation
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Regulations;
