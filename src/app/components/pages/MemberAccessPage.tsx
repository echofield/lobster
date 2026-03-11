import { Link, useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { drops, memberCards } from '@/data/cards';
import { Unlock } from 'lucide-react';
import { useState, useEffect } from 'react';

export function MemberAccessPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const card = memberCards[0];
  const [initialized, setInitialized] = useState(false);
  const [hoveredDrop, setHoveredDrop] = useState<string | null>(null);

  useEffect(() => {
    // Simulate NFC recognition delay
    const timer = setTimeout(() => setInitialized(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAF8F2] relative overflow-hidden">
      {/* Initialization Overlay */}
      {!initialized && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="fixed inset-0 z-50 bg-[#0A0A0A] flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border border-[#A38767]/40 mx-auto mb-6"
              style={{ borderRadius: '50%', borderTopColor: '#A38767' }}
            />
            <motion.p
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-xs tracking-[0.2em] uppercase text-[#FAF8F2]/40"
            >
              Reading Card...
            </motion.p>
          </div>
        </motion.div>
      )}

      {/* Unlock Ripple Effect */}
      <motion.div
        initial={{ scale: 0, opacity: 0.6 }}
        animate={{ scale: 4, opacity: 0 }}
        transition={{ delay: 1.2, duration: 1.5, ease: 'easeOut' }}
        className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-[#A38767]"
      />

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: initialized ? 1 : 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-40 px-8 py-6 flex justify-between items-center"
      >
        <Link to="/" className="flex items-center gap-2">
          <div className="w-4 h-4 border border-[#FAF8F2]/30 rotate-45" />
          <span className="text-xs tracking-[0.2em] uppercase opacity-60">Lobster</span>
        </Link>
        <span className="text-xs tracking-[0.15em] uppercase text-[#A38767]">
          Member Access
        </span>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-8 md:px-16 max-w-5xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: initialized ? 1 : 0, y: initialized ? 0 : 30 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center mb-20"
        >
          {/* Status Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: initialized ? 1 : 0 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-3 px-6 py-3 border border-[#A38767]/40 mb-8"
          >
            <Unlock className="w-4 h-4 text-[#A38767]" />
            <span className="text-xs tracking-[0.15em] uppercase text-[#A38767]">
              Card Recognized
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-serif mb-4">Welcome back</h1>
          <p className="text-[#FAF8F2]/40">
            {card.name} <span className="mx-3 opacity-30">·</span> {card.edition}
          </p>
        </motion.div>

        {/* Archive Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: initialized ? 1 : 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="flex justify-between items-center mb-8">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#FAF8F2]/40">
              Your Archive
            </span>
            <span className="text-xs text-[#FAF8F2]/30">
              {drops.length} drops available
            </span>
          </div>

          {/* Drops List */}
          <div className="space-y-4">
            {drops.map((drop, i) => (
              <motion.div
                key={drop.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: initialized ? 1 : 0, x: initialized ? 0 : -30 }}
                transition={{ delay: 1.2 + i * 0.15, duration: 0.6 }}
              >
                <Link
                  to={`/drop/${drop.id}`}
                  onMouseEnter={() => setHoveredDrop(drop.id)}
                  onMouseLeave={() => setHoveredDrop(null)}
                  className={`group block border border-[#FAF8F2]/10 transition-all duration-500 ${
                    hoveredDrop === drop.id ? 'border-[#A38767]/40 bg-[#A38767]/5' : ''
                  }`}
                >
                  <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
                    {/* Visual */}
                    <div className="w-20 h-20 border border-[#FAF8F2]/10 flex items-center justify-center shrink-0 relative overflow-hidden">
                      {/* Waveform preview */}
                      <svg viewBox="0 0 60 40" className="w-full h-full opacity-30">
                        <path
                          d="M 0 20 Q 15 5, 30 20 T 60 20"
                          fill="none"
                          stroke={hoveredDrop === drop.id ? '#A38767' : '#FAF8F2'}
                          strokeWidth="1"
                        />
                      </svg>
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className={`font-serif text-xl transition-colors duration-300 ${
                          hoveredDrop === drop.id ? 'text-[#A38767]' : ''
                        }`}>
                          {drop.title}
                        </h3>
                        {drop.exclusive && (
                          <span className="text-[10px] tracking-[0.1em] uppercase text-[#A38767]">
                            Exclusive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#FAF8F2]/40">{drop.artist}</p>
                      <p className="text-xs text-[#FAF8F2]/30 line-clamp-1 md:line-clamp-none">
                        {drop.description}
                      </p>
                    </div>

                    {/* Meta */}
                    <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-1 shrink-0">
                      <span className="text-xs text-[#FAF8F2]/30">{drop.trackCount} tracks</span>
                      <span className="text-xs text-[#FAF8F2]/30">{drop.duration}</span>
                    </div>

                    {/* Arrow */}
                    <div className="hidden md:flex w-10 h-10 border border-[#FAF8F2]/10 items-center justify-center shrink-0 group-hover:border-[#A38767]/40 transition-colors">
                      <svg
                        className={`w-4 h-4 transition-colors ${
                          hoveredDrop === drop.id ? 'text-[#A38767]' : 'text-[#FAF8F2]/30'
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Upcoming */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: initialized ? 1 : 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="mt-20 pt-12 border-t border-[#FAF8F2]/10"
        >
          <div className="text-center">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#FAF8F2]/30">
              Coming Soon
            </span>
            <h2 className="mt-3 text-xl font-serif">Next drop: April 2024</h2>
            <p className="mt-2 text-xs text-[#FAF8F2]/30 max-w-md mx-auto">
              Your card will unlock new content as it becomes available. No action needed.
            </p>
          </div>
        </motion.section>

        {/* Card Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: initialized ? 1 : 0 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          className="mt-16 p-6 border border-[#FAF8F2]/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-[10px] tracking-[0.15em] uppercase text-[#FAF8F2]/30">
                Card Status
              </span>
              <div className="flex items-center gap-2 mt-2">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-[#A38767]"
                />
                <span className="text-sm">Active</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] tracking-[0.15em] uppercase text-[#FAF8F2]/30">
                Member Since
              </span>
              <p className="text-sm mt-2">March 2024</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Diamond */}
      <div className="fixed bottom-8 right-8">
        <div className="w-3 h-3 border border-[#FAF8F2]/20 rotate-45" />
      </div>
    </div>
  );
}
