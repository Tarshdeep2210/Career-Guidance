import React, { useState } from "react";
import ChangeName from "../components/Settings/ChangeName";
import ChangePassword from "../components/Settings/ChangePassword";
import Notifications from "../components/Settings/Notifications";

const SettingsPage = () => {
  const [selectedTab, setSelectedTab] = useState("name");

  const tabs = [
    { id: "name", label: "Change Name" },
    { id: "password", label: "Change Password" },
    { id: "notifications", label: "Notifications" },
  ];

  const renderTab = () => {
    switch (selectedTab) {
      case "name":
        return <ChangeName />;
      case "password":
        return <ChangePassword />;
      case "notifications":
        return <Notifications />;
      default:
        return (
          <div className="text-gray-400 text-center py-16 text-lg">
            ⚙️ Select a setting option.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#09091a] to-[#0e0e25] text-white flex flex-col lg:flex-row">

      {/* Main Content (SHIFTED LEFT) */}
      <div className="flex-1 lg:ml-15 pt-24 px-6 pb-10">

        {/* Title Styled Like Dashboard/Roadmap */}
        <h1
          className="
            text-4xl font-extrabold mb-2
            bg-gradient-to-r from-violet-400 to-fuchsia-500
            bg-clip-text text-transparent
            drop-shadow-[0_0_12px_rgba(139,92,246,0.6)]
          "
        >
          ⚙️ Settings
        </h1>

        <p className="text-white/60 mb-6 text-sm">
          Manage your account & preferences
        </p>

        {/* Mobile Dropdown */}
        <div className="lg:hidden mb-6">
          <select
            value={selectedTab}
            onChange={(e) => setSelectedTab(e.target.value)}
            className="
              w-full p-3 rounded-3xl
              bg-black/40 backdrop-blur-xl
              border border-violet-500/20
              text-white
              focus:ring-2 focus:ring-violet-500
            "
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden lg:flex gap-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`
                px-5 py-2 rounded-3xl font-medium transition
                border backdrop-blur-xl shadow-md
                ${
                  selectedTab === tab.id
                    ? "bg-violet-600 border-violet-500/40 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                    : "bg-black/40 border-violet-500/20 text-white/70 hover:bg-black/60 hover:shadow-[0_0_10px_rgba(139,92,246,0.25)]"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Glassmorphism Card */}
        <div
          className="
            relative p-[2px] rounded-3xl
            bg-gradient-to-b from-[#0e0e25] to-[#141434]
            shadow-xl
          "
        >
          <div
            className="
              bg-black/30 backdrop-blur-2xl
              p-6 rounded-3xl min-h-[400px]
              shadow-[0_0_20px_rgba(139,92,246,0.25)]
            "
          >
            {renderTab()}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
