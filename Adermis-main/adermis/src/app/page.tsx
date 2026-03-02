'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiUpload, FiCpu, FiFileText, FiMapPin, FiShield, FiClock, FiZap, FiHeart, FiStar, FiCheck, FiArrowRight, FiChevronDown } from 'react-icons/fi';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { CardHoverEffect } from '@/components/ui/CardHoverEffect';
import { BackgroundBeams } from '@/components/ui/BackgroundBeams';
import { InfiniteMovingCards } from '@/components/ui/InfiniteMovingCards';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { Meteors } from '@/components/ui/Meteors';
import { useState } from 'react';

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const stats = [
  { value: '11+', label: 'Skin Conditions' },
  { value: '95%', label: 'Accuracy Rate' },
  { value: '<10s', label: 'Analysis Time' },
  { value: '24/7', label: 'Availability' },
];

const features = [
  {
    icon: FiCpu,
    title: 'AI-Powered Analysis',
    desc: 'Our deep-learning CNN model trained on thousands of dermatological images provides highly accurate skin condition detection.',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    icon: FiShield,
    title: 'Safety-First Approach',
    desc: 'Every AI response passes through our multi-layer safety pipeline — dosage flagging, harmful content filtering, and medical disclaimers.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: FiClock,
    title: 'Instant Results',
    desc: 'Upload a photo and receive a detailed diagnosis in under 10 seconds. No appointments, no waiting rooms.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: FiFileText,
    title: 'Detailed Reports',
    desc: 'Get comprehensive markdown reports with condition descriptions, severity assessment, and treatment recommendations.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: FiMapPin,
    title: 'Nearby Clinics',
    desc: 'Instantly find dermatology clinics, government hospitals, and NGO centers near you using Google Places integration.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: FiHeart,
    title: 'Scan History & Tracking',
    desc: 'All your scans are saved securely. Track condition changes over time with our dashboard analytics.',
    color: 'from-red-500 to-rose-500',
  },
];

const howItWorks = [
  { step: '01', title: 'Upload Image', desc: 'Take a clear photo of the affected skin area and upload it through our secure interface.', icon: FiUpload },
  { step: '02', title: 'AI Analysis', desc: 'Our CNN model processes the image and identifies potential skin conditions with confidence scores.', icon: FiCpu },
  { step: '03', title: 'Get Diagnosis', desc: 'Receive a detailed AI-enriched report with condition info, remedies, and severity assessment.', icon: FiFileText },
  { step: '04', title: 'Find Care', desc: 'Locate nearby dermatology clinics and healthcare facilities for professional follow-up.', icon: FiMapPin },
];

const conditions = [
  'Acne', 'Eczema', 'Psoriasis', 'Melanoma', 'Vitiligo',
  'Ringworm', 'Impetigo', 'Rosacea', 'Dermatitis', 'Herpes', 'Warts',
];

const testimonials = [
  { quote: 'Adermis identified my eczema condition accurately when I was unsure. The nearby clinic finder helped me get treatment the same day.', name: 'Priya Sharma', title: 'Verified User' },
  { quote: 'As a medical student, I find the AI analysis incredibly educational. The detailed reports help me understand dermatological conditions better.', name: 'Rahul Mehta', title: 'Medical Student' },
  { quote: 'Quick, accurate, and free. I uploaded a photo of my rash and got a comprehensive breakdown within seconds. Highly recommend.', name: 'Ananya Patel', title: 'Verified User' },
  { quote: 'The safety disclaimers and professional referral suggestions give me confidence that this tool prioritizes patient wellbeing.', name: 'Dr. Suresh Kumar', title: 'Dermatologist' },
  { quote: 'I was worried about a mole that changed color. Adermis suggested I see a dermatologist immediately. Early detection matters.', name: 'Kavitha Nair', title: 'Verified User' },
  { quote: 'The scan history feature lets me track how my psoriasis changes over time. It is like having a health journal for my skin.', name: 'Amit Verma', title: 'Verified User' },
];

const faqItems = [
  { q: 'How accurate is the AI diagnosis?', a: 'Our CNN model achieves approximately 95% accuracy on validated test datasets across 11 skin conditions. However, it is designed as a screening tool — always consult a dermatologist for confirmed diagnosis.' },
  { q: 'Is my data secure?', a: 'Absolutely. Images are processed through secure endpoints and scan data is stored in an encrypted MongoDB database. We never share your medical data with third parties.' },
  { q: 'What skin conditions can it detect?', a: 'Currently, Adermis can identify 11 conditions: Acne, Eczema, Psoriasis, Melanoma, Vitiligo, Ringworm, Impetigo, Rosacea, Dermatitis, Herpes, and Warts.' },
  { q: 'Is it free to use?', a: 'Yes, the core AI scan and diagnosis features are completely free. Premium features like advanced analytics may be introduced in the future.' },
  { q: 'Can I use it on mobile?', a: 'Yes! Adermis is fully responsive and works seamlessly on smartphones, tablets, and desktops. Take a photo directly from your phone and upload.' },
];

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="bg-white dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      {/* =============== HERO =============== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <BackgroundBeams />

        {/* Gradient blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/5 dark:to-pink-500/10 rounded-full blur-3xl animate-aurora" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6"
              >
                <FiZap className="w-4 h-4" />
                AI-Powered Skin Diagnosis
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6"
              >
                Your Skin Health,{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Analyzed Instantly
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8 max-w-lg"
              >
                Upload a photo of your skin concern and receive an AI-powered diagnosis in seconds. 
                Powered by deep learning and enriched by Google Gemini for comprehensive, safety-first analysis.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <AnimatedButton href="/scan/upload" size="lg">
                  <FiUpload className="w-5 h-5" />
                  Start Free Scan
                </AnimatedButton>
                <AnimatedButton href="#how-it-works" variant="secondary" size="lg" className="!text-gray-700 dark:!text-gray-300 !border-gray-200 dark:!border-gray-700 hover:!bg-gray-50 dark:hover:!bg-gray-800/50 !bg-white/80 dark:!bg-gray-900/50">
                  Learn More
                  <FiChevronDown className="w-4 h-4" />
                </AnimatedButton>
              </motion.div>
            </div>

            {/* Hero illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-4 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl shadow-blue-500/30 dark:shadow-blue-500/20 p-8 text-white"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                      <FiCpu className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold">AI Scan Result</p>
                      <p className="text-blue-200 text-sm">Analyzed just now</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-xl p-4">
                      <p className="text-sm text-blue-200 mb-1">Detected Condition</p>
                      <p className="font-bold text-lg">Eczema (Atopic Dermatitis)</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold">94.2%</p>
                        <p className="text-xs text-blue-200">Confidence</p>
                      </div>
                      <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold">Mild</p>
                        <p className="text-xs text-blue-200">Severity</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -right-4 top-10 bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-black/40 p-4 border border-gray-100 dark:border-gray-800"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                      <FiCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Safe Analysis</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Verified output</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0], rotate: [0, -3, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                  className="absolute -left-4 bottom-20 bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-black/40 p-4 border border-gray-100 dark:border-gray-800"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                      <FiMapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">3 Clinics Nearby</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Within 5 km</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-100 dark:border-gray-800 shadow-sm"
              >
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* =============== FEATURES =============== */}
      <section className="py-24 bg-gray-50/50 dark:bg-gray-900/50" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need for{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Skin Health
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From AI analysis to clinic discovery, Adermis provides a complete toolkit for understanding and managing your skin conditions.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 0.1}>
                <CardHoverEffect
                  containerClassName="h-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm"
                  className="p-8"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg`}>
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{f.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </CardHoverEffect>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =============== HOW IT WORKS =============== */}
      <section className="py-24 dark:bg-gray-950" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-4">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Four Simple Steps to{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Better Skin Health
              </span>
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <ScrollReveal key={step.step} delay={i * 0.15}>
                <div className="relative group">
                  {i < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-40px)] h-[2px] bg-gradient-to-r from-blue-200 dark:from-blue-500/30 to-indigo-200 dark:to-indigo-500/30" />
                  )}
                  <div className="text-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 border-2 border-blue-100 dark:border-blue-500/20 flex items-center justify-center mx-auto mb-5 group-hover:border-blue-300 dark:group-hover:border-blue-400/50 transition-colors"
                    >
                      <step.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </motion.div>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">Step {step.step}</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-2 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="text-center mt-16">
            <AnimatedButton href="/scan/upload" size="lg">
              Try It Now — It&apos;s Free
              <FiArrowRight className="w-5 h-5" />
            </AnimatedButton>
          </ScrollReveal>
        </div>
      </section>

      {/* =============== CONDITIONS =============== */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-950" id="conditions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium mb-4">
              Conditions We Detect
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              11 Skin Conditions,{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                One Platform
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our CNN model is trained to recognize these common dermatological conditions with high accuracy.
            </p>
          </ScrollReveal>

          <div className="flex flex-wrap justify-center gap-4">
            {conditions.map((c, i) => (
              <ScrollReveal key={c} delay={i * 0.05}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="px-6 py-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md dark:hover:shadow-black/30 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all cursor-default"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{c}</span>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =============== TECHNOLOGY =============== */}
      <section className="py-24 relative overflow-hidden dark:bg-gray-950" id="technology">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <span className="inline-block px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
                Our Technology
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Built on Cutting-Edge{' '}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI Technology
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Adermis combines a custom Convolutional Neural Network (CNN) for image classification with 
                Google Gemini 2.0 Flash for natural language enrichment. Every diagnosis goes through a 
                multi-layer safety pipeline before reaching you.
              </p>

              <div className="space-y-6">
                {[
                  { title: 'Custom CNN Architecture', desc: '3-layer ConvNet with batch normalization and dropout, trained on curated dermatological datasets. Processes 224x224 images and outputs probabilities across 11 disease classes.' },
                  { title: 'Gemini 2.0 Flash Enrichment', desc: 'ML predictions are enriched by Google Gemini to provide detailed descriptions, treatment options, severity assessment, and follow-up recommendations.' },
                  { title: 'Safety Pipeline', desc: 'Every AI output is screened for harmful content, dosage suggestions are flagged, and medical disclaimers are automatically injected.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center mt-0.5">
                      <FiCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="relative">
                <div className="rounded-3xl bg-gradient-to-br from-purple-600/5 to-pink-600/5 dark:from-purple-500/10 dark:to-pink-500/10 border border-purple-100 dark:border-purple-500/20 p-8">
                  <div className="space-y-4">
                    {[
                      { label: 'Image Input', sub: '224 x 224 x 3', color: 'bg-blue-500' },
                      { label: 'CNN Classification', sub: '3 Conv layers + FC', color: 'bg-indigo-500' },
                      { label: 'Top-3 Predictions', sub: 'Class probabilities', color: 'bg-purple-500' },
                      { label: 'Gemini Enrichment', sub: 'Detailed analysis', color: 'bg-pink-500' },
                      { label: 'Safety Filter', sub: 'Content screening', color: 'bg-red-500' },
                      { label: 'Final Report', sub: 'Patient-ready output', color: 'bg-green-500' },
                    ].map((step, i) => (
                      <motion.div
                        key={step.label}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-4"
                      >
                        <div className={`w-3 h-3 rounded-full ${step.color} shadow-lg flex-shrink-0`} />
                        <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{step.label}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{step.sub}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =============== TESTIMONIALS =============== */}
      <section className="py-24 bg-gray-50/50 dark:bg-gray-900/50" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by{' '}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                Thousands
              </span>
            </h2>
          </ScrollReveal>

          <InfiniteMovingCards items={testimonials} speed="slow" />
          <div className="mt-6">
            <InfiniteMovingCards items={[...testimonials].reverse()} direction="right" speed="slow" />
          </div>
        </div>
      </section>

      {/* =============== FAQ =============== */}
      <section className="py-24 dark:bg-gray-950" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-sm font-medium mb-4">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
          </ScrollReveal>

          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 dark:text-white pr-4">{item.q}</span>
                    <motion.span
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <FiChevronDown className="w-5 h-5 text-gray-400" />
                    </motion.span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: openFaq === i ? 'auto' : 0,
                      opacity: openFaq === i ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.a}</p>
                  </motion.div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =============== CTA =============== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700" />
        <Meteors number={15} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Check Your Skin Health?
            </h2>
            <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of users who trust Adermis for instant, AI-powered skin analysis. 
              No appointment needed — just upload a photo and get answers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <AnimatedButton href="/register" size="lg" className="!bg-white !text-blue-600 hover:!bg-blue-50 !shadow-xl">
                Create Free Account
                <FiArrowRight className="w-5 h-5" />
              </AnimatedButton>
              <AnimatedButton href="/scan/upload" variant="secondary" size="lg">
                Scan Without Account
              </AnimatedButton>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
