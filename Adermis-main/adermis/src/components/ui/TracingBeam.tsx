'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function TracingBeam({ children, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  });

  const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Beam line */}
      <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gray-200 dark:bg-gray-800 hidden md:block">
        <motion.div
          className="w-full bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 rounded-full"
          style={{ height }}
        />
      </div>
      {/* Content */}
      <div className="md:pl-12">{children}</div>
    </div>
  );
}
