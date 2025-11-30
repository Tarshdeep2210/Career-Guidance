import { FaGift, FaGamepad, FaStar, FaBox } from "react-icons/fa";

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
