import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Sparkles,
  Globe2,
  Bookmark,
  BookmarkCheck,
  History,
  Trash2,
  Zap,
  ShieldCheck,
  ShieldOff,
  User,
  Menu,
  X,
  ExternalLink,
  Gauge,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchBar } from "@/components/nexus/SearchBar";
import { RegionTabs } from "@/components/nexus/RegionTabs";
import { OrionAnswerCard } from "@/components/nexus/OrionAnswerCard";
import { LANGUAGES, getLanguage, getRegion } from "@/lib/nexusData";
import { runTavilySearch, TAVILY_KEY } from "@/lib/tavily";
import type { BookmarkEntry, HistoryEntry, SearchResult } from "@/types/nexus";
import { cn } from "@/lib/utils";

const IDLE_ANSWER =
  "Ask Orion AI anything about Africa — history, business, culture, language, or current affairs. Orion searches the live web in English, then synthesises and translates the answer into your chosen language.";

export default function App() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [regionId, setRegionId] = useState("all");
  const [languageCode, setLanguageCode] = useState("en");
  const [askOrion, setAskOrion] = useState(true);
  const [saveHistory, setSaveHistory] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [answer, setAnswer] = useState(IDLE_ANSWER);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkEntry[]>([]);
  const [apiKey, setApiKey] = useState("");

  const activeRegion = getRegion(regionId);
  const activeLanguage = getLanguage(languageCode);

  const firstRender = useRef(true);
  const lastLang = useRef(languageCode);

  const citations = useMemo(
    () =>
      results.slice(0, 4).map((r) => ({ title: r.title, domain: r.domain })),
    [results],
  );

  const runSearch = useCallback(
    async (rawQuery: string, langCode: string, regId: string) => {
      const trimmed = rawQuery.trim();
      if (!trimmed) {
        setError("Enter a search query to ask Orion AI.");
        return;
      }

      const region = getRegion(regId);
      const language = getLanguage(langCode);

      setLoading(true);
      setError(null);
      setNotice(null);
      setSubmittedQuery(trimmed);

      if (saveHistory) {
        setHistory((prev) =>
          [
            {
              id: `${Date.now()}`,
              query: trimmed,
              region: region.label,
              timestamp: new Date().toLocaleString(),
            },
            ...prev,
          ].slice(0, 12),
        );
      }

      try {
        const { answer: finalAnswer, results: finalResults } =
          await runTavilySearch({
            userInput: trimmed,
            regionScope: region.scope,
            regionId: region.id,
            languageLabel: language.label,
            languageCode: language.code,
            apiKey,
          });

        setAnswer(finalAnswer);
        setResults(finalResults);
        if (finalResults.length === 0) {
          setNotice("Orion returned no web sources for this query.");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown search failure.";
        setError(message);
        setAnswer(IDLE_ANSWER);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [apiKey, saveHistory],
  );

  // Re-run the pipeline when the user switches language so the synthesis
  // card switches to that language automatically.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      lastLang.current = languageCode;
      return;
    }
    if (lastLang.current === languageCode) return;
    lastLang.current = languageCode;

    if (!submittedQuery) return;
    void runSearch(submittedQuery, languageCode, regionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageCode]);

  const handleLanguageChange = (code: string) => {
    if (code === languageCode) return;
    setLanguageCode(code);
    const lang = getLanguage(code);
    setNotice(
      submittedQuery
        ? `Switching Orion synthesis to ${lang.label}…`
        : `Orion will synthesise in ${lang.label}.`,
    );
  };

  const toggleBookmark = (result: SearchResult) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.url === result.url);
      if (exists) return prev.filter((b) => b.url !== result.url);
      return [
        {
          id: result.id,
          title: result.title,
          domain: result.domain,
          url: result.url,
          timestamp: new Date().toLocaleString(),
        },
        ...prev,
      ];
    });
  };

  const isBookmarked = (url: string) =>
    bookmarks.some((b) => b.url === url);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-blue-950/40 via-slate-950 to-slate-950" />

      <header className="relative border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-cyan-500/20 to-blue-700/20 shadow-lg shadow-cyan-900/40">
              <Globe2 className="h-6 w-6 text-cyan-300" />
            </span>
            <div>
              <h1 className="font-serif text-2xl font-black tracking-tight text-white sm:text-3xl">
                NEXUS
              </h1>
              <p className="text-xs font-medium text-cyan-300/80">
                Powered by Orion AI
              </p>
            </div>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1.5">
              <Globe2 className="h-4 w-4 text-cyan-400" />
              <Select value={languageCode} onValueChange={handleLanguageChange}>
                <SelectTrigger className="h-7 w-32 border-0 bg-transparent text-xs text-slate-200 focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72 border-slate-700 bg-slate-900 text-slate-200">
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l.code} value={l.code}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1.5">
              {saveHistory ? (
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              ) : (
                <ShieldOff className="h-4 w-4 text-slate-500" />
              )}
              <Label
                htmlFor="save-history"
                className="cursor-pointer text-xs text-slate-300"
              >
                Save Search History
              </Label>
              <Switch
                id="save-history"
                checked={saveHistory}
                onCheckedChange={setSaveHistory}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Button>
              </DialogTrigger>
              <DialogContent className="border-slate-800 bg-slate-900 text-slate-100">
                <DialogHeader>
                  <DialogTitle className="font-serif text-xl">
                    Sign in to NEXUS
                  </DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Access saved bookmarks and Orion history across devices.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="you@example.com"
                      className="border-slate-700 bg-slate-950"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="border-slate-700 bg-slate-950"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold">
                    Sign In
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-white hover:from-cyan-400 hover:to-blue-500">
                  <Sparkles className="h-4 w-4" />
                  Create Nexus ID
                </Button>
              </DialogTrigger>
              <DialogContent className="border-slate-800 bg-slate-900 text-slate-100">
                <DialogHeader>
                  <DialogTitle className="font-serif text-xl">
                    Create your Nexus ID
                  </DialogTitle>
                  <DialogDescription className="text-slate-400">
                    One identity for search, bookmarks, and Orion synthesis.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-name">Full name</Label>
                    <Input
                      id="new-name"
                      placeholder="Ada Okonkwo"
                      className="border-slate-700 bg-slate-950"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-email">Email</Label>
                    <Input
                      id="new-email"
                      placeholder="you@example.com"
                      className="border-slate-700 bg-slate-950"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold">
                    Create Nexus ID
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-12">
        <section className="space-y-6 lg:col-span-8">
          <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/40 p-5 shadow-xl shadow-slate-950/50 sm:p-6">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={(v) => void runSearch(v, languageCode, regionId)}
              askOrion={askOrion}
              onAskOrionChange={setAskOrion}
              onVoiceError={setError}
              speechLang={activeLanguage.speech}
              loading={loading}
            />
            <RegionTabs active={regionId} onChange={setRegionId} />
            <div className="flex flex-wrap items-center gap-4 border-t border-slate-800 pt-4">
              <div className="flex items-center gap-2">
                <Zap
                  className={cn(
                    "h-4 w-4",
                    dataSaver ? "text-amber-400" : "text-slate-500",
                  )}
                />
                <Label
                  htmlFor="data-saver"
                  className="cursor-pointer text-xs text-slate-300"
                >
                  Data-Saver Mode
                </Label>
                <Switch
                  id="data-saver"
                  checked={dataSaver}
                  onCheckedChange={setDataSaver}
                  className="data-[state=checked]:bg-amber-500"
                />
              </div>
              {dataSaver && (
                <Badge
                  variant="outline"
                  className="border-amber-500/40 bg-amber-500/10 text-amber-300"
                >
                  <Gauge className="mr-1 h-3 w-3" /> 2G/3G optimised
                </Badge>
              )}
              <span className="ml-auto text-xs text-slate-500">
                {activeRegion.label} · {activeLanguage.label}
              </span>
            </div>
          </div>

          {notice && (
            <p className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs text-cyan-200">
              {notice}
            </p>
          )}

          <OrionAnswerCard
            answerText={answer}
            citations={citations}
            regionScope={activeRegion.label}
            loading={loading}
            error={error}
            languageCode={languageCode}
            onLanguageChange={handleLanguageChange}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-white">
                Web Results
              </h2>
              <span className="text-xs text-slate-500">
                {results.length} sources
              </span>
            </div>

            {results.length === 0 && !loading ? (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8 text-center">
                <p className="text-sm text-slate-500">
                  No results yet. Run a search to pull live African web sources.
                </p>
              </div>
            ) : (
              results.map((r) => (
                <Card
                  key={r.id}
                  className="border-slate-800 bg-slate-900/50 transition-colors hover:border-cyan-500/40"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-xs text-cyan-400">
                          {r.domain}
                        </p>
                        <CardTitle className="mt-1 text-base font-semibold text-slate-100">
                          {r.title}
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleBookmark(r)}
                        className="shrink-0 text-slate-400 hover:text-cyan-300"
                        aria-label="Save to Nexus Account"
                      >
                        {isBookmarked(r.url) ? (
                          <BookmarkCheck className="h-4 w-4 text-cyan-400" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <CardDescription className="text-sm leading-relaxed text-slate-400">
                      {r.snippet}
                    </CardDescription>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{r.timestamp}</span>
                      <span>·</span>
                      <span>{r.region}</span>
                      {r.url && (
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-auto flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
                        >
                          Visit <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        <aside
          className={cn(
            "space-y-6 lg:col-span-4",
            sidebarOpen ? "block" : "hidden lg:block",
          )}
        >
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <KeyRound className="h-4 w-4 text-cyan-400" />
                Tavily API Key
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Optional override. Defaults to the built-in key.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={TAVILY_KEY ? "Using built-in key" : "tvly-…"}
                className="border-slate-700 bg-slate-950 text-xs"
              />
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <History className="h-4 w-4 text-cyan-400" />
                Recent Searches
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                {saveHistory
                  ? "History is being saved on this device."
                  : "History saving is off."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {!saveHistory ? (
                <p className="text-xs text-slate-500">
                  Enable “Save Search History” to keep a record.
                </p>
              ) : history.length === 0 ? (
                <p className="text-xs text-slate-500">No searches yet.</p>
              ) : (
                <>
                  {history.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => {
                        setQuery(h.query);
                        void runSearch(h.query, languageCode, regionId);
                      }}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-left transition-colors hover:border-cyan-500/40"
                    >
                      <p className="truncate text-xs text-slate-200">
                        {h.query}
                      </p>
                      <p className="text-xs text-slate-500">
                        {h.region} · {h.timestamp}
                      </p>
                    </button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setHistory([])}
                    className="w-full gap-2 text-xs text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="h-3 w-3" /> Clear history
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Bookmark className="h-4 w-4 text-cyan-400" />
                Saved Bookmarks
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                {bookmarks.length} saved to your Nexus account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {bookmarks.length === 0 ? (
                <p className="text-xs text-slate-500">
                  Bookmark a result to see it here.
                </p>
              ) : (
                bookmarks.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2"
                  >
                    <p className="truncate text-xs text-slate-200">
                      {b.title}
                    </p>
                    <p className="text-xs text-cyan-400">{b.domain}</p>
                    <p className="text-xs text-slate-500">{b.timestamp}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
}