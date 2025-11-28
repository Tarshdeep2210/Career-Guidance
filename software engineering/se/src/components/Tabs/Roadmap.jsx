import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaRegClock, FaMapSigns, FaCheckCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Roadmap = () => {
  const { user } = useAuth();
  const userKey = user ? `aiData_${user.id}` : "aiData_guest";

  const [roadmap, setRoadmap] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(userKey);
    if (!saved) return;

    const data = JSON.parse(saved);
    if (!data?.roadmap?.length) return;

    // Normalize roadmap and assignments
    const normalizedRoadmap = (data.roadmap || []).map((s) => {
      const duration_days = Math.max(1, Number(s?.duration_days || 1));
      const assignments = (s.assignments || []).map((a = {}) => ({
        title: a.title || "Assignment",
        link: a.link || "#",
        due_in_days: Math.max(1, Number(a.due_in_days || duration_days)),
      }));
      return {
        ...s,
        duration_days,
        assignments: assignments.length ? assignments : [{
          title: `Complete learning activities for "${s.step || "Step"}"`,
          due_in_days: duration_days,
          link: "#",
        }],
      };
    });

    // Compute sequential start and end dates
    const today = new Date();
    let dayCounter = 0;
    const updated = normalizedRoadmap.map((step) => {
      const startDate = new Date(today);
      startDate.setDate(today.getDate() + dayCounter);

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + step.duration_days - 1);

      dayCounter += step.duration_days;

      return {
        ...step,
        startDate,
        endDate,
        completed: !!step.completed,
      };
    });

    setRoadmap(updated);
    setNotifications(data.notifications || []);
  }, [userKey]);

  const updateLocalStorage = (updatedRoadmap, updatedNotifications) => {
    const prev = JSON.parse(localStorage.getItem(userKey)) || {};
    const newData = {
      ...prev,
      roadmap: updatedRoadmap.map((r) => ({
        ...r,
        duration_days: Math.max(1, Number(r.duration_days || 1)),
        assignments: (r.assignments || []).map((a) => ({
          title: a.title,
          link: a.link,
          due_in_days: Math.max(1, Number(a.due_in_days || 1)),
        })),
      })),
      notifications: updatedNotifications,
    };
    localStorage.setItem(userKey, JSON.stringify(newData));
  };

  const toggleComplete = (index) => {
    setRoadmap((prevRoadmap) => {
      const updated = prevRoadmap.map((step, i) =>
        i === index ? { ...step, completed: !step.completed } : step
      );

      const toggled = updated[index];

      const newNotification = {
        message: toggled.completed
          ? `🎉 You completed Step ${index + 1}: "${toggled.step}"!`
          : `🔁 Step ${index + 1}: "${toggled.step}" marked incomplete.`,
        type: toggled.completed ? "milestone" : "reminder",
        timestamp: new Date().toISOString(),
        link: toggled.assignments?.[0]?.link || "#",
      };

      const newNotifs = [newNotification, ...notifications];
      setNotifications(newNotifs);

      updateLocalStorage(updated, newNotifs);
      return updated;
    });
  };

  if (!roadmap.length) {
    return (
      <div className="text-center mt-20 text-gray-400 text-lg">
        No roadmap found. Go to your profile and click{" "}
        <span className="text-indigo-400 font-semibold">“Analyze (AI)”</span> ✓
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-10 py-10 min-h-screen
      bg-gradient-to-b from-[#09091a] to-[#0e0e25] text-white">

      <div className="text-center mb-12">
        <div className="flex justify-center items-center gap-3">
          <FaMapSigns className="text-4xl text-green-400" />
          <h1 className="text-4xl font-extrabold bg-gradient-to-r
            from-green-400 to-indigo-500 bg-clip-text text-transparent">
            Your AI Roadmap
          </h1>
        </div>

        <p className="text-gray-400 mt-2 text-sm">
          Your personalized journey — step by step 🚀
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1  
          bg-gradient-to-b from-green-400 via-indigo-500 to-purple-500 rounded-full" />

        {roadmap.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className={`relative flex items-center mb-12 ${i % 2 === 0 ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 
                border-4 rounded-full z-20 shadow-xl transition-all duration-500
                ${step.completed ? "bg-green-500 border-green-300 animate-pulse" : "bg-indigo-500 border-indigo-200"}`}
            >
              {step.completed && (
                <FaCheckCircle className="text-white absolute inset-0 m-auto w-5 h-5" />
              )}
            </div>

            <div
              onClick={() => toggleComplete(i)}
              className={`w-1/2 p-6 rounded-3xl shadow-xl border cursor-pointer
                bg-black/60 backdrop-blur-md transition hover:scale-105
                ${i % 2 === 0 ? "mr-auto text-right border-indigo-600/40" : "ml-auto text-left border-green-400/40"}`}
            >
              <h2 className="text-xl font-semibold bg-gradient-to-r from-green-300 to-indigo-400 bg-clip-text text-transparent mb-1">
                {i + 1}. {step.step}
              </h2>

              <p className="text-gray-300 text-sm mb-3">
                {step.description}
              </p>

              {step.assignments?.length > 0 && (
                <ul className="text-gray-400 text-sm mb-3 list-disc list-inside">
                  {step.assignments.map((a, idx) => (
                    <li key={idx}>
                      <a
                        href={a.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:underline"
                      >
                        {a.title}
                      </a>{" "}
                      (Due in {a.due_in_days} days)
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FaRegClock className="text-indigo-400" />
                <span>
                  {step.duration_days} days |{" "}
                  {step.startDate.toLocaleDateString()} -{" "}
                  {step.endDate.toLocaleDateString()}
                </span>
              </div>

              {step.completed && (
                <p className="text-green-400 mt-2 text-sm font-semibold">
                  ✓ Completed
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Roadmap;
