import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { Activity, Filter, Calendar, User, FileText, Newspaper, Settings } from 'lucide-react';
import { format } from 'date-fns';

export default function ActivityLogs() {
  const { activityLogs } = useData();
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredLogs = activityLogs.filter(log => {
    const matchesType = filter === 'all' || log.type === filter;
    const matchesDate = dateFilter === 'all' || isWithinDateRange(log.timestamp, dateFilter);
    return matchesType && matchesDate;
  });

  const isWithinDateRange = (timestamp: Date, range: string) => {
    const now = new Date();
    const logDate = new Date(timestamp);
    
    switch (range) {
      case 'today':
        return logDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return logDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return logDate >= monthAgo;
      default:
        return true;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'news':
        return <Newspaper className="w-5 h-5 text-blue-600" />;
      case 'complaint':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'system':
        return <Settings className="w-5 h-5 text-gray-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'news':
        return 'bg-blue-100';
      case 'complaint':
        return 'bg-red-100';
      case 'system':
        return 'bg-gray-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="news">News</option>
            <option value="complaint">Complaints</option>
            <option value="system">System</option>
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="divide-y">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Activity Found</h3>
              <p className="text-gray-600">No activity logs match your current filters.</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${getActivityColor(log.type)}`}>
                    {getActivityIcon(log.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900">{log.action}</h3>
                      <span className="text-sm text-gray-500">
                        {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{log.userName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-400">•</span>
                        <span>{log.userEmail}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span className="capitalize">{log.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}