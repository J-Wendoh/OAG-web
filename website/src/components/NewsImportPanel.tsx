import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText,
  AlertTriangle,
  Play,
  Pause
} from 'lucide-react';

interface ImportStats {
  processed: number;
  imported: number;
  skipped: number;
  errors: number;
  errorDetails: string[];
  status: 'idle' | 'running' | 'completed' | 'failed';
  startTime?: string;
  endTime?: string;
  duration?: number;
}

const NewsImportPanel: React.FC = () => {
  const [importStats, setImportStats] = useState<ImportStats>({ 
    processed: 0, 
    imported: 0, 
    skipped: 0, 
    errors: 0, 
    errorDetails: [], 
    status: 'idle' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Poll for import status when running - with safety checks
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let pollCount = 0;
    const maxPolls = 150; // Maximum 5 minutes of polling (150 * 2 seconds)

    if (importStats.status === 'running') {
      interval = setInterval(() => {
        pollCount++;
        if (pollCount >= maxPolls) {
          console.warn('Import polling stopped after maximum attempts');
          clearInterval(interval);
          return;
        }
        fetchImportStatus();
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [importStats.status]);

  const fetchImportStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/news/import', {
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setImportStats(result.data);
      } else {
        console.warn('Import status fetch unsuccessful:', result.error);
      }
    } catch (error) {
      console.error('Error fetching import status:', error);
      // If there's a persistent error, stop polling
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('Import status fetch timed out');
      }
    }
  };

  const startImport = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3001/api/news/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (result.success) {
        setMessage('News import started successfully!');
        setImportStats(result.data);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (importStats.status) {
      case 'running':
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (importStats.status) {
      case 'running':
        return 'border-blue-200 bg-blue-50';
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'failed':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-kenya-green-600 to-kenya-green-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">News Import System</h2>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className="text-white font-medium capitalize">
                {importStats.status}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Control Panel */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Import Control</h3>
                <p className="text-gray-600">Import news articles from the /news directory</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={fetchImportStatus}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={startImport}
                  disabled={isLoading || importStats.status === 'running'}
                  className="flex items-center space-x-2 px-6 py-2 bg-kenya-green-600 text-white rounded-lg hover:bg-kenya-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Import</span>
                </button>
              </div>
            </div>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg ${
                  message.includes('Error') 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}
              >
                {message}
              </motion.div>
            )}
          </div>

          {/* Statistics */}
          {importStats.status !== 'idle' && (
            <div className={`border-2 rounded-xl p-6 ${getStatusColor()}`}>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Import Statistics</h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{importStats.processed}</div>
                  <div className="text-sm text-gray-600">Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{importStats.imported}</div>
                  <div className="text-sm text-gray-600">Imported</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{importStats.skipped}</div>
                  <div className="text-sm text-gray-600">Skipped</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{importStats.errors}</div>
                  <div className="text-sm text-gray-600">Errors</div>
                </div>
              </div>

              {/* Progress Bar */}
              {importStats.status === 'running' && importStats.processed > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{importStats.processed} articles processed</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-blue-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((importStats.imported + importStats.skipped + importStats.errors) / importStats.processed * 100, 100)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}

              {/* Timing Information */}
              {(importStats.startTime || importStats.duration) && (
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  {importStats.startTime && (
                    <span>Started: {new Date(importStats.startTime).toLocaleString()}</span>
                  )}
                  {importStats.duration && (
                    <span>Duration: {formatDuration(importStats.duration)}</span>
                  )}
                </div>
              )}

              {/* Error Details */}
              {importStats.errors > 0 && importStats.errorDetails.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-red-700">Error Details</span>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                    {importStats.errorDetails.map((error, index) => (
                      <div key={index} className="text-sm text-red-700 mb-1">
                        • {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">How it works:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Scans the /news directory for article folders</li>
              <li>• Extracts metadata from folder names and timestamps</li>
              <li>• Processes images and copies them to the public directory</li>
              <li>• Generates bilingual content (English and Swahili)</li>
              <li>• Inserts articles into the database with proper categorization</li>
              <li>• Skips articles that have already been imported</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsImportPanel;
