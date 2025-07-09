import React, { createContext, useState, useEffect, ReactNode } from 'react';

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  publishDate: Date;
  author: string;
  status: 'published' | 'draft' | 'archived';
  order: number;
}

export interface Complaint {
  id: string;
  ticketNumber: string;
  submissionDate: Date;
  complaintText: string;
  submissionType: 'anonymous' | 'with_contact';
  contactInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  attachment?: string;
  county: string;
  status: 'pending' | 'to_be_replied' | 'in_progress' | 'resolved' | 'closed';
  priority: 'urgent' | 'normal' | 'low';
  assignedTo?: string;
  assignedToEmail?: string;
  attendedBy?: string;
  attendedByEmail?: string;
  attendedDate?: Date;
  lastUpdated?: Date;
  tags?: string[];
  replies: ComplaintReply[];
}

export interface ComplaintReply {
  id: string;
  complaintId: string;
  content: string;
  author: string;
  authorEmail: string;
  date: Date;
  type: 'internal' | 'external';
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  details: string;
  timestamp: Date;
  type: 'news' | 'complaint' | 'system';
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'complaint_handler' | 'head_of_communications' | 'attorney_general';
  isActive: boolean;
}

interface DataContextType {
  newsArticles: NewsArticle[];
  complaints: Complaint[];
  activityLogs: ActivityLog[];
  teamMembers: TeamMember[];
  addNewsArticle: (article: Omit<NewsArticle, 'id'>) => void;
  updateNewsArticle: (id: string, article: Partial<NewsArticle>) => void;
  deleteNewsArticle: (id: string) => void;
  reorderNewsArticles: (articles: NewsArticle[]) => void;
  updateComplaint: (id: string, complaint: Partial<Complaint>) => void;
  assignComplaint: (complaintId: string, teamMemberEmail: string, teamMemberName: string) => void;
  markComplaintAttended: (complaintId: string, handlerEmail: string, handlerName: string) => void;
  addComplaintReply: (complaintId: string, reply: Omit<ComplaintReply, 'id'>) => void;
  logActivity: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

const initialNewsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'Attorney General Launches New Anti-Corruption Initiative',
    content: '<p>The Attorney General has announced a comprehensive new initiative to combat corruption in public institutions. This program will include enhanced oversight mechanisms, whistleblower protection, and strengthened legal frameworks.</p><p>The initiative represents a significant step forward in our commitment to transparency and accountability in government operations.</p>',
    excerpt: 'New comprehensive anti-corruption program launched with enhanced oversight and whistleblower protection.',
    image: 'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishDate: new Date('2024-01-15'),
    author: 'OAG Head of Communications',
    status: 'published',
    order: 1,
  },
  {
    id: '2',
    title: 'Public Consultation on New Legal Framework',
    content: '<p>We are pleased to announce the commencement of public consultations on the proposed amendments to the Legal Aid Act. This initiative aims to expand access to legal services for all Kenyans.</p><p>Citizens are encouraged to participate in the consultation process through various channels including public forums, online submissions, and written comments.</p>',
    excerpt: 'Public consultation begins on Legal Aid Act amendments to expand access to legal services.',
    image: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishDate: new Date('2024-01-10'),
    author: 'OAG Head of Communications',
    status: 'published',
    order: 2,
  },
];

const initialComplaints: Complaint[] = [
  {
    id: '1',
    ticketNumber: 'AG-001',
    submissionDate: new Date('2024-01-20'),
    complaintText: 'I am writing to report suspected corruption in the procurement process at the County Government of Nairobi. Contracts worth millions of shillings appear to have been awarded without proper tender procedures.',
    submissionType: 'with_contact',
    contactInfo: {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+254712345678',
    },
    county: 'Nairobi',
    status: 'pending',
    priority: 'urgent',
    lastUpdated: new Date('2024-01-20'),
    tags: ['corruption', 'procurement'],
    replies: [],
  },
  {
    id: '2',
    ticketNumber: 'AG-002',
    submissionDate: new Date('2024-01-18'),
    complaintText: 'There are allegations of bribery involving police officers at the Mombasa Central Police Station. Citizens are being asked to pay bribes for basic services.',
    submissionType: 'anonymous',
    county: 'Mombasa',
    status: 'to_be_replied',
    priority: 'urgent',
    assignedTo: 'Mary Wanjiku',
    assignedToEmail: 'mary.wanjiku@ag.go.ke',
    attendedBy: 'Mary Wanjiku',
    attendedByEmail: 'mary.wanjiku@ag.go.ke',
    attendedDate: new Date('2024-01-19'),
    lastUpdated: new Date('2024-01-19'),
    tags: ['police', 'bribery'],
    replies: [
      {
        id: '1',
        complaintId: '2',
        content: 'Thank you for bringing this matter to our attention. We have initiated an investigation and will keep you updated on our progress.',
        author: 'Mary Wanjiku',
        authorEmail: 'mary.wanjiku@ag.go.ke',
        date: new Date('2024-01-19'),
        type: 'external',
      },
    ],
  },
  {
    id: '3',
    ticketNumber: 'AG-003',
    submissionDate: new Date('2024-01-22'),
    complaintText: 'I would like to report delays in the issuance of birth certificates at the Registrar of Persons office in Kisumu. People have been waiting for months without receiving their documents.',
    submissionType: 'with_contact',
    contactInfo: {
      name: 'Grace Achieng',
      email: 'grace.achieng@email.com',
      phone: '+254723456789',
    },
    county: 'Kisumu',
    status: 'resolved',
    priority: 'normal',
    assignedTo: 'Peter Kimani',
    assignedToEmail: 'peter.kimani@ag.go.ke',
    attendedBy: 'Peter Kimani',
    attendedByEmail: 'peter.kimani@ag.go.ke',
    attendedDate: new Date('2024-01-23'),
    lastUpdated: new Date('2024-01-23'),
    tags: ['civil-registration', 'delays'],
    replies: [
      {
        id: '2',
        complaintId: '3',
        content: 'We have contacted the Registrar of Persons office in Kisumu and they have committed to clearing the backlog within 2 weeks. We will monitor the situation closely.',
        author: 'Peter Kimani',
        authorEmail: 'peter.kimani@ag.go.ke',
        date: new Date('2024-01-23'),
        type: 'external',
      },
    ],
  },
];

const initialTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Mary Wanjiku',
    email: 'mary.wanjiku@ag.go.ke',
    role: 'complaint_handler',
    isActive: true,
  },
  {
    id: '2',
    name: 'Peter Kimani',
    email: 'peter.kimani@ag.go.ke',
    role: 'complaint_handler',
    isActive: true,
  },
  {
    id: '3',
    name: 'Sarah Muthoni',
    email: 'sarah.muthoni@ag.go.ke',
    role: 'complaint_handler',
    isActive: true,
  },
  {
    id: '4',
    name: 'James Ochieng',
    email: 'james.ochieng@ag.go.ke',
    role: 'complaint_handler',
    isActive: true,
  },
  {
    id: '5',
    name: 'Hon. Dorcas',
    email: 'communications@ag.go.ke',
    role: 'head_of_communications',
    isActive: true,
  },
  {
    id: '6',
    name: 'Hon. Dorcas Oduor',
    email: 'ag@ag.go.ke',
    role: 'attorney_general',
    isActive: true,
  },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const savedNews = localStorage.getItem('ag_news_articles');
    const savedComplaints = localStorage.getItem('ag_complaints');
    const savedLogs = localStorage.getItem('ag_activity_logs');
    const savedTeamMembers = localStorage.getItem('ag_team_members');

    setNewsArticles(savedNews ? JSON.parse(savedNews) : initialNewsArticles);
    setComplaints(savedComplaints ? JSON.parse(savedComplaints) : initialComplaints);
    setActivityLogs(savedLogs ? JSON.parse(savedLogs) : []);
    setTeamMembers(savedTeamMembers ? JSON.parse(savedTeamMembers) : initialTeamMembers);
  }, []);

  const saveNewsArticles = (articles: NewsArticle[]) => {
    localStorage.setItem('ag_news_articles', JSON.stringify(articles));
    setNewsArticles(articles);
  };

  const saveComplaints = (complaints: Complaint[]) => {
    localStorage.setItem('ag_complaints', JSON.stringify(complaints));
    setComplaints(complaints);
  };

  const saveActivityLogs = (logs: ActivityLog[]) => {
    localStorage.setItem('ag_activity_logs', JSON.stringify(logs));
    setActivityLogs(logs);
  };

  const saveTeamMembers = (members: TeamMember[]) => {
    localStorage.setItem('ag_team_members', JSON.stringify(members));
    setTeamMembers(members);
  };

  const addNewsArticle = (article: Omit<NewsArticle, 'id'>) => {
    const newArticle = {
      ...article,
      id: Date.now().toString(),
    };
    const updatedArticles = [...newsArticles, newArticle];
    saveNewsArticles(updatedArticles);
  };

  const updateNewsArticle = (id: string, articleUpdate: Partial<NewsArticle>) => {
    const updatedArticles = newsArticles.map(article =>
      article.id === id ? { ...article, ...articleUpdate } : article
    );
    saveNewsArticles(updatedArticles);
  };

  const deleteNewsArticle = (id: string) => {
    const updatedArticles = newsArticles.filter(article => article.id !== id);
    saveNewsArticles(updatedArticles);
  };

  const reorderNewsArticles = (articles: NewsArticle[]) => {
    saveNewsArticles(articles);
  };

  const updateComplaint = (id: string, complaintUpdate: Partial<Complaint>) => {
    const updatedComplaints = complaints.map(complaint =>
      complaint.id === id ? { ...complaint, ...complaintUpdate } : complaint
    );
    saveComplaints(updatedComplaints);
  };

  const assignComplaint = (complaintId: string, teamMemberEmail: string, teamMemberName: string) => {
    const updatedComplaints = complaints.map(complaint =>
      complaint.id === complaintId 
        ? { 
            ...complaint, 
            assignedTo: teamMemberName,
            assignedToEmail: teamMemberEmail,
            status: 'in_progress' as const
          } 
        : complaint
    );
    saveComplaints(updatedComplaints);
  };

  const markComplaintAttended = (complaintId: string, handlerEmail: string, handlerName: string) => {
    const updatedComplaints = complaints.map(complaint =>
      complaint.id === complaintId 
        ? { 
            ...complaint, 
            attendedBy: handlerName,
            attendedByEmail: handlerEmail,
            attendedDate: new Date(),
            status: complaint.status === 'pending' ? 'in_progress' as const : complaint.status
          } 
        : complaint
    );
    saveComplaints(updatedComplaints);
  };

  const addComplaintReply = (complaintId: string, reply: Omit<ComplaintReply, 'id'>) => {
    const newReply = {
      ...reply,
      id: Date.now().toString(),
    };
    const updatedComplaints = complaints.map(complaint =>
      complaint.id === complaintId
        ? { ...complaint, replies: [...complaint.replies, newReply] }
        : complaint
    );
    saveComplaints(updatedComplaints);

    // Mark as attended when a reply is added
    markComplaintAttended(complaintId, reply.authorEmail, reply.author);
  };

  const logActivity = (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    const updatedLogs = [newLog, ...activityLogs];
    saveActivityLogs(updatedLogs);
  };

  return (
    <DataContext.Provider
      value={{
        newsArticles,
        complaints,
        activityLogs,
        teamMembers,
        addNewsArticle,
        updateNewsArticle,
        deleteNewsArticle,
        reorderNewsArticles,
        updateComplaint,
        assignComplaint,
        markComplaintAttended,
        addComplaintReply,
        logActivity,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}