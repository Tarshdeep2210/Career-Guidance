import React, { useEffect, useState, useMemo, useRef } from "react";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { FaGift, FaGamepad, FaStar, FaBox, FaBolt } from "react-icons/fa";

import MiniGames from "../rewards/MiniGames";
import DailyQuotes from "../rewards/DailyQuotes";
import Activities from "../rewards/Activities";
import UnlockedRewards from "../rewards/UnlockedRewards";

import { useAuth } from "../../context/AuthContext";

// Reward templates & helpers
export const rewardTemplates = [
{ key: "xp", titleSuffix: "XP Bonus", icon: <FaStar className="text-2xl text-yellow-400" />, rarity: "common" },
{ key: "tokens", titleSuffix: "Game Tokens", icon: <FaGamepad className="text-2xl text-green-400" />, rarity: "uncommon" },
{ key: "theme", titleSuffix: "Theme Unlock", icon: <FaBox className="text-2xl text-pink-400" />, rarity: "rare" },
{ key: "surprise", titleSuffix: "Mystery Box", icon: <FaGift className="text-2xl text-purple-400" />, rarity: "legendary" },
];

export const rarityColor = (r) => {
switch (r) {
case "common": return "bg-gray-700 text-gray-200";
case "uncommon": return "bg-green-700 text-green-200";
case "rare": return "bg-indigo-700 text-indigo-200";
case "legendary": return "bg-gradient-to-r from-yellow-400 to-pink-500 text-black font-bold";
default: return "bg-gray-700 text-gray-200";
}
};

const UNLOCK_RULES = [
{ minCompleted: 1, games: ["tap-speed"], quotes: ["motivational"], activities: ["breath-1"] },
{ minCompleted: 3, games: ["memory-flip"], quotes: ["focus"], activities: ["walk-5"] },
{ minCompleted: 5, games: ["reaction-test"], quotes: ["confidence"], activities: ["gratitude"] },
{ minCompleted: 8, games: ["typing-test"], quotes: ["growth"], activities: ["challenge-of-day"] },
];

const Card = ({ children, className = "" }) => (

  <div className={`bg-black/70 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-indigo-600/10 transition hover:scale-105 ${className}`}>
    {children}
  </div>
);

export default function Rewards() {
const { user } = useAuth();
const userId = user?.id || "guest";

const KEY_UNLOCK = `unlockedRewards_${userId}`;
const KEY_AIDATA = `aiData_${userId}`;

const [roadmap, setRoadmap] = useState([]);
const [unlocked, setUnlocked] = useState([]);
const [activeModule, setActiveModule] = useState(null);
const [showConfetti, setShowConfetti] = useState(false);
const [lootOpen, setLootOpen] = useState(false);
const [lootResult, setLootResult] = useState(null);
const audioRef = useRef(null);

// Load roadmap
useEffect(() => {
const raw = localStorage.getItem(KEY_AIDATA);
if (!raw) return;
try {
const parsed = JSON.parse(raw);
setRoadmap(parsed.roadmap || []);
} catch {
setRoadmap([]);
}
}, [KEY_AIDATA]);

const completedCount = useMemo(() => roadmap.filter((s) => s.completed).length, [roadmap]);

const available = useMemo(() => {
const games = new Set();
const quotes = new Set();
const activities = new Set();
UNLOCK_RULES.forEach((r) => {
if (completedCount >= r.minCompleted) {
r.games.forEach((g) => games.add(g));
r.quotes.forEach((q) => quotes.add(q));
r.activities.forEach((a) => activities.add(a));
}
});
return { games: [...games], quotes: [...quotes], activities: [...activities] };
}, [completedCount]);

// Sync unlocked rewards
useEffect(() => {
const saved = JSON.parse(localStorage.getItem(KEY_UNLOCK) || "[]");
const updated = [...saved];
let added = false;


roadmap.forEach((step, idx) => {
  const tpl = rewardTemplates[idx % rewardTemplates.length];
  const newReward = {
    id: idx + 1,
    type: tpl.key,
    title: `${tpl.titleSuffix} — for "${step.step}"`,
    timestamp: new Date().toISOString(),
    rarity: tpl.rarity,
  };
  const exists = updated.some((r) => r.title === newReward.title && r.type === newReward.type);
  if (step.completed && !exists) {
    updated.push(newReward);
    added = true;
  } else if (!step.completed) {
    const i = updated.findIndex((r) => r.title === newReward.title && r.type === newReward.type);
    if (i !== -1) updated.splice(i, 1);
  }
});

localStorage.setItem(KEY_UNLOCK, JSON.stringify(updated));
setUnlocked(updated);

if (added) {
  setShowConfetti(true);
  audioRef.current?.play();
  setTimeout(() => setShowConfetti(false), 1800);
}


}, [roadmap, KEY_UNLOCK]);

const pushReward = (reward) => {
const saved = JSON.parse(localStorage.getItem(KEY_UNLOCK) || "[]");
if (saved.some((r) => r.title === reward.title && r.type === reward.type)) return;
const next = [...saved, reward];
localStorage.setItem(KEY_UNLOCK, JSON.stringify(next));
setUnlocked(next);
window.dispatchEvent(new Event("storage"));
setShowConfetti(true);
audioRef.current?.play();
setTimeout(() => setShowConfetti(false), 1500);
};

const openLoot = () => {
setLootOpen(true);
setLootResult(null);
setTimeout(() => {
const pool = ["common", "common", "common", "uncommon", "uncommon", "rare", "legendary"];
const pick = pool[Math.floor(Math.random() * pool.length)];
const tpl = rewardTemplates.find((t) => t.rarity === pick) || rewardTemplates[Math.floor(Math.random() * rewardTemplates.length)];
const generated = { id: Date.now(), type: tpl.key, title: `${tpl.titleSuffix} (Loot Box)`, timestamp: new Date().toISOString(), rarity: tpl.rarity };
pushReward(generated);
setLootResult(generated);
setTimeout(() => setLootOpen(false), 2400);
}, 900);
};

const nextThreshold = useMemo(() => {
if (completedCount < 3) return 3;
if (completedCount < 5) return 5;
if (completedCount < 8) return 8;
return completedCount + 3;
}, [completedCount]);

const percentToNext = Math.min(100, Math.round((completedCount / nextThreshold) * 100));

return ( <div className="min-h-screen p-8 bg-gradient-to-b from-[#09091a] to-[#0e0e25] text-white"> <audio ref={audioRef} src="/sounds/unlock.mp3" />
{showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

```
  {/* Header */}
  <Card className="mb-8 flex flex-col items-center text-center">
    <div className="flex items-center gap-3">
      <FaBolt className="text-4xl text-indigo-400" />
      <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-green-400 to-indigo-500 bg-clip-text text-transparent">
        Rewards & Fun Zone
      </h1>
    </div>
    <p className="text-gray-300 mt-2">
      Complete roadmap steps to unlock rewards — Completed: <strong>{completedCount}</strong>
    </p>
  </Card>

  {/* Main Grid */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
    <div className="lg:col-span-2">
      {/* Unlocked Rewards */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-green-300">Unlocked Rewards</h2>
          <div className="flex items-center gap-4">
            <button
              className="px-3 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-green-400 text-black font-semibold shadow-md hover:scale-105 transition"
              onClick={openLoot}
            >
              Open Loot Box
            </button>
          </div>
        </div>

        <UnlockedRewards
          unlocked={unlocked}
          removeReward={(id) => {
            const next = unlocked.filter((r) => r.id !== id);
            setUnlocked(next);
            localStorage.setItem(KEY_UNLOCK, JSON.stringify(next));
            window.dispatchEvent(new Event("storage"));
          }}
        />
      </Card>
    </div>

    {/* Right Side */}
    <aside className="flex flex-col gap-4">
      {["games", "quotes", "activities"].map((mod) => (
        <Card key={mod} className="text-center">
          <h3 className="text-lg font-semibold mb-2">{mod === "games" ? "Mini Games" : mod === "quotes" ? "Daily Quote" : "Activities"}</h3>
          <div className="text-sm text-gray-300 mb-3">Available: {available[mod].length}</div>
          <button
            className={`w-full px-4 py-2 rounded-full ${
              mod === "games" ? "bg-indigo-600 hover:bg-indigo-700" : mod === "quotes" ? "bg-green-600 hover:bg-green-700" : "bg-pink-600 hover:bg-pink-700"
            } transition`}
            onClick={() => setActiveModule(mod)}
          >
            {mod === "games" ? "Play" : mod === "quotes" ? "Open" : "View"}
          </button>
        </Card>
      ))}
      <Card className="text-center">
        <div className="text-sm text-gray-300 mb-2">Streak</div>
        <div className="text-xl font-bold text-yellow-300">🔥 {Math.min(14, completedCount)} days</div>
      </Card>
    </aside>
  </div>

  {/* Module Area */}
  <Card>
    {!activeModule && (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold text-gray-100">Choose a module</h3>
      </div>
    )}
    {activeModule === "games" && <MiniGames onClose={() => setActiveModule(null)} availableGames={available.games} pushReward={pushReward} />}
    {activeModule === "quotes" && <DailyQuotes onClose={() => setActiveModule(null)} availableTiers={available.quotes} />}
    {activeModule === "activities" && <Activities onClose={() => setActiveModule(null)} availableActivities={available.activities} pushReward={pushReward} />}
    {activeModule === "rewards" && (
      <div className="text-center">
        <h3 className="text-2xl font-bold text-yellow-300">Reward Details</h3>
        <button className="mt-6 px-4 py-2 rounded-full bg-yellow-400 text-black font-bold" onClick={() => setActiveModule(null)}>
          Close
        </button>
      </div>
    )}
  </Card>

  {/* Loot Box */}
  <AnimatePresence>
    {lootOpen && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="p-6 bg-gradient-to-r from-[#0b0b1a] to-[#1a0b1a] rounded-3xl shadow-2xl text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Loot Box Opening!</h2>
          {!lootResult ? (
            <p className="text-gray-400">Shuffling rewards...</p>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className={`p-6 rounded-xl ${rarityColor(lootResult.rarity)}`}>
                {rewardTemplates.find((t) => t.rarity === lootResult.rarity)?.icon}
              </div>
              <p className="text-lg font-semibold">{lootResult.title}</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
</div>


);
}
