import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  variant?: "default" | "critical" | "success" | "warning";
  className?: string;
}

const variantStyles = {
  default: "border-border",
  critical: "border-critical bg-critical/5",
  success: "border-low bg-low/5", 
  warning: "border-medium bg-medium/5"
};

export function KPICard({ title, value, icon, variant = "default", className }: KPICardProps) {
  return (
    <Card className={cn(
      "p-3 shadow-card hover:shadow-elevated transition-shadow", 
      variantStyles[variant],
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className="text-lg font-bold mt-1">{value}</p>
        </div>
        {icon && (
          <div className="text-lg opacity-60">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}