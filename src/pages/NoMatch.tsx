
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NoMatch = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground p-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mt-6">
          <Button asChild>
            <Link to="/">Return Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoMatch;
