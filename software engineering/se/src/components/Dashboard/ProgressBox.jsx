import React, { useState, useEffect } from "react";

const ProgressBox = ({ progress = 65 }) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = progress;
    const stepTime = 15;
    const increment = end / (1000 / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setDisplayProgress(Math.round(start));
    }, stepTime);

    return () => clearInterval(timer);
  }, [progress]);

  return (
    <div className="bg-black/70 backdrop-blur-md p-6 rounded-3xl shadow-2xl transition hover:scale-105 w-full">
      <h3 className="text-xl font-semibold mb-4 text-green-400">Preparation Progress</h3>

      <div className="relative w-full h-6 rounded-full bg-gray-700 overflow-hidden">
        <div
          className="absolute h-full rounded-full transition-all duration-700 bg-gradient-to-r from-violet-500 via-green-400 to-indigo-500 shadow-lg"
          style={{ width: `${displayProgress}%` }}
        ></div>

        <div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-green-400 shadow-md"
          style={{ left: `${displayProgress}%` }}
        ></div>
      </div>

      <p className="text-white mt-3 font-medium text-center">
        {displayProgress}% completed
      </p>
    </div>
  );
};

export default ProgressBox;
