import { Globe, ShieldCheck, UserPlus, LogIn, Menu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LANGUAGES = [
  "English",
  "Idoma",
  "Tiv",
  "Igbo",
  "Efik",
  "Edo",
  "Hausa",
  "Yoruba",
  "Pidgin",
  "Swahili",
  "Amharic",
  "Zulu",
  "French",
];

interface HeaderProps {
  language: string;
  onLanguageChange: (value: string) => void;
  saveHistory: boolean;
  onToggleHistory: (value: boolean) => void;
  dataSaver: boolean;
  onToggleDataSaver: (value: boolean) => void;
  onOpenAuth: () => void;
  onToggleSidebar: () => void;
}

export function Header({
  language,
  onLanguageChange,
  saveHistory,
  onToggleHistory,
  dataSaver,
  onToggleDataSaver,
  onOpenAuth,
  onToggleSidebar,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="text-slate-400 hover:bg-slate-800 hover:text-cyan-300"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 shadow-lg shadow-blue-900/50">
                <span className="font-serif text-xl font-bold text-white">N</span>
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-amber-400 shadow shadow-amber-400/60" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold tracking-tight text-white drop-shadow-[0_0_12px_rgba(34,211,238,0.55)] sm:text-3xl">
                  NEXUS
                </h1>
                <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400/90">
                  Powered by Orion AI
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 md:flex">
              <Globe className="h-4 w-4 text-cyan-400" />
              <Select value={language} onValueChange={onLanguageChange}>
                <SelectTrigger className="h-7 w-32 border-0 bg-transparent text-sm text-slate-200 focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-slate-800 bg-slate-900 text-slate-200">
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <Label htmlFor="history-toggle" className="cursor-pointer text-xs text-slate-300">
                Save Search History
              </Label>
              <Switch
                id="history-toggle"
                checked={saveHistory}
                onCheckedChange={onToggleHistory}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAuth}
              className="border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:text-white"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
            <Button
              size="sm"
              onClick={onOpenAuth}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-900/40 hover:from-blue-500 hover:to-cyan-400"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Create Nexus ID
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 md:hidden">
            <Globe className="h-4 w-4 text-cyan-400" />
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger className="h-7 w-32 border-0 bg-transparent text-sm text-slate-200 focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-slate-800 bg-slate-900 text-slate-200">
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <Label htmlFor="data-saver" className="cursor-pointer text-xs text-amber-200">
              Data-Saver Mode
            </Label>
            <Switch
              id="data-saver"
              checked={dataSaver}
              onCheckedChange={onToggleDataSaver}
              className="data-[state=checked]:bg-amber-500"
            />
          </div>
        </div>
      </div>
    </header>
  );
}