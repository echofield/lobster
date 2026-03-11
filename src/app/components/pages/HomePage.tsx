import { Link } from 'react-router';
import { motion } from 'motion/react';
import { PageWrapper } from '../layout';
import { memberCards } from '@/data/cards';

export function HomePage() {
  const featuredCard = memberCards[0]; // Founding Member

  return (
    <PageWrapper fullHeight centered className="relative overflow-hidden">
      {/* Aura Circle - Background Element */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0, 0, 0.2, 1] }}
          className="relative"
        >
          {/* Outer Ring */}
          <div
            className="w-[600px] h-[600px] rounded-full border border-border"
            style={{ opacity: 0.4 }}
          />
          {/* Inner Glow */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(163, 135, 103, 0.08) 0%, transparent 70%)'
            }}
          />
          {/* Center Point */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-ink" style={{ opacity: 0.6 }} />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-xl mx-auto text-center space-y-12">
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0, 0, 0.2, 1] }}
          className="space-y-4"
        >
          <span className="small-caps">A Private Sonic Archive</span>
          <h1 className="text-4xl md:text-5xl font-serif">
            Sound is access
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            The Lobster Member Card opens a curated universe of sound.
            Tap to enter. Download what resonates.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0, 0, 0.2, 1] }}
          className="flex flex-col items-center gap-4"
        >
          <Link
            to="/card"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wide hover:opacity-90 transition-opacity duration-300"
          >
            Discover the Card
          </Link>
          <span className="narrator">
            {featuredCard.remaining} of {featuredCard.totalSupply} remaining
          </span>
        </motion.div>
      </div>

      {/* Bottom Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-12 left-0 right-0 flex justify-center gap-8"
      >
        {['Archive', 'Membership', 'Studio'].map((tab, i) => (
          <button
            key={tab}
            className="small-caps hover:opacity-100 transition-opacity duration-300"
            style={{ opacity: i === 1 ? 1 : 0.4 }}
          >
            {tab}
          </button>
        ))}
      </motion.div>
    </PageWrapper>
  );
}
