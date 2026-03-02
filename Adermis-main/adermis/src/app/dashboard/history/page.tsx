'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiSearch, FiActivity, FiCalendar, FiChevronDown } from 'react-icons/fi';
import { formatDate } from '@/lib/utils';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

interface ScanRecord {
  _id: string;
  condition: string;
  confidence: number;
  severity: string;
  description: string;
  created_at: string;
}

export default function HistoryPage() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    async function fetchScans() {
      try {
        const res = await fetch(`${BACKEND}/api/scans?limit=50`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setScans(data.scans || []);
        }
      } catch (err) {
        console.error('Failed to fetch scans:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchScans();
  }, []);

  const filteredScans = scans.filter(
    (s) => s.condition?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const severityColor = (sev: string) => {
    switch (sev?.toLowerCase()) {
      case 'mild': return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400';
      case 'moderate': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400';
      case 'severe': return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Scan History</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">All your previous skin analyses.</p>
        </div>

        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conditions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full sm:w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((k) => (
            <div key={k} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800" />
                <div className="flex-1">
                  <div className="w-40 h-4 bg-gray-100 dark:bg-gray-800 rounded mb-2" />
                  <div className="w-24 h-3 bg-gray-100 dark:bg-gray-800 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredScans.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <FiClock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {searchQuery ? 'No matching scans' : 'No scans yet'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {searchQuery ? 'Try a different search term.' : 'Start by uploading a skin image for analysis.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredScans.map((scan, i) => (
            <motion.div
              key={scan._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow"
            >
              <button
                onClick={() => setExpanded(expanded === scan._id ? null : scan._id)}
                className="w-full flex items-center gap-4 p-5 text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <FiActivity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{scan.condition}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <FiCalendar className="w-3 h-3" />
                      {formatDate(scan.created_at)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityColor(scan.severity)}`}>
                      {scan.severity}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{(scan.confidence * 100).toFixed(0)}%</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">confidence</p>
                </div>
                <motion.div
                  animate={{ rotate: expanded === scan._id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </motion.div>
              </button>

              <AnimatePresence>
                {expanded === scan._id && scan.description && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-0 border-t border-gray-50 dark:border-gray-800">
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                        {scan.description}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
