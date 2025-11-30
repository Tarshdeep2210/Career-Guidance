import React, { useState, useEffect } from "react";

const quotes = [
  "Keep pushing forward — your success story is loading!",
  "Every small step brings you closer to your goal.",
  "Consistency beats talent when talent doesn’t work hard.",
  "Believe in yourself and all that you are capable of.",
  "Success is the sum of small efforts repeated daily.",
];

const MotivationCard = ({ progress = 68, size = 140 }) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setFade(true);
      }, 500);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const safeProgress = Number(progress) || 0;
  const getColor = (value) =>
    value < 40 ? "#F87171" : value < 70 ? "#FBBF24" : "#10B981";
  const radius = 15.9155;
  const dashArray = 100;
  const dashOffset = dashArray - (dashArray * safeProgress) / 100;

  return (
    <div className="relative bg-black/70 backdrop-blur-md border border-violet-500 rounded-3xl shadow-2xl p-8 max-w-full sm:max-w-md mx-auto overflow-hidden transform transition hover:scale-105">
      <span className="absolute top-4 left-5 w-3 h-3 bg-green-400 rounded-full animate-bounce opacity-70"></span>
      <span className="absolute top-8 right-6 w-2 h-2 bg-violet-400 rounded-full animate-ping opacity-60"></span>

      <h2 className="text-2xl md:text-3xl font-bold text-violet-400 mb-4 text-center">
        Daily Motivation
      </h2>

      <p
        className={`text-white text-lg italic mb-6 transition-opacity duration-500 text-center ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        "{quotes[quoteIndex]}"
      </p>

      <div className="relative mx-auto mb-4" style={{ width: size, height: size }}>
        <svg viewBox="0 0 36 36" className="w-full h-full">
          <path
            className="text-white/20"
            d={`M18 2.0845 a ${radius} ${radius} 0 1 1 0 31.831 a ${radius} ${radius} 0 1 1 0 -31.831`}
            fill="none"
            strokeWidth="3.5"
          />
          <path
            d={`M18 2.0845 a ${radius} ${radius} 0 1 1 0 31.831 a ${radius} ${radius} 0 1 1 0 -31.831`}
            fill="none"
            stroke={getColor(safeProgress)}
            strokeWidth="3.5"
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
          <text
            x="18"
            y="20.35"
            className="fill-white font-bold text-sm"
            textAnchor="middle"
          >
            {safeProgress}%
          </text>
        </svg>
      </div>

      <p className="text-white font-medium text-center">
        You're <span className="font-bold text-green-400">{safeProgress}%</span> along your path — keep going!
      </p>
    </div>
  );
};

export default MotivationCard;
