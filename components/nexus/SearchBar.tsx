import { useRef, useState } from "react";
import { Search, Mic, X, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
  askOrion: boolean;
  onAskOrionChange: (v: boolean) => void;
  onVoiceError: (msg: string) => void;
  speechLang: string;
  loading: boolean;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  askOrion,
  onAskOrionChange,
  onVoiceError,
  speechLang,
  loading,
}: SearchBarProps) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startVoice = () => {
    const w = window as any;
    const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onVoiceError("Voice search is not supported in this browser.");
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = speechLang;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onstart = () => setListening(true);
      recognition.onend = () => setListening(false);
      recognition.onerror = () => {
        setListening(false);
        onVoiceError("Voice capture failed. Please try again.");
      };
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript ?? "";
        if (transcript) {
          onChange(transcript);
          onSubmit(transcript);
        }
      };
      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      onVoiceError("Could not start voice search.");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-2 shadow-inner focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/30">
        <Search className="h-5 w-5 shrink-0 text-cyan-400" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit(value);
          }}
          placeholder="Ask Orion AI anything about Africa…"
          className="h-10 border-0 bg-transparent text-base text-slate-100 placeholder:text-slate-500 focus-visible:ring-0"
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChange("")}
            className="h-8 w-8 shrink-0 text-slate-500 hover:text-slate-200"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={startVoice}
          className={cn(
            "h-8 w-8 shrink-0",
            listening
              ? "text-rose-400 animate-pulse"
              : "text-slate-400 hover:text-cyan-300",
          )}
          aria-label="Voice search"
        >
          <Mic className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => onSubmit(value)}
          disabled={loading}
          className="h-9 shrink-0 gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-white hover:from-cyan-400 hover:to-blue-500"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Search
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="ask-orion"
          checked={askOrion}
          onCheckedChange={onAskOrionChange}
          className="data-[state=checked]:bg-cyan-500"
        />
        <Label
          htmlFor="ask-orion"
          className="cursor-pointer text-xs text-slate-400"
        >
          Ask Orion AI
        </Label>
      </div>
    </div>
  );
}