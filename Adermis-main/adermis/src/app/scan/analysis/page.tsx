'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiArrowLeft, FiArrowRight, FiMapPin, FiShield, FiCheckCircle } from 'react-icons/fi';
import { useSkinAnalysis } from '../context/SkinAnalysisContext';

export default function AnalysisPage() {
  const router = useRouter();
  const { result, input } = useSkinAnalysis();

  useEffect(() => {
    if (!result) {
      router.push('/scan/upload');
    }
  }, [result, router]);

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  const predictions = result.predictions || [];
  const primaryPrediction = predictions[0] || { condition: result.top_condition || 'Unknown', confidence: 0 };
  const confPercent = (primaryPrediction.confidence * 100).toFixed(1);

  const severityConfig: Record<string, { color: string; bg: string; label: string }> = {
    mild: { color: 'text-green-700 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-500/10', label: 'Mild' },
    moderate: { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-500/10', label: 'Moderate' },
    severe: { color: 'text-red-700 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-500/10', label: 'Severe' },
  };

  const sev = severityConfig[result.severity?.toLowerCase()] || severityConfig.mild;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-3 mb-12">
        {[
          { label: 'Upload', active: false, done: true },
          { label: 'Analysis', active: true, done: false },
          { label: 'Clinics', active: false, done: false },
        ].map((step, i) => (
          <div key={step.label} className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              step.active
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : step.done
                ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
            }`}>
              {step.done ? (
                <FiCheckCircle className="w-4 h-4" />
              ) : (
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
              )}
              {step.label}
            </div>
            {i < 2 && <div className="w-8 h-0.5 bg-gray-200 dark:bg-gray-700 hidden sm:block" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Primary result card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <p className="text-blue-200 text-sm mb-1">Primary Detection</p>
              <h2 className="text-2xl font-bold">{result.top_condition}</h2>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-3xl font-bold">{confPercent}%</span>
                <span className="text-blue-200 text-sm">confidence</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sev.bg} ${sev.color}`}>
                  {sev.label} Severity
                </span>
              </div>
            </div>

            {/* All predictions */}
            <div className="p-6">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">All Predictions</h3>
              <div className="space-y-3">
                {predictions.map((pred, i) => (
                  <div key={pred.condition} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 dark:text-gray-500 w-4">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{pred.condition}</span>
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{(pred.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pred.confidence * 100}%` }}
                          transition={{ duration: 1, delay: i * 0.2 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
          >
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">About This Condition</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">{result.description}</p>
          </motion.div>

          {/* Recommendations */}
          {(result.recommendations || []).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
            >
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recommendations</h3>
              <div className="space-y-3">
                {(result.recommendations || []).map((rec, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiCheckCircle className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{rec}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image preview */}
          {input.imagePreview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
            >
              <img src={input.imagePreview} alt="Analyzed skin" className="w-full aspect-square object-cover" />
              <div className="p-4 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Analyzed image</p>
              </div>
            </motion.div>
          )}

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-amber-50 dark:bg-amber-500/5 rounded-2xl border border-amber-100 dark:border-amber-500/20 p-5"
          >
            <div className="flex items-start gap-3">
              <FiAlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">Medical Disclaimer</p>
                <p className="text-xs text-amber-700 dark:text-amber-400/80 leading-relaxed">
                  {result.disclaimer || 'This AI analysis is for informational purposes only and should not replace professional medical advice. Please consult a dermatologist for accurate diagnosis and treatment.'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Link
              href="/scan/clinics"
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow"
            >
              <FiMapPin className="w-4 h-4" />
              Find Nearby Clinics
              <FiArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/scan/upload"
              className="flex items-center justify-center gap-2 w-full py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              Scan Another Image
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
