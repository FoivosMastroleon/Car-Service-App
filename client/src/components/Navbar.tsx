import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
    isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-slate-200 px-6">
      <div className="max-w-6xl mx-auto flex items-center gap-1 h-12">
        <NavLink to="/" end className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/vehicles" className={linkClass}>
          Vehicles
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
