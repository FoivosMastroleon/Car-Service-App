import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";

const Header = () => {
  const { isAuthenticated, user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <header className="bg-brand-700 text-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg tracking-tight">
          🚗 CarCare AI
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {isAuthenticated ? (
            <>
              <span className="text-brand-100">Hi, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-brand-800 hover:bg-brand-900 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-lg bg-white text-brand-700 font-medium hover:bg-brand-50 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
