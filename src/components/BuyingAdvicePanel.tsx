import { ShoppingBag } from "lucide-react";

type BuyingAdvicePanelProps = {
  advice: string;
};

export function BuyingAdvicePanel({ advice }: BuyingAdvicePanelProps) {
  return (
    <div className="bg-surface border border-border rounded-none p-5 md:p-6">
      <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
        <div className="w-7 h-7 bg-accent-lt text-accent flex items-center justify-center rounded-none shrink-0">
          <ShoppingBag className="w-3.5 h-3.5" />
        </div>
        <div>
          <p className="font-mono text-[0.55rem] text-muted tracking-wider uppercase leading-none">AI SYSTEM ADVICE</p>
          <h4 className="font-semibold text-xs text-ink tracking-tight mt-0.5">Saran Pembelian dari AI</h4>
        </div>
      </div>
      <p className="text-[0.78rem] text-ink2 leading-relaxed whitespace-pre-line font-normal">
        {advice}
      </p>
    </div>
  );
}
