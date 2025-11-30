import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = ({ switchToSignup }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/home");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 md:p-10 rounded-xl shadow-xl w-full max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-700 text-center mb-4">
          Login to CareerPath
        </h1>
        <p className="text-gray-500 text-center mb-6 text-sm md:text-base">
          Enter your credentials to continue
        </p>

        {error && (
          <p className="text-red-600 text-center mb-4 text-sm md:text-base">{error}</p>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
          />
          <button
            type="submit"
            className="bg-indigo-700 text-white py-3 rounded-lg hover:bg-indigo-800 transition text-sm md:text-base"
          >
            Login
          </button>
        </form>

        <p className="text-sm md:text-base text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <span
            className="text-indigo-600 cursor-pointer hover:underline"
            onClick={switchToSignup}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
