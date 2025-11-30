import React, { useState } from "react";
import Sidebar from "./Sidebar"; // dashboard-style sidebar
import ChangeName from "../Settings/ChangeName";
import ChangePassword from "../Settings/ChangePassword";
import ManageAccounts from "../Settings/ManageAccounts";
import Notifications from "../Settings/Notifications";

const SettingsPage = () => {
  const [selectedTab, setSelectedTab] = useState("name"); // default first tab

  const tabs = [
    { id: "name", label: "Change Name" },
    { id: "password", label: "Change Password" },
    { id: "accounts", label: "Manage Accounts" },
    { id: "notifications", label: "Notifications" },
  ];

  const renderTab = () => {
    switch (selectedTab) {
      case "name":
        return <ChangeName />;
      case "password":
        return <ChangePassword />;
      case "accounts":
        return <ManageAccounts />;
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
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 ml-20 lg:ml-64 pt-24 px-6 pb-10 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-white/90 mb-1">Settings</h1>
          <p className="text-white/60">Manage your account & preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-5 py-2 rounded-3xl font-medium transition hover:scale-105 ${
                selectedTab === tab.id
                  ? "bg-violet-700 text-white"
                  : "bg-black/50 text-white/70 hover:bg-black/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-black/70 backdrop-blur-md p-6 rounded-3xl shadow-xl transition hover:scale-105 min-h-[400px]">
          {renderTab()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
