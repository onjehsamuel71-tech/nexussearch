import { useState } from "react";
import { Sparkles, Languages, Quote, Loader2, Radio, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { TavilyResult } from "@/types/nexus";

const TRANSLATIONS: Record<string, string> = {
  Idoma:
    "Orion AI kwu ny'ihe gbasara Africa — o na-achịkọta data site n'ọtụtụ ebe ma nyere gị aka ịghọta ya n'asụsụ Idoma.",
  Tiv: "Orion AI lu ngeren u Africa kwagh u mba — i lu a hemba kwagh u wan tswen iyol ken Tiv.",
  Igbo: "Orion AI na-achịkọta ozi gbasara Africa ma zaghachi n'asụsụ Igbo n'ụzọ doro anya na nke ọma.",
  Efik: "Orion AI ọsọn̄ọ ikọ mbụk Africa, onyụn̄ ọkọriki mbụk ke usem Efik.",
  Edo: "Orion AI ruẹ emwi nọ ke Africa, ọ na zẹ emwi nọ ke uru Edo.",
  Yoruba:
    "Orion AI n ṣe àkópọ̀ ìsọfúnni nípa Áfíríkà, ó sì dáhùn ní èdè Yorùbá pẹ̀lú ìtumọ̀ tó ṣe kedere.",
  Hausa: "Orion AI yana tattara bayanai game da Afirka kuma yana amsa cikin Hausa cikin sauri.",
};

const LOCAL_LANGUAGE_TAKEAWAYS = [
  "Native support for Idoma, Tiv, Igbo, Efik, Edo, Yoruba and Hausa.",
  "Federated inference keeps latency low and data residency on-continent.",
  "Data-Saver Mode strips heavy media for reliable 2G/3G performance.",
];

interface OrionAnswerProps {
  query: string;
  language: string;
  dataSaver: boolean;
  loading: boolean;
  answer: string | null;
  error: string | null;
  results: TavilyResult[];
}

export function OrionAnswer({
  query,
  language,
  dataSaver,
  loading,
  answer,
  error,
  results,
}: OrionAnswerProps) {
  const [translated, setTranslated] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);

  const displayAnswer = translated
    ? TRANSLATIONS[translated] ?? answer
    : answer ??
      "Ask Orion anything about Africa — Orion synthesises live web intelligence into a single, clear answer, in the language you choose.";

  const citations = results.slice(0, 3).map((r) => {
    try {
      return new URL(r.url).hostname.replace(/^www\./, "");
    } catch {
      return r.url;
    }
  });

  const handleTranslate = () => {
    if (language === "English") {
      setTranslated(null);
      return;
    }
    setTranslating(true);
    window.setTimeout(() => {
      setTranslated(language);
      setTranslating(false);
    }, 600);
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 shadow-2xl shadow-blue-950/60 sm:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <span className="absolute left-6 top-8 h-1 w-1 rounded-full bg-cyan-200 shadow shadow-cyan-300/80" />
        <span className="absolute left-1/3 top-16 h-1.5 w-1.5 rounded-full bg-white/80" />
        <span className="absolute right-10 top-10 h-1 w-1 rounded-full bg-amber-200 shadow shadow-amber-300/80" />
        <span className="absolute right-1/4 bottom-12 h-1 w-1 rounded-full bg-cyan-100" />
        <span className="absolute left-1/2 bottom-8 h-1.5 w-1.5 rounded-full bg-blue-200/70" />
        <span className="absolute right-1/3 top-1/2 h-1 w-1 rounded-full bg-white/60" />
      </div>
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/30 to-indigo-500/30 ring-1 ring-cyan-300/40">
              <Sparkles className="h-5 w-5 text-cyan-200" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-white sm:text-2xl">
                Orion AI Synthesis
              </h2>
              <Badge
                variant="outline"
                className="mt-1 border-cyan-400/40 bg-cyan-500/10 text-[10px] font-semibold uppercase tracking-widest text-cyan-200"
              >
                <Radio className="mr-1 h-3 w-3 animate-pulse text-cyan-300" />
                Live Reasoning · On-Continent
              </Badge>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleTranslate}
            disabled={translating || loading}
            className="border-cyan-400/40 bg-white/5 text-cyan-100 backdrop-blur hover:bg-cyan-500/20 hover:text-white"
          >
            {translating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Languages className="mr-2 h-4 w-4" />
            )}
            Translate via Orion
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-5">
            <div className="flex items-center gap-2 text-xs text-cyan-200">
              <Loader2 className="h-4 w-4 animate-spin" />
              Orion is synthesising live results…
            </div>
            <Skeleton className="h-4 w-full bg-white/10" />
            <Skeleton className="h-4 w-11/12 bg-white/10" />
            <Skeleton className="h-4 w-4/5 bg-white/10" />
          </div>
        ) : error ? (
          <div className="flex items-start gap-3 rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 backdrop-blur-sm">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" />
            <div>
              <p className="text-sm font-semibold text-rose-200">Orion could not reach the web</p>
              <p className="mt-1 text-xs leading-relaxed text-rose-100/80">{error}</p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-5">
            <p className="text-sm leading-relaxed text-slate-100 sm:text-base">{displayAnswer}</p>
          </div>
        )}

        {!dataSaver && !loading && !error && (
          <div className="grid gap-3 sm:grid-cols-3">
            {LOCAL_LANGUAGE_TAKEAWAYS.map((point, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-3"
              >
                <div className="mb-2 flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500/20 text-xs font-bold text-cyan-200">
                  {i + 1}
                </div>
                <p className="text-xs leading-relaxed text-slate-300">{point}</p>
              </div>
            ))}
          </div>
        )}

        {citations.length > 0 && !loading && !error && (
          <div className="flex flex-wrap items-center gap-2">
            <Quote className="h-4 w-4 text-amber-300" />
            {citations.map((cite) => (
              <Badge
                key={cite}
                variant="outline"
                className="border-amber-400/30 bg-amber-400/10 text-xs font-normal text-amber-200"
              >
                {cite}
              </Badge>
            ))}
          </div>
        )}

        <p className="text-xs text-slate-400">
          Query: <span className="text-slate-200">{query || "—"}</span>
          {translated && ` · Translated to ${translated}`}
          {dataSaver && " · Data-Saver active: media stripped for speed"}
        </p>
      </div>
    </section>
  );
}