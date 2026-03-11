import { Link } from 'react-router';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { memberCards, drops } from '@/data/cards';
import { Play, Pause } from 'lucide-react';

export function HomePage() {
  const featuredCard = memberCards[0];
  const [activeTab, setActiveTab] = useState(2);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  const previewTracks = [
    { name: 'Sediment Flow', duration: '0:48', drop: 'Mineral Textures' },
    { name: 'Static Bloom', duration: '0:44', drop: 'Night Signals' },
    { name: 'Crystal Resonance', duration: '0:52', drop: 'Mineral Textures' },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const tabs = ['ARCHIVE', 'DROPS', 'MEMBERSHIP', 'SIGNAL', 'ACCESS', 'VOID'];

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#1A1A1A] relative overflow-hidden flex flex-col">
      {/* Soft ambient glow backgrounds - more violet/lavender */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] rounded-full opacity-25 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(167, 139, 250, 0.2) 40%, transparent 70%)',
            transform: `translate(${(mousePos.x - 0.5) * 30}px, ${(mousePos.y - 0.5) * 30}px)`
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] rounded-full opacity-20 blur-[100px]"
          style={{
            background: 'radial-gradient(circle, rgba(196, 181, 253, 0.4) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 70%)',
            transform: `translate(${(mousePos.x - 0.5) * -20}px, ${(mousePos.y - 0.5) * -20}px)`
          }}
        />
      </div>

      {/* Floating geometric shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Rotating triangle - top left */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[15%] left-[10%]"
          style={{ transform: `translate(${(mousePos.x - 0.5) * 15}px, ${(mousePos.y - 0.5) * 15}px)` }}
        >
          <svg width="40" height="35" viewBox="0 0 40 35" fill="none" className="opacity-[0.08]">
            <path d="M20 0L40 35H0L20 0Z" stroke="#8B5CF6" strokeWidth="0.5" />
          </svg>
        </motion.div>

        {/* Floating hexagon - top right */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[20%] right-[15%]"
        >
          <svg width="50" height="44" viewBox="0 0 50 44" fill="none" className="opacity-[0.06]">
            <path d="M25 0L50 12V32L25 44L0 32V12L25 0Z" stroke="#8B5CF6" strokeWidth="0.5" />
          </svg>
        </motion.div>

        {/* Small diamond - bottom left */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.06, 0.1, 0.06] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[25%] left-[20%]"
        >
          <div className="w-6 h-6 border border-[#8B5CF6] rotate-45" style={{ opacity: 0.15 }} />
        </motion.div>

        {/* Cross shape - center right */}
        <motion.div
          animate={{ rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[45%] right-[8%]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="opacity-[0.08]">
            <path d="M12 0V24M0 12H24" stroke="#A78BFA" strokeWidth="0.5" />
          </svg>
        </motion.div>
      </div>

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center"
      >
        <Link to="/" className="flex items-center gap-2">
          <div className="w-5 h-5 border border-[#1A1A1A]/30 rotate-45" />
          <span className="text-xs tracking-[0.2em] uppercase opacity-60">Lobster Sound</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/access" className="text-xs tracking-[0.15em] uppercase opacity-40 hover:opacity-100 transition-opacity">
            Archive
          </Link>
          <Link to="/card" className="text-xs tracking-[0.15em] uppercase opacity-40 hover:opacity-100 transition-opacity">
            Card
          </Link>
        </div>
      </motion.nav>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* THE CIRCLE - Massive focal element */}
        <div className="relative">
          {/* Outer Ring */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-[70vmin] h-[70vmin] rounded-full border border-[#1A1A1A]/10 relative"
            style={{
              transform: `translate(${(mousePos.x - 0.5) * 10}px, ${(mousePos.y - 0.5) * 10}px)`,
              boxShadow: '0 0 80px rgba(139, 92, 246, 0.08), 0 0 160px rgba(167, 139, 250, 0.05)'
            }}
          >
            {/* Inner Gradient - more violet */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle at ${50 + (mousePos.x - 0.5) * 20}% ${50 + (mousePos.y - 0.5) * 20}%, rgba(139, 92, 246, 0.08) 0%, rgba(196, 181, 253, 0.05) 40%, transparent 70%)`
              }}
            />

            {/* Grid Lines */}
            <div className="absolute inset-0 rounded-full overflow-hidden opacity-[0.06]">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-[#1A1A1A]" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#1A1A1A]" />
            </div>

            {/* CENTER PLAYER - Abstract Geometric */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              {/* Geometric Play Interface */}
              <motion.button
                onClick={() => setIsPlaying(!isPlaying)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative mx-auto mb-6"
              >
                {/* Outer square frame */}
                <motion.div
                  animate={{ rotate: isPlaying ? 45 : 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-20 h-20 border border-[#1A1A1A]/15 relative"
                  style={{
                    boxShadow: isPlaying
                      ? '0 0 40px rgba(139, 92, 246, 0.2), inset 0 0 30px rgba(139, 92, 246, 0.05)'
                      : 'none'
                  }}
                >
                  {/* Inner diamond */}
                  <motion.div
                    animate={{
                      scale: isPlaying ? [1, 0.85, 1] : 1,
                      rotate: isPlaying ? -45 : 0
                    }}
                    transition={{
                      scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                      rotate: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
                    }}
                    className="absolute inset-3 border border-[#8B5CF6]/30"
                    style={{
                      background: isPlaying
                        ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(196, 181, 253, 0.05) 100%)'
                        : 'transparent'
                    }}
                  />
                  {/* Center dot */}
                  <motion.div
                    animate={{
                      scale: isPlaying ? [1, 1.5, 1] : 1,
                      opacity: isPlaying ? [0.6, 1, 0.6] : 0.3
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2"
                    style={{
                      background: isPlaying ? '#8B5CF6' : '#1A1A1A',
                      boxShadow: isPlaying ? '0 0 15px rgba(139, 92, 246, 0.6)' : 'none'
                    }}
                  />
                </motion.div>
                {/* Corner accents */}
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-[#8B5CF6]/20" />
                <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-[#8B5CF6]/20" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-[#8B5CF6]/20" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-[#8B5CF6]/20" />
              </motion.button>

              {/* Track Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="space-y-1"
              >
                <p className="text-sm font-medium tracking-wide">{previewTracks[currentTrack].name}</p>
                <p className="text-xs opacity-40">{previewTracks[currentTrack].drop}</p>
              </motion.div>

              {/* Abstract signal visualization */}
              {isPlaying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-5 flex items-center justify-center gap-1"
                >
                  {[...Array(7)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scaleY: [1, 1.5 + Math.random(), 1],
                        opacity: [0.4, 0.8, 0.4]
                      }}
                      transition={{
                        duration: 0.8 + Math.random() * 0.4,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: 'easeInOut'
                      }}
                      className="w-px h-4"
                      style={{
                        background: 'linear-gradient(180deg, #8B5CF6 0%, #C4B5FD 100%)'
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </div>

            {/* Poetic Text - Bottom of circle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-[15%] left-1/2 -translate-x-1/2 text-center"
            >
              <p className="font-serif italic text-lg opacity-30 tracking-wide">
                Sound is access
              </p>
            </motion.div>
          </motion.div>

          {/* Floating Cube - Right side with subtle animation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute right-[-80px] top-1/2 -translate-y-1/2"
          >
            <motion.svg
              width="60"
              height="70"
              viewBox="0 0 60 70"
              fill="none"
              className="opacity-20"
              animate={{
                rotateY: [0, 10, 0, -10, 0],
                rotateX: [0, 5, 0, -5, 0]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <motion.path
                d="M30 0L60 17.5V52.5L30 70L0 52.5V17.5L30 0Z"
                stroke="#8B5CF6"
                strokeWidth="0.5"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <path d="M30 35L60 17.5" stroke="#8B5CF6" strokeWidth="0.5" />
              <path d="M30 35L0 17.5" stroke="#8B5CF6" strokeWidth="0.5" />
              <path d="M30 35V70" stroke="#8B5CF6" strokeWidth="0.5" />
            </motion.svg>
          </motion.div>

          {/* Track Selector - Left side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute left-[-100px] top-1/2 -translate-y-1/2 space-y-4"
          >
            {previewTracks.map((track, i) => (
              <button
                key={i}
                onClick={() => { setCurrentTrack(i); setIsPlaying(true); }}
                className={`block text-left transition-all duration-300 relative ${
                  currentTrack === i ? 'opacity-100' : 'opacity-25 hover:opacity-50'
                }`}
              >
                <span
                  className="text-[10px] tracking-wider font-light"
                  style={{
                    color: currentTrack === i ? '#8B5CF6' : undefined,
                    textShadow: currentTrack === i ? '0 0 12px rgba(139, 92, 246, 0.4)' : undefined
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                {currentTrack === i && (
                  <motion.div
                    layoutId="trackIndicator"
                    className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-1"
                    style={{
                      background: '#8B5CF6',
                      boxShadow: '0 0 10px rgba(139, 92, 246, 0.8)'
                    }}
                  />
                )}
              </button>
            ))}
          </motion.div>
        </div>

        {/* CTA - Bottom center */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center"
        >
          <Link
            to="/card"
            className="group inline-block px-8 py-4 border border-[#1A1A1A]/15 text-xs tracking-[0.2em] uppercase transition-all duration-500 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.03) 0%, rgba(196, 181, 253, 0.03) 100%)'
            }}
          >
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">Get Your Card</span>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)'
              }}
            />
          </Link>
        </motion.div>

        {/* Edition Counter - Bottom left */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-8 text-xs"
        >
          <span className="opacity-40 tracking-[0.1em]">FOUNDING EDITION</span>
          <div className="mt-1 font-serif text-lg">
            {featuredCard.remaining}<span className="opacity-30">/{featuredCard.totalSupply}</span>
          </div>
        </motion.div>

        {/* Diamond - Bottom right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 right-8"
        >
          <div className="w-3 h-3 border border-[#1A1A1A]/30 rotate-45" />
        </motion.div>
      </div>

      {/* Bottom Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="pb-8 flex justify-center gap-8"
      >
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`text-[10px] tracking-[0.15em] uppercase transition-all duration-300 relative ${
              activeTab === i ? 'opacity-100' : 'opacity-25 hover:opacity-50'
            }`}
            style={{
              color: activeTab === i ? '#8B5CF6' : undefined,
              textShadow: activeTab === i ? '0 0 12px rgba(139, 92, 246, 0.3)' : undefined
            }}
          >
            {tab}
            {activeTab === i && (
              <motion.div
                layoutId="tabIndicator"
                className="absolute -bottom-2 left-0 right-0 h-px"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, #8B5CF6 50%, transparent 100%)'
                }}
              />
            )}
          </button>
        ))}
      </motion.div>
    </div>
  );
}
