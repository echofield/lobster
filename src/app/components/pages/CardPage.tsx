import { Link } from 'react-router';
import { motion } from 'motion/react';
import { memberCards, drops } from '@/data/cards';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

export function CardPage() {
  const card = memberCards[0];
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [hoveredDrop, setHoveredDrop] = useState<string | null>(null);
  const [activeFeature, setActiveFeature] = useState(0);

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

  // Cycle through features
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % card.features.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [card.features.length]);

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#1A1A1A] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 right-1/4 w-[60vw] h-[60vw] rounded-full opacity-20 blur-[120px]"
          style={{
            background:
              'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(167, 139, 250, 0.15) 50%, transparent 70%)',
            transform: `translate(${(mousePos.x - 0.5) * 40}px, ${(mousePos.y - 0.5) * 40}px)`,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-[50vw] h-[50vw] rounded-full opacity-15 blur-[100px]"
          style={{
            background:
              'radial-gradient(circle, rgba(196, 181, 253, 0.4) 0%, rgba(139, 92, 246, 0.1) 60%, transparent 70%)',
            transform: `translate(${(mousePos.x - 0.5) * -30}px, ${(mousePos.y - 0.5) * -30}px)`,
          }}
        />
      </div>

      {/* Floating geometric shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Rotating hexagon - top right */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[15%] right-[10%]"
        >
          <svg width="80" height="70" viewBox="0 0 80 70" fill="none" className="opacity-[0.06]">
            <path
              d="M40 0L80 17.5V52.5L40 70L0 52.5V17.5L40 0Z"
              stroke="#8B5CF6"
              strokeWidth="0.5"
            />
          </svg>
        </motion.div>

        {/* Floating triangle - bottom left */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[20%] left-[8%]"
        >
          <svg width="50" height="44" viewBox="0 0 50 44" fill="none" className="opacity-[0.08]">
            <path d="M25 0L50 44H0L25 0Z" stroke="#8B5CF6" strokeWidth="0.5" />
          </svg>
        </motion.div>

        {/* Cross - center left */}
        <motion.div
          animate={{ rotate: [0, 180, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[45%] left-[5%]"
        >
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" className="opacity-[0.06]">
            <path d="M15 0V30M0 15H30" stroke="#A78BFA" strokeWidth="0.5" />
          </svg>
        </motion.div>

        {/* Small diamond - top left */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[25%] left-[15%]"
        >
          <div className="w-4 h-4 border border-[#8B5CF6] rotate-45" />
        </motion.div>
      </div>

      {/* Ghost grid pattern */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.03]"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="cardGridPattern" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="0.5" fill="#8B5CF6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cardGridPattern)" />
      </svg>

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center"
      >
        <Link
          to="/"
          className="flex items-center gap-3 text-xs tracking-[0.15em] uppercase opacity-50 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          Return
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 border border-[#1A1A1A]/20 rotate-45" />
          <span className="text-[10px] tracking-[0.2em] uppercase opacity-40">Member Card</span>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-8 py-32">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Abstract Card Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center"
          >
            {/* The Card - Abstract representation */}
            <div
              className="relative w-[340px] h-[480px]"
              style={{
                transform: `perspective(1000px) rotateY(${(mousePos.x - 0.5) * 5}deg) rotateX(${(mousePos.y - 0.5) * -5}deg)`,
              }}
            >
              {/* Outer frame - measurement lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Vertical measurement lines */}
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100%"
                  stroke="#8B5CF6"
                  strokeWidth="0.5"
                  strokeOpacity="0.15"
                />
                <line
                  x1="100%"
                  y1="0"
                  x2="100%"
                  y2="100%"
                  stroke="#8B5CF6"
                  strokeWidth="0.5"
                  strokeOpacity="0.15"
                />
                {/* Horizontal measurement lines */}
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="#8B5CF6"
                  strokeWidth="0.5"
                  strokeOpacity="0.15"
                />
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="#8B5CF6"
                  strokeWidth="0.5"
                  strokeOpacity="0.15"
                />
                {/* Corner ticks */}
                {[
                  [0, 0],
                  [340, 0],
                  [0, 480],
                  [340, 480],
                ].map(([x, y], i) => (
                  <g key={i}>
                    <line
                      x1={x - 8}
                      y1={y}
                      x2={x + 8}
                      y2={y}
                      stroke="#8B5CF6"
                      strokeWidth="0.5"
                      strokeOpacity="0.3"
                    />
                    <line
                      x1={x}
                      y1={y - 8}
                      x2={x}
                      y2={y + 8}
                      stroke="#8B5CF6"
                      strokeWidth="0.5"
                      strokeOpacity="0.3"
                    />
                  </g>
                ))}
              </svg>

              {/* Card body */}
              <motion.div
                className="absolute inset-6 bg-[#0A0A0A] overflow-hidden"
                style={{
                  boxShadow: `
                    0 0 80px rgba(139, 92, 246, 0.15),
                    0 25px 50px rgba(0, 0, 0, 0.15),
                    inset 0 0 60px rgba(139, 92, 246, 0.05)
                  `,
                }}
              >
                {/* Abstract line patterns inside card */}
                <svg className="absolute inset-0 w-full h-full opacity-20">
                  {/* Concentric rectangles */}
                  {[0, 1, 2, 3].map((i) => (
                    <motion.rect
                      key={i}
                      x={20 + i * 15}
                      y={20 + i * 20}
                      width={`calc(100% - ${40 + i * 30}px)`}
                      height={`calc(100% - ${40 + i * 40}px)`}
                      fill="none"
                      stroke="#8B5CF6"
                      strokeWidth="0.5"
                      strokeOpacity={0.4 - i * 0.08}
                      animate={{ opacity: [0.2, 0.4, 0.2] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                    />
                  ))}
                  {/* Diagonal lines */}
                  <motion.line
                    x1="0"
                    y1="0"
                    x2="100%"
                    y2="100%"
                    stroke="#8B5CF6"
                    strokeWidth="0.5"
                    strokeOpacity="0.1"
                    strokeDasharray="4 8"
                    animate={{ strokeDashoffset: [0, -24] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.line
                    x1="100%"
                    y1="0"
                    x2="0"
                    y2="100%"
                    stroke="#8B5CF6"
                    strokeWidth="0.5"
                    strokeOpacity="0.1"
                    strokeDasharray="4 8"
                    animate={{ strokeDashoffset: [0, 24] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  />
                </svg>

                {/* Card content */}
                <div className="relative h-full flex flex-col justify-between p-6">
                  {/* Top section */}
                  <div className="flex justify-between items-start">
                    {/* Geometric logo */}
                    <motion.div
                      animate={{ rotate: [0, 90, 90, 0] }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-10 h-10 border border-[#8B5CF6]/50 rotate-45 flex items-center justify-center"
                    >
                      <div className="w-4 h-4 bg-[#8B5CF6]/30" />
                    </motion.div>
                    <span className="text-[9px] tracking-[0.3em] uppercase text-[#8B5CF6]/50">
                      NFC
                    </span>
                  </div>

                  {/* Center - Abstract signal pattern */}
                  <div className="flex justify-center">
                    <svg width="120" height="80" viewBox="0 0 120 80">
                      {/* Signal waves */}
                      {[0, 1, 2, 3].map((i) => (
                        <motion.circle
                          key={i}
                          cx="60"
                          cy="40"
                          r={15 + i * 12}
                          fill="none"
                          stroke="#8B5CF6"
                          strokeWidth="0.5"
                          strokeOpacity={0.5 - i * 0.1}
                          animate={{
                            r: [15 + i * 12, 18 + i * 12, 15 + i * 12],
                            strokeOpacity: [0.5 - i * 0.1, 0.7 - i * 0.1, 0.5 - i * 0.1],
                          }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                      {/* Center dot */}
                      <motion.circle
                        cx="60"
                        cy="40"
                        r="4"
                        fill="#8B5CF6"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{ transformOrigin: '60px 40px' }}
                      />
                    </svg>
                  </div>

                  {/* Bottom section */}
                  <div>
                    <span className="text-[8px] tracking-[0.3em] uppercase text-[#FAF8F2]/30">
                      Lobster Sound
                    </span>
                    <div className="mt-2 font-serif text-xl text-[#FAF8F2]">{card.name}</div>
                    <div className="flex items-center gap-3 mt-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 bg-[#8B5CF6]"
                        style={{ boxShadow: '0 0 8px rgba(139, 92, 246, 0.6)' }}
                      />
                      <span className="text-[9px] tracking-[0.15em] uppercase text-[#8B5CF6]/60">
                        {card.edition}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Side labels */}
              <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-[9px] tracking-[0.2em] text-[#1A1A1A]/20 rotate-90 whitespace-nowrap">
                CR80 · 85.6 × 53.98 mm
              </div>
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-[9px] tracking-[0.2em] text-[#8B5CF6]/30 -rotate-90 whitespace-nowrap">
                NFC ENABLED
              </div>
            </div>

            {/* Edition counter below card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center"
            >
              <span className="text-[9px] tracking-[0.2em] uppercase text-[#1A1A1A]/30">
                Limited Edition
              </span>
              <div className="mt-2 font-serif text-2xl">
                {card.remaining}
                <span className="text-[#1A1A1A]/20">/{card.totalSupply}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Details - More abstract presentation */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="space-y-12"
          >
            {/* Header */}
            <div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="w-16 h-px bg-[#8B5CF6]/40 mb-6 origin-left"
              />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#8B5CF6]">
                {card.edition}
              </span>
              <h1 className="mt-4 text-4xl md:text-5xl font-serif">{card.name}</h1>
              <p className="mt-6 text-[#1A1A1A]/50 leading-relaxed font-light">
                {card.description}
              </p>
            </div>

            {/* Price - Minimal */}
            <div className="flex items-baseline gap-4">
              <span className="font-serif text-5xl">{card.price}</span>
              <span className="text-sm text-[#1A1A1A]/30">{card.currency}</span>
              <span className="text-[10px] text-[#1A1A1A]/20 tracking-wide ml-4">
                One-time · Lifetime
              </span>
            </div>

            {/* Features - Animated cycling */}
            <div className="py-8 border-y border-[#1A1A1A]/5">
              <span className="text-[9px] tracking-[0.2em] uppercase text-[#1A1A1A]/30">
                What You Receive
              </span>
              <div className="mt-6 h-8 relative overflow-hidden">
                {card.features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={false}
                    animate={{
                      y: activeFeature === i ? 0 : activeFeature > i ? -40 : 40,
                      opacity: activeFeature === i ? 1 : 0,
                    }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 flex items-center gap-4"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5 bg-[#8B5CF6]"
                    />
                    <span className="text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>
              {/* Progress dots */}
              <div className="mt-4 flex gap-2">
                {card.features.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-1 transition-all duration-300 ${
                      activeFeature === i ? 'bg-[#8B5CF6] w-4' : 'bg-[#1A1A1A]/15'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Unlocks - Grid */}
            <div>
              <span className="text-[9px] tracking-[0.2em] uppercase text-[#1A1A1A]/30">
                Archive Access
              </span>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {card.unlocks.map((unlock, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="flex items-center gap-3 py-2"
                  >
                    <div className="w-px h-4 bg-[#8B5CF6]/30" />
                    <span className="text-xs text-[#1A1A1A]/60">{unlock}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              <Link
                to="/thank-you"
                className="group relative inline-flex items-center gap-6 px-10 py-5 bg-[#0A0A0A] text-[#FAF8F2] text-xs tracking-[0.2em] uppercase overflow-hidden transition-all duration-500 hover:pr-14"
              >
                <span className="relative z-10">Get Access</span>
                <motion.div
                  className="absolute right-5 opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="w-2 h-2 border-t border-r border-[#8B5CF6] rotate-45" />
                </motion.div>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, transparent 50%)',
                  }}
                />
              </Link>
              <p className="mt-4 text-[10px] text-[#1A1A1A]/25 tracking-wide">
                Ships worldwide. NFC-ready on arrival.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Drops Preview - More abstract grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="px-8 md:px-16 pb-24"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-6 mb-12">
            <div className="flex-1 h-px bg-[#1A1A1A]/5" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#1A1A1A]/30">
              Archive Preview
            </span>
            <div className="flex-1 h-px bg-[#1A1A1A]/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {drops.map((drop, i) => (
              <motion.div
                key={drop.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + i * 0.1 }}
                onMouseEnter={() => setHoveredDrop(drop.id)}
                onMouseLeave={() => setHoveredDrop(null)}
                className="group relative"
              >
                <Link to={`/drop/${drop.id}`} className="block">
                  <div
                    className={`relative border transition-all duration-500 p-6 ${
                      hoveredDrop === drop.id
                        ? 'border-[#8B5CF6]/40 bg-[#8B5CF6]/[0.02]'
                        : 'border-[#1A1A1A]/5'
                    }`}
                  >
                    {/* Abstract cover pattern */}
                    <div className="aspect-square mb-6 relative overflow-hidden bg-[#FAF8F2]">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Different pattern per drop */}
                        {i === 0 &&
                          [0, 1, 2, 3].map((j) => (
                            <motion.rect
                              key={j}
                              x={20 + j * 5}
                              y={20 + j * 5}
                              width={60 - j * 10}
                              height={60 - j * 10}
                              fill="none"
                              stroke={hoveredDrop === drop.id ? '#8B5CF6' : '#1A1A1A'}
                              strokeWidth="0.5"
                              strokeOpacity={hoveredDrop === drop.id ? 0.6 - j * 0.1 : 0.15 - j * 0.03}
                              animate={hoveredDrop === drop.id ? { rotate: [0, 45, 0] } : {}}
                              transition={{ duration: 4, repeat: Infinity }}
                              style={{ transformOrigin: '50px 50px' }}
                            />
                          ))}
                        {i === 1 &&
                          [0, 1, 2, 3, 4].map((j) => (
                            <motion.circle
                              key={j}
                              cx="50"
                              cy="50"
                              r={8 + j * 8}
                              fill="none"
                              stroke={hoveredDrop === drop.id ? '#8B5CF6' : '#1A1A1A'}
                              strokeWidth="0.5"
                              strokeOpacity={hoveredDrop === drop.id ? 0.5 - j * 0.08 : 0.12 - j * 0.02}
                              animate={
                                hoveredDrop === drop.id ? { r: [8 + j * 8, 10 + j * 8, 8 + j * 8] } : {}
                              }
                              transition={{ duration: 2, repeat: Infinity, delay: j * 0.15 }}
                            />
                          ))}
                        {i === 2 && (
                          <>
                            {[0, 1, 2].map((j) => (
                              <motion.polygon
                                key={j}
                                points="50,20 75,65 25,65"
                                fill="none"
                                stroke={hoveredDrop === drop.id ? '#8B5CF6' : '#1A1A1A'}
                                strokeWidth="0.5"
                                strokeOpacity={hoveredDrop === drop.id ? 0.5 - j * 0.15 : 0.12 - j * 0.03}
                                transform={`scale(${1 - j * 0.2})`}
                                style={{ transformOrigin: '50px 50px' }}
                                animate={hoveredDrop === drop.id ? { rotate: [0, 120, 0] } : {}}
                                transition={{ duration: 6, repeat: Infinity }}
                              />
                            ))}
                          </>
                        )}
                        {/* Center dot */}
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="3"
                          fill={hoveredDrop === drop.id ? '#8B5CF6' : '#1A1A1A'}
                          fillOpacity={hoveredDrop === drop.id ? 0.6 : 0.15}
                          animate={hoveredDrop === drop.id ? { scale: [1, 1.5, 1] } : {}}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          style={{ transformOrigin: '50px 50px' }}
                        />
                      </svg>

                      {/* Exclusive badge */}
                      {drop.exclusive && (
                        <div className="absolute top-3 right-3">
                          <span
                            className="text-[8px] tracking-[0.1em] uppercase px-2 py-1 border border-[#8B5CF6]/30"
                            style={{ color: '#8B5CF6', background: 'rgba(139, 92, 246, 0.08)' }}
                          >
                            Exclusive
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="space-y-2">
                      <span className="text-[9px] tracking-[0.15em] uppercase text-[#1A1A1A]/25">
                        {drop.type}
                      </span>
                      <h3
                        className={`font-serif text-lg transition-colors duration-300 ${
                          hoveredDrop === drop.id ? 'text-[#8B5CF6]' : ''
                        }`}
                      >
                        {drop.title}
                      </h3>
                      <p className="text-[10px] text-[#1A1A1A]/30">
                        {drop.trackCount} signals · {drop.duration}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Bottom corner ornaments */}
      <div className="fixed bottom-8 left-8 pointer-events-none">
        <svg width="32" height="32" viewBox="0 0 32 32" className="opacity-[0.08]">
          <path d="M0 32 L16 32 L16 30 L2 30 L2 16 L0 16 Z" fill="#1A1A1A" />
        </svg>
      </div>
      <div className="fixed bottom-8 right-8 pointer-events-none">
        <div className="w-3 h-3 border border-[#1A1A1A]/20 rotate-45" />
      </div>
    </div>
  );
}
