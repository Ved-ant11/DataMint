import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <h1 className="text-5xl font-bold text-white mb-6">404</h1>
      <p className="text-xl text-gray-300 mb-8">
        The page you're looking for doesn't exist
      </p>
      <Link to="/" className="btn-primary inline-block px-6 py-3">
        Go Home
      </Link>
    </div>
  );
}
