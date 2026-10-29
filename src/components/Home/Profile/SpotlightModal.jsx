import React, { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, FolderGit2, FileText, Mail, ExternalLink, X } from "lucide-react";

// Safe SVG Icons for GitHub and LinkedIn (avoids lucide-react CommonJS export error)
const GithubIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const SPOTLIGHT_ITEMS = [
  {
    id: "projects",
    title: "Projects",
    category: "Navigation",
    subtitle: "Browse featured web apps & experiments",
    icon: FolderGit2,
    action: (nav) => nav("Projects"),
  },
  {
    id: "resume",
    title: "Download Resume",
    category: "Document",
    subtitle: "View curriculum vitae (PDF)",
    icon: FileText,
    action: () => window.open("/resume", "_blank"),
  },
  {
    id: "contact",
    title: "Get in Touch",
    category: "Contact",
    subtitle: "Send a direct email or message",
    icon: Mail,
    action: (nav) => nav("Contact"),
  },
  {
    id: "github",
    title: "GitHub Profile",
    category: "External",
    subtitle: "@shubhamiwork27-oss (open-source repos)",
    icon: GithubIcon,
    action: () => window.open("https://github.com/shubhamiwork27-oss", "_blank"),
  },
  {
    id: "linkedin",
    title: "LinkedIn Profile",
    category: "External",
    subtitle: "Connect on LinkedIn",
    icon: LinkedinIcon,
    action: () => window.open("https://www.linkedin.com/in/shubhamidnani", "_blank"),
  },
];

function SpotlightModal({ isOpen, onClose, onNavigateTab }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filtered = SPOTLIGHT_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length)
      );
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      filtered[selectedIndex].action(onNavigateTab);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Spotlight Glass Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[560px] rounded-2xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.8)] border border-white/[0.18]"
            style={{
              backgroundColor: "rgba(22, 24, 30, 0.85)",
              backdropFilter: "blur(40px) saturate(190%)",
              WebkitBackdropFilter: "blur(40px) saturate(190%)",
              boxShadow:
                "inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 25px 60px rgba(0, 0, 0, 0.7)",
            }}
            onKeyDown={handleKeyDown}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.1]">
              <Search size={18} className="text-[#0A84FF] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Spotlight Search (Projects, Resume, Links)..."
                className="w-full bg-transparent border-none outline-none text-white text-sm placeholder-white/40"
              />
              <button
                type="button"
                onClick={onClose}
                className="w-6 h-6 rounded-full bg-white/[0.08] hover:bg-white/[0.15] flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <X size={12} />
              </button>
            </div>

            {/* List Results */}
            <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
              {filtered.length > 0 ? (
                filtered.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        item.action(onNavigateTab);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? "bg-[#0A84FF] text-white shadow-md"
                          : "text-white/80 hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? "bg-white/20 text-white" : "bg-white/[0.08] text-white/70"
                          }`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-medium truncate">
                            {item.title}
                          </div>
                          <div
                            className={`text-[10px] truncate ${
                              isSelected ? "text-white/80" : "text-white/45"
                            }`}
                          >
                            {item.subtitle}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span
                          className={`text-[9px] uppercase px-1.5 py-0.5 rounded ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-white/[0.05] text-white/40"
                          }`}
                        >
                          {item.category}
                        </span>
                        <ExternalLink
                          size={11}
                          className={isSelected ? "text-white" : "text-white/40"}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-white/40">
                  No matching items found.
                </div>
              )}
            </div>

            {/* Footer with Keyboard Hints */}
            <div className="px-4 py-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] text-white/40 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Open</span>
                <span>esc Close</span>
              </div>
              <span className="text-[#0A84FF]">macOS Spotlight</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default memo(SpotlightModal);
