'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMail, FiMapPin, FiGithub, FiTwitter, FiLinkedin, FiHeart } from 'react-icons/fi';

const footerLinks = {
  Product: [
    { label: 'AI Skin Scan', href: '/scan/upload' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Scan History', href: '/dashboard/history' },
    { label: 'Find Clinics', href: '/scan/clinics' },
  ],
  Company: [
    { label: 'About Us', href: '/contact' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
  Resources: [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Skin Conditions', href: '/#conditions' },
    { label: 'Research', href: '/#stats' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-gray-950 text-gray-300 overflow-hidden">
      {/* Top gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-white">Adermis</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              AI-powered skin disease diagnosis at your fingertips. Upload a photo and get instant, 
              reliable analysis backed by deep learning technology.
            </p>
            <div className="flex gap-3">
              {[FiGithub, FiTwitter, FiLinkedin].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <FiMail className="w-4 h-4" />
            <span>support@adermis.ai</span>
          </div>
          <div className="flex items-center gap-2">
            <FiMapPin className="w-4 h-4" />
            <span>AI Healthcare Division</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} Adermis. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-red-500"
            >
              <FiHeart className="w-3 h-3 fill-current" />
            </motion.span>
            for better healthcare
          </p>
        </div>
      </div>

      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
    </footer>
  );
}
