import { createContext, useContext, useState } from "react";

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  // Checklist: array of tasks with completion status
  const [checklist, setChecklist] = useState([
    { task: "Complete basic resources", done: false },
    { task: "Watch tutorial videos", done: false },
    { task: "Read recommended books", done: false },
  ]);

  // Roadmap milestones: array of {name, completed}
  const [milestones, setMilestones] = useState([
    { name: "Milestone 1", completed: false },
    { name: "Milestone 2", completed: false },
    { name: "Final Goal", completed: false },
  ]);

  // Preparation progress in %
  const completedTasks = checklist.filter((t) => t.done).length;
  const progress = Math.round((completedTasks / checklist.length) * 100);

  // Rewards unlocked based on milestones
  const rewards = milestones.filter((m) => m.completed).map((m) => m.name);

  const toggleTask = (index) => {
    const updated = [...checklist];
    updated[index].done = !updated[index].done;
    setChecklist(updated);

    // Auto-complete milestones based on tasks
    const milestoneUpdate = [...milestones];
    milestoneUpdate[0].completed = updated[0].done;
    milestoneUpdate[1].completed = updated[1].done;
    milestoneUpdate[2].completed = updated.every((t) => t.done);
    setMilestones(milestoneUpdate);
  };

  return (
    <DashboardContext.Provider
      value={{ checklist, toggleTask, milestones, progress, rewards }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
