import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Layout from "./Layout/Layout1";

const CareerChatbotPage = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I can help you with career and technical queries." },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await axios.post("http://localhost:8000/api/chatbot", { message: input });
      setMessages((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Server error. Try again later." },
      ]);
    }
  };

  return (
    <Layout showSidebar={true} >
    <div className="flex flex-col w-full h-[80vh] bg-black/90 rounded-2xl shadow-lg mx-auto overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gray-900 border-b border-gray-700 text-lg font-bold text-center">
        🎯 Career Guidance Chatbot
      </div>

      {/* Chat */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
            <p
              className={`p-2 max-w-[75%] break-words rounded-xl text-sm sm:text-base ${
                m.sender === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-gray-700 text-white rounded-bl-none"
              }`}
            >
              {m.text}
            </p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="flex flex-col sm:flex-row p-2 bg-gray-900 border-t border-gray-700 gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded-xl border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={sendMessage}
          className="p-2 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold"
        >
          Send
        </button>
      </div>
    </div>
    </Layout>
  );
};

export default CareerChatbotPage;
