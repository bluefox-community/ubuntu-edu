import { cn } from '@/lib/utils';

/** Linear progress bar with orange gradient fill. Width animates via CSS transition. */
export default function ProgressBar({
  value,
  className,
  label,
}: {
  /** 0..100 */
  value: number;
  className?: string;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="mb-1.5 flex items-center justify-between font-mono text-xs text-muted-foreground">
          <span>{label}</span>
          <span className="text-orange">{clamped}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-full bg-aubergine-900"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange to-orange-soft transition-[width] duration-[600ms] ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
