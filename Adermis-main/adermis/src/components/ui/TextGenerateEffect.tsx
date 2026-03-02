'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  words: string;
  className?: string;
  delay?: number;
}

export function TextGenerateEffect({ words, className = '', delay = 0 }: Props) {
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const wordArray = words.split(' ');

  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < wordArray.length) {
          setDisplayedWords(prev => [...prev, wordArray[i]]);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 60);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <span className={className}>
      <AnimatePresence>
        {displayedWords.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            className="inline-block mr-1"
          >
            {word}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}
