import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  centered?: boolean;
  fullHeight?: boolean;
}

export function PageWrapper({
  children,
  className = '',
  centered = false,
  fullHeight = false
}: PageWrapperProps) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={`
        px-6 pt-24 pb-16
        ${fullHeight ? 'min-h-screen' : ''}
        ${centered ? 'flex flex-col items-center justify-center' : ''}
        ${className}
      `}
    >
      {children}
    </motion.main>
  );
}
