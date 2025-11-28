import React, { useEffect, useState } from "react";
import { FaRandom, FaSave } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const QUOTE_BANK = {
  motivational: ["Believe in yourself!", "You are capable of amazing things!", "Small steps every day."],
  focus: ["Focus on the next right thing.", "What you do today shapes tomorrow.", "Remove distractions."],
  confidence: ["You are skilled and getting better.", "Trust the work you put in."],
  growth: ["Mistakes are proofs that you tried.", "Growth comes from consistent practice."],
};

export default function DailyQuotes({ onClose, availableTiers = [] }) {
  const { user } = useAuth();
  const uid = user?.id || "guest";
  const LOCAL_FAV = `savedQuotes_${uid}`;

  const [quote, setQuote] = useState("");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(LOCAL_FAV) || "[]");
    setFavorites(saved);

    const tier = availableTiers.length ? availableTiers[availableTiers.length - 1] : "motivational";
    const bank = QUOTE_BANK[tier] || QUOTE_BANK["motivational"];
    const idx = new Date().getDate() % bank.length;
    setQuote(bank[idx]);
  }, [availableTiers, LOCAL_FAV]);

  const pickRandom = () => {
    const tier = availableTiers.length ? availableTiers[availableTiers.length - 1] : "motivational";
    const bank = QUOTE_BANK[tier] || QUOTE_BANK["motivational"];
    const idx = Math.floor(Math.random() * bank.length);
    setQuote(bank[idx]);
  };

  const saveFavorite = () => {
    const next = favorites.includes(quote) ? favorites : [...favorites, quote];
    setFavorites(next);
    localStorage.setItem(LOCAL_FAV, JSON.stringify(next));
  };

  const removeFavorite = (q) => {
    const next = favorites.filter((f) => f !== q);
    setFavorites(next);
    localStorage.setItem(LOCAL_FAV, JSON.stringify(next));
  };

  return (
    <div className="bg-[#071024] p-6 rounded-2xl text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold text-green-300">Daily Quote</h3>
        <div className="text-sm text-gray-400">Tier: {availableTiers.length ? availableTiers[availableTiers.length - 1] : "motivational"}</div>
      </div>

      <p className="text-xl text-gray-100 italic mb-4">“{quote}”</p>

      <div className="flex gap-3 mb-4">
        <button onClick={pickRandom} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 flex items-center gap-2"><FaRandom /> Random</button>
        <button onClick={saveFavorite} className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-black flex items-center gap-2"><FaSave /> Save</button>
        <button onClick={() => onClose && onClose()} className="px-4 py-2 rounded bg-gray-700">Close</button>
      </div>

      <div className="mt-4">
        <h4 className="text-lg font-semibold text-yellow-300 mb-2">Saved Quotes</h4>
        {favorites.length === 0 ? (
          <p className="text-gray-400">No saved quotes yet.</p>
        ) : (
          <ul className="space-y-2 text-gray-200">
            {favorites.map((f, i) => (
              <li key={i} className="flex justify-between items-center bg-black/30 p-3 rounded">
                <span>{f}</span>
                <button onClick={() => removeFavorite(f)} className="text-red-400 hover:text-red-500 px-2">Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
