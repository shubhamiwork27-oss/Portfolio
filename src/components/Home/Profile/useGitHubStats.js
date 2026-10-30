import { useState, useEffect } from "react";
import { PROFILE_CONFIG } from "./config";

const CACHE_KEY_PREFIX = "portfolio_gh_contributions_";
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

// In-memory cache & listeners for simultaneous mounting across widgets
let memoryCache = null;
let inFlightPromise = null;
const listeners = new Set();

function notifyListeners(data) {
  memoryCache = data;
  listeners.forEach((listener) => listener(data));
}

// Deterministic fallback grid for offline/initial render (7 rows x 20 cols)
export function getFallbackGrid(rows = 7, cols = 20) {
  const total = rows * cols;
  const grid = [];
  for (let i = 0; i < total; i++) {
    const val = (Math.sin(i * 12.9898 + 78.233) * 43758.5453) % 1;
    const absVal = Math.abs(val);
    let level = 0;
    if (absVal > 0.88) level = 3;
    else if (absVal > 0.65) level = 2;
    else if (absVal > 0.40) level = 1;
    grid.push({
      date: null,
      count: level,
      level,
      isFallback: true,
    });
  }
  return grid;
}

// Process API contributions into a 20-column x 7-row calendar ending at the end of the current week
export function processContributions(contributions, totalWeeks = 20) {
  if (!contributions || contributions.length === 0) return null;
  const all = [...contributions];
  const lastItem = all[all.length - 1];
  if (!lastItem?.date) return null;

  const [y, m, d] = lastItem.date.split("-").map(Number);
  const lastDayOfWeek = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0: Sun, 6: Sat

  // Pad the current week up to Saturday so calendar columns align consistently
  const padEnd = 6 - lastDayOfWeek;
  const padded = [...all];
  for (let i = 0; i < padEnd; i++) {
    padded.push({ date: null, count: 0, level: 0, future: true });
  }

  const totalCells = totalWeeks * 7;
  return padded.slice(-totalCells);
}

// Extract 12 weekly contribution totals from daily contributions for sparkline
export function extractWeeklySparkline(contributions, numWeeks = 12) {
  if (!Array.isArray(contributions) || contributions.length === 0) return null;
  const daysNeeded = numWeeks * 7;
  const slice = contributions.slice(-daysNeeded);
  const weekly = [];

  for (let i = 0; i < slice.length; i += 7) {
    const chunk = slice.slice(i, i + 7);
    const sum = chunk.reduce((acc, cur) => acc + (cur?.count || 0), 0);
    weekly.push(sum);
  }

  while (weekly.length < numWeeks) {
    weekly.unshift(0);
  }

  return weekly;
}

// Calculate velocity percentage from sparkline weekly points
export function calculateVelocityPercent(weeklyPoints) {
  if (!Array.isArray(weeklyPoints) || weeklyPoints.length === 0) return 75;
  const recentWeek = weeklyPoints[weeklyPoints.length - 1] ?? 0;
  const recent4Weeks = weeklyPoints.slice(-4);
  const avgRecent = recent4Weeks.reduce((a, b) => a + b, 0) / (recent4Weeks.length || 1);
  const peak = Math.max(...weeklyPoints, 1);
  const effective = Math.max(recentWeek, avgRecent);
  const raw = Math.round((effective / peak) * 100);
  return Math.min(100, Math.max(25, raw));
}

// Read saved cache from localStorage
function readSavedCache(cacheKey) {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(cacheKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (
        parsed &&
        Date.now() - parsed.timestamp < CACHE_TTL_MS &&
        Array.isArray(parsed.cells) &&
        parsed.cells.length === 140
      ) {
        return parsed;
      }
    }
  } catch (e) {
    // Ignore localStorage errors
  }
  return null;
}

// Fetch GitHub contributions & profile metadata
async function fetchAllGitHubStats(username, cacheKey, signal) {
  // 1. Fetch contributions from jogruber API
  const contribRes = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
    { signal }
  );

  if (!contribRes.ok) throw new Error(`HTTP ${contribRes.status}`);
  const contribData = await contribRes.json();

  const cells = processContributions(contribData.contributions, 20);
  if (!cells) throw new Error("No contributions data parsed");

  const total =
    contribData.total?.lastYear ??
    contribData.contributions?.reduce((sum, item) => sum + (item.count || 0), 0) ??
    0;

  const weeklySparkline =
    extractWeeklySparkline(contribData.contributions, 12) ||
    PROFILE_CONFIG.sparklineData;

  const velocityPercent = calculateVelocityPercent(weeklySparkline);

  // 2. Fetch public repos count from GitHub API (best-effort)
  let publicRepos = null;
  try {
    const userRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}`,
      { signal }
    );
    if (userRes.ok) {
      const userData = await userRes.json();
      if (typeof userData.public_repos === "number") {
        publicRepos = userData.public_repos;
      }
    }
  } catch (e) {
    // GitHub API rate limit or network error - non-critical
  }

  const payload = {
    cells,
    total,
    weeklySparkline,
    velocityPercent,
    publicRepos,
    recentWeekCommits: weeklySparkline[weeklySparkline.length - 1] ?? 0,
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem(cacheKey, JSON.stringify(payload));
  } catch (e) {
    // Ignore quota errors
  }

  return payload;
}

export function useGitHubStats() {
  const username = PROFILE_CONFIG.github?.username || "shubhamiwork27-oss";
  const cacheKey = `${CACHE_KEY_PREFIX}${username}`;

  const [data, setData] = useState(() => {
    if (memoryCache) return memoryCache;
    return readSavedCache(cacheKey);
  });

  const [isLoading, setIsLoading] = useState(!data);

  useEffect(() => {
    // If memoryCache updated elsewhere, sync immediately
    if (memoryCache && memoryCache !== data) {
      setData(memoryCache);
      setIsLoading(false);
    }

    const listener = (newData) => {
      setData(newData);
      setIsLoading(false);
    };
    listeners.add(listener);

    // If we already have fresh data, no need to refetch immediately
    if (data && Date.now() - (data.timestamp || 0) < CACHE_TTL_MS) {
      return () => listeners.delete(listener);
    }

    const controller = new AbortController();

    if (!inFlightPromise) {
      inFlightPromise = fetchAllGitHubStats(username, cacheKey, controller.signal)
        .then((result) => {
          inFlightPromise = null;
          notifyListeners(result);
          return result;
        })
        .catch((err) => {
          inFlightPromise = null;
          if (err.name !== "AbortError") {
            setIsLoading(false);
          }
        });
    }

    return () => {
      listeners.delete(listener);
      controller.abort();
    };
  }, [username, cacheKey]);

  return {
    username,
    isLoading,
    totalCommits: data?.total ?? null,
    sparklineData: data?.weeklySparkline ?? null,
    velocityPercent: data?.velocityPercent ?? 75,
    publicRepos: data?.publicRepos ?? null,
    recentWeekCommits: data?.recentWeekCommits ?? 0,
    cells: data?.cells ?? null,
    rawTotal: data?.total,
  };
}

