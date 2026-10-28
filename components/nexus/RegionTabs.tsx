import { REGIONS } from "@/lib/nexusData";
import { cn } from "@/lib/utils";

interface RegionTabsProps {
  active: string;
  onChange: (id: string) => void;
}

export function RegionTabs({ active, onChange }: RegionTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {REGIONS.map((r) => (
        <button
          key={r.id}
          onClick={() => onChange(r.id)}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
            active === r.id
              ? "border-cyan-400/60 bg-cyan-500/15 text-cyan-200"
              : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-200",
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}