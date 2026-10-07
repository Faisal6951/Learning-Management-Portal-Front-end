import { cn } from "@/lib/utils";

export function PercentageBar({
  percentage,
  lowAttendance,
  className,
}: {
  percentage: number;
  lowAttendance?: boolean;
  className?: string;
}) {
  const color = lowAttendance || percentage < 70 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{percentage}%</span>
        {lowAttendance && (
          <span className="text-amber-700" aria-label="Low attendance warning">
            Low
          </span>
        )}
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Attendance ${percentage} percent`}
      >
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
