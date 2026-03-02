'use client';

import { useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiImage, FiX, FiArrowRight, FiShield, FiCpu, FiZap } from 'react-icons/fi';
import { useSkinAnalysis } from '../context/SkinAnalysisContext';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import toast from 'react-hot-toast';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function UploadPage() {
  const router = useRouter();
  const { input, setInput, setResult, setAnalyzing } = useSkinAnalysis();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be less than 10MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setInput({ image: file, imagePreview: e.target?.result as string });
    };
    reader.readAsDataURL(file);
  }, [setInput]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleSubmit = async () => {
    if (!input.image) {
      toast.error('Please upload an image first');
      return;
    }

    setIsSubmitting(true);
    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('image', input.image);

      const res = await fetch(`${BACKEND}/api/analyze`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Analysis failed' }));
        throw new Error(err.error || 'Analysis failed');
      }

      const data = await res.json();

      const predictions = (data.predictions || []).map((p: any) => ({
        condition: p.disease || p.condition || 'Unknown',
        confidence: p.score ?? p.confidence ?? 0,
      }));

      const normalized = {
        predictions,
        top_condition: predictions[0]?.condition || data.top_condition || 'Unknown',
        description: data.description || '',
        severity: data.severity || data.risk_level || 'mild',
        recommendations: data.recommendations || [],
        disclaimer: data.disclaimer || 'This AI analysis is for informational purposes only. Please consult a dermatologist for accurate diagnosis.',
        follow_up_questions: data.followup_questions || data.follow_up_questions || [],
        scan_id: data.scan_id || '',
      };

      setResult(normalized);
      router.push('/scan/analysis');
    } catch (err: any) {
      const msg = err.message || 'Failed to analyze image';
      if (msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('networkerror')) {
        toast.error('Cannot reach the backend server. Make sure it is running on port 5000.');
      } else {
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
      setAnalyzing(false);
    }
  };

  const removeImage = () => {
    setInput({ image: null, imagePreview: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-3 mb-12">
        {[
          { label: 'Upload', active: true },
          { label: 'Analysis', active: false },
          { label: 'Clinics', active: false },
        ].map((step, i) => (
          <div key={step.label} className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              step.active
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
            }`}>
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              {step.label}
            </div>
            {i < 2 && <div className="w-8 h-0.5 bg-gray-200 dark:bg-gray-700 hidden sm:block" />}
          </div>
        ))}
      </div>

      <ScrollReveal className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Upload Skin Image</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
          Take a clear, well-lit photo of the affected area. Our AI will analyze it and provide a detailed diagnosis.
        </p>
      </ScrollReveal>

      {/* Upload area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto"
      >
        <AnimatePresence mode="wait">
          {!input.imagePreview ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/5 scale-[1.02]'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-300 dark:hover:border-blue-500/50 hover:bg-blue-50/30 dark:hover:bg-blue-500/5'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
              />
              <motion.div
                animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mx-auto mb-4"
              >
                <FiUpload className="w-7 h-7 text-blue-500" />
              </motion.div>
              <p className="text-gray-900 dark:text-white font-semibold mb-1">
                {isDragging ? 'Drop your image here' : 'Drag & drop your image'}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">or click to browse</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Supports JPG, PNG, WebP up to 10MB</p>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative rounded-3xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-lg"
            >
              <div className="relative aspect-[4/3]">
                <img
                  src={input.imagePreview!}
                  alt="Skin image preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
                    <FiImage className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{input.image?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {((input.image?.size || 0) / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-blue-500/40 transition-shadow"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FiCpu className="w-5 h-5" />
                      Analyze Image
                      <FiArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info cards */}
        <div className="grid grid-cols-3 gap-3 mt-8">
          {[
            { icon: FiCpu, label: 'AI Analysis', sub: 'CNN + Gemini' },
            { icon: FiShield, label: 'Safety First', sub: 'Filtered output' },
            { icon: FiZap, label: 'Instant', sub: 'Under 10 seconds' },
          ].map((item) => (
            <div key={item.label} className="text-center p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <item.icon className="w-5 h-5 text-blue-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-900 dark:text-white">{item.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.sub}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
