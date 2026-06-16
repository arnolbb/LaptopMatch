type MatchScoreBadgeProps = {
  score: number;
};

export function MatchScoreBadge({ score }: MatchScoreBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1.5 border border-accent bg-accent-lt px-2 py-0.5 select-none shrink-0">
      <span className="w-1.5 h-1.5 bg-accent shrink-0" />
      <span className="font-mono text-[0.625rem] font-bold text-accent uppercase tracking-wider tabular-nums">
        {score}% MATCH
      </span>
    </div>
  );
}
