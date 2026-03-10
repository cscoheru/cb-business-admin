import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export function StatCard({ label, value, icon: Icon, trend, description }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-muted-foreground">{label}</div>
        {Icon && (
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      {trend && (
        <div className={`text-xs flex items-center gap-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          <span className="text-muted-foreground">vs 上期</span>
        </div>
      )}
      {description && (
        <div className="text-xs text-muted-foreground mt-1">{description}</div>
      )}
    </Card>
  );
}
