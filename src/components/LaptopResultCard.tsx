import { useState } from "react";
import { Cpu, MemoryStick, HardDrive, Tv2, Battery, Weight, CheckCircle2, XCircle, ShoppingBag, Eye, EyeOff } from "lucide-react";
import type { Recommendation } from "../types";
import { SpecBadge } from "./SpecBadge";
import { MatchScoreBadge } from "./MatchScoreBadge";

type LaptopResultCardProps = {
  rec: Recommendation;
  badge: string;
  label: string;
  highlight: boolean;
  matchScore: number;
};

export function LaptopResultCard({ rec, badge, label, highlight, matchScore }: LaptopResultCardProps) {
  const [showDetail, setShowDetail] = useState(false);

  const tokpUrl = `https://www.tokopedia.com/search?q=${encodeURIComponent(rec.name)}`;
  const shopeeUrl = `https://shopee.co.id/search?keyword=${encodeURIComponent(rec.name)}`;

  return (
    <article
      className={`
        bg-surface border rounded-none overflow-hidden relative
        ${highlight ? "border-accent" : "border-border"}
      `}
    >
      {highlight && (
        <div className="h-1 w-full bg-gradient-to-r from-accent to-accent/50" />
      )}

      {/* Card Header */}
      <div className={`
        px-5 md:px-6 py-3.5 border-b flex items-center justify-between gap-4
        ${highlight ? "bg-accent-lt border-accent/20" : "bg-surface2/60 border-border"}
      `}>
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={`
            font-mono text-[0.625rem] font-bold tracking-widest shrink-0
            ${highlight ? "text-accent" : "text-muted"}
          `}>{badge}</span>
          <span className={`
            text-[0.8125rem] font-bold uppercase tracking-tight
            ${highlight ? "text-accent" : "text-ink2"}
          `}>{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[0.875rem] font-bold text-accent shrink-0 tabular-nums">
            {rec.price}
          </span>
          <MatchScoreBadge score={matchScore} />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 md:p-6 space-y-5">
        <div>
          <h3 className="text-[1.125rem] md:text-[1.25rem] font-bold tracking-tight leading-snug text-ink">
            {rec.name}
          </h3>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <SpecBadge icon={<Cpu className="w-3.5 h-3.5" />}         label="Prosesor" value={rec.specs.cpu} />
          <SpecBadge icon={<MemoryStick className="w-3.5 h-3.5" />} label="RAM"      value={rec.specs.ram} />
          <SpecBadge icon={<HardDrive className="w-3.5 h-3.5" />}   label="Storage"  value={rec.specs.storage} />
          <SpecBadge icon={<Tv2 className="w-3.5 h-3.5" />}         label="GPU"      value={rec.specs.gpu} />
          <SpecBadge icon={<Battery className="w-3.5 h-3.5" />}     label="Baterai"  value={rec.specs.battery} />
          <SpecBadge icon={<Weight className="w-3.5 h-3.5" />}      label="Bobot"    value={rec.specs.weight} />
        </div>

        {/* Description / AI Reason */}
        <div className="space-y-1">
          <p className="font-mono text-[0.55rem] text-muted tracking-wider uppercase">ALASAN AI MEMILIH</p>
          <p className="text-[0.825rem] text-ink2 leading-relaxed max-w-[66ch]">{rec.description}</p>
        </div>

        {/* Pros / Cons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-success-lt border border-success/10 rounded-none p-4 space-y-2.5">
            <p className="font-mono text-[0.625rem] font-bold uppercase tracking-wider text-success flex items-center gap-1.5">
              + Kelebihan
            </p>
            <ul className="space-y-1.5">
              {rec.pros.map((pro, i) => (
                <li key={i} className="text-[0.78rem] text-ink flex items-start gap-2 leading-snug">
                  <span className="font-mono text-success mt-[0.05em] shrink-0 font-bold text-[0.875rem]">+</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-danger-lt border border-danger/10 rounded-none p-4 space-y-2.5">
            <p className="font-mono text-[0.625rem] font-bold uppercase tracking-wider text-danger flex items-center gap-1.5">
              - Kekurangan
            </p>
            <ul className="space-y-1.5">
              {rec.cons.map((con, i) => (
                <li key={i} className="text-[0.78rem] text-ink flex items-start gap-2 leading-snug">
                  <span className="font-mono text-danger mt-[0.05em] shrink-0 font-bold text-[0.875rem]">-</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons Panel */}
        <div className="pt-2 flex flex-wrap gap-2.5 border-t border-border">
          <button
            onClick={() => setShowDetail(!showDetail)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-none border border-border text-[0.6875rem] font-mono font-bold uppercase tracking-wider hover:bg-surface active:scale-[0.98] transition-all cursor-pointer"
          >
            {showDetail ? (
              <>
                <EyeOff className="w-3.5 h-3.5" /> Sembunyikan Detail
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" /> Lihat Detail Spec
              </>
            )}
          </button>
          
          <a
            href={tokpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-none border border-[#00B156]/40 hover:border-[#00B156] bg-[#00B156]/5 text-[#00B156] text-[0.6875rem] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Cari di Tokopedia
          </a>

          <a
            href={shopeeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-none border border-[#EE4D2D]/40 hover:border-[#EE4D2D] bg-[#EE4D2D]/5 text-[#EE4D2D] text-[0.6875rem] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Cari di Shopee
          </a>
        </div>

        {/* Expanded Tech Inspector Detail Spec Panel */}
        {showDetail && (
          <div className="border border-border/80 pt-4 px-4 pb-3 space-y-3 font-mono text-[0.7rem] bg-surface2/50 rounded-none animate-in fade-in duration-150">
            <h4 className="font-bold text-ink uppercase tracking-widest text-[0.625rem] border-b border-border/40 pb-1.5 text-accent">
              INSPEKTOR HARDWARE DETAIL
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              <div className="flex justify-between border-b border-border/40 pb-1">
                <span className="text-muted uppercase text-[0.625rem]">PROSESOR</span>
                <span className="text-ink font-semibold text-right max-w-[70%] truncate" title={rec.specs.cpu}>{rec.specs.cpu}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1">
                <span className="text-muted uppercase text-[0.625rem]">RAM</span>
                <span className="text-ink font-semibold text-right max-w-[70%] truncate" title={rec.specs.ram}>{rec.specs.ram}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1">
                <span className="text-muted uppercase text-[0.625rem]">STORAGE</span>
                <span className="text-ink font-semibold text-right max-w-[70%] truncate" title={rec.specs.storage}>{rec.specs.storage}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1">
                <span className="text-muted uppercase text-[0.625rem]">GRAFIS (GPU)</span>
                <span className="text-ink font-semibold text-right max-w-[70%] truncate" title={rec.specs.gpu}>{rec.specs.gpu}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1">
                <span className="text-muted uppercase text-[0.625rem]">BATERAI</span>
                <span className="text-ink font-semibold text-right max-w-[70%] truncate" title={rec.specs.battery}>{rec.specs.battery}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1">
                <span className="text-muted uppercase text-[0.625rem]">BOBOT</span>
                <span className="text-ink font-semibold text-right max-w-[70%] truncate" title={rec.specs.weight}>{rec.specs.weight}</span>
              </div>
            </div>
            <p className="text-[0.55rem] text-muted italic">
              * CATATAN: KELAYAKAN SPESIFIKASI DAN KETERSEDIAAN BARANG BISA BERBEDA TERGANTUNG DISTRIBUTOR DI TOKOPEDIA/SHOPEE.
            </p>
          </div>
        )}

      </div>
    </article>
  );
}
