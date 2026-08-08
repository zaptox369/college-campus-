interface LiveOccupancyBadgeProps {
  crowdLevel: string;
  occupancyPct?: number;
  size?: "sm" | "md" | "lg";
}

export default function LiveOccupancyBadge({ crowdLevel, occupancyPct, size = "md" }: LiveOccupancyBadgeProps) {
  let color = "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
  let dotColor = "bg-emerald-400";

  if (crowdLevel === "Medium") {
    color = "bg-amber-500/20 text-amber-400 border-amber-500/40";
    dotColor = "bg-amber-400";
  } else if (crowdLevel === "High") {
    color = "bg-orange-500/20 text-orange-400 border-orange-500/40";
    dotColor = "bg-orange-400";
  } else if (crowdLevel === "Very High") {
    color = "bg-rose-500/20 text-rose-400 border-rose-500/40";
    dotColor = "bg-rose-400";
  }

  const padding = size === "sm" ? "px-2 py-0.5 text-[10px]" : size === "lg" ? "px-4 py-2 text-sm" : "px-2.5 py-1 text-xs";

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${padding} ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotColor}`}></span>
      <span>{crowdLevel} {occupancyPct !== undefined ? `(${occupancyPct}%)` : ""}</span>
    </span>
  );
}
