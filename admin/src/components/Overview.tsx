import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { 
  Newspaper, 
  FileText, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  ArrowUp,
  ArrowDown,
  UserCheck,
  Badge
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { format } from 'date-fns';

export default function Overview() {
  const { user } = useAuth();
  const { newsArticles, complaints, activityLogs } = useData();

  const publishedNews = newsArticles.filter(article => article.status === 'published');
  const draftNews = newsArticles.filter(article => article.status === 'draft');
  const urgentComplaints = complaints.filter(complaint => complaint.priority === 'urgent');
  const resolvedComplaints = complaints.filter(complaint => complaint.status === 'resolved');

  const isHeadOfCommunications = user?.role === 'head_of_communications';
  const isAttorneyGeneral = user?.role === 'attorney_general';
  const isComplaintHandler = user?.role === 'complaint_handler';

  // Filter data for complaint handlers
  const userComplaints = isComplaintHandler 
    ? complaints.filter(complaint => 
        complaint.assignedToEmail === user.email || 
        complaint.attendedByEmail === user.email
      )
    : complaints;

  const myAssignedComplaints = isComplaintHandler 
    ? complaints.filter(complaint => complaint.assignedToEmail === user.email)
    : [];

  const myResolvedComplaints = isComplaintHandler 
    ? complaints.filter(complaint => 
        complaint.attendedByEmail === user.email && complaint.status === 'resolved'
      )
    : [];

  const complaintsByStatus = [
    { name: 'Pending', value: complaints.filter(c => c.status === 'pending').length, color: '#f59e0b' },
    { name: 'To Be Replied', value: complaints.filter(c => c.status === 'to_be_replied').length, color: '#f97316' },
    { name: 'In Progress', value: complaints.filter(c => c.status === 'in_progress').length, color: '#3b82f6' },
    { name: 'Resolved', value: complaints.filter(c => c.status === 'resolved').length, color: '#10b981' },
    { name: 'Closed', value: complaints.filter(c => c.status === 'closed').length, color: '#6b7280' },
  ];

  const monthlyData = [
    { month: 'Jan', news: 8, complaints: 15, views: 1200 },
    { month: 'Feb', news: 12, complaints: 22, views: 1800 },
    { month: 'Mar', news: 6, complaints: 18, views: 1400 },
    { month: 'Apr', news: 9, complaints: 25, views: 2100 },
    { month: 'May', news: 14, complaints: 20, views: 2800 },
    { month: 'Jun', news: 11, complaints: 17, views: 2400 },
  ];

  const StatCard = ({ title, value, icon: Icon, gradient, change, changeType }: any) => (
    <div className="glass-card rounded-2xl p-6 hover-lift animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 text-sm font-medium ${
            changeType === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {changeType === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            <span>{change}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );

  const getWelcomeMessage = () => {
    if (isHeadOfCommunications) {
      return 'Manage news and communications for the Office of the Attorney General';
    } else if (isAttorneyGeneral) {
      return 'Monitor and oversee all public complaints and legal matters';
    } else if (isComplaintHandler) {
      return 'Handle assigned complaints and provide timely responses to citizens';
    }
    return 'Welcome to the OAG Admin Portal';
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in-up">
      {/* Welcome Section */}
      <div className="glass-card rounded-3xl p-6 lg:p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-blue-100 text-lg">
              {getWelcomeMessage()}
            </p>
          </div>
          <div className="mt-4 lg:mt-0 text-right">
            <p className="text-blue-100 text-sm">Today</p>
            <p className="text-xl font-semibold">{format(new Date(), 'MMMM d, yyyy')}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isHeadOfCommunications && (
          <>
            <StatCard
              title="Published Articles"
              value={publishedNews.length}
              icon={Newspaper}
              gradient="from-blue-500 to-blue-600"
              change={12}
              changeType="up"
            />
            <StatCard
              title="Draft Articles"
              value={draftNews.length}
              icon={Clock}
              gradient="from-yellow-500 to-orange-500"
              change={5}
              changeType="down"
            />
            <StatCard
              title="Total Views"
              value="24,563"
              icon={Eye}
              gradient="from-green-500 to-emerald-500"
              change={18}
              changeType="up"
            />
            <StatCard
              title="Active Readers"
              value="1,247"
              icon={Users}
              gradient="from-purple-500 to-pink-500"
              change={8}
              changeType="up"
            />
          </>
        )}

        {isAttorneyGeneral && (
          <>
            <StatCard
              title="Total Complaints"
              value={complaints.length}
              icon={FileText}
              gradient="from-red-500 to-pink-500"
              change={7}
              changeType="up"
            />
            <StatCard
              title="Urgent Cases"
              value={urgentComplaints.length}
              icon={AlertTriangle}
              gradient="from-orange-500 to-red-500"
              change={15}
              changeType="down"
            />
            <StatCard
              title="Resolved Cases"
              value={resolvedComplaints.length}
              icon={CheckCircle}
              gradient="from-green-500 to-emerald-500"
              change={22}
              changeType="up"
            />
            <StatCard
              title="Response Rate"
              value="94%"
              icon={TrendingUp}
              gradient="from-blue-500 to-indigo-500"
              change={3}
              changeType="up"
            />
          </>
        )}

        {isComplaintHandler && (
          <>
            <StatCard
              title="Assigned to Me"
              value={myAssignedComplaints.length}
              icon={Badge}
              gradient="from-blue-500 to-blue-600"
              change={5}
              changeType="up"
            />
            <StatCard
              title="My Resolved Cases"
              value={myResolvedComplaints.length}
              icon={CheckCircle}
              gradient="from-green-500 to-emerald-500"
              change={12}
              changeType="up"
            />
            <StatCard
              title="Pending Response"
              value={myAssignedComplaints.filter(c => c.status === 'pending' || c.status === 'in_progress').length}
              icon={Clock}
              gradient="from-yellow-500 to-orange-500"
              change={8}
              changeType="down"
            />
            <StatCard
              title="Response Rate"
              value="96%"
              icon={UserCheck}
              gradient="from-purple-500 to-pink-500"
              change={4}
              changeType="up"
            />
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Monthly Overview */}
        <div className="glass-card rounded-2xl p-6 lg:p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
              />
              {isHeadOfCommunications && (
                <>
                  <Bar dataKey="news" fill="url(#blueGradient)" name="News Articles" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="views" fill="url(#purpleGradient)" name="Views" radius={[4, 4, 0, 0]} />
                </>
              )}
              {(isAttorneyGeneral || isComplaintHandler) && (
                <Bar dataKey="complaints" fill="url(#redGradient)" name="Complaints" radius={[4, 4, 0, 0]} />
              )}
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
                <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution or Engagement */}
        <div className="glass-card rounded-2xl p-6 lg:p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            {(isAttorneyGeneral || isComplaintHandler) ? 'Complaint Status Distribution' : 'Engagement Trends'}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            {(isAttorneyGeneral || isComplaintHandler) ? (
              <PieChart>
                <Pie
                  data={complaintsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {complaintsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : (
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card rounded-2xl p-6 lg:p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {activityLogs.slice(0, 5).map((log, index) => (
            <div 
              key={log.id} 
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 animate-slide-in-right"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{log.action}</p>
                <p className="text-xs text-gray-600">{log.details}</p>
                <p className="text-xs text-gray-500 mt-1">by {log.userName}</p>
              </div>
              <div className="text-xs text-gray-500 font-medium">
                {format(new Date(log.timestamp), 'MMM d, HH:mm')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}