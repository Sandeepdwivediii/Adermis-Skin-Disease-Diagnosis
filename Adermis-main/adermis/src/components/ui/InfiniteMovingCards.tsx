'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface InfiniteCard {
  quote: string;
  name: string;
  title: string;
}

interface Props {
  items: InfiniteCard[];
  direction?: 'left' | 'right';
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

export function InfiniteMovingCards({ items, direction = 'left', speed = 'normal', className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!scrollerRef.current || !containerRef.current) return;
    const scroller = scrollerRef.current;
    const items = Array.from(scroller.children);
    items.forEach((item) => {
      const clone = item.cloneNode(true);
      scroller.appendChild(clone);
    });
    setStart(true);
  }, []);

  const speedMap = { slow: '60s', normal: '40s', fast: '20s' };

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden relative ${className}`}
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      }}
    >
      <ul
        ref={scrollerRef}
        className={`flex gap-4 py-4 w-max ${start ? 'animate-scroll' : ''}`}
        style={{
          animationDirection: direction === 'left' ? 'normal' : 'reverse',
          animationDuration: speedMap[speed],
        }}
      >
        {items.map((item, idx) => (
          <li
            key={idx}
            className="w-[350px] max-w-full shrink-0 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-8 py-6 shadow-lg dark:shadow-gray-900/30"
          >
            <blockquote>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">"{item.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-semibold text-sm">{item.name}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{item.title}</p>
                </div>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
}
