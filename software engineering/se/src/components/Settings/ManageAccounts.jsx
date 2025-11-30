import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const ManageAccounts = () => {
  const { user, activeAccount, switchAccount, logout } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user?.accounts) setAccounts(user.accounts);
  }, [user]);

  // Switch account
  const handleSwitch = async (id) => {
    try {
      const acct = await switchAccount(id);
      setMessage(`Switched to ${acct.name}`);
    } catch (err) {
      setMessage(err.message || "Failed to switch account");
    }
  };

  // Delete account
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/settings/delete-account/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setAccounts(accounts.filter((acc) => acc._id !== id));
      if (activeAccount?._id === id) logout();
      setMessage(data.message);
    } catch (err) {
      setMessage(err.message || "Failed to delete account");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Your Accounts</h2>
      {accounts.map((acc) => (
        <div
          key={acc._id}
          className="flex items-center justify-between p-3 bg-black/50 rounded-xl"
        >
          <div>
            <p className="text-white font-medium">{acc.name}</p>
            <p className="text-white/60 text-sm">{acc.email}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSwitch(acc._id)}
              className={`px-3 py-1 rounded-xl text-sm ${
                activeAccount?._id === acc._id
                  ? "bg-green-600 text-white"
                  : "bg-violet-700 text-white hover:bg-violet-800"
              }`}
            >
              {activeAccount?._id === acc._id ? "Active" : "Switch"}
            </button>
            <button
              onClick={() => handleDelete(acc._id)}
              className="px-3 py-1 rounded-xl bg-red-600 text-white text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      {message && <p className="text-white/80">{message}</p>}
    </div>
  );
};

export default ManageAccounts;
