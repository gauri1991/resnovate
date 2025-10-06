'use client';

import { motion } from 'framer-motion';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  iconBgColor?: string;
  description?: string;
  trend?: Array<{ month: string; value: number }>;
}

export default function StatsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  iconBgColor = 'bg-blue-500',
  description,
  trend,
}: StatsCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return <ArrowTrendingUpIcon className="h-4 w-4" />;
      case 'decrease':
        return <ArrowTrendingDownIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300"
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
              <div className="text-white">{icon}</div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
          {change !== undefined && (
            <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
              {getChangeIcon()}
              <span className="text-sm font-medium">
                {change > 0 ? '+' : ''}{change}%
              </span>
            </div>
          )}
        </div>
        
        {description && (
          <p className="mt-3 text-sm text-gray-500">{description}</p>
        )}
        
        {trend && trend.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center space-x-1 h-8">
              {trend.map((point, index) => (
                <div
                  key={index}
                  className="flex-1 bg-gray-100 rounded-sm relative overflow-hidden"
                  style={{ height: '6px' }}
                >
                  <div
                    className={`absolute bottom-0 left-0 ${iconBgColor.replace('bg-', 'bg-opacity-70 bg-')} rounded-sm transition-all duration-500`}
                    style={{
                      height: `${Math.max(10, (point.value / Math.max(...trend.map(t => t.value))) * 100)}%`,
                      animationDelay: `${index * 100}ms`
                    }}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">Last 6 months trend</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}