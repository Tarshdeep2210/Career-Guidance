import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout/Layout1";

// Tabs
import Dashboard from "../components/Dashboard/Dashboard";
import Resources from "../components/Tabs/Resources";
import Roadmap from "../components/Tabs/Roadmap";
import Alumni from "../components/Tabs/Alumni";
import Rewards from "../components/Tabs/Rewards";
import Notifications from "../components/Tabs/Notifications";
import SettingsPage from "../pages/Settings";
import CareerChatbotPage from "../components/CareerChatbotPage";
import Chatbot from "../components/Chatbot";
import Profile from "./Profile";

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Global Chatbot */}
      <Chatbot />

      <Routes>
        {/* Pages with sidebar */}
        {[
          { path: "dashboard", component: <Dashboard /> },
          { path: "resources", component: <Resources /> },
          { path: "roadmap", component: <Roadmap /> },
          { path: "alumni", component: <Alumni /> },
          { path: "rewards", component: <Rewards /> },
          { path: "notifications", component: <Notifications /> },
          { path: "settings", component: <SettingsPage /> },
          { path: "profile", component: <Profile /> }, // ✅ Profile page added
        ].map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<Layout showSidebar={true}>{route.component}</Layout>}
          />
        ))}

        {/* Chatbot page without sidebar */}
        <Route
          path="chatbot"
          element={
            <Layout showSidebar={false} showFooter={false}>
              <CareerChatbotPage />
            </Layout>
          }
        />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="dashboard" />} />
        <Route path="*" element={<Navigate to="dashboard" />} />
      </Routes>
    </div>
  );
};

export default Home;
