import { cn } from "@/lib/utils";

interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: "hero" | "features" | "default";
}

export function GradientBackground({
  children,
  className,
  variant = "default",
}: GradientBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {variant === "hero" && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
          <div className="pointer-events-none absolute -top-40 -right-40 size-[500px] rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 size-[400px] rounded-full bg-accent/10 blur-3xl" />
        </>
      )}
      {variant === "features" && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
          <div className="pointer-events-none absolute -top-20 -right-20 size-[300px] rounded-full bg-secondary/10 blur-3xl" />
        </>
      )}
      {children}
    </div>
  );
}
