import React from "react";
import { motion } from "framer-motion";
import { rewardTemplates, rarityColor } from "./RewardsHelpers"; // optionally move helpers here

export default function UnlockedRewards({ unlocked, removeReward }) {
if (!unlocked || unlocked.length === 0) {
return ( <div className="text-center py-4 text-gray-400">
No unlocked rewards yet. </div>
);
}

return ( <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
{unlocked.map((r, i) => {
const tpl = rewardTemplates.find((t) => t.key === r.type) || rewardTemplates[0];
return (
<motion.div
key={r.id + r.title}
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: i * 0.03 }}
className="p-4 rounded-xl border border-indigo-600/10 bg-black/50 flex items-center gap-4 hover:scale-105 transition cursor-pointer"
>
<div className={`w-14 h-14 rounded-lg flex items-center justify-center ${rarityColor(r.rarity)} shadow-inner`}>
{tpl.icon} </div> <div className="flex-1"> <div className="font-semibold text-white">{r.title}</div> <div className="text-sm text-gray-400">{new Date(r.timestamp).toLocaleDateString()}</div> </div>
<button
className="px-2 py-1 text-sm rounded-full bg-red-600 hover:bg-red-700"
onClick={() => removeReward(r.id)}
>
Remove </button>
</motion.div>
);
})} </div>
);
}
