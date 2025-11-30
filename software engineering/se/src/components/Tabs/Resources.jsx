import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { FaYoutube, FaBook, FaGlobe, FaLink } from "react-icons/fa";
import { PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

// Resource categories
const categories = {
  YouTube: { title: "YouTube Links", icon: <FaYoutube className="text-green-400" /> },
  "Book/PDF": { title: "Books / PDFs", icon: <FaBook className="text-indigo-300" /> },
  Website: { title: "Websites", icon: <FaGlobe className="text-purple-300" /> },
  "Online Course": { title: "Online Courses", icon: <FaBook className="text-green-300" /> },
};

export default function Resources() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null); // Full profile including age, interests
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  // Unique localStorage key per user
  const userKey = user ? `aiData_${user.id}` : "aiData_guest";

  // --- Load profile and resources ---
  useEffect(() => {
    if (!user?.id) return;

    const loadProfile = async () => {
      let data = null;

      // Try from localStorage first
      const cached = localStorage.getItem(userKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.top_resources?.length) data = parsed;
      }

      // If not in localStorage, fetch from backend
      if (!data) {
        try {
          const res = await api.get(`profile/${user.id}`);
          if (res.data.success) data = res.data.profile;
        } catch (err) {
          console.error("Failed to load profile:", err);
        }
      }

      if (data) {
        setProfile(data);
        setResources(data.top_resources || []);
        localStorage.setItem(userKey, JSON.stringify(data));
      }
    };

    loadProfile();
  }, [user?.id]);

  // --- Refresh AI resources ---
  const handleAIRefresh = async () => {
    if (!user?.id) return alert("Not logged in");

    setLoading(true);
    try {
      await api.post("profile/analyze", { userId: user.id });
      const res = await api.get(`profile/${user.id}`);
      if (res.data.success) {
        const updatedProfile = res.data.profile;
        setProfile(updatedProfile);
        setResources(updatedProfile.top_resources || []);
        localStorage.setItem(userKey, JSON.stringify(updatedProfile));
        alert("✅ AI resources updated!");
      }
    } catch (err) {
      console.error(err);
      alert("AI update failed");
    } finally {
      setLoading(false);
    }
  };

  // --- Group resources by category ---
  const knownTypes = Object.keys(categories).map((t) => t.toLowerCase());
  const grouped = {};
  const others = [];

  resources.forEach((r) => {
    const type = r.type?.toLowerCase();
    if (knownTypes.includes(type)) {
      const key = Object.keys(categories).find((k) => k.toLowerCase() === type);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(r);
    } else {
      others.push(r);
    }
  });

  return (
    <div className="px-4 lg:px-10 py-10 min-h-screen bg-gradient-to-b from-[#09091a] to-[#0e0e25] text-white">

      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-400 via-indigo-500 to-purple-400 bg-clip-text text-transparent drop-shadow-xl">
          📚 Career Resources Hub
        </h1>
        {profile && (
          <p className="text-gray-400 mt-2 text-sm">
            {profile.name ? `${profile.name}'s` : "Your"} AI-curated learning resources for{" "}
            {profile.age ? `${profile.age} y.o` : "all ages"} with interests in{" "}
            {profile.interests?.join(", ") || "various topics"} 🚀
          </p>
        )}
      </div>

      {/* RESOURCE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(categories).map(([type, info]) => (
          <motion.div key={type} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="bg-black/50 backdrop-blur-2xl rounded-3xl p-6 cursor-pointer hover:scale-[1.03] transition shadow-xl">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 bg-gradient-to-r from-green-300 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {info.icon} {info.title}
              </h2>
              {grouped[type]?.length ? (
                <ul className="space-y-2">
                  {grouped[type].map((r, i) => (
                    <li key={i}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:text-purple-300 underline flex items-center gap-1">
                        <FaLink /> {r.title}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 italic">No resources yet</p>
              )}
            </div>
          </motion.div>
        ))}

        {/* OTHERS */}
        {others.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="bg-black/50 backdrop-blur-2xl rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-green-300 mb-4">Other Resources</h2>
              <ul className="space-y-2">
                {others.map((r, i) => (
                  <li key={i}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-green-300 hover:text-indigo-300 underline flex items-center gap-1">
                      <FaLink /> {r.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>

      {/* REFRESH BUTTON */}
      <div className="text-center mt-12">
        <button
          onClick={handleAIRefresh}
          disabled={loading}
          className="mt-6 px-6 py-3 rounded-2xl font-semibold bg-gradient-to-r from-green-400 to-indigo-500 shadow-xl hover:scale-[1.03] transition flex items-center gap-2 mx-auto"
        >
          <PlusCircle /> {loading ? "Updating..." : "Refresh AI Links"}
        </button>
      </div>
    </div>
  );
}
