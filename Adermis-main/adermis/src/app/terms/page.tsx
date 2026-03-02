'use client';

import { motion } from 'framer-motion';
import { FiFileText, FiAlertTriangle, FiCheck, FiShield, FiRefreshCw, FiMail } from 'react-icons/fi';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { TracingBeam } from '@/components/ui/TracingBeam';

const sections = [
  {
    icon: FiCheck,
    title: '1. Acceptance of Terms',
    color: 'border-l-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/5',
    text: 'By accessing or using the Adermis skin analysis service, you agree to be bound by these Terms of Service. If you do not agree to these terms, please discontinue use of our service immediately.',
  },
  {
    icon: FiShield,
    title: '2. User Responsibilities',
    color: 'border-l-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/5',
    items: [
      { label: 'Accurate Information', desc: 'Provide true and current information during registration and skin analysis.' },
      { label: 'Intended Use', desc: 'Use the service solely for personal health insights as intended.' },
      { label: 'Account Security', desc: 'Maintain the confidentiality of your account credentials.' },
      { label: 'Ethical Use', desc: 'Do not misuse the service or attempt to compromise its integrity.' },
    ],
  },
  {
    icon: FiAlertTriangle,
    title: '3. Medical Disclaimer',
    color: 'border-l-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/5',
    text: 'Adermis provides AI-powered skin analysis as an informational tool only. Our service is NOT a substitute for professional medical diagnosis or treatment. Always consult with qualified healthcare professionals for definitive medical advice. Adermis is not liable for any decisions made based on our analysis results.',
    highlight: true,
  },
  {
    icon: FiFileText,
    title: '4. Intellectual Property',
    color: 'border-l-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-500/5',
    text: 'All content, algorithms, machine learning models, and design elements of Adermis are protected intellectual property. You may not reproduce, distribute, or create derivative works from our service without explicit written permission.',
  },
  {
    icon: FiShield,
    title: '5. Privacy & Data Handling',
    color: 'border-l-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-500/5',
    text: 'We are committed to protecting your privacy. Your uploaded images are processed for analysis purposes only. Please refer to our Privacy Policy for detailed information on how we collect, use, and protect your data.',
  },
  {
    icon: FiRefreshCw,
    title: '6. Service Modifications',
    color: 'border-l-teal-500',
    bg: 'bg-teal-50 dark:bg-teal-500/5',
    text: 'Adermis reserves the right to modify, suspend, or discontinue any aspect of the service at any time. We will endeavor to provide reasonable notice of significant changes.',
  },
  {
    icon: FiFileText,
    title: '7. Changes to Terms',
    color: 'border-l-gray-500',
    bg: 'bg-gray-50 dark:bg-gray-800/50',
    text: 'Adermis reserves the right to modify these Terms of Service at any time. Continued use of the service after changes constitutes acceptance of the updated terms. We will notify registered users of significant changes via email.',
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-950">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center mx-auto mb-6"
          >
            <FiFileText className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Terms of Service
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto"
          >
            Please read these terms carefully before using Adermis. They govern your use of our
            AI-powered skin analysis platform.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <TracingBeam>
          <div className="space-y-8">
            {sections.map((section, i) => (
              <ScrollReveal key={section.title} delay={i * 0.05}>
                <div className={`rounded-2xl border-l-4 ${section.color} ${section.bg} p-6`}>
                  <div className="flex items-start gap-3 mb-3">
                    <section.icon className="w-5 h-5 text-gray-700 dark:text-gray-300 mt-0.5 flex-shrink-0" />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{section.title}</h2>
                  </div>
                  <div className="ml-8">
                    {section.text && (
                      <p className={`text-sm leading-relaxed ${section.highlight ? 'text-amber-800 dark:text-amber-300 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                        {section.text}
                      </p>
                    )}
                    {section.items && (
                      <ul className="space-y-3">
                        {section.items.map((item) => (
                          <li key={item.label} className="text-sm">
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{item.label}:</span>{' '}
                            <span className="text-gray-600 dark:text-gray-400">{item.desc}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </TracingBeam>

        {/* Footer note */}
        <ScrollReveal className="mt-16">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 text-center border border-transparent dark:border-gray-800">
            <FiMail className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Questions About These Terms?</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Contact us at{' '}
              <a href="mailto:legal@adermis.ai" className="text-blue-600 dark:text-blue-400 underline">
                legal@adermis.ai
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
