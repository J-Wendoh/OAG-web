import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, Eye, EyeOff, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { complaintsApi } from '../../../shared/utils/api';
import type { ComplaintStatusInfo, ComplaintStatusUpdateRow } from '../../../shared/types/database';

const ComplaintStatusCheck: React.FC = () => {
  const { t } = useTranslation();
  const [ticketId, setTicketId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [complaintData, setComplaintData] = useState<ComplaintStatusInfo | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId.trim() || !password.trim()) {
      setError('Please enter both ticket ID and password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await complaintsApi.checkComplaintStatus({
        ticketId: ticketId.trim(),
        accessPassword: password.trim()
      });
      setComplaintData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check complaint status');
      setComplaintData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'in_progress':
        return <Eye className="w-5 h-5 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'closed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Check Complaint Status
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Enter your ticket ID and password to check the current status of your complaint
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="ticketId" className="block text-sm font-medium text-slate-700 mb-2">
                Ticket ID
              </label>
              <input
                type="text"
                id="ticketId"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your ticket ID (e.g., COMPLAINT-2024-001)"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Checking...</span>
                </div>
              ) : (
                'Check Status'
              )}
            </button>
          </form>
        </motion.div>

        {complaintData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Complaint Details</h2>
              <p className="text-blue-100">Ticket ID: {complaintData.complaint.ticket_id}</p>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Basic Information</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium text-slate-700">Subject:</span> {complaintData.complaint.subject}</p>
                      <p><span className="font-medium text-slate-700">County:</span> {complaintData.complaint.county}</p>
                      <p><span className="font-medium text-slate-700">Priority:</span> {complaintData.complaint.priority}</p>
                      <p><span className="font-medium text-slate-700">Submitted:</span> {formatDate(complaintData.complaint.created_at)}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Current Status</h3>
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(complaintData.complaint.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaintData.complaint.status)}`}>
                        {complaintData.complaint.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Description</h3>
                  <p className="text-slate-700 leading-relaxed">{complaintData.complaint.complaint}</p>
                </div>
              </div>

              {complaintData.statusUpdates && complaintData.statusUpdates.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Status Updates</h3>
                  <div className="space-y-4">
                    {complaintData.statusUpdates.map((update: ComplaintStatusUpdateRow, index: number) => (
                      <motion.div
                        key={update.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="bg-slate-50 rounded-lg p-4 border-l-4 border-blue-500"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              {getStatusIcon(update.status_to)}
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(update.status_to)}`}>
                                {update.status_from ? `${update.status_from} → ` : ''}{update.status_to}
                              </span>
                            </div>
                            {update.update_message && (
                              <p className="text-slate-700 mb-2">{update.update_message}</p>
                            )}
                            <p className="text-sm text-slate-500">
                              Updated on {formatDate(update.created_at)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Need Help?</h3>
            <p className="text-slate-600 mb-4">
              If you can't find your complaint or need assistance, please contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="/complaints"
                className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors"
              >
                Submit New Complaint
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ComplaintStatusCheck; 