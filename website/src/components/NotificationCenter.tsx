import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, AlertCircle, FileText, MessageSquare, Trash2, Settings } from 'lucide-react';
import { notificationService } from '../services/NotificationService';
import type { Notification } from '../services/NotificationService';

interface NotificationCenterProps {
  userRole?: string;
  userId?: string;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ userRole, userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<'all' | 'unread' | 'complaints' | 'news'>('all');
  const [isConnected, setIsConnected] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load stored notifications
    const stored = notificationService.getStoredNotifications();
    setNotifications(stored);
    updateUnreadCount(stored);

    // Check connection status
    setIsConnected(notificationService.isConnectedToRealtime());

    // Subscribe to new notifications
    const unsubscribe = notificationService.subscribe('notification-center', (notification) => {
      // Filter notifications based on user role and ID
      if (shouldShowNotification(notification)) {
        setNotifications(prev => {
          const updated = [notification, ...prev];
          updateUnreadCount(updated);
          return updated;
        });

        // Show browser notification if permission granted
        showBrowserNotification(notification);
      }
    });

    // Request notification permission
    requestNotificationPermission();

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userRole, userId]);

  const shouldShowNotification = (notification: Notification): boolean => {
    // Show all notifications if no user context
    if (!userRole && !userId) return true;

    // Show notifications targeted to user role
    if (notification.userRole && notification.userRole === userRole) return true;

    // Show notifications targeted to specific user
    if (notification.userId && notification.userId === userId) return true;

    // Show general notifications (no specific targeting)
    if (!notification.userRole && !notification.userId) return true;

    return false;
  };

  const updateUnreadCount = (notificationList: Notification[]) => {
    const unread = notificationList.filter(n => !n.read && shouldShowNotification(n)).length;
    setUnreadCount(unread);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const showBrowserNotification = (notification: Notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id
      });

      browserNotification.onclick = () => {
        window.focus();
        setIsOpen(true);
        browserNotification.close();
      };

      // Auto close after 5 seconds
      setTimeout(() => browserNotification.close(), 5000);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'complaint_new':
      case 'complaint_update':
      case 'complaint_assigned':
        return <FileText className="w-4 h-4" />;
      case 'news':
        return <MessageSquare className="w-4 h-4" />;
      case 'system':
        return <Settings className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'urgent') return 'text-red-600 bg-red-50';
    if (priority === 'high') return 'text-orange-600 bg-orange-50';
    
    switch (type) {
      case 'complaint_new':
      case 'complaint_assigned':
        return 'text-kenya-red-600 bg-kenya-red-50';
      case 'complaint_update':
        return 'text-blue-600 bg-blue-50';
      case 'news':
        return 'text-kenya-green-600 bg-kenya-green-50';
      case 'system':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (!shouldShowNotification(notification)) return false;
    
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'complaints':
        return notification.type.startsWith('complaint');
      case 'news':
        return notification.type === 'news';
      default:
        return true;
    }
  });

  const markAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId);
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      updateUnreadCount(updated);
      return updated;
    });
  };

  const markAllAsRead = () => {
    const unreadIds = notifications.filter(n => !n.read && shouldShowNotification(n)).map(n => n.id);
    unreadIds.forEach(id => notificationService.markAsRead(id));
    
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      updateUnreadCount(updated);
      return updated;
    });
  };

  const clearAll = () => {
    notificationService.clearAll();
    setNotifications([]);
    setUnreadCount(0);
  };

  const sendTestNotification = () => {
    notificationService.sendTestNotification();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-kenya-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.div>
        )}

        {/* Connection Status Indicator */}
        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        }`} />
      </motion.button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-xs text-gray-500">
                    {isConnected ? 'Live' : 'Offline'}
                  </span>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'unread', label: 'Unread' },
                  { key: 'complaints', label: 'Complaints' },
                  { key: 'news', label: 'News' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key as any)}
                    className={`flex-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      filter === tab.key
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              {filteredNotifications.length > 0 && (
                <div className="flex items-center justify-between mt-3">
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-kenya-green-600 hover:text-kenya-green-700 font-medium"
                  >
                    Mark all read
                  </button>
                  <button
                    onClick={clearAll}
                    className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No notifications</p>
                  {process.env.NODE_ENV === 'development' && (
                    <button
                      onClick={sendTestNotification}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-700"
                    >
                      Send test notification
                    </button>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${getNotificationColor(notification.type, notification.priority)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {formatTime(notification.createdAt)}
                            </span>
                            
                            {notification.priority === 'urgent' && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-medium">
                                Urgent
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
