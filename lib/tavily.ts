import { getLanguage } from "@/lib/nexusData";
import type { SearchResult } from "@/types/nexus";

export const TAVILY_KEY = "tvly-dev-nexus-orion";

const TAVILY_ENDPOINT = "https://api.tavily.com/search";

interface TavilyRawResult {
  title?: string;
  url?: string;
  content?: string;
  score?: number;
  published_date?: string;
}

interface TavilyResponse {
  answer?: string;
  results?: TavilyRawResult[];
}

export interface RunSearchArgs {
  userInput: string;
  regionScope: string;
  regionId: string;
  languageLabel: string;
  languageCode: string;
  apiKey?: string;
}

export interface RunSearchOutput {
  answer: string;
  results: SearchResult[];
}

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function relativeTime(dateStr?: string): string {
  if (!dateStr) return "recently";
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return "recently";
  const diff = Date.now() - then;
  const days = Math.floor(diff / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

/**
 * STEP 1 — Live English web search via Tavily for factual grounding.
 * We always search in English so the source material is rich and accurate.
 */
async function englishWebSearch(
  args: RunSearchArgs,
  key: string,
): Promise<TavilyResponse> {
  const englishQuery = `${args.userInput} ${args.regionScope}`.trim();

  const res = await fetch(TAVILY_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: key,
      query: englishQuery,
      search_depth: "advanced",
      include_answer: true,
      include_raw_content: false,
      max_results: 6,
      topic: "general",
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Tavily search failed (${res.status}). Check your API key.`,
    );
  }

  return (await res.json()) as TavilyResponse;
}

/**
 * STEP 2 — Translate the English synthesis into the exact selected language
 * using a strict native-translator system prompt. English skips this hop.
 */
async function translateSynthesis(
  englishText: string,
  languageCode: string,
  key: string,
): Promise<string> {
  if (languageCode === "en") return englishText;

  const language = getLanguage(languageCode);
  const systemPrompt = `${language.translationDirective}

Return ONLY the translated text in ${language.label}. No preamble, no notes, no English explanation.`;

  const res = await fetch(TAVILY_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: key,
      query: `${systemPrompt}\n\nTEXT TO TRANSLATE:\n${englishText}`,
      search_depth: "basic",
      include_answer: true,
      max_results: 1,
    }),
  });

  if (!res.ok) return englishText;

  const data = (await res.json()) as TavilyResponse;
  return data.answer?.trim() || englishText;
}

export async function runTavilySearch(
  args: RunSearchArgs,
): Promise<RunSearchOutput> {
  const key = args.apiKey?.trim() || TAVILY_KEY;

  // ── STEP 1: English web search for factual grounding ──────────────────
  const data = await englishWebSearch(args, key);

  const rawResults = data.results ?? [];
  const results: SearchResult[] = rawResults.map((r, i) => {
    const url = r.url ?? "";
    return {
      id: `${i}-${url || r.title || "result"}`,
      title: r.title ?? "Untitled source",
      url,
      domain: url ? domainOf(url) : "unknown",
      snippet: (r.content ?? "").slice(0, 320),
      timestamp: relativeTime(r.published_date),
      region: args.regionScope,
    };
  });

  const englishSummary =
    data.answer?.trim() ||
    rawResults
      .slice(0, 3)
      .map((r) => r.content ?? "")
      .filter(Boolean)
      .join(" ")
      .slice(0, 900) ||
    "Orion could not find a confident answer for this query. Try rephrasing or widening the regional scope.";

  // ── STEP 2: Translate into the selected language ──────────────────────
  const translated = await translateSynthesis(
    englishSummary,
    args.languageCode,
    key,
  );

  return { answer: translated, results };
}