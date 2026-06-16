import { Cpu, MemoryStick, HardDrive, Tv2, Battery, Weight, ShoppingBag } from "lucide-react";
import { MatchScoreBadge } from "./MatchScoreBadge";
import { SpecBadge } from "./SpecBadge";

export function RecommendationPreview() {
  return (
    <div className="border border-accent/40 bg-surface rounded-none overflow-hidden max-w-lg mx-auto">
      {/* Header */}
      <div className="px-5 py-3 bg-accent-lt border-b border-accent/20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-mono text-[0.625rem] text-accent tracking-widest font-semibold">PREVIEW</span>
          <span className="text-[0.8125rem] font-semibold text-accent">#1 Pilihan Terbaik</span>
        </div>
        <MatchScoreBadge score={98} />
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-mono text-[0.6875rem] text-muted tracking-wider uppercase">MOCK RECOMMENDATION REPORT</h3>
          <h4 className="text-base font-bold tracking-tight text-ink mt-0.5">Lenovo Legion Slim 5 16</h4>
          <p className="font-mono text-xs font-semibold text-accent mt-1">Rp 19.499.000</p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-1.5">
          <SpecBadge icon={<Cpu className="w-3 h-3" />} label="Prosesor" value="AMD Ryzen 7 7840HS" />
          <SpecBadge icon={<MemoryStick className="w-3 h-3" />} label="RAM" value="16GB DDR5 5600MHz" />
          <SpecBadge icon={<HardDrive className="w-3 h-3" />} label="Storage" value="512GB SSD NVMe Gen4" />
          <SpecBadge icon={<Tv2 className="w-3 h-3" />} label="GPU" value="NVIDIA RTX 4060 8GB" />
        </div>

        {/* AI Reason Description */}
        <p className="text-[0.75rem] text-ink2 leading-relaxed">
          Kombinasi prosesor Ryzen 7 HS-series yang efisien dan GPU RTX 4060 memberikan performa gaming dan editing video terbaik di kelasnya dengan suhu kerja yang terjaga.
        </p>

        {/* Pros / Cons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="bg-success-lt p-3 space-y-1 rounded-none border border-success/10">
            <p className="font-mono text-[0.625rem] font-bold uppercase tracking-wider text-success flex items-center gap-1">
              + KELEBIHAN
            </p>
            <ul className="text-[0.7rem] text-ink space-y-0.5">
              <li>? Performa GPU optimal</li>
              <li>? Layar IPS QHD+ 165Hz</li>
            </ul>
          </div>
          <div className="bg-danger-lt p-3 space-y-1 rounded-none border border-danger/10">
            <p className="font-mono text-[0.625rem] font-bold uppercase tracking-wider text-danger flex items-center gap-1">
              - KEKURANGAN
            </p>
            <ul className="text-[0.7rem] text-ink space-y-0.5">
              <li>? Charger bawaan cukup berat</li>
              <li>? Speaker standard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
