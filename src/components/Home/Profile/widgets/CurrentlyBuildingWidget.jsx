import React, { useState, memo } from "react";
import GlassWidgetCard from "./GlassWidgetCard";
import { CheckCircle2, Circle, ListTodo } from "lucide-react";

function CurrentlyBuildingWidget() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Liquid Glass Portfolio", done: true },
    { id: 2, title: "WebGL Audio Visualizer", done: false },
    { id: 3, title: "Serverless Microservices", done: false },
  ]);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.done).length;

  return (
    <GlassWidgetCard className="p-3 sm:p-3.5 flex flex-col justify-between h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 border-b border-white/[0.08] mb-0.5">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase text-white/50 whitespace-nowrap">
          <ListTodo size={11} className="text-[#0A84FF]" />
          <span>CURRENTLY BUILDING</span>
        </div>
        <span className="text-[9px] text-[#0A84FF] font-medium bg-[#0A84FF]/10 px-1.5 py-0.5 rounded border border-[#0A84FF]/20">
          {completedCount}/{tasks.length} Done
        </span>
      </div>

      {/* Reminders Checklist */}
      <div className="my-auto py-1 space-y-1.5">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="flex items-center gap-2 text-[10px] cursor-pointer group/item select-none"
          >
            {task.done ? (
              <CheckCircle2
                size={13}
                className="text-[#0A84FF] shrink-0 transition-transform group-hover/item:scale-110"
              />
            ) : (
              <Circle
                size={13}
                className="text-white/35 shrink-0 transition-transform group-hover/item:scale-110 group-hover/item:text-white/70"
              />
            )}
            <span
              className={`leading-snug transition-all ${
                task.done
                  ? "line-through text-white/40"
                  : "text-white/85 group-hover/item:text-white"
              }`}
            >
              {task.title}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-1.5 border-t border-white/[0.08] flex items-center justify-between text-[8.5px] text-white/40 shrink-0">
        <span>macOS Reminders</span>
        <span className="text-white/40">Active Queue</span>
      </div>
    </GlassWidgetCard>
  );
}

export default memo(CurrentlyBuildingWidget);
