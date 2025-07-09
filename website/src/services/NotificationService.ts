/**
 * Real-time Notification Service
 * Handles WebSocket connections and real-time notifications for the OAG Web System
 */

import { supabase } from '../lib/supabase';

export interface Notification {
  id: string;
  type: 'complaint_new' | 'complaint_update' | 'complaint_assigned' | 'system' | 'news';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  userId?: string;
  userRole?: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface ComplaintNotificationData {
  complaintId: string;
  ticketId: string;
  status: string;
  priority: string;
  assignedTo?: string;
  updatedBy?: string;
}

class NotificationService {
  private listeners: Map<string, (notification: Notification) => void> = new Map();
  private realtimeChannel: any = null;
  private isConnected = false;

  constructor() {
    this.initializeRealtimeConnection();
  }

  /**
   * Initialize Supabase realtime connection for notifications
   */
  private initializeRealtimeConnection() {
    try {
      // Subscribe to complaint changes
      this.realtimeChannel = supabase
        .channel('complaint-notifications')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'complaints'
          },
          (payload) => {
            this.handleComplaintChange(payload);
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'complaint_status_updates'
          },
          (payload) => {
            this.handleComplaintStatusUpdate(payload);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'news_articles'
          },
          (payload) => {
            this.handleNewsUpdate(payload);
          }
        )
        .subscribe((status: string) => {
          if (status === 'SUBSCRIBED') {
            this.isConnected = true;
            console.log('✅ Real-time notifications connected');
          } else if (status === 'CHANNEL_ERROR') {
            this.isConnected = false;
            console.error('❌ Real-time notifications connection error');
          }
        });
    } catch (error) {
      console.error('Failed to initialize real-time connection:', error);
    }
  }

  /**
   * Handle complaint table changes
   */
  private handleComplaintChange(payload: any) {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    switch (eventType) {
      case 'INSERT':
        this.createComplaintNotification(newRecord, 'new');
        break;
      case 'UPDATE':
        this.createComplaintNotification(newRecord, 'update', oldRecord);
        break;
    }
  }

  /**
   * Handle complaint status updates
   */
  private handleComplaintStatusUpdate(payload: any) {
    const { eventType, new: newRecord } = payload;

    if (eventType === 'INSERT') {
      this.createStatusUpdateNotification(newRecord);
    }
  }

  /**
   * Handle news updates
   */
  private handleNewsUpdate(payload: any) {
    const { new: newRecord } = payload;

    if (newRecord.status === 'published') {
      this.createNewsNotification(newRecord);
    }
  }

  /**
   * Create complaint-related notifications
   */
  private createComplaintNotification(complaint: any, type: 'new' | 'update', oldRecord?: any) {
    const isNew = type === 'new';
    const statusChanged = oldRecord && oldRecord.status !== complaint.status;
    const assignmentChanged = oldRecord && oldRecord.assigned_to !== complaint.assigned_to;

    // Notification for new complaints (to admins)
    if (isNew) {
      const notification: Notification = {
        id: `complaint-new-${complaint.id}`,
        type: 'complaint_new',
        title: 'New Complaint Received',
        message: `New complaint "${complaint.subject}" from ${complaint.first_name} ${complaint.last_name} (${complaint.ticket_id})`,
        data: {
          complaintId: complaint.id,
          ticketId: complaint.ticket_id,
          status: complaint.status,
          priority: complaint.priority
        } as ComplaintNotificationData,
        read: false,
        userRole: 'admin', // Target admin users
        createdAt: new Date().toISOString(),
        priority: complaint.priority || 'medium'
      };

      this.broadcastNotification(notification);
    }

    // Notification for status changes
    if (statusChanged) {
      const notification: Notification = {
        id: `complaint-status-${complaint.id}-${Date.now()}`,
        type: 'complaint_update',
        title: 'Complaint Status Updated',
        message: `Complaint ${complaint.ticket_id} status changed from "${oldRecord.status}" to "${complaint.status}"`,
        data: {
          complaintId: complaint.id,
          ticketId: complaint.ticket_id,
          status: complaint.status,
          priority: complaint.priority
        } as ComplaintNotificationData,
        read: false,
        userId: complaint.assigned_to,
        createdAt: new Date().toISOString(),
        priority: complaint.priority || 'medium'
      };

      this.broadcastNotification(notification);
    }

    // Notification for assignment changes
    if (assignmentChanged && complaint.assigned_to) {
      const notification: Notification = {
        id: `complaint-assigned-${complaint.id}-${Date.now()}`,
        type: 'complaint_assigned',
        title: 'Complaint Assigned to You',
        message: `You have been assigned complaint ${complaint.ticket_id}: "${complaint.subject}"`,
        data: {
          complaintId: complaint.id,
          ticketId: complaint.ticket_id,
          status: complaint.status,
          priority: complaint.priority,
          assignedTo: complaint.assigned_to
        } as ComplaintNotificationData,
        read: false,
        userId: complaint.assigned_to,
        createdAt: new Date().toISOString(),
        priority: complaint.priority || 'medium'
      };

      this.broadcastNotification(notification);
    }
  }

  /**
   * Create status update notifications
   */
  private createStatusUpdateNotification(statusUpdate: any) {
    if (statusUpdate.update_message) {
      const notification: Notification = {
        id: `status-update-${statusUpdate.id}`,
        type: 'complaint_update',
        title: 'Complaint Update',
        message: `Update on complaint: ${statusUpdate.update_message}`,
        data: {
          complaintId: statusUpdate.complaint_id,
          statusFrom: statusUpdate.status_from,
          statusTo: statusUpdate.status_to,
          updatedBy: statusUpdate.updated_by
        },
        read: false,
        createdAt: new Date().toISOString(),
        priority: 'medium'
      };

      this.broadcastNotification(notification);
    }
  }

  /**
   * Create news notifications
   */
  private createNewsNotification(newsArticle: any) {
    const notification: Notification = {
      id: `news-${newsArticle.id}`,
      type: 'news',
      title: 'New Article Published',
      message: `New article published: "${newsArticle.title_en}"`,
      data: {
        articleId: newsArticle.id,
        title: newsArticle.title_en,
        slug: newsArticle.slug
      },
      read: false,
      createdAt: new Date().toISOString(),
      priority: newsArticle.is_featured ? 'high' : 'low'
    };

    this.broadcastNotification(notification);
  }

  /**
   * Broadcast notification to all listeners
   */
  private broadcastNotification(notification: Notification) {
    this.listeners.forEach((callback) => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });

    // Store notification in localStorage for persistence
    this.storeNotification(notification);
  }

  /**
   * Store notification in localStorage
   */
  private storeNotification(notification: Notification) {
    try {
      const stored = localStorage.getItem('oag-notifications');
      const notifications: Notification[] = stored ? JSON.parse(stored) : [];
      
      // Add new notification
      notifications.unshift(notification);
      
      // Keep only last 50 notifications
      const trimmed = notifications.slice(0, 50);
      
      localStorage.setItem('oag-notifications', JSON.stringify(trimmed));
    } catch (error) {
      console.error('Failed to store notification:', error);
    }
  }

  /**
   * Subscribe to notifications
   */
  public subscribe(id: string, callback: (notification: Notification) => void) {
    this.listeners.set(id, callback);
    
    return () => {
      this.listeners.delete(id);
    };
  }

  /**
   * Get stored notifications
   */
  public getStoredNotifications(): Notification[] {
    try {
      const stored = localStorage.getItem('oag-notifications');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get stored notifications:', error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  public markAsRead(notificationId: string) {
    try {
      const stored = localStorage.getItem('oag-notifications');
      if (stored) {
        const notifications: Notification[] = JSON.parse(stored);
        const updated = notifications.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        );
        localStorage.setItem('oag-notifications', JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  /**
   * Clear all notifications
   */
  public clearAll() {
    try {
      localStorage.removeItem('oag-notifications');
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }

  /**
   * Get connection status
   */
  public isConnectedToRealtime(): boolean {
    return this.isConnected;
  }

  /**
   * Disconnect from real-time updates
   */
  public disconnect() {
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel);
      this.isConnected = false;
    }
  }

  /**
   * Manually trigger a test notification
   */
  public sendTestNotification() {
    const testNotification: Notification = {
      id: `test-${Date.now()}`,
      type: 'system',
      title: 'Test Notification',
      message: 'This is a test notification to verify the system is working correctly.',
      read: false,
      createdAt: new Date().toISOString(),
      priority: 'low'
    };

    this.broadcastNotification(testNotification);
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default NotificationService;
