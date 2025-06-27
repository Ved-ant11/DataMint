import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="bg-black/30 backdrop-blur-md border-b border-white/20 py-4 sticky top-0 z-40"
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white tracking-tight">
          DataMint
        </Link>
        <nav className="flex items-center space-x-6">
          {user ? (
            <>
              <NavLink to="/dashboard" label="Dashboard" location={location} />
              <NavLink to="/generator" label="Generator" location={location} />
              <button
                onClick={logout}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Logout
              </button>
              <span className="ml-2 px-3 py-1 bg-primary-500/30 text-primary-100 rounded-full text-sm">
                {user.name || user.email}
              </span>
            </>
          ) : (
            <>
              <NavLink to="/login" label="Login" location={location} />
              <NavLink to="/register" label="Register" location={location} />
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
}

// Helper for active nav link styling
function NavLink({ to, label, location }) {
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`transition-colors px-2 py-1 rounded ${
        isActive
          ? "bg-primary-600 text-white"
          : "text-gray-300 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}
