import * as LucideIcons from "lucide-react";
import { motion } from "framer-motion";

const Alumni = () => {
  const groups = [
    {
      name: "Telegram Group",
      url: "#",
      icon: (
        <LucideIcons.MessageSquare className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_#22d3ee]" />
      ),
    },
    {
      name: "Facebook Group",
      url: "#",
      icon: (
        <LucideIcons.Facebook className="w-6 h-6 text-blue-500 drop-shadow-[0_0_8px_#3b82f6]" />
      ),
    },
  ];

  const connectOptions = [
    {
      title: "Connect with Seniors / Peers",
      description: "Ask guidance or career advice anonymously in real-time.",
      icon: (
        <LucideIcons.Users className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_#34d399]" />
      ),
    },
    {
      title: "Success Stories",
      description: "Learn from real alumni journeys & achievements.",
      icon: (
        <LucideIcons.Star className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_8px_#facc15]" />
      ),
    },
    {
      title: "Mentorship Match",
      description: "Automatically get paired with alumni mentors.",
      icon: (
        <LucideIcons.Handshake className="w-6 h-6 text-purple-400 drop-shadow-[0_0_8px_#a855f7]" />
      ),
    },
  ];

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-b from-[#09091a] to-[#0e0e25] text-white">

      {/* Outer wrapper with gradient border – same as Roadmap theme */}
      <div className="relative max-w-6xl mx-auto">
        <div className="absolute inset-0 p-[2px] rounded-3xl bg-gradient-to-b from-[#0e0e25] to-[#141434]"></div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="
            relative
            bg-black/30 
            backdrop-blur-xl 
            rounded-3xl 
            p-10 
            shadow-xl 
          "
        >
          {/* Header (Matches Roadmap heading style) */}
          <h2
            className="
              text-center 
              text-4xl 
              font-extrabold 
              mb-12
              bg-gradient-to-r from-green-400 to-indigo-500
              bg-clip-text text-transparent
              drop-shadow-[0_0_12px_rgba(99,102,241,0.5)]
            "
          >
            🎓 Alumni Network
          </h2>

          {/* Groups */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {groups.map((group, idx) => (
              <motion.a
                key={idx}
                href={group.url}
                whileHover={{ scale: 1.05 }}
                className="
                  flex items-center gap-4 
                  p-5 
                  bg-black/40 
                  rounded-2xl 
                  border border-indigo-500/20 
                  hover:border-indigo-400/40 
                  shadow-[0_0_20px_rgba(79,70,229,0.25)]
                  transition-all
                "
              >
                {group.icon}
                <span className="text-white text-lg font-semibold tracking-wide">
                  {group.name}
                </span>
              </motion.a>
            ))}
          </div>

          {/* Connection Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {connectOptions.map((option, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{ scale: 1.06 }}
                className="
                  p-6
                  rounded-2xl
                  bg-black/40
                  backdrop-blur-xl
                  border border-green-400/20
                  hover:border-green-300/40
                  shadow-[0_0_25px_rgba(16,185,129,0.25)]
                  cursor-pointer
                  transition-all
                "
              >
                <div className="flex items-center gap-3 mb-4">
                  {option.icon}
                  <h3 className="text-white text-lg font-bold tracking-wide">
                    {option.title}
                  </h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {option.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Spotlight */}
          <div
            className="
              mt-14
              p-6
              rounded-2xl
              bg-black/40
              border border-indigo-600/30
              shadow-[0_0_20px_rgba(99,102,241,0.35)]
            "
          >
            <h3 className="text-indigo-300 text-xl font-semibold flex items-center gap-2">
              <LucideIcons.Megaphone className="w-6 h-6 text-indigo-400 drop-shadow-[0_0_6px_#6366f1]" />
              Alumni Spotlight
            </h3>
            <p className="text-gray-300 mt-3 text-sm leading-relaxed">
              Weekly highlights of alumni who shine in tech, research, business
              & creative fields. Stay inspired and follow proven career pathways.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Alumni;
