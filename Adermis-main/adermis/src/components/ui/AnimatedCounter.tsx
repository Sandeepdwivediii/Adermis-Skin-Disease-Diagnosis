'use client';

import { motion } from 'framer-motion';

interface Props {
  number: number;
  suffix?: string;
  className?: string;
  duration?: number;
}

export function AnimatedCounter({ number, suffix = '', className = '', duration = 2 }: Props) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <Counter from={0} to={number} duration={duration} />
        {suffix}
      </motion.span>
    </motion.span>
  );
}

function Counter({ from, to, duration }: { from: number; to: number; duration: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        initial={{ scale: 0.5 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {to.toLocaleString()}
      </motion.span>
    </motion.span>
  );
}
