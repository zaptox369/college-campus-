import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: "blue" | "emerald" | "amber" | "rose" | "purple";
  trend?: string;
}

export default function StatCard({ title, value, subtitle, icon: Icon, color = "blue", trend }: StatCardProps) {
  const colorMap = {
    blue: "from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30",
    emerald: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30",
    amber: "from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30",
    rose: "from-rose-500/20 to-red-500/10 text-rose-400 border-rose-500/30",
    purple: "from-purple-500/20 to-violet-500/10 text-purple-400 border-purple-500/30",
  };

  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-br ${colorMap[color]} border glass-panel relative overflow-hidden transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-extrabold text-white mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          {trend && <p className="text-[11px] font-medium text-emerald-400 mt-2 flex items-center gap-1">↑ {trend}</p>}
        </div>
        <div className={`p-3.5 rounded-xl bg-gray-900/60 border border-gray-800`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
