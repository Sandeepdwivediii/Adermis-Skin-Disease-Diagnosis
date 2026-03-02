'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MeteorsProps {
  number?: number;
  className?: string;
}

export function Meteors({ number = 20, className = '' }: MeteorsProps) {
  const [meteors, setMeteors] = useState<Array<{ id: number; left: string; delay: string; duration: string }>>([]);

  useEffect(() => {
    const items = Array.from({ length: number }, (_, i) => ({
      id: i,
      left: `${Math.floor(Math.random() * 100)}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 2}s`,
    }));
    setMeteors(items);
  }, [number]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {meteors.map((m) => (
        <span
          key={m.id}
          className="absolute top-0 w-0.5 h-0.5 rounded-full bg-blue-400 shadow-[0_0_0_1px_#3b82f680] rotate-[215deg]
          before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-1/2
          before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-blue-400 before:to-transparent
          animate-meteor"
          style={{
            left: m.left,
            animationDelay: m.delay,
            animationDuration: m.duration,
          }}
        />
      ))}
    </div>
  );
}
