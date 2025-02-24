import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <Card className="w-full max-w-md p-8 text-center border border-gray-700 bg-gray-800 shadow-lg">
        <h1 className="text-5xl font-bold text-red-500">404</h1>
        <p className="text-lg text-gray-300 mt-2">Oops! Page not found.</p>
        <p className="text-sm text-gray-400 mt-1">
          The page you are looking for does not exist.
        </p>
        <CardContent className="mt-4 space-y-3">
          <Button
            className="w-full bg-indigo-500 hover:bg-indigo-600"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button asChild className="w-full bg-gray-700 hover:bg-gray-600">
            <Link to="/">Go Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
