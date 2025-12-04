import { AlertTriangle } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-4xl font-bold mb-2 text-red-600">404</h1>
      <p className="text-lg text-gray-700 mb-2">Page Not Found</p>
      <p className="text-gray-500">Sorry, the page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFoundPage;