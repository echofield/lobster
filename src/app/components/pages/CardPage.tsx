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
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/3 left-1/3 w-[70vw] h-[70vw] rounded-full opacity-20 blur-[150px]"
          animate={{
            x: (mousePos.x - 0.5) * 60,
            y: (mousePos.y - 0.5) * 60,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 30 }}
          style={{
            background:
              'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(167, 139, 250, 0.1) 50%, transparent 70%)',
          }}
        />
      </div>

      {/* Ghost grid pattern */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.025]"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="cardGridPattern" width="50" height="50" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="0.5" fill="#8B5CF6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cardGridPattern)" />
      </svg>

      {/* Floating geometric shapes - alive */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Breathing hexagon */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.05, 1],
          }}
          transition={{
            rotate: { duration: 90, repeat: Infinity, ease: 'linear' },
            scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
          }}
          className="absolute top-[12%] right-[8%]"
        >
          <svg width="60" height="52" viewBox="0 0 60 52" fill="none" className="opacity-[0.06]">
            <path d="M30 0L60 13V39L30 52L0 39V13L30 0Z" stroke="#8B5CF6" strokeWidth="0.5" />
          </svg>
        </motion.div>

        {/* Floating cross */}
        <motion.div
          animate={{
            rotate: [0, 90, 180, 270, 360],
            opacity: [0.04, 0.08, 0.04]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[40%] right-[5%]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 0V24M0 12H24" stroke="#A78BFA" strokeWidth="0.5" />
          </svg>
        </motion.div>

        {/* Pulsing diamond */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.12, 0.05]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[30%] left-[6%]"
        >
          <div className="w-3 h-3 border border-[#8B5CF6] rotate-45" />
        </motion.div>

        {/* Orbiting circles - bottom right */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[15%] right-[12%]"
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="opacity-[0.05]">
            <circle cx="20" cy="20" r="18" stroke="#8B5CF6" strokeWidth="0.5" />
            <circle cx="20" cy="2" r="2" fill="#8B5CF6" fillOpacity="0.3" />
          </svg>
        </motion.div>
      </div>

      {/* Corner brackets - technical drawing style */}
      <div className="fixed top-8 left-8 w-12 h-12 pointer-events-none">
        <svg width="48" height="48" viewBox="0 0 48 48" className="opacity-[0.08]">
          <path d="M0 16 L0 0 L16 0" fill="none" stroke="#1A1A1A" strokeWidth="1" />
        </svg>
      </div>
      <div className="fixed top-8 right-8 w-12 h-12 pointer-events-none">
        <svg width="48" height="48" viewBox="0 0 48 48" className="opacity-[0.08]">
          <path d="M48 16 L48 0 L32 0" fill="none" stroke="#1A1A1A" strokeWidth="1" />
        </svg>
      </div>
      <div className="fixed bottom-8 left-8 w-12 h-12 pointer-events-none">
        <svg width="48" height="48" viewBox="0 0 48 48" className="opacity-[0.08]">
          <path d="M0 32 L0 48 L16 48" fill="none" stroke="#1A1A1A" strokeWidth="1" />
        </svg>
      </div>
      <div className="fixed bottom-8 right-8 w-12 h-12 pointer-events-none">
        <svg width="48" height="48" viewBox="0 0 48 48" className="opacity-[0.08]">
          <path d="M48 32 L48 48 L32 48" fill="none" stroke="#1A1A1A" strokeWidth="1" />
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
          className="flex items-center gap-3 text-xs tracking-[0.15em] uppercase opacity-40 hover:opacity-100 transition-opacity duration-500"
        >
          <ArrowLeft className="w-4 h-4" />
          Return
        </Link>
        <motion.div
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="flex items-center gap-3"
        >
          <div className="w-2 h-2 border border-[#8B5CF6]/40 rotate-45" />
          <span className="text-[9px] tracking-[0.25em] uppercase text-[#8B5CF6]/50">
            Member Access
          </span>
        </motion.div>
      </motion.nav>

      {/* Main Content - Full bleed, instrument-like */}
      <div className="min-h-screen flex items-center justify-center px-8 py-24">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Left: The Card - Transparent, instrument-like */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center"
          >
            <div
              className="relative w-[320px] h-[450px]"
              style={{
                transform: `perspective(1200px) rotateY(${(mousePos.x - 0.5) * 4}deg) rotateX(${(mousePos.y - 0.5) * -4}deg)`,
              }}
            >
              {/* Outer measurement frame - breathing */}
              <motion.svg
                className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] pointer-events-none"
                animate={{ opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Corner brackets */}
                <path d="M0 24 L0 0 L24 0" fill="none" stroke="#8B5CF6" strokeWidth="0.5" />
                <path d="M100% 24 L100% 0 L calc(100%-24) 0" fill="none" stroke="#8B5CF6" strokeWidth="0.5"
                      transform="translate(-24, 0)" style={{ transform: 'translateX(calc(100% - 24px))' }} />
                <line x1="0" y1="0" x2="20" y2="0" stroke="#8B5CF6" strokeWidth="0.5" />
                <line x1="0" y1="0" x2="0" y2="20" stroke="#8B5CF6" strokeWidth="0.5" />
                <line x1="100%" y1="0" x2="calc(100% - 20px)" y2="0" stroke="#8B5CF6" strokeWidth="0.5" />
                <line x1="100%" y1="0" x2="100%" y2="20" stroke="#8B5CF6" strokeWidth="0.5" />
                <line x1="0" y1="100%" x2="20" y2="100%" stroke="#8B5CF6" strokeWidth="0.5" />
                <line x1="0" y1="100%" x2="0" y2="calc(100% - 20px)" stroke="#8B5CF6" strokeWidth="0.5" />
                <line x1="100%" y1="100%" x2="calc(100% - 20px)" y2="100%" stroke="#8B5CF6" strokeWidth="0.5" />
                <line x1="100%" y1="100%" x2="100%" y2="calc(100% - 20px)" stroke="#8B5CF6" strokeWidth="0.5" />
              </motion.svg>

              {/* Card body - semi-transparent */}
              <motion.div
                className="absolute inset-0 overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, rgba(10, 10, 10, 0.95) 0%, rgba(15, 15, 20, 0.9) 100%)',
                  boxShadow: `
                    0 0 100px rgba(139, 92, 246, 0.08),
                    0 30px 60px rgba(0, 0, 0, 0.12),
                    inset 0 0 80px rgba(139, 92, 246, 0.03)
                  `,
                }}
              >
                {/* Internal geometry - alive */}
                <svg className="absolute inset-0 w-full h-full">
                  {/* Breathing rectangles */}
                  {[0, 1, 2].map((i) => (
                    <motion.rect
                      key={i}
                      x={16 + i * 12}
                      y={16 + i * 16}
                      width={`calc(100% - ${32 + i * 24}px)`}
                      height={`calc(100% - ${32 + i * 32}px)`}
                      fill="none"
                      stroke="#8B5CF6"
                      strokeWidth="0.5"
                      strokeOpacity={0.12 - i * 0.03}
                      animate={{
                        strokeOpacity: [0.08 - i * 0.02, 0.15 - i * 0.03, 0.08 - i * 0.02]
                      }}
                      transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                    />
                  ))}

                  {/* Diagonal flow lines */}
                  <motion.line
                    x1="0" y1="0" x2="100%" y2="100%"
                    stroke="#8B5CF6" strokeWidth="0.5" strokeOpacity="0.05"
                    strokeDasharray="2 6"
                    animate={{ strokeDashoffset: [0, -16] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.line
                    x1="100%" y1="0" x2="0" y2="100%"
                    stroke="#8B5CF6" strokeWidth="0.5" strokeOpacity="0.05"
                    strokeDasharray="2 6"
                    animate={{ strokeDashoffset: [0, 16] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  />
                </svg>

                {/* Card content */}
                <div className="relative h-full flex flex-col justify-between p-6">
                  {/* Top */}
                  <div className="flex justify-between items-start">
                    <motion.div
                      animate={{ rotate: [0, 90, 90, 0], scale: [1, 1.05, 1] }}
                      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-8 h-8 border border-[#8B5CF6]/40 rotate-45 flex items-center justify-center"
                    >
                      <motion.div
                        animate={{ opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-3 h-3 bg-[#8B5CF6]/30"
                      />
                    </motion.div>
                    <motion.span
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-[8px] tracking-[0.3em] uppercase text-[#8B5CF6]/50"
                    >
                      NFC
                    </motion.span>
                  </div>

                  {/* Center - Signal rings */}
                  <div className="flex justify-center">
                    <svg width="140" height="100" viewBox="0 0 140 100">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <motion.circle
                          key={i}
                          cx="70"
                          cy="50"
                          r={12 + i * 10}
                          fill="none"
                          stroke="#8B5CF6"
                          strokeWidth="0.5"
                          animate={{
                            r: [12 + i * 10, 14 + i * 10, 12 + i * 10],
                            strokeOpacity: [0.4 - i * 0.06, 0.6 - i * 0.08, 0.4 - i * 0.06],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: 'easeInOut'
                          }}
                        />
                      ))}
                      <motion.circle
                        cx="70"
                        cy="50"
                        r="4"
                        fill="#8B5CF6"
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ transformOrigin: '70px 50px' }}
                      />
                    </svg>
                  </div>

                  {/* Bottom */}
                  <div>
                    <motion.span
                      animate={{ opacity: [0.2, 0.35, 0.2] }}
                      transition={{ duration: 5, repeat: Infinity }}
                      className="text-[7px] tracking-[0.35em] uppercase text-[#FAF8F2]/25"
                    >
                      Lobster Sound
                    </motion.span>
                    <div className="mt-2 font-serif text-xl text-[#FAF8F2]/90">{card.name}</div>
                    <div className="flex items-center gap-3 mt-3">
                      <motion.div
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.4, 1, 0.4],
                          boxShadow: [
                            '0 0 4px rgba(139, 92, 246, 0.3)',
                            '0 0 12px rgba(139, 92, 246, 0.6)',
                            '0 0 4px rgba(139, 92, 246, 0.3)'
                          ]
                        }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        className="w-1.5 h-1.5 bg-[#8B5CF6]"
                      />
                      <span className="text-[8px] tracking-[0.2em] uppercase text-[#8B5CF6]/50">
                        {card.edition}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Side whispers */}
              <motion.div
                animate={{ opacity: [0.15, 0.25, 0.15] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute -left-14 top-1/2 -translate-y-1/2 text-[8px] tracking-[0.25em] text-[#8B5CF6]/30 -rotate-90 whitespace-nowrap"
              >
                NFC ENABLED
              </motion.div>
              <motion.div
                animate={{ opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute -right-10 top-1/2 -translate-y-1/2 text-[8px] tracking-[0.2em] text-[#1A1A1A]/15 rotate-90 whitespace-nowrap"
              >
                CR80
              </motion.div>
            </div>

            {/* Limited Edition - no numbers */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute -bottom-12 left-1/2 -translate-x-1/2"
            >
              <motion.span
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-[9px] tracking-[0.3em] uppercase text-[#1A1A1A]/30"
              >
                Limited Edition
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Right: Cryptic details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="space-y-16"
          >
            {/* Cryptic header */}
            <div>
              <motion.div
                animate={{ scaleX: [0, 1], opacity: [0, 0.4, 0.4] }}
                transition={{ delay: 0.8, duration: 1.2 }}
                className="w-12 h-px bg-[#8B5CF6] mb-8 origin-left"
              />
              <motion.span
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-[9px] tracking-[0.35em] uppercase text-[#8B5CF6]/60"
              >
                Access Protocol
              </motion.span>
              <h1 className="mt-4 text-4xl font-serif text-[#1A1A1A]/80">{card.name}</h1>
              <motion.p
                animate={{ opacity: [0.35, 0.5, 0.35] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="mt-6 text-sm text-[#1A1A1A]/40 leading-relaxed font-light max-w-sm"
              >
                {card.description}
              </motion.p>
            </div>

            {/* Price - minimal, cryptic */}
            <motion.div
              animate={{ opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="flex items-baseline gap-3"
            >
              <span className="font-serif text-4xl text-[#1A1A1A]/70">{card.price}</span>
              <span className="text-[10px] text-[#1A1A1A]/25 tracking-wide">{card.currency}</span>
            </motion.div>

            {/* Features - cryptic list */}
            <div className="space-y-4">
              {card.features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.15 }}
                  className="flex items-center gap-4"
                >
                  <motion.div
                    animate={{
                      opacity: [0.3, 0.7, 0.3],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                    className="w-1 h-1 bg-[#8B5CF6]"
                  />
                  <motion.span
                    animate={{ opacity: [0.4, 0.6, 0.4] }}
                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
                    className="text-xs text-[#1A1A1A]/50"
                  >
                    {feature}
                  </motion.span>
                </motion.div>
              ))}
            </div>

            {/* Unlocks - even more cryptic */}
            <div className="pt-8 border-t border-[#1A1A1A]/5">
              <motion.span
                animate={{ opacity: [0.2, 0.35, 0.2] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="text-[8px] tracking-[0.3em] uppercase text-[#1A1A1A]/25"
              >
                Unlocks
              </motion.span>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {card.unlocks.map((unlock, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.25, 0.45, 0.25] }}
                    transition={{ delay: 1.2 + i * 0.1, duration: 4, repeat: Infinity }}
                    className="text-[10px] text-[#1A1A1A]/35"
                  >
                    {unlock}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* CTA - subtle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <Link
                to="/thank-you"
                className="group relative inline-flex items-center gap-4 px-8 py-4 border border-[#1A1A1A]/10 text-[10px] tracking-[0.25em] uppercase transition-all duration-700 hover:border-[#8B5CF6]/40 hover:bg-[#8B5CF6]/5"
              >
                <span className="text-[#1A1A1A]/50 group-hover:text-[#8B5CF6] transition-colors duration-500">
                  Request Access
                </span>
                <motion.div
                  animate={{ x: [0, 3, 0], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 border-t border-r border-[#8B5CF6]/50 rotate-45"
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Sound Collections Preview */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="px-8 md:px-16 pb-24"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-8 mb-16">
            <motion.div
              animate={{ scaleX: [0.5, 1, 0.5], opacity: [0.1, 0.15, 0.1] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="flex-1 h-px bg-[#1A1A1A]"
            />
            <motion.span
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-[9px] tracking-[0.35em] uppercase text-[#1A1A1A]/30"
            >
              Sound Collections
            </motion.span>
            <motion.div
              animate={{ scaleX: [0.5, 1, 0.5], opacity: [0.1, 0.15, 0.1] }}
              transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}
              className="flex-1 h-px bg-[#1A1A1A]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {drops.map((drop, i) => (
              <motion.div
                key={drop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 + i * 0.1 }}
                onMouseEnter={() => setHoveredDrop(drop.id)}
                onMouseLeave={() => setHoveredDrop(null)}
                className="group"
              >
                <Link to={`/drop/${drop.id}`} className="block">
                  <div
                    className={`relative border transition-all duration-700 p-5 ${
                      hoveredDrop === drop.id
                        ? 'border-[#8B5CF6]/30 bg-[#8B5CF6]/[0.02]'
                        : 'border-[#1A1A1A]/5'
                    }`}
                  >
                    {/* Abstract pattern */}
                    <div className="aspect-square mb-5 relative overflow-hidden">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {i === 0 && [0, 1, 2, 3].map((j) => (
                          <motion.rect
                            key={j}
                            x={25 + j * 4}
                            y={25 + j * 4}
                            width={50 - j * 8}
                            height={50 - j * 8}
                            fill="none"
                            stroke={hoveredDrop === drop.id ? '#8B5CF6' : '#1A1A1A'}
                            strokeWidth="0.5"
                            strokeOpacity={hoveredDrop === drop.id ? 0.5 - j * 0.1 : 0.1 - j * 0.02}
                            animate={hoveredDrop === drop.id ? {
                              rotate: [0, 45, 0],
                              scale: [1, 1.02, 1]
                            } : {}}
                            transition={{ duration: 4, repeat: Infinity }}
                            style={{ transformOrigin: '50px 50px' }}
                          />
                        ))}
                        {i === 1 && [0, 1, 2, 3, 4].map((j) => (
                          <motion.circle
                            key={j}
                            cx="50"
                            cy="50"
                            r={8 + j * 7}
                            fill="none"
                            stroke={hoveredDrop === drop.id ? '#8B5CF6' : '#1A1A1A'}
                            strokeWidth="0.5"
                            strokeOpacity={hoveredDrop === drop.id ? 0.4 - j * 0.06 : 0.08 - j * 0.01}
                            animate={hoveredDrop === drop.id ? {
                              r: [8 + j * 7, 10 + j * 7, 8 + j * 7]
                            } : {}}
                            transition={{ duration: 2.5, repeat: Infinity, delay: j * 0.1 }}
                          />
                        ))}
                        {i === 2 && [0, 1, 2].map((j) => (
                          <motion.polygon
                            key={j}
                            points="50,22 74,62 26,62"
                            fill="none"
                            stroke={hoveredDrop === drop.id ? '#8B5CF6' : '#1A1A1A'}
                            strokeWidth="0.5"
                            strokeOpacity={hoveredDrop === drop.id ? 0.4 - j * 0.12 : 0.08 - j * 0.02}
                            transform={`scale(${1 - j * 0.18})`}
                            style={{ transformOrigin: '50px 50px' }}
                            animate={hoveredDrop === drop.id ? { rotate: [0, 120, 0] } : {}}
                            transition={{ duration: 8, repeat: Infinity }}
                          />
                        ))}
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="2"
                          fill={hoveredDrop === drop.id ? '#8B5CF6' : '#1A1A1A'}
                          fillOpacity={hoveredDrop === drop.id ? 0.6 : 0.1}
                          animate={hoveredDrop === drop.id ? {
                            scale: [1, 1.5, 1],
                            opacity: [0.6, 1, 0.6]
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{ transformOrigin: '50px 50px' }}
                        />
                      </svg>
                    </div>

                    <div className="space-y-2">
                      <motion.span
                        animate={{ opacity: [0.15, 0.3, 0.15] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="text-[8px] tracking-[0.2em] uppercase text-[#1A1A1A]/25"
                      >
                        Collection
                      </motion.span>
                      <h3 className={`font-serif text-base transition-colors duration-500 ${
                        hoveredDrop === drop.id ? 'text-[#8B5CF6]/80' : 'text-[#1A1A1A]/60'
                      }`}>
                        {drop.title}
                      </h3>
                      <motion.p
                        animate={{ opacity: [0.2, 0.35, 0.2] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="text-[9px] text-[#1A1A1A]/25"
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
