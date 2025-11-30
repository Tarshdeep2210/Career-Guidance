import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const ChangeName = () => {
  const { changeName } = useAuth();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await changeName(name);
      setMessage("Name updated successfully ✅");
      setName("");
    } catch (err) {
      setMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Enter new name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 rounded-xl bg-black/50 text-white outline-none"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 rounded-xl bg-violet-700 text-white font-semibold"
      >
        {loading ? "Updating..." : "Change Name"}
      </button>
      {message && <p className="text-white/80">{message}</p>}
    </form>
  );
};

export default ChangeName;
