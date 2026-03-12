import { Link } from 'react-router';
import { motion } from 'motion/react';
import { memberCards, drops } from '@/data/cards';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

export function CardPage() {
  const card = memberCards[0];
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [hoveredDrop, setHoveredDrop] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#1A1A1A] relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/3 left-1/3 w-[60vw] h-[60vw] rounded-full opacity-15 blur-[200px]"
          animate={{
            x: (mousePos.x - 0.5) * 40,
            y: (mousePos.y - 0.5) * 40,
          }}
          transition={{ type: 'spring', stiffness: 30, damping: 40 }}
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Ghost grid */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.02]"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="cardGridPattern" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="0.3" fill="#8B5CF6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cardGridPattern)" />
      </svg>

      {/* Corner brackets */}
      <div className="fixed top-8 left-8 w-12 h-12 pointer-events-none">
        <svg width="48" height="48" viewBox="0 0 48 48" className="opacity-[0.06]">
          <path d="M0 16 L0 0 L16 0" fill="none" stroke="#1A1A1A" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="fixed top-8 right-8 w-12 h-12 pointer-events-none">
        <svg width="48" height="48" viewBox="0 0 48 48" className="opacity-[0.06]">
          <path d="M48 16 L48 0 L32 0" fill="none" stroke="#1A1A1A" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="fixed bottom-8 left-8 w-12 h-12 pointer-events-none">
        <svg width="48" height="48" viewBox="0 0 48 48" className="opacity-[0.06]">
          <path d="M0 32 L0 48 L16 48" fill="none" stroke="#1A1A1A" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="fixed bottom-8 right-8 w-12 h-12 pointer-events-none">
        <svg width="48" height="48" viewBox="0 0 48 48" className="opacity-[0.06]">
          <path d="M48 32 L48 48 L32 48" fill="none" stroke="#1A1A1A" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center"
      >
        <Link
          to="/"
          className="flex items-center gap-3 text-xs tracking-[0.15em] uppercase opacity-30 hover:opacity-70 transition-opacity duration-500"
        >
          <ArrowLeft className="w-4 h-4" />
          Return
        </Link>
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="flex items-center gap-3"
        >
          <div className="w-1.5 h-1.5 border border-[#8B5CF6]/30 rotate-45" />
          <span className="text-[8px] tracking-[0.25em] uppercase text-[#1A1A1A]/30">
            Member Access
          </span>
        </motion.div>
      </motion.nav>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-8 py-24">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">

          {/* Left: The Abstract Card Form - just geometric traits */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1.5 }}
            className="relative flex justify-center"
          >
            <div
              className="relative w-[280px] h-[400px]"
              style={{
                transform: `perspective(1200px) rotateY(${(mousePos.x - 0.5) * 3}deg) rotateX(${(mousePos.y - 0.5) * -3}deg)`,
              }}
            >
              {/* The card is just lines - pure abstraction */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 400">
                {/* Outer frame - breathing */}
                <motion.rect
                  x="0" y="0" width="280" height="400"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="0.5"
                  animate={{ strokeOpacity: [0.08, 0.15, 0.08] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                {/* Inner frames - layered depth */}
                {[1, 2, 3].map((i) => (
                  <motion.rect
                    key={i}
                    x={12 * i} y={16 * i}
                    width={280 - 24 * i} height={400 - 32 * i}
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="0.3"
                    animate={{ strokeOpacity: [0.04 - i * 0.01, 0.08 - i * 0.015, 0.04 - i * 0.01] }}
                    transition={{ duration: 5, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}

                {/* Center cross - subtle axis */}
                <motion.line
                  x1="140" y1="80" x2="140" y2="320"
                  stroke="#8B5CF6"
                  strokeWidth="0.3"
                  strokeDasharray="2 8"
                  animate={{ strokeOpacity: [0.05, 0.1, 0.05] }}
                  transition={{ duration: 6, repeat: Infinity }}
                />
                <motion.line
                  x1="50" y1="200" x2="230" y2="200"
                  stroke="#8B5CF6"
                  strokeWidth="0.3"
                  strokeDasharray="2 8"
                  animate={{ strokeOpacity: [0.05, 0.1, 0.05] }}
                  transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}
                />

                {/* Center point - the essence */}
                <motion.circle
                  cx="140" cy="200" r="3"
                  fill="#8B5CF6"
                  animate={{
                    r: [3, 4, 3],
                    fillOpacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Expanding signal rings from center */}
                {[0, 1, 2].map((i) => (
                  <motion.circle
                    key={`ring-${i}`}
                    cx="140" cy="200"
                    r={20 + i * 25}
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="0.3"
                    animate={{
                      r: [20 + i * 25, 22 + i * 25, 20 + i * 25],
                      strokeOpacity: [0.08 - i * 0.02, 0.15 - i * 0.03, 0.08 - i * 0.02]
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.4 }}
                  />
                ))}

                {/* Corner marks - technical drawing feel */}
                <path d="M0 30 L0 0 L30 0" fill="none" stroke="#1A1A1A" strokeWidth="0.3" strokeOpacity="0.15" />
                <path d="M280 30 L280 0 L250 0" fill="none" stroke="#1A1A1A" strokeWidth="0.3" strokeOpacity="0.15" />
                <path d="M0 370 L0 400 L30 400" fill="none" stroke="#1A1A1A" strokeWidth="0.3" strokeOpacity="0.15" />
                <path d="M280 370 L280 400 L250 400" fill="none" stroke="#1A1A1A" strokeWidth="0.3" strokeOpacity="0.15" />
              </svg>

              {/* Minimal text overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-8 pointer-events-none">
                {/* Top */}
                <div className="flex justify-between items-start">
                  <motion.div
                    animate={{ opacity: [0.15, 0.3, 0.15] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="w-4 h-4 border border-[#8B5CF6]/30 rotate-45"
                  />
                  <motion.span
                    animate={{ opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-[7px] tracking-[0.3em] uppercase text-[#8B5CF6]/40"
                  >
                    NFC
                  </motion.span>
                </div>

                {/* Bottom */}
                <div>
                  <motion.span
                    animate={{ opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="text-[6px] tracking-[0.3em] uppercase text-[#1A1A1A]/20"
                  >
                    Lobster Sound
                  </motion.span>
                  <motion.div
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="mt-2 font-serif text-lg text-[#1A1A1A]/40"
                  >
                    {card.name}
                  </motion.div>
                </div>
              </div>

              {/* Side whispers */}
              <motion.div
                animate={{ opacity: [0.08, 0.15, 0.08] }}
                transition={{ duration: 7, repeat: Infinity }}
                className="absolute -left-10 top-1/2 -translate-y-1/2 text-[6px] tracking-[0.3em] text-[#8B5CF6]/20 -rotate-90 whitespace-nowrap"
              >
                CR80 PROTOCOL
              </motion.div>
            </div>

            {/* Limited Edition */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute -bottom-12 left-1/2 -translate-x-1/2"
            >
              <motion.span
                animate={{ opacity: [0.1, 0.25, 0.1] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="text-[8px] tracking-[0.3em] uppercase text-[#1A1A1A]/20"
              >
                Limited Edition
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Right: Cryptic details - minimal */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="space-y-16"
          >
            {/* Header */}
            <div>
              <motion.div
                animate={{ scaleX: [0, 1], opacity: [0, 0.2] }}
                transition={{ delay: 1, duration: 1 }}
                className="w-8 h-px bg-[#8B5CF6] mb-8 origin-left"
              />
              <motion.span
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="text-[8px] tracking-[0.3em] uppercase text-[#8B5CF6]/40"
              >
                Access
              </motion.span>
              <motion.h1
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="mt-4 text-3xl font-serif text-[#1A1A1A]/50"
              >
                {card.name}
              </motion.h1>
              <motion.p
                animate={{ opacity: [0.2, 0.35, 0.2] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="mt-6 text-xs text-[#1A1A1A]/30 leading-relaxed font-light max-w-xs"
              >
                {card.description}
              </motion.p>
            </div>

            {/* Price */}
            <motion.div
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="flex items-baseline gap-2"
            >
              <span className="font-serif text-3xl text-[#1A1A1A]/40">{card.price}</span>
              <span className="text-[9px] text-[#1A1A1A]/15 tracking-wide">{card.currency}</span>
            </motion.div>

            {/* Features - very subtle */}
            <div className="space-y-3">
              {card.features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    animate={{ opacity: [0.15, 0.35, 0.15] }}
                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
                    className="w-0.5 h-0.5 bg-[#8B5CF6]"
                  />
                  <motion.span
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 5, repeat: Infinity, delay: i * 0.15 }}
                    className="text-[10px] text-[#1A1A1A]/35"
                  >
                    {feature}
                  </motion.span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              <Link
                to="/thank-you"
                className="group relative inline-flex items-center gap-4 px-6 py-3 border border-[#1A1A1A]/05 text-[9px] tracking-[0.2em] uppercase transition-all duration-700 hover:border-[#8B5CF6]/20 hover:bg-[#8B5CF6]/[0.02]"
              >
                <motion.span
                  animate={{ opacity: [0.25, 0.45, 0.25] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-[#1A1A1A]/35 group-hover:text-[#8B5CF6]/60 transition-colors duration-500"
                >
                  Request
                </motion.span>
                <motion.div
                  animate={{ x: [0, 2, 0], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-1 h-1 border-t border-r border-[#8B5CF6]/30 rotate-45"
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Sound Collections Preview - minimal */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="px-8 md:px-16 pb-24"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-8 mb-16">
            <motion.div
              animate={{ scaleX: [0.3, 1, 0.3], opacity: [0.05, 0.1, 0.05] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="flex-1 h-px bg-[#1A1A1A]"
            />
            <motion.span
              animate={{ opacity: [0.1, 0.25, 0.1] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="text-[8px] tracking-[0.3em] uppercase text-[#1A1A1A]/20"
            >
              Collections
            </motion.span>
            <motion.div
              animate={{ scaleX: [0.3, 1, 0.3], opacity: [0.05, 0.1, 0.05] }}
              transition={{ duration: 8, repeat: Infinity, delay: 0.5 }}
              className="flex-1 h-px bg-[#1A1A1A]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {drops.map((drop, i) => (
              <motion.div
                key={drop.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 + i * 0.15 }}
                onMouseEnter={() => setHoveredDrop(drop.id)}
                onMouseLeave={() => setHoveredDrop(null)}
                className="group"
              >
                <Link to={`/drop/${drop.id}`} className="block">
                  <div className="relative p-6">
                    {/* Just geometric form */}
                    <div className="aspect-square mb-6 relative">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Simple geometric - square variations */}
                        <motion.rect
                          x="10" y="10" width="80" height="80"
                          fill="none"
                          stroke={hoveredDrop === drop.id ? '#8B5CF6' : '#1A1A1A'}
                          strokeWidth="0.3"
                          strokeOpacity={hoveredDrop === drop.id ? 0.4 : 0.06}
                          animate={hoveredDrop === drop.id ? { rotate: [0, 3, 0] } : {}}
                          transition={{ duration: 3, repeat: Infinity }}
                          style={{ transformOrigin: '50px 50px' }}
                        />
                        <motion.rect
                          x="20" y="20" width="60" height="60"
                          fill="none"
                          stroke={hoveredDrop === drop.id ? '#8B5CF6' : '#1A1A1A'}
                          strokeWidth="0.3"
                          strokeOpacity={hoveredDrop === drop.id ? 0.3 : 0.04}
                          animate={hoveredDrop === drop.id ? { rotate: [0, -2, 0] } : {}}
                          transition={{ duration: 4, repeat: Infinity }}
                          style={{ transformOrigin: '50px 50px' }}
                        />
                        <motion.circle
                          cx="50" cy="50" r="2"
                          fill={hoveredDrop === drop.id ? '#8B5CF6' : '#1A1A1A'}
                          fillOpacity={hoveredDrop === drop.id ? 0.5 : 0.1}
                          animate={hoveredDrop === drop.id ? { scale: [1, 1.3, 1] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{ transformOrigin: '50px 50px' }}
                        />
                      </svg>
                    </div>

                    <div className="space-y-1">
                      <h3 className={`font-serif text-sm transition-all duration-500 ${
                        hoveredDrop === drop.id ? 'text-[#8B5CF6]/60' : 'text-[#1A1A1A]/35'
                      }`}>
                        {drop.title}
                      </h3>
                      <motion.p
                        animate={{ opacity: [0.1, 0.2, 0.1] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="text-[8px] text-[#1A1A1A]/15"
                      >
                        {drop.trackCount} signals
                      </motion.p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
