import { useNavigate, useLocation } from "react-router-dom";
import { FaRobot } from "react-icons/fa";

const Chatbot = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide the floating button when on the chatbot page
  if (location.pathname === "/home/chatbot") return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => navigate("/home/chatbot")}
        className="p-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg flex items-center justify-center"
      >
        <FaRobot size={20} />
      </button>
    </div>
  );
};

export default Chatbot;
