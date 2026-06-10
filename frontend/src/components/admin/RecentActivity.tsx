'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Activity {
  id: string;
  type: 'product' | 'gallery' | 'message' | 'content';
  action: string;
  description: string;
  time: string;
  user: string;
}

const activityIcons = {
  product: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  gallery: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  message: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  content: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
};

const activityColors = {
  product: 'bg-amber-100 text-amber-600',
  gallery: 'bg-blue-100 text-blue-600',
  message: 'bg-green-100 text-green-600',
  content: 'bg-purple-100 text-purple-600',
};

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/admin/audit-logs?limit=5');
        if (response.ok) {
          const data = await response.json();
          const formattedActivities: Activity[] = data.data?.map((log: any) => {
            const timestamp = new Date(log.timestamp);
            const now = new Date();
            const diffMs = now.getTime() - timestamp.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);

            let timeStr = 'À l\'instant';
            if (diffMins >= 1 && diffMins < 60) timeStr = `Il y a ${diffMins}m`;
            else if (diffHours >= 1 && diffHours < 24) timeStr = `Il y a ${diffHours}h`;
            else if (diffDays >= 1) timeStr = `Il y a ${diffDays}j`;

            return {
              id: log._id,
              type: log.resource as 'product' | 'gallery' | 'message' | 'content',
              action: log.action,
              description: log.details?.name || log.details?.message || 'Modification effectuée',
              time: timeStr,
              user: log.user || 'Admin',
            };
          }) || [];
          setActivities(formattedActivities);
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Activité Récente</h2>
        <button className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors">
          Voir tout
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-4 animate-pulse">
                <div className="w-10 h-10 rounded-lg bg-neutral-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-1/2" />
                  <div className="h-3 bg-neutral-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p>Aucune activité récente</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${activityColors[activity.type]}`}>
                {activityIcons[activity.type]}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900">
                  {activity.action}
                </p>
                <p className="text-sm text-neutral-600 truncate">
                  {activity.description}
                </p>
                <div className="flex items-center mt-1 text-xs text-neutral-500">
                  <span>{activity.time}</span>
                  <span className="mx-2">•</span>
                  <span>{activity.user}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

