import { useParams, useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { getDropById } from '@/data/cards';
import { ArrowLeft, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AudioPlayer, MiniPlayer } from '../ui/AudioPlayer';

export function DropPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const drop = getDropById(id || '');
  const [playingId, setPlayingId] = useState<string | null>(null);
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

  if (!drop) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#FAF8F2] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-serif">Signal not found</h1>
          <button
            onClick={() => navigate('/access')}
            className="text-xs tracking-[0.15em] uppercase opacity-60 hover:opacity-100"
          >
            Return to Archive
          </button>
        </div>
      </div>
    );
  }

  const currentTrack = drop.samples?.find(s => s.id === playingId);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAF8F2] relative overflow-hidden">
      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-xs tracking-[0.15em] uppercase opacity-60 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          Return
        </button>
        <div className="flex items-center gap-4">
          <span className="text-xs tracking-[0.15em] uppercase opacity-40">MERIDIEN</span>
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-60">FR</span>
            <span className="opacity-30">/</span>
            <span className="text-xs opacity-40">EN</span>
          </div>
        </div>
      </motion.nav>

      {/* Left Side - Mode Indicator */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="fixed left-8 top-24 z-40"
      >
        <div className="flex flex-col gap-4">
          {/* Icon */}
          <div className="w-14 h-14 border border-[#A38767]/40 flex items-center justify-center">
            <div className="w-6 h-6 border border-[#A38767] rotate-45" />
          </div>
          {/* Mode */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#A38767]" />
            <span className="text-xs text-[#A38767]">Quiet</span>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column - Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="lg:col-span-4 space-y-8"
          >
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#A38767]">
                {drop.exclusive ? 'EXCLUSIVE DROP' : 'ARCHIVE'}
              </span>
              <h1 className="mt-3 text-3xl md:text-4xl font-serif">{drop.title}</h1>
              <p className="mt-2 text-sm text-[#FAF8F2]/40">{drop.artist}</p>
            </div>

            <p className="text-sm text-[#FAF8F2]/60 leading-relaxed">
              {drop.description}
            </p>

            {/* Specs */}
            <div className="space-y-4 pt-6 border-t border-[#FAF8F2]/10">
              <div className="flex justify-between">
                <span className="text-[10px] tracking-[0.15em] uppercase text-[#FAF8F2]/40">TRACKS</span>
                <span className="text-sm">{drop.trackCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] tracking-[0.15em] uppercase text-[#FAF8F2]/40">DURATION</span>
                <span className="text-sm">{drop.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] tracking-[0.15em] uppercase text-[#FAF8F2]/40">RELEASE</span>
                <span className="text-sm">{drop.releaseDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] tracking-[0.15em] uppercase text-[#FAF8F2]/40">TYPE</span>
                <span className="text-sm uppercase">{drop.type}</span>
              </div>
            </div>

            {/* Download Button */}
            <button className="w-full py-4 border border-[#FAF8F2]/30 text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:bg-[#FAF8F2] hover:text-[#0A0A0A] transition-all duration-300">
              <Download className="w-4 h-4" />
              Download All
            </button>
          </motion.div>

          {/* Right Column - Instrument Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="lg:col-span-8"
          >
            {/* Waveform Instrument Panel */}
            <div className="relative border border-[#FAF8F2]/10 bg-[#0A0A0A]">
              {/* Vertical Labels - Right Side */}
              <div className="absolute -right-16 top-0 bottom-0 flex flex-col justify-between py-4 text-[10px] tracking-[0.1em] text-[#FAF8F2]/30">
                <span className="rotate-90 origin-left translate-x-4">DISPERSION</span>
                <span className="rotate-90 origin-left translate-x-4">RESONANCE</span>
                <span className="rotate-90 origin-left translate-x-4">HARMONICS</span>
              </div>

              {/* Main Visualization Area */}
              <div className="p-8">
                {/* Current Playing Info */}
                {currentTrack && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6 text-center"
                  >
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#FAF8F2]/40">
                      NOW PLAYING
                    </span>
                    <h3 className="mt-2 font-serif text-xl">{currentTrack.name}</h3>
                    <p className="text-xs text-[#FAF8F2]/30 mt-1">
                      {currentTrack.bpm && `${currentTrack.bpm} BPM`}
                      {currentTrack.key && ` · ${currentTrack.key}`}
                    </p>
                  </motion.div>
                )}

                {/* Waveform Display */}
                <div className="relative h-64 border border-[#FAF8F2]/10">
                  {/* Grid */}
                  <div className="absolute inset-0">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={`h-${i}`}
                        className="absolute left-0 right-0 h-px bg-[#FAF8F2]/5"
                        style={{ top: `${(i + 1) * 12.5}%` }}
                      />
                    ))}
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={`v-${i}`}
                        className="absolute top-0 bottom-0 w-px bg-[#FAF8F2]/5"
                        style={{ left: `${(i + 1) * 8.33}%` }}
                      />
                    ))}
                  </div>

                  {/* Oscillation Wave */}
                  <svg
                    viewBox="0 0 400 200"
                    className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="none"
                  >
                    <motion.path
                      d="M 0 100 Q 50 40, 100 100 T 200 100 T 300 100 T 400 100"
                      fill="none"
                      stroke="#A38767"
                      strokeWidth="1"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{
                        pathLength: 1,
                        opacity: playingId ? 0.8 : 0.3,
                        d: playingId
                          ? [
                              "M 0 100 Q 50 40, 100 100 T 200 100 T 300 100 T 400 100",
                              "M 0 100 Q 50 160, 100 100 T 200 100 T 300 100 T 400 100",
                              "M 0 100 Q 50 40, 100 100 T 200 100 T 300 100 T 400 100"
                            ]
                          : "M 0 100 Q 50 70, 100 100 T 200 100 T 300 100 T 400 100"
                      }}
                      transition={{
                        pathLength: { duration: 1 },
                        d: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                    />
                    <motion.path
                      d="M 0 100 Q 50 130, 100 100 T 200 100 T 300 100 T 400 100"
                      fill="none"
                      stroke="#FAF8F2"
                      strokeWidth="0.5"
                      strokeOpacity="0.2"
                      animate={{
                        d: playingId
                          ? [
                              "M 0 100 Q 50 130, 100 100 T 200 100 T 300 100 T 400 100",
                              "M 0 100 Q 50 70, 100 100 T 200 100 T 300 100 T 400 100",
                              "M 0 100 Q 50 130, 100 100 T 200 100 T 300 100 T 400 100"
                            ]
                          : "M 0 100 Q 50 110, 100 100 T 200 100 T 300 100 T 400 100"
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    />
                  </svg>

                  {/* Center Label */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="px-4 py-2 border border-[#FAF8F2]/20 bg-[#0A0A0A]">
                      <span className="text-xs tracking-[0.15em] uppercase">
                        {playingId ? 'ACTIVE' : 'IDLE'}
                      </span>
                    </div>
                    <p className="mt-2 text-[10px] text-[#FAF8F2]/40">
                      {playingId ? 'SIGNAL DETECTED' : 'SELECT A TRACK'}
                    </p>
                  </div>
                </div>

                {/* Timeline Scrubber */}
                <div className="mt-6 relative">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: playingId ? [1, 1.3, 1] : 1 }}
                      transition={{ duration: 0.5, repeat: playingId ? Infinity : 0 }}
                      className={`w-2 h-2 rounded-full ${playingId ? 'bg-[#A38767]' : 'bg-[#FAF8F2]/20'}`}
                    />
                    <div className="flex-1 h-px bg-[#FAF8F2]/10 relative">
                      <div className="absolute inset-y-0 left-0 bg-[#A38767]/60" style={{ width: playingId ? '45%' : '0%' }} />
                      {/* Ticks */}
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className={`absolute top-1/2 -translate-y-1/2 w-px ${
                            i % 5 === 0 ? 'h-2 bg-[#FAF8F2]/20' : 'h-1 bg-[#FAF8F2]/10'
                          }`}
                          style={{ left: `${(i + 1) * 5}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-[#FAF8F2]/30">
                    <span>0</span>
                    <span>1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Track List */}
            <div className="mt-8 border border-[#FAF8F2]/10">
              <div className="px-4 py-3 border-b border-[#FAF8F2]/10">
                <span className="text-[10px] tracking-[0.15em] uppercase text-[#FAF8F2]/40">
                  TRACKS · {drop.samples?.length || 0}
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {drop.samples?.map((sample, i) => (
                  <MiniPlayer
                    key={sample.id}
                    index={i}
                    title={sample.name}
                    duration={sample.duration}
                    isPlaying={playingId === sample.id}
                    onToggle={() => setPlayingId(playingId === sample.id ? null : sample.id)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Right Diamond */}
      <div className="fixed bottom-8 right-8">
        <div className="w-3 h-3 border border-[#FAF8F2]/20 rotate-45" />
      </div>
    </div>
  );
}
