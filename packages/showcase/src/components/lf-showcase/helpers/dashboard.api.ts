/**
 * Dashboard API utilities for fetching external data
 * Used by the showcase intro dashboard
 */

//#region Types
export interface GitHubRepoStats {
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  license: string;
  language: string;
  createdAt: string;
  updatedAt: string;
  description: string;
}

export interface GitHubRelease {
  tagName: string;
  name: string;
  body: string;
  publishedAt: string;
  author: {
    login: string;
    avatarUrl: string;
  };
  htmlUrl: string;
}

export interface GitHubContributor {
  login: string;
  avatarUrl: string;
  contributions: number;
  htmlUrl: string;
}

export interface NpmPackageStats {
  weeklyDownloads: number;
  monthlyDownloads: number;
  totalDownloads: number;
  version: string;
  lastPublished: string;
}

export interface BundleStats {
  size: number;
  gzip: number;
  dependencyCount: number;
}

export interface DashboardData {
  github: {
    repo: GitHubRepoStats | null;
    release: GitHubRelease | null;
    contributors: GitHubContributor[];
    commitActivity: number[];
  };
  npm: NpmPackageStats | null;
  bundle: BundleStats | null;
  fetchedAt: Date;
  errors: string[];
}
//#endregion

//#region Constants
const GITHUB_OWNER = "lucafoscili";
const GITHUB_REPO = "lf-widgets";
const NPM_PACKAGE = "@lf-widgets/core";
const CACHE_KEY = "lf-showcase-dashboard-data";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
//#endregion

//#region Cache utilities
interface CachedData {
  data: DashboardData;
  timestamp: number;
}

const getCache = (): DashboardData | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const parsed: CachedData = JSON.parse(cached);
    const now = Date.now();

    if (now - parsed.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return {
      ...parsed.data,
      fetchedAt: new Date(parsed.data.fetchedAt),
    };
  } catch {
    return null;
  }
};

const setCache = (data: DashboardData): void => {
  try {
    const cacheData: CachedData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch {
    // Silently fail if localStorage is unavailable
  }
};
//#endregion

//#region GitHub API
const fetchGitHubRepo = async (): Promise<GitHubRepoStats | null> => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`,
    );
    if (!response.ok) return null;

    const data = await response.json();
    return {
      stars: data.stargazers_count ?? 0,
      forks: data.forks_count ?? 0,
      watchers: data.watchers_count ?? 0,
      openIssues: data.open_issues_count ?? 0,
      license: data.license?.spdx_id ?? "Unknown",
      language: data.language ?? "TypeScript",
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      description: data.description ?? "",
    };
  } catch {
    return null;
  }
};

const fetchGitHubRelease = async (): Promise<GitHubRelease | null> => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`,
    );
    if (!response.ok) return null;

    const data = await response.json();
    return {
      tagName: data.tag_name ?? "",
      name: data.name ?? "",
      body: data.body ?? "",
      publishedAt: data.published_at ?? "",
      author: {
        login: data.author?.login ?? "Unknown",
        avatarUrl: data.author?.avatar_url ?? "",
      },
      htmlUrl: data.html_url ?? "",
    };
  } catch {
    return null;
  }
};

const fetchGitHubContributors = async (): Promise<GitHubContributor[]> => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contributors?per_page=10`,
    );
    if (!response.ok) return [];

    const data = await response.json();
    return data.map(
      (c: {
        login: string;
        avatar_url: string;
        contributions: number;
        html_url: string;
      }) => ({
        login: c.login,
        avatarUrl: c.avatar_url,
        contributions: c.contributions,
        htmlUrl: c.html_url,
      }),
    );
  } catch {
    return [];
  }
};

const fetchGitHubCommitActivity = async (): Promise<number[]> => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/stats/participation`,
    );
    if (!response.ok) return [];

    const data = await response.json();
    // Returns last 52 weeks of commit counts, we'll take last 12
    return (data.all ?? []).slice(-12);
  } catch {
    return [];
  }
};
//#endregion

//#region npm API
const fetchNpmStats = async (): Promise<NpmPackageStats | null> => {
  try {
    // Fetch download counts
    const downloadsResponse = await fetch(
      `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(NPM_PACKAGE)}`,
    );

    const monthlyResponse = await fetch(
      `https://api.npmjs.org/downloads/point/last-month/${encodeURIComponent(NPM_PACKAGE)}`,
    );

    // Fetch package info
    const packageResponse = await fetch(
      `https://registry.npmjs.org/${encodeURIComponent(NPM_PACKAGE)}`,
    );

    const weeklyData = downloadsResponse.ok
      ? await downloadsResponse.json()
      : null;
    const monthlyData = monthlyResponse.ok
      ? await monthlyResponse.json()
      : null;
    const packageData = packageResponse.ok
      ? await packageResponse.json()
      : null;

    if (!packageData) return null;

    const latestVersion = packageData["dist-tags"]?.latest ?? "";
    const versionData = packageData.versions?.[latestVersion];

    return {
      weeklyDownloads: weeklyData?.downloads ?? 0,
      monthlyDownloads: monthlyData?.downloads ?? 0,
      totalDownloads: 0, // Would need different API
      version: latestVersion,
      lastPublished:
        versionData?.time ?? packageData.time?.[latestVersion] ?? "",
    };
  } catch {
    return null;
  }
};
//#endregion

//#region Bundlephobia API
const fetchBundleStats = async (): Promise<BundleStats | null> => {
  try {
    const response = await fetch(
      `https://bundlephobia.com/api/size?package=${encodeURIComponent(NPM_PACKAGE)}`,
    );
    if (!response.ok) return null;

    const data = await response.json();
    return {
      size: data.size ?? 0,
      gzip: data.gzip ?? 0,
      dependencyCount: data.dependencyCount ?? 0,
    };
  } catch {
    return null;
  }
};
//#endregion

//#region Test environment detection
/**
 * Detects if running in Cypress test environment
 * Skips API calls to avoid rate limiting during automated tests
 */
const isTestEnvironment = (): boolean => {
  try {
    // Check for Cypress
    if (typeof window !== "undefined" && "Cypress" in window) {
      return true;
    }
    // Check for common test environment indicators
    if (
      typeof window !== "undefined" &&
      (window.location.href.includes("__cypress") || window.navigator.webdriver)
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

/**
 * Returns empty dashboard data for test environments
 */
const getEmptyDashboardData = (): DashboardData => ({
  github: {
    repo: null,
    release: null,
    contributors: [],
    commitActivity: [],
  },
  npm: null,
  bundle: null,
  fetchedAt: new Date(),
  errors: ["API calls skipped in test environment"],
});
//#endregion

//#region Main fetch function
export const fetchDashboardData = async (
  forceRefresh = false,
): Promise<DashboardData> => {
  // Skip API calls in test environments to avoid rate limiting
  if (isTestEnvironment()) {
    return getEmptyDashboardData();
  }

  // Check cache first
  if (!forceRefresh) {
    const cached = getCache();
    if (cached) return cached;
  }

  const errors: string[] = [];

  // Fetch all data in parallel
  const [repo, release, contributors, commitActivity, npm, bundle] =
    await Promise.all([
      fetchGitHubRepo().catch((): null => {
        errors.push("Failed to fetch GitHub repo stats");
        return null;
      }),
      fetchGitHubRelease().catch((): null => {
        errors.push("Failed to fetch GitHub release");
        return null;
      }),
      fetchGitHubContributors().catch((): GitHubContributor[] => {
        errors.push("Failed to fetch GitHub contributors");
        return [];
      }),
      fetchGitHubCommitActivity().catch((): number[] => {
        errors.push("Failed to fetch commit activity");
        return [];
      }),
      fetchNpmStats().catch((): null => {
        errors.push("Failed to fetch npm stats");
        return null;
      }),
      fetchBundleStats().catch((): null => {
        errors.push("Failed to fetch bundle stats");
        return null;
      }),
    ]);

  const data: DashboardData = {
    github: {
      repo,
      release,
      contributors,
      commitActivity,
    },
    npm,
    bundle,
    fetchedAt: new Date(),
    errors,
  };

  // Cache the results
  setCache(data);

  return data;
};
//#endregion

//#region Utility functions
export const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

export const calculateLibraryAge = (createdAt: string): string => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);

  if (years > 0) {
    return months > 0 ? `${years}y ${months}m` : `${years} years`;
  }
  return months > 0 ? `${months} months` : `${days} days`;
};

export const getRandomTip = (): { tip: string; icon: string } => {
  const tips = [
    {
      tip: "All components use Shadow DOM for style encapsulation",
      icon: "door",
    },
    {
      tip: "Use CSS custom properties to customize component appearance",
      icon: "palette",
    },
    {
      tip: "The framework is tree-shakeable - import only what you need",
      icon: "listTree",
    },
    {
      tip: "Every component emits typed events for easy integration",
      icon: "schema",
    },
    {
      tip: "Check out the 15+ built-in themes for quick styling",
      icon: "colorSwatch",
    },
    {
      tip: "Use the Debug service to monitor component lifecycles",
      icon: "bug",
    },
    {
      tip: "The Data service provides powerful dataset manipulation",
      icon: "schema",
    },
    {
      tip: "Ripple effects can be toggled with the lfRipple prop",
      icon: "droplet",
    },
  ];
  return tips[Math.floor(Math.random() * tips.length)];
};
//#endregion
