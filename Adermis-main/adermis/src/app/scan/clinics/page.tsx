'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiStar, FiNavigation, FiArrowLeft, FiCheckCircle, FiLoader } from 'react-icons/fi';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

interface Clinic {
  name: string;
  address: string;
  rating: number;
  phone: string;
  type: string;
  distance: string;
  place_id: string;
}

export default function ClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch(`${BACKEND}/api/find_clinics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              radius: 10000,
            }),
          });

          if (!res.ok) throw new Error('Failed to fetch clinics');
          const data = await res.json();
          setClinics(data.clinics || []);
        } catch (err: any) {
          setError(err.message || 'Could not load clinics');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLocationError(true);
        setLoading(false);
      }
    );
  }, []);

  const typeColor: Record<string, string> = {
    'Government': 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400',
    'NGO': 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    'Private': 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-3 mb-12">
        {[
          { label: 'Upload', done: true },
          { label: 'Analysis', done: true },
          { label: 'Clinics', active: true },
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

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Nearby Clinics</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
          Based on your location, here are dermatology clinics and healthcare facilities near you.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FiLoader className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Finding clinics near you...</p>
        </div>
      ) : locationError ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <FiMapPin className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Location Access Required</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Please enable location access in your browser to find nearby clinics.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      ) : clinics.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <FiMapPin className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Clinics Found</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Try expanding your search radius or check back later.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {clinics.map((clinic, i) => (
            <motion.div
              key={clinic.place_id || i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white">{clinic.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${typeColor[clinic.type] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                      {clinic.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{clinic.address}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {clinic.rating > 0 && (
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                        <FiStar className="w-3.5 h-3.5" />
                        {clinic.rating.toFixed(1)}
                      </span>
                    )}
                    {clinic.phone && (
                      <a href={`tel:${clinic.phone}`} className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                        <FiPhone className="w-3.5 h-3.5" />
                        {clinic.phone}
                      </a>
                    )}
                    {clinic.distance && (
                      <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <FiNavigation className="w-3.5 h-3.5" />
                        {clinic.distance}
                      </span>
                    )}
                  </div>
                </div>
                <a
                  href={`https://www.google.com/maps/place/?q=place_id:${clinic.place_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium text-sm rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors flex-shrink-0"
                >
                  Directions
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-4 mt-10">
        <Link
          href="/scan/analysis"
          className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Results
        </Link>
        <Link
          href="/scan/upload"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25"
        >
          New Scan
        </Link>
      </div>
    </div>
  );
}
