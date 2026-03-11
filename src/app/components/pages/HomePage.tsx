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
      {/* Soft ambient glow backgrounds */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] rounded-full opacity-30 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(199, 146, 234, 0.4) 0%, rgba(255, 182, 193, 0.3) 40%, transparent 70%)',
            transform: `translate(${(mousePos.x - 0.5) * 30}px, ${(mousePos.y - 0.5) * 30}px)`
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] rounded-full opacity-25 blur-[100px]"
          style={{
            background: 'radial-gradient(circle, rgba(255, 200, 150, 0.5) 0%, rgba(255, 160, 180, 0.3) 50%, transparent 70%)',
            transform: `translate(${(mousePos.x - 0.5) * -20}px, ${(mousePos.y - 0.5) * -20}px)`
          }}
        />
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
              boxShadow: '0 0 60px rgba(199, 146, 234, 0.15), 0 0 120px rgba(255, 182, 193, 0.1)'
            }}
          >
            {/* Inner Candy Gradient */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle at ${50 + (mousePos.x - 0.5) * 20}% ${50 + (mousePos.y - 0.5) * 20}%, rgba(199, 146, 234, 0.15) 0%, rgba(255, 182, 193, 0.1) 30%, transparent 60%)`
              }}
            />

            {/* Grid Lines */}
            <div className="absolute inset-0 rounded-full overflow-hidden opacity-10">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-[#1A1A1A]" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#1A1A1A]" />
            </div>

            {/* CENTER PLAYER */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              {/* Play Button with glow */}
              <motion.button
                onClick={() => setIsPlaying(!isPlaying)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-24 h-24 rounded-full border-2 border-[#1A1A1A]/20 flex items-center justify-center transition-all duration-300 mx-auto relative"
                style={{
                  background: isPlaying
                    ? 'linear-gradient(135deg, rgba(199, 146, 234, 0.15) 0%, rgba(255, 182, 193, 0.15) 100%)'
                    : 'transparent',
                  boxShadow: isPlaying
                    ? '0 0 40px rgba(199, 146, 234, 0.3), 0 0 80px rgba(255, 182, 193, 0.2)'
                    : 'none'
                }}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" style={{ color: '#C792EA' }} />
                ) : (
                  <Play className="w-8 h-8 text-[#1A1A1A]/50 ml-1" />
                )}
              </motion.button>

              {/* Track Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-6 space-y-1"
              >
                <p className="text-sm font-medium">{previewTracks[currentTrack].name}</p>
                <p className="text-xs opacity-40">{previewTracks[currentTrack].drop}</p>
              </motion.div>

              {/* Mini Waveform with candy gradient */}
              {isPlaying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 flex items-center justify-center gap-0.5"
                >
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [8, 20 + Math.random() * 12, 8] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                      className="w-0.5 rounded-full"
                      style={{
                        height: 8,
                        background: `linear-gradient(180deg, #C792EA ${i * 5}%, #FFB6C1 100%)`
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
              <p className="font-serif italic text-lg opacity-40 tracking-wide">
                Sound is access
              </p>
            </motion.div>
          </motion.div>

          {/* Floating Cube - Right side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute right-[-80px] top-1/2 -translate-y-1/2"
          >
            <svg width="60" height="70" viewBox="0 0 60 70" fill="none" className="opacity-20">
              <path d="M30 0L60 17.5V52.5L30 70L0 52.5V17.5L30 0Z" stroke="#1A1A1A" strokeWidth="0.5" />
              <path d="M30 35L60 17.5" stroke="#1A1A1A" strokeWidth="0.5" />
              <path d="M30 35L0 17.5" stroke="#1A1A1A" strokeWidth="0.5" />
              <path d="M30 35V70" stroke="#1A1A1A" strokeWidth="0.5" />
            </svg>
          </motion.div>

          {/* Track Selector - Left side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute left-[-120px] top-1/2 -translate-y-1/2 space-y-3"
          >
            {previewTracks.map((track, i) => (
              <button
                key={i}
                onClick={() => { setCurrentTrack(i); setIsPlaying(true); }}
                className={`block text-left transition-all duration-300 relative ${
                  currentTrack === i ? 'opacity-100' : 'opacity-30 hover:opacity-60'
                }`}
              >
                <span
                  className="text-[10px] tracking-wider"
                  style={{
                    color: currentTrack === i ? '#C792EA' : undefined,
                    textShadow: currentTrack === i ? '0 0 10px rgba(199, 146, 234, 0.5)' : undefined
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                {currentTrack === i && (
                  <motion.div
                    layoutId="trackIndicator"
                    className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #C792EA 0%, #FFB6C1 100%)',
                      boxShadow: '0 0 8px rgba(199, 146, 234, 0.6)'
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
            className="group inline-block px-8 py-4 border border-[#1A1A1A]/20 text-xs tracking-[0.2em] uppercase transition-all duration-500 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(199, 146, 234, 0.05) 0%, rgba(255, 182, 193, 0.05) 100%)'
            }}
          >
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">Get Your Card</span>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(135deg, #C792EA 0%, #FFB6C1 100%)'
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
              activeTab === i ? 'opacity-100' : 'opacity-30 hover:opacity-60'
            }`}
            style={{
              color: activeTab === i ? '#C792EA' : undefined,
              textShadow: activeTab === i ? '0 0 15px rgba(199, 146, 234, 0.4)' : undefined
            }}
          >
            {tab}
            {activeTab === i && (
              <motion.div
                layoutId="tabIndicator"
                className="absolute -bottom-2 left-0 right-0 h-px"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, #C792EA 50%, transparent 100%)'
                }}
              />
            )}
          </button>
        ))}
      </motion.div>
    </div>
  );
}
