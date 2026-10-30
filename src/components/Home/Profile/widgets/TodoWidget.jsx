import React, { useState, useEffect, memo } from "react";
import GlassWidgetCard from "./GlassWidgetCard";
import { CheckCircle2, Circle, ListTodo, Plus, X } from "lucide-react";

const STORAGE_KEY = "portfolio_todo_list";

const DEFAULT_TASKS = [
  { id: "1", title: "Review portfolio projects", done: true },
  { id: "2", title: "Listen to playlist in Music tab", done: false },
  { id: "3", title: "Reach out via Contact page", done: false },
];

function TodoWidget() {
  const [tasks, setTasks] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        // Fallback to default tasks
      }
    }
    return DEFAULT_TASKS;
  });

  const [inputVal, setInputVal] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (e) {
        // Ignore storage errors
      }
    }
  }, [tasks]);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const removeTask = (id, e) => {
    e.stopPropagation();
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed) return;

    const newTask = {
      id: Date.now().toString(),
      title: trimmed,
      done: false,
    };

    setTasks((prev) => [newTask, ...prev]);
    setInputVal("");
  };

  const completedCount = tasks.filter((t) => t.done).length;

  return (
    <GlassWidgetCard className="p-3 sm:p-3.5 flex flex-col justify-between h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.08] shrink-0">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase text-white/50 whitespace-nowrap">
          <ListTodo size={11} className="text-white" />
          <span>TODO LIST</span>
        </div>
        <span className="text-[9px] text-white/90 font-medium bg-white/10 px-1.5 py-0.5 rounded border border-white/20 tabular-nums">
          {completedCount}/{tasks.length} Done
        </span>
      </div>

      {/* Task List (Scrollable without breaking the Bento cell) */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 py-1.5 pr-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[10px] text-white/35 italic">
            No tasks yet. Add one below!
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="flex items-center justify-between gap-1.5 text-[10px] cursor-pointer group/item select-none p-1 rounded-md hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {task.done ? (
                  <CheckCircle2
                    size={12}
                    className="text-white shrink-0 transition-transform group-hover/item:scale-110"
                  />
                ) : (
                  <Circle
                    size={12}
                    className="text-white/35 shrink-0 transition-transform group-hover/item:scale-110 group-hover/item:text-white/70"
                  />
                )}
                <span
                  className={`leading-snug truncate transition-all ${
                    task.done
                      ? "line-through text-white/35"
                      : "text-white/85 group-hover/item:text-white"
                  }`}
                  title={task.title}
                >
                  {task.title}
                </span>
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => removeTask(task.id, e)}
                title="Remove task"
                className="w-4 h-4 rounded flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover/item:opacity-100 shrink-0 cursor-pointer"
              >
                <X size={10} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Task Input Form */}
      <form
        onSubmit={handleAddTask}
        className="pt-1.5 border-t border-white/[0.08] flex items-center gap-1.5 shrink-0"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Add task... (Press Enter)"
          className="flex-1 min-w-0 bg-white/[0.06] hover:bg-white/[0.09] focus:bg-white/[0.12] border border-white/[0.10] focus:border-white/40 rounded-lg px-2 py-1 text-[10px] text-white placeholder-white/35 outline-none transition-all shadow-inner"
        />
        <button
          type="submit"
          disabled={!inputVal.trim()}
          title="Add task"
          className="w-6 h-6 rounded-lg bg-white hover:bg-white/90 active:scale-95 text-zinc-950 flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none shrink-0 shadow-sm"
        >
          <Plus size={11} strokeWidth={2.5} />
        </button>
      </form>
    </GlassWidgetCard>
  );
}

export default memo(TodoWidget);

