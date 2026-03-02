'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiCamera, FiClock, FiTrendingUp, FiActivity, FiArrowRight, FiCalendar } from 'react-icons/fi';
import { useAuth } from '@/components/providers/AuthProvider';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { formatDate } from '@/lib/utils';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

interface ScanRecord {
  _id: string;
  condition: string;
  confidence: number;
  severity: string;
  created_at: string;
}

interface DashboardStats {
  total_scans: number;
  conditions_detected: string[];
  last_scan_date: string | null;
  severity_distribution: Record<string, number>;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentScans, setRecentScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, scansRes] = await Promise.all([
          fetch(`${BACKEND}/api/stats`, { credentials: 'include' }),
          fetch(`${BACKEND}/api/scans?limit=5`, { credentials: 'include' }),
        ]);

        if (statsRes.ok) {
          const sData = await statsRes.json();
          setStats(sData);
        }
        if (scansRes.ok) {
          const scData = await scansRes.json();
          setRecentScans(scData.scans || []);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statCards = [
    {
      label: 'Total Scans',
      value: stats?.total_scans ?? 0,
      icon: FiCamera,
      color: 'from-blue-500 to-indigo-500',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      iconColor: 'text-blue-500',
    },
    {
      label: 'Conditions Found',
      value: stats?.conditions_detected?.length ?? 0,
      icon: FiActivity,
      color: 'from-purple-500 to-pink-500',
      bg: 'bg-purple-50 dark:bg-purple-500/10',
      iconColor: 'text-purple-500',
    },
    {
      label: 'Last Scan',
      value: stats?.last_scan_date ? formatDate(stats.last_scan_date) : 'Never',
      icon: FiCalendar,
      color: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      iconColor: 'text-amber-500',
    },
    {
      label: 'Health Score',
      value: stats?.total_scans ? 'Active' : 'Start scanning',
      icon: FiTrendingUp,
      color: 'from-green-500 to-emerald-500',
      bg: 'bg-green-50 dark:bg-green-500/10',
      iconColor: 'text-green-500',
    },
  ];

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Here&apos;s an overview of your skin health journey.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{card.label}</p>
                {loading ? (
                  <div className="w-16 h-7 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof card.value === 'number' ? card.value : card.value}
                  </p>
                )}
              </div>
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick actions + Recent scans */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20"
        >
          <h3 className="font-bold text-lg mb-2">Start New Scan</h3>
          <p className="text-blue-100 text-sm mb-6">
            Upload a photo of your skin concern and get an AI-powered diagnosis in seconds.
          </p>
          <Link
            href="/scan/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 font-semibold rounded-xl text-sm hover:bg-blue-50 transition-colors"
          >
            <FiCamera className="w-4 h-4" />
            Upload Image
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Recent scans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-bold text-gray-900 dark:text-white">Recent Scans</h3>
            <Link href="/dashboard/history" className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1">
              View all <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3].map((k) => (
                <div key={k} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                  <div className="flex-1">
                    <div className="w-32 h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-1" />
                    <div className="w-20 h-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentScans.length === 0 ? (
            <div className="p-10 text-center">
              <FiClock className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">No scans yet. Start your first scan!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {recentScans.map((scan) => (
                <div key={scan._id} className="flex items-center gap-4 p-5 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                    <FiActivity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{scan.condition}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(scan.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {(scan.confidence * 100).toFixed(0)}%
                    </span>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{scan.severity}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
