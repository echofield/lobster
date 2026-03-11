import { Link } from 'react-router';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { memberCards } from '@/data/cards';

export function HomePage() {
  const featuredCard = memberCards[0];
  const [activeTab, setActiveTab] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

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

  const tabs = ['ARCHIVE', 'SIGNAL', 'MEMBERSHIP', 'RESONANCE', 'ACCESS', 'VOID'];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAF8F2] relative overflow-hidden flex flex-col">
      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center"
      >
        <Link to="/" className="flex items-center gap-2">
          <div className="w-5 h-5 border border-[#FAF8F2]/30 rotate-45" />
          <span className="text-xs tracking-[0.2em] uppercase opacity-60">Lobster</span>
        </Link>
        <div className="flex items-center gap-6">
          <span className="text-xs tracking-[0.15em] uppercase opacity-40">FR</span>
          <span className="text-xs tracking-[0.15em] uppercase opacity-40">/</span>
          <span className="text-xs tracking-[0.15em] uppercase opacity-60">EN</span>
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
            className="w-[70vmin] h-[70vmin] rounded-full border border-[#FAF8F2]/20 relative"
            style={{
              transform: `translate(${(mousePos.x - 0.5) * 10}px, ${(mousePos.y - 0.5) * 10}px)`
            }}
          >
            {/* Inner Gradient */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle at ${50 + (mousePos.x - 0.5) * 20}% ${50 + (mousePos.y - 0.5) * 20}%, rgba(163, 135, 103, 0.15) 0%, transparent 50%)`
              }}
            />

            {/* Grid Lines */}
            <div className="absolute inset-0 rounded-full overflow-hidden opacity-10">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-[#FAF8F2]" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#FAF8F2]" />
            </div>

            {/* Center Point */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#A38767]"
            />

            {/* Poetic Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-[30%] left-1/2 -translate-x-1/2 text-center"
            >
              <p className="font-serif italic text-lg opacity-60 tracking-wide">
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
            style={{
              transform: `translateY(${-50 + (mousePos.y - 0.5) * 20}%)`
            }}
          >
            <svg width="60" height="70" viewBox="0 0 60 70" fill="none" className="opacity-30">
              <path d="M30 0L60 17.5V52.5L30 70L0 52.5V17.5L30 0Z" stroke="#FAF8F2" strokeWidth="0.5" />
              <path d="M30 35L60 17.5" stroke="#FAF8F2" strokeWidth="0.5" />
              <path d="M30 35L0 17.5" stroke="#FAF8F2" strokeWidth="0.5" />
              <path d="M30 35V70" stroke="#FAF8F2" strokeWidth="0.5" />
            </svg>
          </motion.div>
        </div>

        {/* CTA - Overlaid on circle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
        >
          <Link
            to="/card"
            className="group relative inline-block"
          >
            <span className="relative z-10 px-8 py-4 block border border-[#FAF8F2]/40 text-xs tracking-[0.2em] uppercase hover:bg-[#FAF8F2] hover:text-[#0A0A0A] transition-all duration-500">
              Enter
            </span>
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
          <div className="w-3 h-3 border border-[#FAF8F2]/30 rotate-45" />
        </motion.div>
      </div>

      {/* Bottom Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="pb-12 flex justify-center gap-8"
      >
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`text-[10px] tracking-[0.15em] uppercase transition-opacity duration-300 ${
              activeTab === i ? 'opacity-100' : 'opacity-30 hover:opacity-60'
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>
    </div>
  );
}
