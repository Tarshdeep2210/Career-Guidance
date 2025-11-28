/* ---------------------- FRONTEND: Profile.jsx ---------------------- */
import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();

  // Unique key per logged user
  const userKey = useMemo(
    () => (user?.id ? `aiData_${user.id}` : "aiData_guest"),
    [user?.id]
  );

  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState("");

  const [profile, setProfile] = useState({
    age: "",
    education: "",
    skills: "",
    interests: "",
    careerGoal: "",
    completionTarget: "",
  });

  const [aiData, setAiData] = useState({
    suggestions: [],
    roadmap: [],
    notifications: [],
    top_resources: [],
  });

  /* ----------------------------
          LOAD PROFILE
  -----------------------------*/
  useEffect(() => {
    if (!user?.id) return;

    const load = async () => {
      try {
        const res = await api.get(`profile/${user.id}`);
        if (!res.data?.success) return;
        const data = res.data.profile;

        setProfile({
          age: data.age || "",
          education: data.education || "",
          skills: (data.skills || []).join(", "),
          interests: (data.interests || []).join(", "),
          careerGoal: data.careerGoal || "",
          completionTarget: data.completionTarget || "",
        });

        setAiData({
          suggestions: data.suggestions || [],
          roadmap: data.roadmap || [],
          notifications: data.notifications || [],
          top_resources: data.top_resources || [],
        });

        localStorage.setItem(userKey, JSON.stringify(data));
      } catch (err) {
        console.error("Profile load failed:", err);
      }
    };
    load();
  }, [user?.id, userKey]);

  /* ----------------------------
        SYNC AI DATA IN STORAGE
  -----------------------------*/
  useEffect(() => {
    if (aiData?.roadmap?.length >= 0) {
      localStorage.setItem(userKey, JSON.stringify(aiData));
    }
  }, [aiData, userKey]);

  /* ----------------------------
          INPUT HANDLING
  -----------------------------*/
  const handleChange = (e) =>
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  /* ----------------------------
            SAVE PROFILE
  -----------------------------*/
  const saveProfile = async () => {
    if (!user?.id) return alert("Not logged in");

    setLoading(true);
    setLoadingAction("save");

    try {
      const skills = profile.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const interests = profile.interests
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        userId: user.id,
        profile: {
          age: profile.age,
          education: profile.education,
          skills,
          interests,
          careerGoal: profile.careerGoal,
          completionTarget: Number(profile.completionTarget) || 0,
        },
      };

      const res = await api.post("profile/save", payload);

      if (res.data.success) {
        alert("Profile updated ✓");
      }
    } catch (e) {
      console.error(e);
      alert("Save failed");
    } finally {
      setLoading(false);
      setLoadingAction("");
    }
  };

  /* ----------------------------
             AI ANALYSIS
  -----------------------------*/
  const analyzeProfile = async () => {
    if (!user?.id) return alert("Not logged in");

    setLoading(true);
    setLoadingAction("analyze");

    try {
      const res = await api.post("profile/analyze", {
        userId: user.id,
        completionTarget: Number(profile.completionTarget) || 0,
      });

      if (!res.data?.success) {
        alert("AI failed");
        return;
      }

      const data = res.data.profile;

      setAiData({
        suggestions: data.suggestions || [],
        roadmap: data.roadmap || [],
        notifications: data.notifications || [],
        top_resources: data.top_resources || [],
      });

      localStorage.setItem(userKey, JSON.stringify(data));
      localStorage.setItem("profile_updated_at", String(Date.now()));

      alert("AI analysis updated ✓");
    } catch (err) {
      console.error(err);
      alert("AI failed");
    } finally {
      setLoading(false);
      setLoadingAction("");
    }
  };

  /* ----------------------------
              UI
  -----------------------------*/
  return (
    <div className="min-h-screen px-6 pt-24 pb-16 text-white bg-gradient-to-b from-[#09091a] to-[#0e0e25]">
      <h1 className="text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-green-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_22px_rgba(99,255,181,0.35)]">
        🎯 Your Profile
      </h1>

      <div className="p-[2px] rounded-3xl mb-10 bg-gradient-to-r from-green-500/40 via-indigo-500/40 to-purple-500/40 shadow-[0_0_25px_rgba(55,159,255,0.45)]">
        <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-6">
          <div className="grid gap-4">
            {[
              "age",
              "education",
              "skills",
              "interests",
              "careerGoal",
              "completionTarget",
            ].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field.replace(/([A-Z])/g, " $1")}
                value={profile[field]}
                onChange={handleChange}
                disabled={loading}
                className="p-3 rounded-2xl bg-black/50 text-white border border-indigo-500/40 focus:ring-2 focus:ring-green-400 shadow-[0_0_10px_rgba(66,150,255,0.15)] placeholder-white/30"
              />
            ))}
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={saveProfile}
              disabled={loading}
              className="px-5 py-2.5 rounded-2xl font-semibold bg-gradient-to-r from-green-500 to-green-700 shadow-[0_0_15px_rgba(0,255,102,0.35)] hover:scale-[1.03] transition"
            >
              {loading && loadingAction === "save" ? "Saving..." : "💾 Save"}
            </button>

            <button
              onClick={analyzeProfile}
              disabled={loading}
              className="px-5 py-2.5 rounded-2xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 shadow-[0_0_18px_rgba(105,52,255,0.35)] hover:scale-[1.03] transition"
            >
              {loading && loadingAction === "analyze"
                ? "Analyzing..."
                : "✨ Analyze (AI)"}
            </button>
          </div>
        </div>
      </div>

      {aiData.roadmap.length > 0 && (
        <div className="p-6 mt-4 rounded-3xl bg-black/40 backdrop-blur-xl border border-indigo-600/40 shadow-[0_0_25px_rgba(99,255,181,0.25)]">
          <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-green-300 to-indigo-300 bg-clip-text text-transparent">
            🧠 AI Summary
          </h2>

          <p className="text-white/70 mb-3">
            AI generated{" "}
            <span className="text-green-300 font-semibold">
              {aiData.roadmap.length}
            </span>{" "}
            roadmap steps,{" "}
            <span className="text-indigo-300 font-semibold">
              {aiData.notifications.length}
            </span>{" "}
            notifications, and{" "}
            <span className="text-purple-300 font-semibold">
              {aiData.top_resources.length}
            </span>{" "}
            resources.
          </p>

          <Link
            to="/home/roadmap"
            className="text-indigo-300 hover:text-purple-300 underline"
          >
            View your full roadmap →
          </Link>
        </div>
      )}
    </div>
  );
};

export default Profile;
