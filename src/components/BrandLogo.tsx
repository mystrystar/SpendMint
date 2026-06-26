import { useState } from "react";
import { WalletCards } from "lucide-react";
import { cn } from "../lib/utils";

export function BrandLogo({ name, logoUrl, className }: { name: string; logoUrl?: string | null; className?: string }) {
  const [failed, setFailed] = useState(false);
  const initial = name.trim().charAt(0).toUpperCase() || "V";

  return (
    <div className={cn("grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/70 bg-white shadow-sm", className)}>
      {logoUrl && !failed ? (
        <img src={logoUrl} alt={`${name} logo`} className="h-full w-full object-contain p-2" onError={() => setFailed(true)} />
      ) : (
        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-emerald-700 to-amber-500 text-sm font-extrabold text-white">
          {initial || <WalletCards className="h-5 w-5" />}
        </div>
      )}
    </div>
  );
}
