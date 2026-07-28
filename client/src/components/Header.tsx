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
    <header className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="font-semibold text-lg">
        CarCare AI
      </Link>

      <nav className="flex items-center gap-4 text-sm">
        {isAuthenticated ? (
          <>
            <span className="text-gray-500">{user?.username}</span>
            <button onClick={handleLogout} className="text-gray-700 hover:underline">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:underline">
              Login
            </Link>
            <Link to="/register" className="text-gray-700 hover:underline">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
