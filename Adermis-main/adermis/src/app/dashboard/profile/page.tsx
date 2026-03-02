'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import { useAuth } from '@/components/providers/AuthProvider';
import toast from 'react-hot-toast';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${BACKEND}/api/auth/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      await refreshUser();
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err: any) {
      toast.error(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Manage your account information.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
      >
        {/* Avatar header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-bold border border-white/30">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-blue-200 text-sm">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Profile fields */}
        <div className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">Full Name</label>
            <div className="flex items-center gap-3">
              {editing ? (
                <>
                  <div className="relative flex-1">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="p-2.5 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors"
                  >
                    <FiCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { setEditing(false); setName(user?.name || ''); }}
                    className="p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <div className="flex-1 flex items-center gap-3 py-2.5 px-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <FiUser className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">{user?.name}</span>
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">Email Address</label>
            <div className="flex items-center gap-3 py-2.5 px-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <FiMail className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-900 dark:text-white">{user?.email}</span>
              <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">Cannot be changed</span>
            </div>
          </div>

          {/* Account info */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Account Information</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Account Created</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Account Status</p>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Active</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
