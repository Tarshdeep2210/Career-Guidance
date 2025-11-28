import React from "react";
import { FaBars, FaSignOutAlt, FaUserCircle, FaCog } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-md shadow-md z-50 flex justify-between items-center px-6">
      <div className="flex items-center gap-3">
        {/* Hamburger always visible on mobile */}
        <button
          className="text-white lg:hidden z-50"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaBars size={24} />
        </button>

        <h1
          className="text-2xl font-bold text-violet-400 cursor-pointer"
          onClick={() => navigate("/home/dashboard")}
        >
          CareerPath
        </h1>
        <p className="text-green-400 text-sm hidden sm:inline">Your roadmap, your pace</p>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <button
          onClick={() => navigate("/home/settings")}
          className="flex items-center gap-2 text-white hover:text-violet-400 transition"
        >
          <FaCog size={18} />
          <span className="hidden md:inline">Settings</span>
        </button>

        <button className="flex items-center gap-2 text-white">
          <FaUserCircle size={20} />
          <span className="hidden md:inline">{user?.name || "Profile"}</span>
        </button>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex items-center gap-2 text-white hover:text-red-500 transition"
        >
          <FaSignOutAlt size={20} />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
