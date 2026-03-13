// WhisperText - Text that types itself letter by letter, then fades when ignored
// Part of the Lobster presence philosophy: everything breathes

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface WhisperTextProps {
  text: string;
  className?: string;
  typeSpeed?: number; // ms per character
  fadeDelay?: number; // ms before starting fade when not observed
  minOpacity?: number; // lowest opacity when faded
  maxOpacity?: number; // highest opacity when visible
  onComplete?: () => void;
}

export function WhisperText({
  text,
  className = '',
  typeSpeed = 50,
  fadeDelay = 2000,
  minOpacity = 0.15,
  maxOpacity = 0.6,
  onComplete,
}: WhisperTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isObserved, setIsObserved] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Type out the text letter by letter
  useEffect(() => {
    if (hasTyped) return;

    let currentIndex = 0;
    setIsTyping(true);

    const typeInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        setHasTyped(true);
        onComplete?.();
      }
    }, typeSpeed);

    return () => clearInterval(typeInterval);
  }, [text, typeSpeed, hasTyped, onComplete]);

  // Handle observation (hover/focus)
  const handleObserve = () => {
    setIsObserved(true);
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }
  };

  const handleIgnore = () => {
    fadeTimeoutRef.current = setTimeout(() => {
      setIsObserved(false);
    }, fadeDelay);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, []);

  // Intersection observer - fade when scrolled out of view
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleObserve();
          handleIgnore(); // Start fade timer
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const targetOpacity = isTyping || isObserved ? maxOpacity : minOpacity;

  return (
    <motion.span
      ref={containerRef}
      className={className}
      onMouseEnter={handleObserve}
      onMouseLeave={handleIgnore}
      onFocus={handleObserve}
      onBlur={handleIgnore}
      animate={{ opacity: targetOpacity }}
      transition={{ duration: isTyping ? 0.1 : 1.5, ease: 'easeOut' }}
    >
      {displayedText}
      {isTyping && (
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-px bg-current ml-0.5"
          style={{ height: '0.8em' }}
        />
      )}
    </motion.span>
  );
}

// Simpler variant - just breathes between opacities
export function BreathingText({
  children,
  className = '',
  minOpacity = 0.2,
  maxOpacity = 0.5,
  duration = 4,
}: {
  children: React.ReactNode;
  className?: string;
  minOpacity?: number;
  maxOpacity?: number;
  duration?: number;
}) {
  return (
    <motion.span
      className={className}
      animate={{ opacity: [minOpacity, maxOpacity, minOpacity] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.span>
  );
}
