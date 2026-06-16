import { type ReactNode } from "react";

type UseCaseCardProps = {
  title: string;
  desc: string;
  icon: ReactNode;
  categoryName: string;
  onClick: (categoryName: string) => void;
};

export function UseCaseCard({ title, desc, icon, categoryName, onClick }: UseCaseCardProps) {
  return (
    <button
      onClick={() => onClick(categoryName)}
      className="group text-left border border-border bg-surface p-5 hover:border-accent transition-all duration-150 flex flex-col justify-between h-full min-h-[9rem] rounded-none cursor-pointer"
    >
      <div className="flex items-start justify-between w-full">
        <div className="w-8 h-8 bg-accent-lt text-accent flex items-center justify-center rounded-none group-hover:bg-accent group-hover:text-bg transition-colors duration-150 shrink-0">
          {icon}
        </div>
        <span className="font-mono text-[0.625rem] text-muted tracking-widest uppercase font-semibold group-hover:text-accent transition-colors">
          SELECT
        </span>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold text-sm tracking-tight text-ink group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-[0.75rem] text-ink2 mt-1 leading-normal line-clamp-2">
          {desc}
        </p>
      </div>
    </button>
  );
}
