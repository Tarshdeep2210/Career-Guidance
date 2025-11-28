import React, { useState } from "react";
import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";

const Landing = () => {
  const [page, setPage] = useState("choice"); // "choice", "login", "signup"

  const goToLogin = () => setPage("login");
  const goToSignup = () => setPage("signup");

  // Render Login/Signup directly if chosen
  if (page === "login") return <Login switchToSignup={goToSignup} />;
  if (page === "signup") return <Signup switchToLogin={goToLogin} />;

  // Default landing choice page
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-indigo-600 mb-6">Welcome to CareerPath</h1>
      <p className="text-gray-700 mb-8 text-center max-w-md">
        Plan, prepare, and succeed in your desired career path with guided roadmaps, resources, and mentorship.
      </p>
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={goToLogin}
          className="bg-indigo-600 text-white py-3 px-8 rounded-lg hover:bg-indigo-700 transition"
        >
          Login
        </button>
        <button
          onClick={goToSignup}
          className="bg-green-600 text-white py-3 px-8 rounded-lg hover:bg-green-700 transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Landing;
