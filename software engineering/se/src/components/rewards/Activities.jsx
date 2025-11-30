import React, { useEffect, useState } from "react";
import { FaTasks, FaCheck } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const ALL_ACTIVITIES = {
  "breath-1": { id: "a1", title: "1 min Deep Breath" },
  "walk-5": { id: "a2", title: "5 min Walk Break" },
  "gratitude": { id: "a3", title: "Write 3 Things You're Grateful For" },
  "challenge-of-day": { id: "a4", title: "Daily Challenge" },
};

export default function Activities({ onClose, availableActivities = [], pushReward }) {
  const { user } = useAuth();
  const uid = user?.id;
  if (!uid) return <div className="text-white p-4">Login required</div>;

  const KEY_PROGRESS = `activitiesProgress_${uid}`;
  const KEY_UNLOCK = `unlockedRewards_${uid}`;

  const [progress, setProgress] = useState(() => {
    const raw = localStorage.getItem(KEY_PROGRESS);
    return raw ? JSON.parse(raw) : {};
  });

  useEffect(() => {
    localStorage.setItem(KEY_PROGRESS, JSON.stringify(progress));

    const allDone = availableActivities.every((k) => progress[ALL_ACTIVITIES[k]?.id]);

    if (allDone && availableActivities.length) {
      const reward = {
        id: `${uid}_bonus_${Date.now()}`,
        title: "Activities Completion Bonus",
        type: "surprise",
        timestamp: new Date().toISOString(),
      };

      const saved = JSON.parse(localStorage.getItem(KEY_UNLOCK) || "[]");
      if (!saved.find((r) => r.id === reward.id)) {
        const next = [...saved, reward];
        localStorage.setItem(KEY_UNLOCK, JSON.stringify(next));
        window.dispatchEvent(new Event("storage"));
        if (pushReward) pushReward(reward);
      }
    }
  }, [progress, availableActivities]);

  const visible = availableActivities.map((k) => ALL_ACTIVITIES[k]).filter(Boolean);

  const toggle = (id) => setProgress((prev) => ({ ...prev, [id]: !prev[id] }));
  const resetAll = () => setProgress({});

  if (!visible.length) {
    return (
      <div className="bg-[#081226] p-6 rounded-2xl text-white text-center">
        <h3 className="text-2xl font-semibold text-pink-300"><FaTasks /> Activities</h3>
        <p className="text-gray-400 mt-4">No activities unlocked yet.</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 rounded bg-gray-700">Close</button>
      </div>
    );
  }

  return (
    <div className="bg-[#081226] p-6 rounded-2xl text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold text-pink-300 flex items-center gap-2"><FaTasks /> Activities</h3>
        <button onClick={resetAll} className="text-sm text-gray-400 hover:text-gray-200">Reset</button>
      </div>

      <ul className="space-y-3 mb-4">
        {visible.map((a) => (
          <li key={a.id} className="flex items-center justify-between bg-black/30 p-3 rounded">
            <div>
              <div className="font-semibold">{a.title}</div>
              <div className="text-xs text-gray-400">Small micro-activity to refresh your mind</div>
            </div>
            <button onClick={() => toggle(a.id)} className={`px-3 py-2 rounded-full font-bold transition ${progress[a.id] ? "bg-green-500 text-black" : "bg-gray-700 hover:bg-gray-600"}`}>
              {progress[a.id] ? <FaCheck /> : "Do"}
            </button>
          </li>
        ))}
      </ul>

      <div className="text-sm text-gray-300 mb-4">
        Completed: {Object.values(progress).filter(Boolean).length}/{visible.length}
      </div>

      <div className="flex gap-3">
        <button onClick={onClose} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">Close</button>
      </div>
    </div>
  );
}
