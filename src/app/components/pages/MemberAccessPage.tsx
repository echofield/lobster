import { Link, useParams } from 'react-router';
import { motion } from 'motion/react';
import { PageWrapper } from '../layout';
import { drops, memberCards } from '@/data/cards';
import { Lock, Unlock } from 'lucide-react';

export function MemberAccessPage() {
  const { token } = useParams();
  const card = memberCards[0]; // In real app, would validate token

  return (
    <PageWrapper fullHeight className="relative">
      {/* Welcome State Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Radial Unlock Effect */}
        <motion.div
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-lobster-gold/20"
        />
      </motion.div>

      <div className="max-w-4xl mx-auto pt-8">
        {/* Access Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center space-y-6 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-lobster-gold/30 rounded-full">
            <Unlock className="w-4 h-4 text-lobster-gold" />
            <span className="small-caps text-lobster-gold" style={{ opacity: 1 }}>
              Card Recognized
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-serif">
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              {card.name} <span className="mx-2 opacity-30">|</span> {card.edition}
            </p>
          </div>
        </motion.div>

        {/* Available Drops */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="space-y-8"
        >
          <div className="flex justify-between items-center">
            <span className="small-caps">Your Archive</span>
            <span className="text-sm text-muted-foreground">
              {drops.length} drops available
            </span>
          </div>

          <div className="space-y-4">
            {drops.map((drop, i) => (
              <motion.div
                key={drop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.6 }}
              >
                <Link
                  to={`/drop/${drop.id}`}
                  className="group block border border-border hover:border-lobster-gold/40 transition-all duration-500"
                >
                  <div className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                    {/* Cover Placeholder */}
                    <div className="w-20 h-20 bg-paper-warm border border-border flex items-center justify-center shrink-0">
                      <div className="w-8 h-8 rounded-full border border-border opacity-40" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-serif text-xl group-hover:text-lobster-gold transition-colors duration-300">
                            {drop.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {drop.artist}
                          </p>
                        </div>
                        {drop.exclusive && (
                          <span className="text-[10px] text-lobster-gold tracking-wider uppercase whitespace-nowrap">
                            Exclusive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {drop.description}
                      </p>
                    </div>

                    {/* Meta */}
                    <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-1 shrink-0">
                      <span className="text-sm text-muted-foreground">
                        {drop.trackCount} tracks
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {drop.duration}
                      </span>
                    </div>

                    {/* Action */}
                    <div className="shrink-0">
                      <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-lobster-gold group-hover:bg-lobster-gold/10 transition-all duration-300">
                        <svg
                          className="w-4 h-4 text-muted-foreground group-hover:text-lobster-gold transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
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
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-16 pt-12 border-t border-border"
        >
          <div className="text-center space-y-4">
            <span className="small-caps">Coming Soon</span>
            <h2 className="text-xl font-serif">Next drop: April 2024</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Your card will unlock new content as it becomes available.
              No action needed.
            </p>
          </div>
        </motion.section>

        {/* Card Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16 p-6 border border-border bg-paper-warm"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <span className="small-caps">Card Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-lobster-green" />
                <span className="text-sm">Active</span>
              </div>
            </div>
            <div className="text-right space-y-1">
              <span className="small-caps">Member Since</span>
              <p className="text-sm text-muted-foreground">March 2024</p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
