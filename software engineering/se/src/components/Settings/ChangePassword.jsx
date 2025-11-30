import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const ChangePassword = () => {
  const { changePassword } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const msg = await changePassword(oldPassword, newPassword);
      setMessage(msg || "Password updated successfully ✅");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="password"
        placeholder="Old Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        className="w-full p-3 rounded-xl bg-black/50 text-white outline-none"
        required
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full p-3 rounded-xl bg-black/50 text-white outline-none"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 rounded-xl bg-violet-700 text-white font-semibold"
      >
        {loading ? "Updating..." : "Change Password"}
      </button>
      {message && <p className="text-white/80">{message}</p>}
    </form>
  );
};

export default ChangePassword;
