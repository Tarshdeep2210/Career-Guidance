import React from "react";
import { FaCheckCircle, FaCircle } from "react-icons/fa";

const Checklist = ({ tasks, toggleTask }) => {
  if (!tasks?.length) {
    return (
      <div className="bg-[#141432] p-6 rounded-3xl shadow-lg text-center text-gray-400">
        No tasks found. Generate a roadmap first.
      </div>
    );
  }

  return (
    <div className="bg-[#141432] p-6 rounded-3xl shadow-lg flex flex-col gap-3">
      <h2 className="text-xl font-semibold mb-3 text-indigo-400">Checklist</h2>
      <ul className="space-y-2 max-h-80 overflow-y-auto scrollbar-custom">
        {tasks.map((task, idx) => (
          <li
            key={idx}
            onClick={() => toggleTask(idx)}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${
              task.completed
                ? "bg-green-600/20 hover:bg-green-600/30"
                : "bg-black/40 hover:bg-black/30"
            }`}
          >
            <div className="flex items-center gap-3">
              {task.completed ? (
                <FaCheckCircle className="text-green-400" />
              ) : (
                <FaCircle className="text-gray-400" />
              )}
              <span
                className={`text-white ${
                  task.completed ? "line-through text-gray-300" : ""
                }`}
              >
                {task.title}
              </span>
            </div>
            <span className="text-sm text-gray-400">{task.due}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Checklist;
