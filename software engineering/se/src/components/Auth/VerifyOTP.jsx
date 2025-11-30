import React, { useState } from "react";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setMessage("Please enter a 6-digit OTP.");
      return;
    }
    setMessage(`OTP ${otp} verified successfully!`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg flex flex-col space-y-4 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-indigo-600 text-center">Verify OTP</h1>
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-center tracking-widest text-lg"
        />
        {message && <p className="text-green-500 text-center">{message}</p>}
        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Verify
        </button>
      </form>
    </div>
  );
};

export default VerifyOTP;
