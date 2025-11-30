import {
  LF_THEME_COLORS,
  LF_THEME_FONTS,
  LF_THEME_UI,
  LfArticleDataset,
  LfArticleNode,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { version as LF_WIDGETS_VERSION } from "../../../../package.json";
import { DOC_IDS, DOC_STYLES } from "./constants";
import {
  calculateLibraryAge,
  DashboardData,
  formatBytes,
  formatNumber,
  formatRelativeTime,
} from "./dashboard.api";

//#region Styles
export const DASHBOARD_STYLES = {
  // Grid layouts
  twoColumnGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "2em",
    margin: "2em 0",
  } as Record<string, string>,
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "1em",
    margin: "1.5em 0",
  } as Record<string, string>,
  contributorsGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75em",
    justifyContent: "center",
    margin: "1em 0",
  } as Record<string, string>,

  // Cards - glassmorphism style matching component cards
  statCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.5em 1em",
    borderRadius: "12px",
    background: `rgba(var(${LF_THEME_COLORS.surface}), var(${LF_THEME_UI.alphaGlass}))`,
    border: `1px solid rgba(var(${LF_THEME_COLORS.surface}), var(${LF_THEME_UI.alphaGlassSolid}))`,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
    minHeight: "120px",
  } as Record<string, string>,
  contributorCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1em",
    borderRadius: "12px",
    background: `rgba(var(${LF_THEME_COLORS.surface}), var(${LF_THEME_UI.alphaGlass}))`,
    border: `1px solid rgba(var(${LF_THEME_COLORS.surface}), var(${LF_THEME_UI.alphaGlassSolid}))`,
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    minWidth: "100px",
    transition: "transform 0.2s, border-color 0.2s",
  } as Record<string, string>,
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    marginBottom: "0.5em",
  } as Record<string, string>,

  // Typography
  statNumber: {
    fontSize: "2.5em",
    fontWeight: "700",
    fontFamily: `var(${LF_THEME_FONTS.familySecondary})`,
    color: `rgb(var(${LF_THEME_COLORS.onSurface}))`,
    lineHeight: "1.1",
    letterSpacing: "-0.02em",
  } as Record<string, string>,
  statLabel: {
    fontSize: "0.7em",
    color: `rgb(var(${LF_THEME_COLORS.onSurface}))`,
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginTop: "0.5em",
    textAlign: "center",
    opacity: "0.7",
    fontWeight: "500",
  } as Record<string, string>,
  sectionTitle: {
    fontSize: "1.25em",
    fontWeight: "600",
    fontFamily: `var(${LF_THEME_FONTS.familySecondary})`,
    color: `rgb(var(${LF_THEME_COLORS.primary}))`,
    justifyContent: "center",
    marginBottom: "0.5em",
    display: "flex",
    alignItems: "center",
    gap: "0.5em",
  } as Record<string, string>,
  heroTitle: {
    fontSize: "2.5em",
    fontWeight: "700",
    fontFamily: `var(${LF_THEME_FONTS.familySecondary})`,
    textAlign: "center",
    marginBottom: "0.25em",
    background: `linear-gradient(135deg, rgba(var(${LF_THEME_COLORS.primary}), var(${LF_THEME_UI.alphaGlass})), rgba(var(${LF_THEME_COLORS.secondary}), var(${LF_THEME_UI.alphaGlass})))`,
    webkitBackgroundClip: "text",
    webkitTextFillColor: "transparent",
    backgroundClip: "text",
  } as Record<string, string>,
  subtitle: {
    fontSize: "1.1em",
    fontFamily: `var(${LF_THEME_FONTS.familySecondary})`,
    textAlign: "center",
    maxWidth: "600px",
    margin: "0 auto 1em",
    lineHeight: "1.6",
    opacity: "0.85",
  } as Record<string, string>,

  // Badges
  versionBadge: {
    display: "inline-block",
    padding: "0.35em 1em",
    borderRadius: "20px",
    background: `rgb(var(${LF_THEME_COLORS.primary}))`,
    color: `rgb(var(${LF_THEME_COLORS.onPrimary}))`,
    fontFamily: `var(${LF_THEME_FONTS.familyMonospace})`,
    fontSize: "0.85em",
    fontWeight: "600",
  } as Record<string, string>,
  liveBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4em",
    padding: "0.25em 0.75em",
    borderRadius: "12px",
    background: `rgb(var(${LF_THEME_COLORS.success}))`,
    color: `rgb(var(${LF_THEME_COLORS.onSuccess}))`,
    fontSize: "0.75em",
    fontWeight: "600",
  } as Record<string, string>,

  // Misc
  separator: {
    ...DOC_STYLES.separator,
    width: "60%",
    margin: "2em auto",
  } as Record<string, string>,
  tipBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "1em",
    padding: "1.25em 1.5em",
    borderRadius: "12px",
    background: `rgba(var(${LF_THEME_COLORS.border}), var(${LF_THEME_UI.alphaGlass}))`,
    border: `1px solid rgba(var(${LF_THEME_COLORS.border}), 1)`,
    backdropFilter: "blur(12px)",
    webkitBackdropFilter: "blur(12px)",
    margin: "1.5em 0",
  } as Record<string, string>,
  chartContainer: {
    margin: "1.5em auto",
    maxWidth: "100%",
  } as Record<string, string>,
  codeContainer: {
    margin: "1em 0",
  } as Record<string, string>,
  activityBar: {
    display: "flex",
    alignItems: "flex-end",
    gap: "2px",
    height: "60px",
    margin: "1em 0",
  } as Record<string, string>,
} as const;
//#endregion

//#region Helper functions
const createStatCard = (
  value: string,
  label: string,
  icon?: string,
): LfArticleNode => ({
  cssStyle: DASHBOARD_STYLES.statCard,
  id: DOC_IDS.content,
  value: "",
  children: [
    ...(icon
      ? [
          {
            cssStyle: {
              backdropFilter: "blur(8px)",
              webkitBackdropFilter: "blur(8px)",
              fontSize: "1.5em",
              marginBottom: "0.25em",
              opacity: "0.7",
            },
            id: DOC_IDS.content,
            tagName: "span" as const,
            value: icon,
          },
        ]
      : []),
    {
      cssStyle: DASHBOARD_STYLES.statNumber,
      id: DOC_IDS.content,
      tagName: "span" as const,
      value,
    },
    {
      cssStyle: DASHBOARD_STYLES.statLabel,
      id: DOC_IDS.content,
      tagName: "span" as const,
      value: label,
    },
  ],
});

const createSeparator = (): LfArticleNode => ({
  cssStyle: DASHBOARD_STYLES.separator,
  id: DOC_IDS.contentWrapper,
  value: "",
});

const createSectionTitle = (title: string, emoji?: string): LfArticleNode => ({
  cssStyle: DASHBOARD_STYLES.sectionTitle,
  id: DOC_IDS.content,
  value: "",
  children: [
    ...(emoji
      ? [
          {
            id: DOC_IDS.content,
            tagName: "span" as const,
            value: emoji,
          },
        ]
      : []),
    {
      id: DOC_IDS.content,
      tagName: "span" as const,
      value: title,
    },
  ],
});
//#endregion

export const buildHeroSection = (
  framework: LfFrameworkInterface,
): LfArticleNode[] => {
  const imagePath = framework.assets.get("./assets/showcase/LFW.jpg").path;

  return [
    //#region Hero section
    {
      id: DOC_IDS.paragraph,
      value: "",
      children: [
        {
          cells: {
            lfImage: {
              lfValue: imagePath,
              shape: "image",
              value: "",
            },
          },
          id: DOC_IDS.contentWrapper,
          value: "",
        },
      ],
    },
    //#endregion

    //#region Title and version
    {
      id: DOC_IDS.paragraph,
      value: "",
      children: [
        {
          cssStyle: { textAlign: "center", margin: "1.5em 0 0.5em" },
          id: DOC_IDS.contentWrapper,
          value: "",
          children: [
            {
              cssStyle: DASHBOARD_STYLES.versionBadge,
              id: DOC_IDS.content,
              tagName: "span",
              value: `v${LF_WIDGETS_VERSION}`,
            },
          ],
        },
      ],
    },
    //#endregion

    //#region Tagline
    {
      id: DOC_IDS.paragraph,
      value: "",
      children: [
        {
          cssStyle: DASHBOARD_STYLES.subtitle,
          id: DOC_IDS.contentWrapper,
          value:
            "A framework-agnostic web components library built with Stencil.js — lightweight, stylish, and fully customizable.",
        },
      ],
    },
    //#endregion
  ];
};

//#region GitHub
export const buildGitHubStatsSection = (
  data: DashboardData | null,
): LfArticleNode => {
  const repo = data?.github.repo;
  const release = data?.github.release;

  const statsNodes: LfArticleNode[] = [
    createSectionTitle("GitHub", "⭐"),
    {
      cssStyle: DASHBOARD_STYLES.statsGrid,
      id: DOC_IDS.content,
      value: "",
      children: [
        createStatCard(repo ? formatNumber(repo.stars) : "—", "Stars"),
        createStatCard(repo ? formatNumber(repo.forks) : "—", "Forks"),
        createStatCard(repo ? formatNumber(repo.openIssues) : "—", "Issues"),
        createStatCard(repo ? calculateLibraryAge(repo.createdAt) : "—", "Age"),
      ],
    },
  ];

  // Add release info if available
  if (release) {
    statsNodes.push({
      cssStyle: {
        fontSize: "0.9em",
        opacity: "0.8",
        textAlign: "center",
        marginTop: "0.5em",
      },
      tagName: "div" as const,
      id: DOC_IDS.content,
      value: `Latest: ${release.tagName} • ${formatRelativeTime(release.publishedAt)}`,
    });
  }

  // Add commit activity chart if available
  const activity = data?.github.commitActivity ?? [];
  if (activity.length > 0) {
    statsNodes.push({
      id: DOC_IDS.content,
      value: "",
      children: [
        {
          cssStyle: {
            textAlign: "center",
            fontSize: "0.8em",
            opacity: "0.7",
            marginTop: "1em",
            marginBottom: "0.25em",
          },
          tagName: "div" as const,
          id: DOC_IDS.content,
          value: "Commit activity (last 12 weeks)",
        },
        {
          cells: {
            lfChart: {
              lfAxis: "Week",
              lfDataset: {
                columns: [
                  { id: "Week", title: "Week" },
                  { id: "Commits", title: "Commits" },
                ],
                nodes: activity.map((commits, i) => ({
                  id: `week-${i}`,
                  cells: {
                    Week: { value: `W${i + 1}` },
                    Commits: { value: commits.toString() },
                  },
                })),
              },
              lfTypes: ["bar"],
              lfStyle: "--lf-chart-height: 120px",
              shape: "chart",
              value: "",
            },
          },
          id: DOC_IDS.content,
          value: "",
        },
      ],
    });
  }

  return {
    id: DOC_IDS.paragraph,
    value: "",
    children: [
      {
        id: DOC_IDS.contentWrapper,
        value: "",
        children: statsNodes,
      },
    ],
  };
};
//#endregion

//#region npm/package
export const buildNpmStatsSection = (
  data: DashboardData | null,
): LfArticleNode => {
  const npm = data?.npm;
  const bundle = data?.bundle;

  return {
    id: DOC_IDS.paragraph,
    value: "",
    children: [
      {
        id: DOC_IDS.contentWrapper,
        value: "",
        children: [
          createSectionTitle("Package", "📦"),
          {
            cssStyle: DASHBOARD_STYLES.statsGrid,
            id: DOC_IDS.content,
            value: "",
            children: [
              createStatCard(
                npm ? formatNumber(npm.weeklyDownloads) : "—",
                "Weekly DLs",
              ),
              createStatCard(
                npm ? formatNumber(npm.monthlyDownloads) : "—",
                "Monthly DLs",
              ),
              createStatCard(
                bundle ? formatBytes(bundle.gzip) : "—",
                "Gzipped",
              ),
              createStatCard(
                bundle?.dependencyCount?.toString() ?? "0",
                "Deps",
              ),
            ],
          },
          {
            cssStyle: {
              fontSize: "0.9em",
              opacity: "0.8",
              textAlign: "center",
              marginTop: "0.5em",
            },
            id: DOC_IDS.content,
            tagName: "div" as const,
            value: npm
              ? `Published ${formatRelativeTime(npm.lastPublished)}`
              : "Loading npm data...",
          },
        ],
      },
    ],
  };
};
//#endregion

//#region Contributors
export const buildContributorsSection = (
  data: DashboardData | null,
): LfArticleNode => {
  const contributors = data?.github.contributors ?? [];

  if (contributors.length === 0) {
    return {
      id: DOC_IDS.paragraph,
      value: "",
      children: [],
    };
  }

  return {
    id: DOC_IDS.paragraph,
    value: "",
    children: [
      {
        id: DOC_IDS.contentWrapper,
        value: "",
        children: [
          createSectionTitle("Contributors", "👥"),
          {
            cssStyle: DASHBOARD_STYLES.contributorsGrid,
            id: DOC_IDS.content,
            value: "",
            children: contributors.slice(0, 8).map((contributor) => ({
              cssStyle: DASHBOARD_STYLES.contributorCard,
              id: DOC_IDS.content,
              value: "",
              children: [
                {
                  cssStyle: {
                    ...DASHBOARD_STYLES.avatar,
                    backgroundImage: `url(${contributor.avatarUrl})`,
                  },
                  id: DOC_IDS.content,
                  tagName: "div" as const,
                  value: "",
                },
                {
                  cssStyle: { fontSize: "0.75em", fontWeight: "600" },
                  id: DOC_IDS.content,
                  value: contributor.login,
                },
                {
                  cssStyle: { fontSize: "0.65em", opacity: "0.7" },
                  id: DOC_IDS.content,
                  value: `${contributor.contributions} commits`,
                },
              ],
            })),
          },
        ],
      },
    ],
  };
};
//#endregion

//#region Quick Start
export const buildQuickStartSection = (): LfArticleNode => {
  const installCode = `# Install with npm
npm install @lf-widgets/core

# Or with yarn
yarn add @lf-widgets/core

# Or with pnpm
pnpm add @lf-widgets/core`;

  const usageCode = `// Import and use components
import { defineCustomElements } from '@lf-widgets/core/loader';

// Register all components
defineCustomElements();

// Now use in your HTML
// <lf-button lf-label="Click me"></lf-button>`;

  return {
    id: DOC_IDS.paragraph,
    value: "",
    children: [
      {
        id: DOC_IDS.contentWrapper,
        value: "",
        children: [
          createSectionTitle("Quick Start", "🚀"),
          {
            cssStyle: DASHBOARD_STYLES.codeContainer,
            id: DOC_IDS.content,
            value: "",
            children: [
              {
                cells: {
                  lfCode: {
                    lfLanguage: "bash",
                    lfValue: installCode,
                    shape: "code",
                    value: "",
                  },
                },
                id: DOC_IDS.content,
                value: "",
              },
            ],
          },
          {
            cssStyle: { ...DASHBOARD_STYLES.codeContainer, marginTop: "1em" },
            id: DOC_IDS.content,
            value: "",
            children: [
              {
                cells: {
                  lfCode: {
                    lfLanguage: "typescript",
                    lfValue: usageCode,
                    shape: "code",
                    value: "",
                  },
                },
                id: DOC_IDS.content,
                value: "",
              },
            ],
          },
        ],
      },
    ],
  };
};
//#endregion

//#region Components
export const buildComponentsOverview = (
  componentCount: number,
  frameworkCount: number,
): LfArticleNode => {
  return {
    id: DOC_IDS.paragraph,
    value: "",
    children: [
      {
        id: DOC_IDS.contentWrapper,
        value: "",
        children: [
          createSectionTitle("What's Inside", "📊"),
          {
            cssStyle: DASHBOARD_STYLES.statsGrid,
            id: DOC_IDS.content,
            value: "",
            children: [
              createStatCard(componentCount.toString(), "Components"),
              createStatCard(frameworkCount.toString(), "Services"),
              createStatCard("15+", "Themes"),
              createStatCard("100%", "TypeScript"),
            ],
          },
        ],
      },
    ],
  };
};
//#endregion

//#region Features chips
export const buildFeaturesChips = (
  icons: ReturnType<LfFrameworkInterface["theme"]["get"]["icons"]>,
): LfArticleNode => {
  return {
    id: DOC_IDS.paragraph,
    value: "",
    children: [
      {
        id: DOC_IDS.contentWrapper,
        value: "",
        children: [
          createSectionTitle("Features", "✨"),
          {
            cells: {
              lfChip: {
                lfDataset: {
                  nodes: [
                    { id: "ts", value: "TypeScript", icon: icons.code },
                    { id: "shadow", value: "Shadow DOM", icon: icons.door },
                    { id: "themes", value: "15+ Themes", icon: icons.palette },
                    { id: "a11y", value: "Accessible", icon: icons.help },
                    {
                      id: "tree",
                      value: "Tree-shakeable",
                      icon: icons.listTree,
                    },
                    {
                      id: "zero",
                      value: "Zero Deps",
                      icon: icons.playstationCircle,
                    },
                  ],
                },
                lfStyle:
                  "--lf-chip-row-gap: 0.5em; --lf-chip-column-gap: 0.5em",
                shape: "chip",
                value: "",
              },
            },
            id: DOC_IDS.content,
            value: "",
          },
        ],
      },
    ],
  };
};
//#endregion

//#region Main builder
export const buildDashboardDataset = (
  framework: LfFrameworkInterface,
  data: DashboardData | null,
  componentCount: number,
  frameworkCount: number,
): LfArticleDataset => {
  const icons = framework.theme.get.icons();

  return {
    nodes: [
      {
        id: DOC_IDS.root,
        value: "LF Widgets",
        children: [
          {
            id: DOC_IDS.section,
            value: "",
            children: [
              // Hero section
              ...buildHeroSection(framework),

              // Separator
              {
                id: DOC_IDS.paragraph,
                value: "",
                children: [createSeparator()],
              },

              // GitHub stats
              buildGitHubStatsSection(data),

              // npm/bundle stats
              buildNpmStatsSection(data),

              // Contributors
              buildContributorsSection(data),

              // Separator
              {
                id: DOC_IDS.paragraph,
                value: "",
                children: [createSeparator()],
              },

              // Components overview with chart
              buildComponentsOverview(componentCount, frameworkCount),

              // Features chips
              buildFeaturesChips(icons),

              // Separator
              {
                id: DOC_IDS.paragraph,
                value: "",
                children: [createSeparator()],
              },

              // Quick start
              buildQuickStartSection(),
            ],
          },
        ],
      },
    ],
  };
};
//#endregion
