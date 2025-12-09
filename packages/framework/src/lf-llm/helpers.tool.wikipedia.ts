import {
  LfDataDataset,
  LfFrameworkInterface,
  LfLLMToolHandlers,
  LfLLMToolResponse,
} from "@lf-widgets/foundations";

//#region Types
interface WikipediaSummaryApiResponse {
  title?: unknown;
  extract?: unknown;
  lang?: unknown;
  description?: unknown;
  type?: unknown;
  pageid?: unknown;
  tid?: unknown;
  timestamp?: unknown;
  thumbnail?: {
    source?: unknown;
    width?: unknown;
    height?: unknown;
  };
  originalimage?: {
    source?: unknown;
    width?: unknown;
    height?: unknown;
  };
  content_urls?: {
    desktop?: {
      page?: unknown;
    };
  };
}

interface WikipediaSummary {
  title: string;
  extract: string;
  lang: string;
  url: string;
  description?: string;
  imageUrl?: string;
  type?: string;
  pageId?: number;
  tid?: string;
  timestamp?: string;
  seed?: string;
}

const FALLBACK_TITLE = "Random Wikipedia Article";
const FALLBACK_EXTRACT = "No summary is available for this article.";

/**
 * Safely converts a raw JSON payload into a strongly-typed WikipediaSummary.
 * Applies defensive checks so unexpected shapes never crash the tool.
 */
const toWikipediaSummary = (
  data: unknown,
  defaultLang: string,
): WikipediaSummary => {
  const raw = (data ?? {}) as WikipediaSummaryApiResponse;

  const title =
    typeof raw.title === "string" && raw.title.trim().length > 0
      ? raw.title.trim()
      : FALLBACK_TITLE;

  const extract =
    typeof raw.extract === "string" && raw.extract.trim().length > 0
      ? raw.extract.trim()
      : FALLBACK_EXTRACT;

  const lang =
    typeof raw.lang === "string" && raw.lang.trim().length > 0
      ? raw.lang.trim()
      : defaultLang;

  const type =
    typeof raw.type === "string" && raw.type.trim().length > 0
      ? raw.type.trim()
      : undefined;

  const pageId =
    typeof raw.pageid === "number"
      ? raw.pageid
      : typeof raw.pageid === "string" &&
          raw.pageid.trim().length > 0 &&
          !Number.isNaN(Number(raw.pageid.trim()))
        ? Number(raw.pageid.trim())
        : undefined;

  const tid =
    typeof raw.tid === "string" && raw.tid.trim().length > 0
      ? raw.tid.trim()
      : undefined;

  const timestamp =
    typeof raw.timestamp === "string" && raw.timestamp.trim().length > 0
      ? raw.timestamp.trim()
      : undefined;

  const desktopPage =
    typeof raw.content_urls?.desktop?.page === "string" &&
    raw.content_urls.desktop.page.trim().length > 0
      ? raw.content_urls.desktop.page.trim()
      : undefined;

  const url =
    desktopPage ??
    `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title)}`;

  const description =
    typeof raw.description === "string" && raw.description.trim().length > 0
      ? raw.description.trim()
      : undefined;

  const originalSource =
    typeof raw.originalimage?.source === "string" &&
    raw.originalimage.source.trim().length > 0
      ? raw.originalimage.source.trim()
      : undefined;

  const thumbnailSource =
    typeof raw.thumbnail?.source === "string" &&
    raw.thumbnail.source.trim().length > 0
      ? raw.thumbnail.source.trim()
      : undefined;

  // Prefer thumbnail (lighter) and fall back to original image.
  const imageUrl = thumbnailSource ?? originalSource;

  const seedParts: string[] = [];
  if (lang) seedParts.push(lang);
  if (pageId !== undefined) seedParts.push(String(pageId));
  if (tid) seedParts.push(tid);

  const seed = seedParts.length > 0 ? `wiki:${seedParts.join(":")}` : undefined;

  return {
    title,
    extract,
    lang,
    url,
    description,
    imageUrl,
    type,
    pageId,
    tid,
    timestamp,
    seed,
  };
};
//#endregion

//#region Wikipedia Tool Handler
/**
 * Creates the handler function for the random Wikipedia article tool.
 * Uses Wikipedia's REST API to fetch a random article summary and wraps it
 * into an lf-article dataset plus a textual summary for the LLM.
 */
export const createWikipediaToolHandler = (
  framework: LfFrameworkInterface,
): LfLLMToolHandlers[string] => {
  return async (args: Record<string, unknown>): Promise<LfLLMToolResponse> => {
    const rawLanguage = args.language;
    const language =
      typeof rawLanguage === "string" && rawLanguage.trim().length > 0
        ? rawLanguage.trim()
        : "en";

    const apiBase = `https://${encodeURIComponent(
      language,
    )}.wikipedia.org/api/rest_v1`;

    try {
      const response = await fetch(`${apiBase}/page/random/summary`);

      if (!response.ok) {
        return {
          type: "text",
          content: `Unable to fetch a random Wikipedia article (status: ${response.status}). Please try again.`,
        };
      }

      const json = (await response.json()) as unknown;
      const {
        title,
        extract,
        lang,
        url,
        description,
        imageUrl,
        type,
        pageId,
        timestamp,
        seed,
      } = toWikipediaSummary(json, language);

      const summaryLines: Array<string | undefined> = [
        `Random Wikipedia article (${lang}): ${title}`,
        `URL: ${url}`,
        seed ? `Seed: ${seed}` : undefined,
        "",
        extract,
      ];
      const content = summaryLines
        .filter((line): line is string => Boolean(line))
        .join("\n");

      const article = framework.data.article;
      const builder = article.builder.create({
        id: "wikipedia-article",
        title: "",
        layout: "hero-top",
      });

      const metaDataset: LfDataDataset = {
        nodes: [
          {
            id: "wikipedia-meta",
            description: "Click to open the article on Wikipedia",
            value: url,
            cells: {
              text1: { value: title },
              text2: { value: description ?? `Language: ${lang}` },
              text3: {
                value: [
                  "- Info:",
                  `Language: ${lang}`,
                  `Type: ${type ?? "N/A"}`,
                  `Page ID: ${pageId ?? "N/A"}`,
                  `Seed: ${seed ?? "N/A"}`,
                  "",
                  "- Source:",
                  url,
                  timestamp ? `\n(Wikipedia timestamp: ${timestamp})` : "",
                ]
                  .filter((line) => Boolean(line))
                  .join("\n"),
              },
              ...(imageUrl
                ? {
                    lfImage: {
                      shape: "image",
                      value: imageUrl,
                    },
                  }
                : {}),
            },
          },
        ],
      };

      builder.section.add.withLeaf({
        sectionId: "wikipedia-summary",
        sectionTitle: "",
        text: extract,
        layout: "hero-top",
        leaf: article.shapes.card("wikipedia-meta-card", {
          lfDataset: metaDataset,
          lfLayout: "material",
          lfSizeY: "200px",
        }),
      });

      const dataset = builder.getDataset();

      return {
        type: "article",
        content,
        dataset,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error ?? "Unknown");

      return {
        type: "text",
        content: `Error fetching Wikipedia article: ${message}`,
      };
    }
  };
};
//#endregion
