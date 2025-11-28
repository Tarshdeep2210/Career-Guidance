import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaBell,
  FaRocket,
  FaLightbulb,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";    // 👈 IMPORTANT

const typeIcons = {
  milestone: <FaRocket className="text-green-400 drop-shadow-[0_0_6px_#34d399]" />,
  reminder: <FaClock className="text-yellow-400 drop-shadow-[0_0_6px_#facc15]" />,
  motivation: <FaLightbulb className="text-indigo-400 drop-shadow-[0_0_6px_#6366f1]" />,
  alert: <FaBell className="text-red-400 drop-shadow-[0_0_6px_#ef4444]" />,
  actionable: <FaArrowRight className="text-blue-400 drop-shadow-[0_0_6px_#3b82f6]" />,
};

const Notifications = () => {
  const { user } = useAuth();                          // 👈 get current user
  const userId = user?.id || "guest";
  const LOCAL_AIDATA = `aiData_${userId}`;             // 👈 MULTI USER KEY

  const [notifications, setNotifications] = useState([]);

  // Initial load
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(LOCAL_AIDATA));
    if (data?.notifications) setNotifications(data.notifications);
  }, [LOCAL_AIDATA]);

  // Listen for sync updates
  useEffect(() => {
    const handleStorageChange = () => {
      const data = JSON.parse(localStorage.getItem(LOCAL_AIDATA));
      if (data?.notifications) setNotifications(data.notifications);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [LOCAL_AIDATA]);

  // Highlight clickable URLs
  const renderMessage = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, idx) =>
      urlRegex.test(part) ? (
        <a
          key={idx}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline hover:text-blue-300"
        >
          {part}
        </a>
      ) : (
        <span key={idx}>{part}</span>
      )
    );
  };

  if (!notifications.length)
    return (
      <div className="text-center text-gray-400 mt-20 text-lg">
        No AI notifications yet. Complete roadmap steps to see updates ✨
      </div>
    );

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-b from-[#09091a] to-[#0e0e25] text-white">
      <div className="relative max-w-5xl mx-auto">
        <div className="absolute inset-0 p-[2px] rounded-3xl bg-gradient-to-b from-[#0e0e25] to-[#141434]" />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-black/30 backdrop-blur-xl rounded-3xl p-10 shadow-xl"
        >
          <h2
            className="
              text-center text-4xl font-extrabold mb-12
              bg-gradient-to-r from-green-400 to-indigo-500
              bg-clip-text text-transparent
              drop-shadow-[0_0_12px_rgba(99,102,241,0.5)]
              flex items-center justify-center gap-3
            "
          >
            <FaBell className="text-indigo-400" />
            AI Notifications
          </h2>

          <div className="space-y-5">
            {notifications.map((n, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="
                  flex items-center justify-between gap-4
                  p-5 rounded-2xl bg-black/40 backdrop-blur-xl
                  border border-indigo-500/20
                  hover:border-indigo-400/40
                  shadow-[0_0_25px_rgba(79,70,229,0.25)]
                  hover:shadow-[0_0_35px_rgba(99,102,241,0.35)]
                  transition-all
                "
              >
                <div className="flex items-center gap-4">
                  {typeIcons[n.type] || (
                    <FaBell className="text-indigo-400 drop-shadow-[0_0_6px_#6366f1]" />
                  )}

                  <div>
                    <p className="text-gray-200 leading-relaxed">
                      {renderMessage(n.message)}
                    </p>
                    <p className="text-xs text-gray-500 capitalize mt-1">
                      {n.type}
                    </p>
                  </div>
                </div>

                {n.link && (
                  <a
                    href={n.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex items-center gap-1 
                      text-blue-400 
                      font-medium 
                      hover:underline 
                      hover:text-blue-300
                    "
                  >
                    Go <FaArrowRight />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Notifications;
