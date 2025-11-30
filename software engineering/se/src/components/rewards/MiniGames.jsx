import React, { useEffect, useState } from "react";
import { FaBolt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function MiniGames({ onClose, availableGames = [], pushReward }) {
  const { user } = useAuth();
  const uid = user?.id || "guest";
  const LOCAL_KEY = `unlockedRewards_${uid}`;

  const persistReward = (reward) => {
    const saved = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
    if (!saved.find((r) => r.id === reward.id)) {
      const next = [...saved, reward];
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("storage"));
      return next;
    }
    return saved;
  };

  const [mode, setMode] = useState(availableGames[0] || "locked");
  const [target, setTarget] = useState(12);
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(Number(localStorage.getItem("minigame_score") || 0));
  const [message, setMessage] = useState("");

  useEffect(() => setMode(availableGames[0] || "locked"), [availableGames]);

  useEffect(() => {
    let t;
    if (running && timeLeft > 0) t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    else if (running && timeLeft === 0) { setRunning(false); setMessage("⏳ Time's up!"); }
    return () => clearInterval(t);
  }, [running, timeLeft]);

  useEffect(() => localStorage.setItem("minigame_score", String(score)), [score]);

  const startTap = () => { setClicks(0); setTimeLeft(15); setTarget(Math.floor(Math.random() * 11) + 8); setMessage(""); setRunning(true); };
  const handleClick = () => {
    if (!running) return;
    setClicks((c) => {
      const next = c + 1;
      if (next >= target) {
        setScore((s) => s + 1);
        setRunning(false);
        setMessage("🎉 You won!");
        const reward = { id: Date.now(), title: `Mini-Game Bonus (${mode})`, type: "tokens", timestamp: new Date().toISOString() };
        persistReward(reward);
        if (pushReward) pushReward(reward);
      }
      return next;
    });
  };

  if (!availableGames.length) {
    return (
      <div className="bg-[#0f1724] p-6 rounded-2xl text-white text-center">
        <h3 className="text-2xl font-semibold text-indigo-300"><FaBolt /> Mini Games</h3>
        <p className="text-gray-400 mt-4">No mini-games unlocked yet.</p>
        <button onClick={() => onClose && onClose()} className="mt-6 px-4 py-2 rounded bg-gray-700">Close</button>
      </div>
    );
  }

  return (
    <div className="bg-[#0f1724] p-6 rounded-2xl text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold text-indigo-300"><FaBolt /> Mini Games</h3>
        <div className="text-sm text-gray-400">Mode: <strong className="text-white">{mode}</strong></div>
      </div>

      <p className="text-gray-300 mb-4">Click the big button {target} times before the timer ends.</p>
      <div className="text-yellow-300 font-bold text-lg">Time: {timeLeft}s</div>
      <div className="text-green-300 font-bold text-lg">Clicks: {clicks}/{target}</div>

      <div className="flex gap-3 mt-4">
        <button onClick={handleClick} disabled={!running} className={`px-8 py-4 rounded-full font-bold text-black ${running ? "bg-indigo-500" : "bg-gray-600 cursor-not-allowed"}`}>CLICK</button>
        {!running ? (
          <button onClick={startTap} className="px-4 py-2 rounded-full bg-green-500 font-bold text-black">Start</button>
        ) : (
          <button onClick={() => setRunning(false)} className="px-4 py-2 rounded-full bg-yellow-500 font-bold text-black">Pause</button>
        )}
      </div>

      {message && <div className="mt-4 text-purple-300 font-semibold">{message}</div>}
      <div className="mt-4"><button onClick={() => onClose && onClose()} className="px-4 py-2 rounded bg-gray-700">Close</button></div>
    </div>
  );
}
