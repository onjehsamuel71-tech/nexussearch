import { Sparkles, Languages, Quote, AlertTriangle, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES, getLanguage } from "@/lib/nexusData";

interface OrionAnswerCardProps {
  answerText: string;
  citations: { title: string; domain: string }[];
  regionScope: string;
  loading: boolean;
  error: string | null;
  languageCode: string;
  onLanguageChange: (code: string) => void;
}

export function OrionAnswerCard({
  answerText,
  citations,
  regionScope,
  loading,
  error,
  languageCode,
  onLanguageChange,
}: OrionAnswerCardProps) {
  const activeLang = getLanguage(languageCode);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 shadow-2xl shadow-blue-950/50 sm:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        {Array.from({ length: 28 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-cyan-200/70"
            style={{
              top: `${(i * 37) % 100}%`,
              left: `${(i * 53) % 100}%`,
              opacity: 0.25 + ((i * 13) % 60) / 100,
            }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-500/10 shadow-inner shadow-cyan-500/30">
              <Sparkles className="h-5 w-5 text-cyan-300" />
            </span>
            <div>
              <h2 className="font-serif text-xl font-bold tracking-tight text-white sm:text-2xl">
                Orion AI Synthesis
              </h2>
              <p className="text-xs text-cyan-200/70">
                Scope: {regionScope} · Output: {activeLang.label} (
                {activeLang.native}) · Live Tavily
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-cyan-300" />
            <Select value={languageCode} onValueChange={onLanguageChange}>
              <SelectTrigger className="h-9 w-44 border-cyan-400/40 bg-slate-900/60 text-xs text-cyan-200">
                <SelectValue placeholder="Translate via Orion" />
              </SelectTrigger>
              <SelectContent className="max-h-72 border-slate-700 bg-slate-900 text-slate-200">
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.label} — {lang.native}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 text-xs text-cyan-300">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Searching in English, then translating into {activeLang.label}…
            </div>
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-700/60" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-700/60" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-slate-700/60" />
          </div>
        ) : error ? (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            <p className="text-sm text-amber-200">{error}</p>
          </div>
        ) : (
          <>
            <div className="mt-5 rounded-2xl border border-cyan-500/20 bg-slate-950/40 p-4 backdrop-blur-sm">
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-100 sm:text-base">
                {answerText}
              </p>
            </div>

            {citations.length > 0 && (
              <div className="mt-6">
                <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                  <Quote className="h-3.5 w-3.5" /> Live web citations
                </span>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {citations.map((c) => (
                    <div
                      key={c.domain}
                      className="rounded-xl border border-cyan-500/20 bg-slate-950/40 px-3 py-2"
                    >
                      <p className="truncate text-xs font-medium text-cyan-200">
                        {c.title}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {c.domain}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}