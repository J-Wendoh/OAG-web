import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { 
  Filter, 
  Search, 
  Eye, 
  Reply, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Hash,
  UserCheck,
  Users,
  Badge,
  MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function ComplaintManagement() {
  const { complaints, teamMembers, updateComplaint, addComplaintReply, assignComplaint, logActivity } = useData();
  const { user } = useAuth();
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const isAttorneyGeneral = user?.role === 'attorney_general';
  const isComplaintHandler = user?.role === 'complaint_handler';

  // Filter complaints based on user role
  const userComplaints = isComplaintHandler 
    ? complaints.filter(complaint => 
        complaint.assignedToEmail === user.email || 
        complaint.attendedByEmail === user.email ||
        complaint.status === 'pending'
      )
    : complaints;

  const filteredComplaints = userComplaints.filter(complaint => {
    const matchesFilter = filter === 'all' || complaint.status === filter;
    const matchesSearch = complaint.complaintText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.county.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = (complaintId: string, newStatus: string) => {
    updateComplaint(complaintId, { status: newStatus as any });
    logActivity({
      userId: user?.id || '',
      userName: user?.name || '',
      userEmail: user?.email || '',
      action: 'Complaint Status Updated',
      details: `Updated complaint ${complaintId} status to ${newStatus}`,
      type: 'complaint',
    });
    toast.success('Complaint status updated');
  };

  const handlePriorityChange = (complaintId: string, newPriority: string) => {
    updateComplaint(complaintId, { priority: newPriority as any });
    logActivity({
      userId: user?.id || '',
      userName: user?.name || '',
      userEmail: user?.email || '',
      action: 'Complaint Priority Updated',
      details: `Updated complaint ${complaintId} priority to ${newPriority}`,
      type: 'complaint',
    });
    toast.success('Complaint priority updated');
  };

  const handleAssignComplaint = (teamMemberEmail: string) => {
    const teamMember = teamMembers.find(member => member.email === teamMemberEmail);
    if (teamMember && selectedComplaint) {
      assignComplaint(selectedComplaint.id, teamMemberEmail, teamMember.name);
      logActivity({
        userId: user?.id || '',
        userName: user?.name || '',
        userEmail: user?.email || '',
        action: 'Complaint Assigned',
        details: `Assigned complaint ${selectedComplaint.ticketNumber} to ${teamMember.name}`,
        type: 'complaint',
      });
      setShowAssignModal(false);
      toast.success(`Complaint assigned to ${teamMember.name}`);
    }
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const replyType = formData.get('replyType') as 'external' | 'internal';
    addComplaintReply(selectedComplaint.id, {
      complaintId: selectedComplaint.id,
      content: replyText,
      author: user?.name || 'Unknown',
      authorEmail: user?.email || '',
      date: new Date(),
      type: replyType || 'external',
    });

    // Update complaint status based on reply type
    if (replyType === 'external') {
      updateComplaint(selectedComplaint.id, { 
        status: 'in_progress',
        lastUpdated: new Date()
      });
    }
    logActivity({
      userId: user?.id || '',
      userName: user?.name || '',
      userEmail: user?.email || '',
      action: replyType === 'external' ? 'Public Reply Added' : 'Internal Note Added',
      details: `Added ${replyType} reply to complaint ${selectedComplaint.ticketNumber}`,
      type: 'complaint',
    });

    setReplyText('');
    setShowReplyForm(false);
    toast.success(replyType === 'external' ? 'Public reply sent successfully' : 'Internal note added successfully');
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      to_be_replied: 'bg-orange-100 text-orange-800',
      in_progress: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      normal: 'bg-gray-100 text-gray-800',
      low: 'bg-green-100 text-green-800',
    };
    return colors[priority as keyof typeof colors] || colors.normal;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'to_be_replied':
        return <AlertTriangle className="w-4 h-4" />;
      case 'in_progress':
        return <AlertTriangle className="w-4 h-4" />;
      case 'resolved':
      case 'closed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const complaintHandlers = teamMembers.filter(member => 
    member.role === 'complaint_handler' && member.isActive
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isComplaintHandler ? 'My Assigned Complaints' : 'Complaint Management'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isComplaintHandler 
              ? 'Handle complaints assigned to you and respond to citizens'
              : 'Monitor and manage all public complaints'
            }
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search complaints..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="to_be_replied">To Be Replied</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Complaints List ({filteredComplaints.length})
              </h2>
            </div>
            <div className="divide-y">
              {filteredComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                    selectedComplaint?.id === complaint.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedComplaint(complaint)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-1">
                          <Hash className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{complaint.ticketNumber}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(complaint.status)}`}>
                          {complaint.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityBadge(complaint.priority)}`}>
                          {complaint.priority}
                        </span>
                        {complaint.attendedBy && (
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 flex items-center space-x-1">
                            <UserCheck className="w-3 h-3" />
                            <span>Attended</span>
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {complaint.complaintText}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(complaint.submissionDate), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{complaint.county}</span>
                        </div>
                        {complaint.assignedTo && (
                          <div className="flex items-center space-x-1">
                            <Badge className="w-4 h-4" />
                            <span>Assigned to {complaint.assignedTo}</span>
                          </div>
                        )}
                        {complaint.replies.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>
                              {complaint.replies.filter(r => r.type === 'external').length} public replies, {' '}
                              {complaint.replies.filter(r => r.type === 'internal').length} internal notes
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(complaint.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedComplaint ? (
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedComplaint.ticketNumber}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {(isAttorneyGeneral || (isComplaintHandler && selectedComplaint.assignedToEmail === user?.email)) && (
                      <button
                        onClick={() => setShowReplyForm(!showReplyForm)}
                        className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Reply className="w-4 h-4 mr-2" />
                        Reply
                      </button>
                    )}
                    {isAttorneyGeneral && !selectedComplaint.assignedTo && (
                      <button
                        onClick={() => setShowAssignModal(true)}
                        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Assign
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Complaint Details</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {selectedComplaint.complaintText}
                  </p>
                </div>

                {selectedComplaint.contactInfo && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span>{selectedComplaint.contactInfo.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{selectedComplaint.contactInfo.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{selectedComplaint.contactInfo.phone}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Complaint Metadata</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Submission Date:</span>
                      <span className="font-medium">{format(new Date(selectedComplaint.submissionDate), 'MMM d, yyyy HH:mm')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">
                        {selectedComplaint.lastUpdated 
                          ? format(new Date(selectedComplaint.lastUpdated), 'MMM d, yyyy HH:mm')
                          : 'Not updated'
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">County:</span>
                      <span className="font-medium">{selectedComplaint.county}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Submission Type:</span>
                      <span className="font-medium capitalize">{selectedComplaint.submissionType.replace('_', ' ')}</span>
                    </div>
                    {selectedComplaint.tags && selectedComplaint.tags.length > 0 && (
                      <div>
                        <span className="text-gray-600 block mb-1">Tags:</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedComplaint.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {selectedComplaint.assignedTo && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Assignment Details</h4>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 text-sm">
                        <Badge className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Assigned to:</span>
                        <span>{selectedComplaint.assignedTo}</span>
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        {selectedComplaint.assignedToEmail}
                      </div>
                    </div>
                  </div>
                )}

                {selectedComplaint.attendedBy && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Response Details</h4>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 text-sm">
                        <UserCheck className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Attended by:</span>
                        <span>{selectedComplaint.attendedBy}</span>
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        {selectedComplaint.attendedByEmail}
                      </div>
                      {selectedComplaint.attendedDate && (
                        <div className="text-xs text-green-600 mt-1">
                          {format(new Date(selectedComplaint.attendedDate), 'MMM d, yyyy HH:mm')}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {isAttorneyGeneral && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Status & Priority</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Status</label>
                        <select
                          value={selectedComplaint.status}
                          onChange={(e) => handleStatusChange(selectedComplaint.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="pending">Pending</option>
                          <option value="to_be_replied">To Be Replied</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Priority</label>
                        <select
                          value={selectedComplaint.priority}
                          onChange={(e) => handlePriorityChange(selectedComplaint.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="low">Low</option>
                          <option value="normal">Normal</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {selectedComplaint.replies && selectedComplaint.replies.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Replies</h4>
                    <div className="space-y-3">
                      {selectedComplaint.replies.map((reply: any) => (
                        <div key={reply.id} className="bg-gray-50 p-3 rounded-lg">
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                  reply.type === 'external' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {reply.type === 'external' ? 'Public Reply' : 'Internal Note'}
                                </span>
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-medium text-sm">{reply.author}</span>
                              <span className="text-xs text-gray-500 ml-2">{reply.authorEmail}</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {format(new Date(reply.date), 'MMM d, yyyy HH:mm')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {showReplyForm && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Add Reply</h4>
                    <form onSubmit={handleReplySubmit} className="space-y-3">
                      <div className="flex items-center space-x-4 mb-3">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="replyType"
                            value="external"
                            defaultChecked
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">Public Reply (Citizen will see this)</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="replyType"
                            value="internal"
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">Internal Note</span>
                        </label>
                      </div>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Write your reply to the citizen..."
                        required
                      />
                      <div className="flex items-center space-x-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Send Reply
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowReplyForm(false)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="text-center py-8">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Complaint</h3>
                <p className="text-gray-600">Click on a complaint to view details and manage it</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Complaint</h3>
            <p className="text-gray-600 mb-4">
              Assign complaint {selectedComplaint?.ticketNumber} to a team member:
            </p>
            <div className="space-y-2 mb-6">
              {complaintHandlers.map((handler) => (
                <button
                  key={handler.id}
                  onClick={() => handleAssignComplaint(handler.email)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium">{handler.name}</div>
                  <div className="text-sm text-gray-600">{handler.email}</div>
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}