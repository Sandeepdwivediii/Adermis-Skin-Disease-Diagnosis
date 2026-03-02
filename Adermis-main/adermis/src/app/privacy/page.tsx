'use client';

import { motion } from 'framer-motion';
import { FiShield, FiLock, FiEye, FiDatabase, FiTrash2, FiMail } from 'react-icons/fi';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { TracingBeam } from '@/components/ui/TracingBeam';

const sections = [
  {
    icon: FiDatabase,
    title: 'Information We Collect',
    color: 'blue',
    content: [
      'Account information (name, email) when you register',
      'Skin images you upload for analysis',
      'Analysis results and scan history',
      'Anonymous usage analytics to improve our service',
      'Device and browser information for security purposes',
    ],
  },
  {
    icon: FiEye,
    title: 'How We Use Your Data',
    color: 'indigo',
    content: [
      'Provide accurate AI-powered skin condition analysis',
      'Improve our machine learning model diagnostics',
      'Deliver personalized health recommendations',
      'Maintain scan history for your reference',
      'Send important service-related notifications',
    ],
  },
  {
    icon: FiLock,
    title: 'Data Protection',
    color: 'emerald',
    content: [
      'JWT-based authentication with HttpOnly cookies',
      'Encrypted data transmission via HTTPS',
      'Strict access controls on all stored data',
      'Regular security audits and vulnerability assessments',
      'No sharing of personal data with third parties',
    ],
  },
  {
    icon: FiShield,
    title: 'Your Rights',
    color: 'purple',
    content: [
      'Access all personal data we store about you',
      'Request complete deletion of your account and data',
      'Export your scan history and analysis results',
      'Opt-out of anonymous analytics collection',
      'Withdraw consent for data processing at any time',
    ],
  },
  {
    icon: FiTrash2,
    title: 'Data Retention',
    color: 'amber',
    content: [
      'Account data retained while your account is active',
      'Scan images processed in-memory and not permanently stored on our servers',
      'Analysis results stored in your account until you request deletion',
      'Anonymous analytics data retained for up to 12 months',
      'All data deleted within 30 days of account deletion request',
    ],
  },
];

const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
  blue: { bg: 'bg-blue-50 dark:bg-blue-500/10', icon: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-500/20' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-500/10', icon: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-500/20' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', icon: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-500/20' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-500/10', icon: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-500/20' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-500/10', icon: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-500/20' },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-950">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mx-auto mb-6"
          >
            <FiShield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto"
          >
            At Adermis, protecting your privacy is fundamental to everything we build. Here&apos;s how
            we handle your data responsibly.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <TracingBeam>
          <div className="space-y-10">
            {sections.map((section, i) => {
              const colors = colorMap[section.color];
              return (
                <ScrollReveal key={section.title} delay={i * 0.05}>
                  <div className={`rounded-2xl border ${colors.border} bg-white dark:bg-gray-900/50 p-6`}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                        <section.icon className={`w-5 h-5 ${colors.icon}`} />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-1">{section.title}</h2>
                    </div>
                    <ul className="space-y-2.5 ml-14">
                      {section.content.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </TracingBeam>

        {/* Contact */}
        <ScrollReveal className="mt-16">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 text-center border border-transparent dark:border-gray-800">
            <FiMail className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Questions About Your Privacy?</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Contact our team at{' '}
              <a href="mailto:privacy@adermis.ai" className="text-blue-600 dark:text-blue-400 underline">
                privacy@adermis.ai
              </a>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
}
