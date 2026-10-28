import { Bookmark, BookmarkCheck, ExternalLink, Globe2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getDomain } from "@/lib/tavily";
import { truncateSnippet } from "@/lib/format";
import { REGIONS } from "@/lib/regions";
import type { TavilyResult } from "@/types/nexus";

interface ResultsListProps {
  results: TavilyResult[];
  bookmarks: string[];
  onToggleBookmark: (domain: string) => void;
  dataSaver: boolean;
  region: string;
  loading: boolean;
  error: string | null;
  query: string;
}

export function ResultsList({
  results,
  bookmarks,
  onToggleBookmark,
  dataSaver,
  region,
  loading,
  error,
  query,
}: ResultsListProps) {
  const regionLabel = REGIONS.find((r) => r.id === region)?.label ?? "All Africa";

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-serif text-lg font-semibold text-slate-100">
          Web Results
          <span className="ml-2 text-sm font-normal text-slate-500">· {regionLabel}</span>
        </h2>
        <Badge
          variant="outline"
          className="border-slate-700 bg-slate-900/60 text-xs font-normal text-slate-400"
        >
          {loading ? "searching…" : `${results.length} results`} ·{" "}
          {dataSaver ? "low-data" : "full media"}
        </Badge>
      </div>

      {loading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" />
                <Skeleton className="h-3 w-40 bg-slate-800" />
              </div>
              <Skeleton className="mb-2 h-5 w-3/4 bg-slate-800" />
              <Skeleton className="mb-1.5 h-3.5 w-full bg-slate-800" />
              <Skeleton className="h-3.5 w-5/6 bg-slate-800" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" />
          <div>
            <p className="text-sm font-semibold text-rose-200">Search unavailable</p>
            <p className="mt-1 text-xs leading-relaxed text-rose-100/80">{error}</p>
            <p className="mt-2 text-xs text-rose-100/60">
              Please check your network connection or API key settings, then try again.
            </p>
          </div>
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center">
          <Globe2 className="mx-auto mb-3 h-6 w-6 text-slate-600" />
          <p className="text-sm text-slate-400">
            {query
              ? `No live results found for “${query}”. Try a different query.`
              : "Enter a query above to pull live results from across Africa's web."}
          </p>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="space-y-3">
          {results.map((result, i) => {
            const domain = getDomain(result.url);
            const saved = bookmarks.includes(domain);
            const snippet = truncateSnippet(result.content, 180);
            return (
              <article
                key={`${result.url}-${i}`}
                className={cn(
                  "group flex min-h-44 flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm transition-all hover:border-cyan-500/40 hover:bg-slate-900 hover:shadow-lg hover:shadow-cyan-950/30",
                  i === 0 && "sm:p-6",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <Globe2 className="h-3.5 w-3.5 text-cyan-400" />
                      <span className="font-medium text-cyan-300">{domain}</span>
                    </div>
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-1.5 inline-flex items-center gap-1.5 font-serif text-lg font-semibold leading-snug text-slate-100 transition-colors hover:text-cyan-200"
                    >
                      {result.title}
                      <ExternalLink className="h-4 w-4 shrink-0 text-slate-500 group-hover:text-cyan-300" />
                    </a>
                    <p className="text-sm leading-relaxed text-slate-400">{snippet}</p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleBookmark(domain)}
                    className={cn(
                      "shrink-0",
                      saved
                        ? "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
                        : "text-slate-500 hover:bg-slate-800 hover:text-amber-300",
                    )}
                    aria-label={saved ? "Remove bookmark" : "Save to Nexus Account"}
                  >
                    {saved ? (
                      <BookmarkCheck className="h-5 w-5" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </Button>
                </div>

                {!dataSaver && (
                  <div className="mt-auto flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-500">
                    <ExternalLink className="h-3.5 w-3.5 text-slate-600" />
                    Rich preview available on full-data connection
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}