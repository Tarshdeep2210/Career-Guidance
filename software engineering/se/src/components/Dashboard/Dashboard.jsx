// src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Checklist from "./Checklist";
import MotivationCard from "./MotivationCard";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { FaUser, FaGraduationCap, FaLightbulb, FaTrophy } from "react-icons/fa";

const COLORS = ["#10B981", "#7C3AED"];

const Card = ({ children, className = "" }) => (
  <div className={`bg-black/70 backdrop-blur-md p-6 rounded-3xl shadow-xl transition hover:scale-105 ${className}`}>
    {children}
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();

  // 🔥 MATCH ROADMAP STORAGE EXACTLY
  const userKey = user ? `aiData_${user.id}` : "aiData_guest";

  const displayName = user?.name || "User";

  const [roadmap, setRoadmap] = useState([]);
  const [search, setSearch] = useState("");

  // 🔥 LOAD PER-USER ROADMAP
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(userKey));
    if (saved?.roadmap) {
      setRoadmap(saved.roadmap);
    }
  }, [userKey]);

  // ----------- PROGRESS LOGIC -----------
  const totalSteps = roadmap.length;
  const completedSteps = roadmap.filter((s) => s.completed).length;
  const progressPercent = totalSteps ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const tasks = roadmap.map((step) => ({
    title: step.step,
    completed: step.completed,
    due: `In ${step.duration_days || 1} days`,
  }));

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const pieData = [
    { name: "Completed", value: progressPercent },
    { name: "Remaining", value: 100 - progressPercent },
  ];

  // LINE CHART DATA
  let lastPercent = 0;
  const lineData = roadmap.map((step, idx) => {
    const completedBefore = roadmap.slice(0, idx + 1).filter((s) => s.completed).length;
    const percent = totalSteps ? Math.round((completedBefore / totalSteps) * 100) : 0;
    if (percent < lastPercent)
      return { day: step.step?.trim() || `Step ${idx + 1}`, progress: lastPercent };
    lastPercent = percent;
    return { day: step.step?.trim() || `Step ${idx + 1}`, progress: percent };
  });

  // 🔥 SAVE PER-USER TO MATCH ROADMAP
  const saveToLocalStorage = (updatedRoadmap) => {
    const data = {
      roadmap: updatedRoadmap,
    };
    localStorage.setItem(userKey, JSON.stringify(data));
  };

  const toggleTask = (index) => {
    const updated = roadmap.map((s, i) =>
      i === index ? { ...s, completed: !s.completed } : s
    );
    setRoadmap(updated);
    saveToLocalStorage(updated);
  };

  const exportRoadmap = () => {
    const blob = new Blob([JSON.stringify(roadmap, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "my_roadmap.json";
    link.click();
  };

  const recentAchievements = roadmap.filter((t) => t.completed).slice(-5).reverse();

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-8 overflow-x-hidden scrollbar-custom">

      {/* GREETING */}
      <Card className="flex flex-col sm:flex-row items-center gap-4 mt-6">
        <FaUser className="text-green-400 text-4xl sm:text-5xl" />
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
            Welcome back, {displayName}! 👋
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm md:text-base">
            Here's your AI-driven roadmap and progress overview.
          </p>
        </div>
      </Card>

      <MotivationCard progress={progressPercent} />

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* PROGRESS CARD */}
        <Card className="flex flex-col items-center w-full">
          <h2 className="text-xl font-bold mb-4 text-green-400">Progress</h2>

          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* CHECKLIST */}
        <Card>
          <input
            type="text"
            placeholder="Search steps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-lg mb-4 bg-black/50 text-white placeholder-gray-400"
          />
          <Checklist tasks={filteredTasks} toggleTask={toggleTask} />

          <button
            onClick={exportRoadmap}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg"
          >
            Export Roadmap
          </button>
        </Card>

        {/* STATS */}
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-green-400">Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-black/50 p-3 rounded-lg">
              <FaGraduationCap className="text-green-400 text-2xl" />
              <span className="text-white font-medium">Steps Completed:</span>
              <span className="font-bold text-white">
                {completedSteps}/{totalSteps}
              </span>
            </div>

            <div className="flex items-center gap-3 bg-black/50 p-3 rounded-lg">
              <FaLightbulb className="text-yellow-400 text-2xl" />
              <span className="text-white font-medium">Progress:</span>
              <span className="font-bold text-white">{progressPercent}%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* LINE CHART */}
      <Card>
        <h2 className="text-xl font-semibold mb-4 text-violet-400">Progress Over Time</h2>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={lineData}>
            <CartesianGrid stroke="#333" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" stroke="#bbb" />
            <YAxis stroke="#bbb" tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
            <Tooltip formatter={(v) => `${v}%`} />
            <Line
              type="monotone"
              dataKey="progress"
              stroke="#10B981"
              strokeWidth={4}
              dot={{ r: 6, fill: "#7C3AED", stroke: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* UPCOMING TASKS */}
      <Card>
        <h2 className="text-xl font-semibold mb-4 text-blue-400">Upcoming Tasks</h2>
        <ul className="space-y-2">
          {roadmap.filter((t) => !t.completed).slice(0, 5).map((task, idx) => (
            <li key={idx} className="flex justify-between p-3 bg-black/50 rounded-lg">
              <span className="font-medium">{task.step}</span>
              <span className="text-gray-400">{task.duration_days || 1} days left</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* RECENT ACHIEVEMENTS */}
      <Card>
        <h2 className="text-xl font-semibold mb-4 text-yellow-400 flex items-center gap-2">
          <FaTrophy /> Recent Achievements
        </h2>

        {recentAchievements.length > 0 ? (
          <ul className="space-y-3">
            {recentAchievements.map((t, idx) => (
              <li key={idx} className="flex items-center gap-3 p-3 bg-black/50 rounded-lg">
                <FaTrophy className="text-yellow-400 text-xl" />
                <div>
                  <p className="text-white font-medium">{t.step}</p>
                  <p className="text-gray-400 text-sm">{t.duration_days || 1} days</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No achievements yet.</p>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
