import { NavLink } from "react-router-dom";
import { FaPlus, FaChartPie } from "react-icons/fa";

const NavBar = () => {
  const linkStyle =
    "flex items-center gap-2 px-4 py-2 rounded-full transition font-medium text-sm sm:text-base";
  const active =
    "bg-emerald-500 text-white shadow";
  const inactive =
    "text-emerald-600 hover:bg-emerald-100 hover:text-emerald-800";

  return (
    <nav className="flex justify-center gap-4 mb-6">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${linkStyle} ${isActive ? active : inactive}`
        }
      >
        <FaPlus /> Add Expense
      </NavLink>

      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `${linkStyle} ${isActive ? active : inactive}`
        }
      >
        <FaChartPie /> Dashboard
      </NavLink>
    </nav>
  );
};

export default NavBar;
