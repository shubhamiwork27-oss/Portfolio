/**
 * Profile Configuration File
 * All user-editable details live here.
 */

export const PROFILE_CONFIG = {
  name: "Shubham Idnani",
  eyebrow: "Hi, I'm",
  tagline: "Building digital experiences with code, design & motion.",
  roles: [
    "Full-Stack Developer",
    "UI Tinkerer",
    "Problem Solver",
    "Motion Enthusiast",
  ],
  status: "Open to work",
  location: "Bhopal, India",
  timezone: "Asia/Kolkata", // e.g. IST (UTC+5:30)

  // 3 short lines Apple Notes style bio
  bioTitle: "About Me",
  bio: [
    "Computer Science engineer passionate about tactile web apps & interactions.",
    "Specializing in performant full-stack systems with thoughtful motion.",
    "Driven by curiosity, clean code craftsmanship, and modern design.",
  ],

  // Numeric stats for CountUp animation & sparkline commits
  stats: [
    { label: "Years Exp", value: 2, suffix: "+" },
    { label: "Projects", value: 14, suffix: "" },
    { label: "Commits", value: 115, suffix: "+" },
  ],
  // 12-point sparkline activity points (representing recent weeks)
  sparklineData: [4, 7, 3, 9, 6, 12, 8, 14, 7, 11, 9, 13],

  // Now playing widget data
  nowPlaying: {
    track: "Verappa (Acoustic)",
    artist: "Anirudh Ravichander",
    durationSeconds: 220,
    initialProgressPercent: 42,
  },

  // 8 Brand tech stack tiles (React, Node, TS, Tailwind, MongoDB, Git, Figma, Next.js)
  techStack: [
    { name: "React", brandColor: "#61DAFB", tag: "Frontend" },
    { name: "Node.js", brandColor: "#5FA04E", tag: "Backend" },
    { name: "TypeScript", brandColor: "#3178C6", tag: "Language" },
    { name: "Tailwind", brandColor: "#06B6D4", tag: "Styling" },
    { name: "MongoDB", brandColor: "#47A248", tag: "Database" },
    { name: "Git", brandColor: "#F05032", tag: "VCS" },
    { name: "Figma", brandColor: "#F24E1E", tag: "Design" },
    { name: "Next.js", brandColor: "#FFFFFF", tag: "Framework" },
  ],

  // Reminders / Currently Building tasks
  currentlyBuildingList: [
    { id: 1, title: "Liquid Glass Portfolio", done: true },
    { id: 2, title: "WebGL Audio Visualizer", done: false },
    { id: 3, title: "Serverless Microservices", done: false },
  ],

  // GitHub contribution activity heatmap data
  github: {
    username: "shubhamiwork27-oss",
    totalContributions: "115 contributions this year",
  },
};
