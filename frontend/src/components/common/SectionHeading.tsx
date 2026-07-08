import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "mx-auto max-w-3xl text-center",
        align === "left" && "text-left",
        className,
      )}
    >
      {badge && (
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 px-5 py-2 text-xs font-semibold tracking-wide text-primary">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          {badge}
        </div>
      )}
      <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[56px] lg:leading-[1.1]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground md:text-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
