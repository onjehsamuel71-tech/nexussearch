import { History, Bookmark, Trash2, Search, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  history: string[];
  bookmarks: string[];
  saveHistory: boolean;
  onSelectHistory: (value: string) => void;
  onClearHistory: () => void;
}

export function Sidebar({
  history,
  bookmarks,
  saveHistory,
  onSelectHistory,
  onClearHistory,
}: SidebarProps) {
  return (
    <aside className="hidden w-72 shrink-0 space-y-4 lg:block">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">Recent Searches</h3>
          </div>
          {saveHistory && history.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClearHistory}
              className="h-7 w-7 text-slate-500 hover:bg-slate-800 hover:text-rose-400"
              aria-label="Clear history"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {!saveHistory ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 px-4 py-6 text-center">
            <ShieldOff className="h-5 w-5 text-slate-600" />
            <p className="text-xs text-slate-500">
              History is off. Turn on “Save Search History” to keep your queries.
            </p>
          </div>
        ) : history.length === 0 ? (
          <p className="text-xs text-slate-500">No searches yet.</p>
        ) : (
          <ul className="space-y-1.5">
            {history.map((item) => (
              <li key={item}>
                <button
                  onClick={() => onSelectHistory(item)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-400 transition-colors hover:bg-slate-800/70 hover:text-cyan-200"
                >
                  <Search className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                  <span className="truncate">{item}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-100">Saved Bookmarks</h3>
          </div>
          <Badge
            variant="outline"
            className="border-slate-700 bg-slate-950/60 text-xs font-normal text-slate-400"
          >
            {bookmarks.length}
          </Badge>
        </div>

        {bookmarks.length === 0 ? (
          <p className="text-xs text-slate-500">
            Bookmark a result to save it to your Nexus Account.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {bookmarks.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-300"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                <span className="truncate">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/60 to-slate-900/60 p-5">
        <p className="text-xs uppercase tracking-widest text-indigo-300">Orion Core</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          Federated inference across 54 nations. Your queries stay on-continent.
        </p>
      </div>
    </aside>
  );
}