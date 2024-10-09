
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4">
        Go back to the <Link to="/" className="text-indigo-600">Home Page</Link>.
      </p>
    </div>
  );
};

export default NotFound;
