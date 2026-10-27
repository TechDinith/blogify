import { Link } from "react-router-dom";
import { Home, SearchX } from "lucide-react";

const NotFound = () => (
  <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800">
      <SearchX size={28} />
    </div>
    <h1 className="text-4xl font-extrabold">404</h1>
    <p className="mt-2 text-[rgb(var(--muted))]">The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn-primary mt-6">
      <Home size={16} /> Back home
    </Link>
  </div>
);

export default NotFound;
