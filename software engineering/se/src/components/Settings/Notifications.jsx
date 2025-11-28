import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Notifications = () => {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(user?.notifications || false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const toggleNotification = async () => {
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/settings/notifications", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setEnabled(data.notifications);
        setMessage("Notification preference updated ✅");
      }
    } catch (err) {
      setMessage("Error updating notifications");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Notifications</h2>
      <p className="text-white/70">
        {enabled
          ? "You are currently receiving notifications."
          : "Notifications are turned off."}
      </p>
      <button
        onClick={toggleNotification}
        disabled={loading}
        className={`px-6 py-2 rounded-xl font-semibold ${
          enabled ? "bg-red-600 text-white" : "bg-green-600 text-white"
        }`}
      >
        {loading ? "Updating..." : enabled ? "Disable" : "Enable"} Notifications
      </button>
      {message && <p className="text-white/80">{message}</p>}
    </div>
  );
};

export default Notifications;
