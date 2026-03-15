// InstrumentPage - Circular Boutique Sampler
// A premium sound object, not a DAW

import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { CircularInstrument } from '@/app/components/instrument';
import { sedimentFlowPack } from '@/app/data/instrument/sediment-flow';

export function InstrumentPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#1A1A1A] relative overflow-x-hidden">
      {/* Ambient background - very subtle */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Ghost grid - ARCHÉ style concentric circles */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.03]"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="0.5" fill="#8B5CF6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridPattern)" />
      </svg>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 md:py-6 flex justify-between items-center"
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-[10px] md:text-xs tracking-[0.15em] uppercase opacity-50 hover:opacity-100 transition-opacity duration-300"
        >
          <ArrowLeft className="w-3 md:w-4 h-3 md:h-4" />
          <span className="hidden sm:inline">Return</span>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-2.5 md:w-3 h-2.5 md:h-3 border border-[#1A1A1A]/20 rotate-45" />
          <span className="text-[8px] md:text-[10px] tracking-[0.2em] uppercase opacity-40">
            Instrument
          </span>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-2 sm:px-4 py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Instrument title - above the circle (hidden on mobile) */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hidden md:block text-center mb-8"
          >
            <span className="text-[9px] tracking-[0.3em] uppercase text-[#1A1A1A]/30">
              Sound Laboratory
            </span>
          </motion.div>

          {/* The Circular Instrument */}
          <CircularInstrument pack={sedimentFlowPack} showFieldMonitor={false} />

          {/* Subtle footer text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center mt-4 md:mt-8 px-4"
          >
            <p className="text-[8px] md:text-[9px] tracking-[0.1em] md:tracking-[0.15em] uppercase text-[#1A1A1A]/20">
              Click nodes to load samples
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Corner ornaments - hidden on mobile */}
      <div className="hidden md:block fixed top-8 left-8 w-8 h-8 pointer-events-none">
        <svg width="32" height="32" viewBox="0 0 32 32" className="opacity-[0.08]">
          <path d="M0 0 L16 0 L16 2 L2 2 L2 16 L0 16 Z" fill="#1A1A1A" />
        </svg>
      </div>
      <div className="hidden md:block fixed top-8 right-8 w-8 h-8 pointer-events-none">
        <svg width="32" height="32" viewBox="0 0 32 32" className="opacity-[0.08]">
          <path d="M32 0 L16 0 L16 2 L30 2 L30 16 L32 16 Z" fill="#1A1A1A" />
        </svg>
      </div>
      <div className="hidden md:block fixed bottom-8 left-8 w-8 h-8 pointer-events-none">
        <svg width="32" height="32" viewBox="0 0 32 32" className="opacity-[0.08]">
          <path d="M0 32 L16 32 L16 30 L2 30 L2 16 L0 16 Z" fill="#1A1A1A" />
        </svg>
      </div>
      <div className="hidden md:block fixed bottom-8 right-8 w-8 h-8 pointer-events-none">
        <svg width="32" height="32" viewBox="0 0 32 32" className="opacity-[0.08]">
          <path d="M32 32 L16 32 L16 30 L30 30 L30 16 L32 16 Z" fill="#1A1A1A" />
        </svg>
      </div>

      {/* Central diamond marker - hidden on mobile */}
      <div className="hidden md:block fixed bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="w-2 h-2 border border-[#1A1A1A]/15 rotate-45" />
      </div>
    </div>
  );
}
