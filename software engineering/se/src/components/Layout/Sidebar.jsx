import React, { useState, useEffect } from "react";
import { FaHome, FaBook, FaRoad, FaUserGraduate, FaGift, FaBell, FaCog } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tabs = [
    { name: "Dashboard", icon: <FaHome />, path: "/home/dashboard" },
    { name: "Resources", icon: <FaBook />, path: "/home/resources" },
    { name: "Roadmap", icon: <FaRoad />, path: "/home/roadmap" },
    { name: "Alumni", icon: <FaUserGraduate />, path: "/home/alumni" },
    { name: "Rewards", icon: <FaGift />, path: "/home/rewards" },
    { name: "Notifications", icon: <FaBell />, path: "/home/notifications" },
    { name: "Settings", icon: <FaCog />, path: "/home/settings" },
    { name: "Profile", icon: <FaUserGraduate />, path: "/home/profile" }, // ✅ Profile added
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-black/90 backdrop-blur-md shadow-lg z-50 transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        w-64`}
    >
      <div className="pt-20 flex flex-col gap-3">
        {tabs.map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.path}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 p-3 mx-2 rounded-lg transition transform hover:scale-105 ${
                isActive ? "bg-violet-700 text-green-400" : "text-gray-400"
              }`
            }
          >
            <div className="text-2xl">{tab.icon}</div>
            {(sidebarOpen || windowWidth >= 1024) && <span>{tab.name}</span>}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
