import React, { useState } from 'react';
import { Database, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface DatabaseStatus {
  status: string;
  database: string;
  articleCount?: number;
  timestamp: string;
}

const DatabaseStatus: React.FC = () => {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkDatabaseStatus = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/db-status', {
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setStatus(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Database status check failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (isLoading) {
      return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
    }
    if (error) {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
    if (status?.status === '✅ READY') {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    return <Database className="w-5 h-5 text-gray-400" />;
  };

  const getStatusColor = () => {
    if (error) return 'border-red-200 bg-red-50';
    if (status?.status === '✅ READY') return 'border-green-200 bg-green-50';
    if (status) return 'border-yellow-200 bg-yellow-50';
    return 'border-gray-200 bg-gray-50';
  };

  return (
    <div className="max-w-md mx-auto">
      <div className={`border-2 rounded-xl p-4 ${getStatusColor()}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="font-semibold text-gray-900">Database Status</span>
          </div>
          <button
            onClick={checkDatabaseStatus}
            disabled={isLoading}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Checking...' : 'Check'}
          </button>
        </div>

        {error && (
          <div className="text-red-700 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {status && !error && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium">{status.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Database:</span>
              <span className="font-medium">{status.database}</span>
            </div>
            {status.articleCount !== undefined && (
              <div className="flex justify-between">
                <span className="text-gray-600">Articles:</span>
                <span className="font-medium">{status.articleCount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Last Check:</span>
              <span className="font-medium text-xs">
                {new Date(status.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}

        {!status && !error && !isLoading && (
          <div className="text-gray-600 text-sm text-center">
            Click "Check" to test database connectivity
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseStatus;
