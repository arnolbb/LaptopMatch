import { Cpu, MemoryStick, HardDrive, Tv2 } from "lucide-react";

export function HeroLaptopMockup() {
  return (
    <div className="relative w-full max-w-[480px] mx-auto pt-6 px-4">
      {/* Laptop Screen / Lid */}
      <div className="relative border border-border bg-bg aspect-[16/10] w-full p-2 flex flex-col justify-between overflow-hidden select-none">
        
        {/* Top Camera Notch/Dot */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-border2 rounded-full" />

        {/* Screen Header */}
        <div className="flex items-center justify-between border-b border-border pb-1.5 text-[0.625rem] font-mono text-muted">
          <span>SYSTEM: IDLE</span>
          <span>LAPTOPMATCH_V2.0_SPEC</span>
        </div>

        {/* Mock Screen Content (Technical Spec Grid) */}
        <div className="flex-1 py-4 flex flex-col justify-center gap-2">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 bg-accent" />
            <div className="space-y-1">
              <p className="font-mono text-[0.55rem] text-muted tracking-wider uppercase leading-none">CORE ENGINE</p>
              <p className="font-semibold text-xs leading-none">GEMINI 2.5 FLASH Recommendation</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-surface/50 border border-border/60 p-2 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-accent" />
              <div className="min-w-0">
                <p className="font-mono text-[0.5rem] text-muted leading-none">CPU</p>
                <p className="font-mono text-[0.625rem] font-medium truncate leading-normal">Intel Ultra 7 / Ryzen 7</p>
              </div>
            </div>
            <div className="bg-surface/50 border border-border/60 p-2 flex items-center gap-2">
              <MemoryStick className="w-3.5 h-3.5 text-accent" />
              <div className="min-w-0">
                <p className="font-mono text-[0.5rem] text-muted leading-none">RAM</p>
                <p className="font-mono text-[0.625rem] font-medium truncate leading-normal">16GB / 32GB LPDDR5X</p>
              </div>
            </div>
            <div className="bg-surface/50 border border-border/60 p-2 flex items-center gap-2">
              <HardDrive className="w-3.5 h-3.5 text-accent" />
              <div className="min-w-0">
                <p className="font-mono text-[0.5rem] text-muted leading-none">STORAGE</p>
                <p className="font-mono text-[0.625rem] font-medium truncate leading-normal">1TB NVMe PCIe 4.0</p>
              </div>
            </div>
            <div className="bg-surface/50 border border-border/60 p-2 flex items-center gap-2">
              <Tv2 className="w-3.5 h-3.5 text-accent" />
              <div className="min-w-0">
                <p className="font-mono text-[0.5rem] text-muted leading-none">DISPLAY</p>
                <p className="font-mono text-[0.625rem] font-medium truncate leading-normal">OLED 120Hz 100% DCI-P3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Screen Footer */}
        <div className="flex items-center justify-between border-t border-border pt-1.5 text-[0.55rem] font-mono text-muted">
          <span>OPTIMAL CONFIGURATION FOUND</span>
          <span className="text-accent animate-pulse">? ONLINE</span>
        </div>

      </div>

      {/* Laptop Base (Hinge/Keyboard Base) */}
      <div className="relative w-[108%] -left-[4%] h-2 bg-surface2 border-x border-b border-border flex items-center justify-center">
        {/* Hinge Line */}
        <div className="w-16 h-[2px] bg-border" />
      </div>

      {/* Screen Reflection overlay effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent mix-blend-overlay" />

      {/* Floating Card: AI Match Score */}
      <div className="absolute -top-3 -right-2 bg-surface border-2 border-accent px-3.5 py-2.5 flex items-center gap-2.5">
        <div className="w-1.5 h-1.5 bg-accent shrink-0 animate-ping" />
        <div className="min-w-0">
          <p className="font-mono text-[0.55rem] text-muted leading-none uppercase tracking-wider">AI ASSISTANCE</p>
          <p className="font-mono text-[0.875rem] font-bold text-ink leading-tight mt-0.5">98.4% MATCH</p>
        </div>
      </div>

    </div>
  );
}
