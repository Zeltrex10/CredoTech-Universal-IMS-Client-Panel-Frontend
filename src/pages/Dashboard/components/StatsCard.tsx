import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  className,
}) => {
  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold mt-1 text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className="p-3 bg-primary-50 dark:bg-primary-900/50 rounded-lg">
          <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={cn(
            "text-sm font-medium",
            trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          )}>
            {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
          </span>
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">from last month</span>
        </div>
      )}
    </div>
  );
};