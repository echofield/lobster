import { Link, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { drops, memberCards } from '@/data/cards';
import { useState, useEffect } from 'react';
import { Play, Pause, ShoppingBag } from 'lucide-react';

// Abstract cover patterns
const CoverPatterns = {
  squares: ({ isPlaying }: { isPlaying: boolean }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {[0, 1, 2, 3].map((i) => (
        <motion.rect
          key={i}
          x={20 + i * 5}
          y={20 + i * 5}
          width={60 - i * 10}
          height={60 - i * 10}
          fill="none"
          stroke={isPlaying ? '#8B5CF6' : '#1A1A1A'}
          strokeWidth="0.5"
          strokeOpacity={isPlaying ? 0.8 - i * 0.15 : 0.2 - i * 0.03}
          animate={isPlaying ? { rotate: [0, 90], scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
          style={{ transformOrigin: '50px 50px' }}
        />
      ))}
      <motion.rect
        x="45"
        y="45"
        width="10"
        height="10"
        fill={isPlaying ? '#8B5CF6' : '#1A1A1A'}
        fillOpacity={isPlaying ? 0.6 : 0.1}
        animate={isPlaying ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ transformOrigin: '50px 50px' }}
      />
    </svg>
  ),
  circles: ({ isPlaying }: { isPlaying: boolean }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.circle
          key={i}
          cx="50"
          cy="50"
          r={10 + i * 8}
          fill="none"
          stroke={isPlaying ? '#8B5CF6' : '#1A1A1A'}
          strokeWidth="0.5"
          strokeOpacity={isPlaying ? 0.6 - i * 0.1 : 0.15 - i * 0.02}
          animate={isPlaying ? { r: [10 + i * 8, 12 + i * 8, 10 + i * 8] } : {}}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
      <motion.circle
        cx="50"
        cy="50"
        r="4"
        fill={isPlaying ? '#8B5CF6' : '#1A1A1A'}
        fillOpacity={isPlaying ? 0.8 : 0.2}
        animate={isPlaying ? { scale: [1, 1.5, 1] } : {}}
        transition={{ duration: 1, repeat: Infinity }}
        style={{ transformOrigin: '50px 50px' }}
      />
    </svg>
  ),
  grid: ({ isPlaying }: { isPlaying: boolean }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 5 }).map((_, col) => (
          <motion.rect
            key={`${row}-${col}`}
            x={20 + col * 15}
            y={20 + row * 15}
            width="8"
            height="8"
            fill={isPlaying ? '#8B5CF6' : '#1A1A1A'}
            fillOpacity={isPlaying ? 0.1 + (row + col) * 0.05 : 0.05 + (row + col) * 0.02}
            animate={isPlaying ? {
              scale: [1, 1.2, 1],
              fillOpacity: [0.1 + (row + col) * 0.05, 0.3 + (row + col) * 0.05, 0.1 + (row + col) * 0.05]
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity, delay: (row + col) * 0.1 }}
            style={{ transformOrigin: `${24 + col * 15}px ${24 + row * 15}px` }}
          />
        ))
      )}
    </svg>
  ),
  hexagon: ({ isPlaying }: { isPlaying: boolean }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {[0, 1, 2].map((i) => (
        <motion.polygon
          key={i}
          points="50,15 80,32.5 80,67.5 50,85 20,67.5 20,32.5"
          fill="none"
          stroke={isPlaying ? '#8B5CF6' : '#1A1A1A'}
          strokeWidth="0.5"
          strokeOpacity={isPlaying ? 0.6 - i * 0.15 : 0.15 - i * 0.03}
          transform={`scale(${1 - i * 0.2})`}
          style={{ transformOrigin: '50px 50px' }}
          animate={isPlaying ? { rotate: [0, 60, 0] } : {}}
          transition={{ duration: 6, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
      <motion.circle
        cx="50"
        cy="50"
        r="5"
        fill={isPlaying ? '#8B5CF6' : '#1A1A1A'}
        fillOpacity={isPlaying ? 0.6 : 0.15}
        animate={isPlaying ? { scale: [1, 1.4, 1] } : {}}
        transition={{ duration: 1.2, repeat: Infinity }}
        style={{ transformOrigin: '50px 50px' }}
      />
    </svg>
  ),
};

const patterns = ['squares', 'circles', 'grid', 'hexagon'] as const;

export function MemberAccessPage() {
  const { token } = useParams();
  const card = memberCards[0];
  const [phase, setPhase] = useState<'detecting' | 'recognized' | 'granted' | 'ready'>('detecting');
  const [hoveredDrop, setHoveredDrop] = useState<string | null>(null);
  const [playingDrop, setPlayingDrop] = useState<string | null>(null);

  const togglePlay = (dropId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPlayingDrop(playingDrop === dropId ? null : dropId);
  };

  useEffect(() => {
    // NFC Magic Sequence
    const timers = [
      setTimeout(() => setPhase('recognized'), 1200),
      setTimeout(() => setPhase('granted'), 2400),
      setTimeout(() => setPhase('ready'), 3600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const isReady = phase === 'ready';

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#1A1A1A] relative overflow-hidden">
      {/* NFC Detection Overlay - The Magic Moment */}
      <AnimatePresence>
        {phase !== 'ready' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 bg-[#FAF8F2] flex items-center justify-center"
          >
            {/* Ambient glow */}
            <motion.div
              animate={{
                scale: phase === 'granted' ? [1, 1.5] : 1,
                opacity: phase === 'granted' ? [0.3, 0] : 0.2
              }}
              transition={{ duration: 1 }}
              className="absolute w-[80vmin] h-[80vmin] rounded-full blur-[100px]"
              style={{
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)'
              }}
            />

            {/* Main Circle */}
            <div className="relative">
              {/* Outer expanding rings */}
              {phase === 'recognized' && (
                <>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.6 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-[#8B5CF6]"
                  />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.4 }}
                    animate={{ scale: 3, opacity: 0 }}
                    transition={{ duration: 1.8, ease: 'easeOut', delay: 0.2 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-[#8B5CF6]"
                  />
                </>
              )}

              {/* The Circle */}
              <motion.div
                animate={{
                  scale: phase === 'detecting' ? [1, 1.02, 1] : 1,
                  boxShadow: phase === 'recognized' || phase === 'granted'
                    ? '0 0 60px rgba(139, 92, 246, 0.4), 0 0 120px rgba(139, 92, 246, 0.2)'
                    : '0 0 0px transparent'
                }}
                transition={{
                  scale: { duration: 2, repeat: phase === 'detecting' ? Infinity : 0 },
                  boxShadow: { duration: 0.6 }
                }}
                className="w-64 h-64 rounded-full border border-[#1A1A1A]/10 relative flex items-center justify-center"
                style={{
                  background: phase === 'granted'
                    ? 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)'
                    : 'transparent'
                }}
              >
                {/* Inner geometric element */}
                <motion.div
                  animate={{
                    rotate: phase === 'detecting' ? [0, 360] : phase === 'recognized' ? 45 : 0,
                    scale: phase === 'granted' ? [1, 0.9, 1] : 1
                  }}
                  transition={{
                    rotate: phase === 'detecting'
                      ? { duration: 8, repeat: Infinity, ease: 'linear' }
                      : { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                    scale: { duration: 1.5, repeat: phase === 'granted' ? Infinity : 0 }
                  }}
                  className="w-16 h-16 border border-[#8B5CF6]/40 relative"
                  style={{
                    background: phase !== 'detecting'
                      ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 139, 250, 0.05) 100%)'
                      : 'transparent'
                  }}
                >
                  {/* Center dot */}
                  <motion.div
                    animate={{
                      scale: phase === 'recognized' || phase === 'granted' ? [1, 1.5, 1] : 1,
                      opacity: phase === 'detecting' ? 0.3 : 1
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2"
                    style={{
                      background: '#8B5CF6',
                      boxShadow: phase !== 'detecting' ? '0 0 20px rgba(139, 92, 246, 0.8)' : 'none'
                    }}
                  />
                </motion.div>

                {/* Corner markers */}
                <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-[#8B5CF6]/20" />
                <div className="absolute top-8 right-8 w-4 h-4 border-t border-r border-[#8B5CF6]/20" />
                <div className="absolute bottom-8 left-8 w-4 h-4 border-b border-l border-[#8B5CF6]/20" />
                <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-[#8B5CF6]/20" />
              </motion.div>

              {/* Text States */}
              <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 text-center w-80">
                <AnimatePresence mode="wait">
                  {phase === 'detecting' && (
                    <motion.div
                      key="detecting"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-2"
                    >
                      <motion.p
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-xs tracking-[0.3em] uppercase text-[#1A1A1A]/40"
                      >
                        Detecting Signal...
                      </motion.p>
                    </motion.div>
                  )}

                  {phase === 'recognized' && (
                    <motion.div
                      key="recognized"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3"
                    >
                      <p
                        className="text-sm tracking-[0.25em] uppercase font-medium"
                        style={{ color: '#8B5CF6' }}
                      >
                        Lobster Card Detected
                      </p>
                      <p className="text-xs tracking-[0.15em] uppercase text-[#1A1A1A]/30">
                        Card #{String(41).padStart(3, '0')}
                      </p>
                    </motion.div>
                  )}

                  {phase === 'granted' && (
                    <motion.div
                      key="granted"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3"
                    >
                      <p
                        className="text-sm tracking-[0.25em] uppercase font-medium"
                        style={{ color: '#8B5CF6' }}
                      >
                        Archive Access Granted
                      </p>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-px mx-auto w-24"
                        style={{ background: 'linear-gradient(90deg, transparent, #8B5CF6, transparent)' }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Floating geometric shapes */}
            <motion.div
              animate={{ rotate: 360, y: [0, -5, 0] }}
              transition={{ rotate: { duration: 20, repeat: Infinity }, y: { duration: 3, repeat: Infinity } }}
              className="absolute top-[20%] left-[15%]"
            >
              <svg width="30" height="26" viewBox="0 0 30 26" fill="none" className="opacity-[0.08]">
                <path d="M15 0L30 26H0L15 0Z" stroke="#8B5CF6" strokeWidth="0.5" />
              </svg>
            </motion.div>

            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute bottom-[25%] right-[20%]"
            >
              <div className="w-8 h-8 border border-[#8B5CF6]/10 rotate-45" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Soft ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/3 w-[50vw] h-[50vw] rounded-full opacity-20 blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)' }}
        />
      </div>

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-40 px-8 py-6 flex justify-between items-center"
      >
        <Link to="/" className="flex items-center gap-2">
          <div className="w-4 h-4 border border-[#1A1A1A]/30 rotate-45" />
          <span className="text-xs tracking-[0.2em] uppercase opacity-60">Lobster Sound</span>
        </Link>
        <span className="text-xs tracking-[0.15em] uppercase" style={{ color: '#8B5CF6' }}>
          Archive
        </span>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-8 md:px-16 max-w-6xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 30 }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          {/* Status Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: isReady ? 1 : 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-3 px-6 py-3 border border-[#8B5CF6]/30 mb-8"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(167, 139, 250, 0.03) 100%)'
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2"
              style={{ background: '#8B5CF6', boxShadow: '0 0 10px rgba(139, 92, 246, 0.6)' }}
            />
            <span className="text-xs tracking-[0.15em] uppercase" style={{ color: '#8B5CF6' }}>
              Signal Active
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-serif mb-4">Your Archive</h1>
          <p className="text-[#1A1A1A]/40">
            Card #{String(41).padStart(3, '0')} <span className="mx-3 opacity-30">·</span> {card.edition}
          </p>
        </motion.div>

        {/* Archive Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: isReady ? 1 : 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="flex justify-between items-center mb-10">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/40">
              Available Packs
            </span>
            <span className="text-xs text-[#1A1A1A]/30">
              {drops.length} unlocked
            </span>
          </div>

          {/* Album Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {drops.map((drop, i) => {
              const PatternComponent = CoverPatterns[patterns[i % patterns.length]];
              const isPlaying = playingDrop === drop.id;
              const isHovered = hoveredDrop === drop.id;

              return (
                <motion.div
                  key={drop.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 30 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                  className="group"
                  onMouseEnter={() => setHoveredDrop(drop.id)}
                  onMouseLeave={() => setHoveredDrop(null)}
                >
                  {/* Album Card */}
                  <div className={`relative border transition-all duration-500 ${
                    isHovered || isPlaying
                      ? 'border-[#8B5CF6]/40 bg-[#8B5CF6]/[0.02]'
                      : 'border-[#1A1A1A]/10'
                  }`}>
                    {/* Abstract Cover */}
                    <div className="aspect-square relative overflow-hidden bg-[#FAF8F2]">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PatternComponent isPlaying={isPlaying} />
                      </div>

                      {/* Play Button Overlay */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered || isPlaying ? 1 : 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-[#FAF8F2]/60 backdrop-blur-sm"
                      >
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => togglePlay(drop.id, e)}
                          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isPlaying
                              ? 'bg-[#8B5CF6] text-white'
                              : 'border-2 border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white'
                          }`}
                          style={{
                            boxShadow: isPlaying ? '0 0 30px rgba(139, 92, 246, 0.4)' : 'none'
                          }}
                        >
                          {isPlaying ? (
                            <Pause className="w-6 h-6" fill="currentColor" />
                          ) : (
                            <Play className="w-6 h-6 ml-1" fill="currentColor" />
                          )}
                        </motion.button>
                      </motion.div>

                      {/* Playing indicator */}
                      {isPlaying && (
                        <motion.div
                          className="absolute bottom-4 left-4 right-4"
                        >
                          <div className="flex items-end gap-1 h-4">
                            {[...Array(12)].map((_, j) => (
                              <motion.div
                                key={j}
                                className="flex-1 bg-[#8B5CF6]"
                                animate={{
                                  height: ['30%', '100%', '50%', '80%', '30%']
                                }}
                                transition={{
                                  duration: 0.8,
                                  repeat: Infinity,
                                  delay: j * 0.05,
                                  ease: 'easeInOut'
                                }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Exclusive Badge */}
                      {drop.exclusive && (
                        <div className="absolute top-4 right-4">
                          <span
                            className="text-[9px] tracking-[0.1em] uppercase px-2 py-1 border border-[#8B5CF6]/30"
                            style={{
                              color: '#8B5CF6',
                              background: 'rgba(139, 92, 246, 0.08)'
                            }}
                          >
                            Exclusive
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className={`font-serif text-lg transition-colors duration-300 ${
                          isHovered || isPlaying ? 'text-[#8B5CF6]' : ''
                        }`}>
                          {drop.title}
                        </h3>
                        <p className="text-sm text-[#1A1A1A]/40 mt-1">{drop.artist}</p>
                      </div>

                      <p className="text-xs text-[#1A1A1A]/30 line-clamp-2">
                        {drop.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-[#1A1A1A]/5">
                        <span className="text-[10px] text-[#1A1A1A]/30 tracking-wide">
                          {drop.trackCount} signals · {drop.duration}
                        </span>

                        <Link
                          to={`/drop/${drop.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 text-xs tracking-[0.1em] uppercase transition-all duration-300 border border-[#8B5CF6]/30 hover:bg-[#8B5CF6] hover:text-white hover:border-[#8B5CF6]"
                          style={{ color: '#8B5CF6' }}
                        >
                          <ShoppingBag className="w-3 h-3" />
                          Access
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Card Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isReady ? 1 : 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 p-6 border border-[#1A1A1A]/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-[10px] tracking-[0.15em] uppercase text-[#1A1A1A]/30">
                Card Signal
              </span>
              <div className="flex items-center gap-2 mt-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2"
                  style={{ background: '#8B5CF6', boxShadow: '0 0 8px rgba(139, 92, 246, 0.5)' }}
                />
                <span className="text-sm">Active</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] tracking-[0.15em] uppercase text-[#1A1A1A]/30">
                Access Level
              </span>
              <p className="text-sm mt-2">Full Archive</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Diamond */}
      <div className="fixed bottom-8 right-8">
        <div className="w-3 h-3 border border-[#1A1A1A]/20 rotate-45" />
      </div>
    </div>
  );
}
