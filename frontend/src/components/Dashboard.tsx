import React from 'react';
import { TrendingUp, Users, Zap, BarChart3, ArrowUpRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const metrics = [
    { label: 'Trending Topics', value: '24', change: '+12%', icon: TrendingUp, color: 'blue' },
    { label: 'User Engagement', value: '89%', change: '+5%', icon: Users, color: 'green' },
    { label: 'AI Predictions', value: '156', change: '+23%', icon: Zap, color: 'purple' },
    { label: 'Accuracy Score', value: '94.2%', change: '+2.1%', icon: BarChart3, color: 'teal' },
  ];

  const trends = [
    { category: 'Entertainment', trend: 'Interactive Streaming', score: 94, growth: '+15%' },
    { category: 'Fashion', trend: 'Sustainable Luxury', score: 89, growth: '+22%' },
    { category: 'Food & Drink', trend: 'Plant-Based Innovation', score: 91, growth: '+18%' },
    { category: 'Technology', trend: 'AI-Human Collaboration', score: 96, growth: '+28%' },
    { category: 'Travel', trend: 'Micro-Adventures', score: 87, growth: '+12%' },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      teal: 'bg-teal-50 text-teal-700 border-teal-200',
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl border ${getColorClasses(metric.color)}`}>
                <metric.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-green-600 flex items-center">
                {metric.change}
                <ArrowUpRight className="w-3 h-3 ml-1" />
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
              <p className="text-sm text-gray-600">{metric.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trending Now Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Trending Now</h2>
          <p className="text-gray-600">AI-powered insights from your preferences</p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {trends.map((trend, index) => (
            <div
              key={index}
              className="p-6 hover:bg-gray-50 transition-colors duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                      {trend.category}
                    </span>
                    <span className="text-sm font-medium text-green-600 flex items-center">
                      {trend.growth}
                      <ArrowUpRight className="w-3 h-3 ml-1" />
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {trend.trend}
                  </h3>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Trend Score</p>
                    <p className="text-lg font-bold text-gray-900">{trend.score}</p>
                  </div>
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                      style={{ width: `${trend.score}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};