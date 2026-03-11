import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { PageWrapper } from '../layout';
import { memberCards, drops } from '@/data/cards';
import { ArrowLeft } from 'lucide-react';

export function CardPage() {
  const navigate = useNavigate();
  const card = memberCards[0]; // Founding Member

  return (
    <PageWrapper className="max-w-6xl mx-auto">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 small-caps hover:opacity-100 opacity-60 transition-opacity mb-12"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left: Card Visualization (Instrument-inspired) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="relative"
        >
          {/* Diagrammatic Frame */}
          <div className="relative aspect-[3/4] border border-border p-8 bg-paper-warm">
            {/* Grid Lines */}
            <div className="absolute inset-8 border border-border opacity-30" />
            <div className="absolute top-1/2 left-8 right-8 h-px bg-border opacity-30" />
            <div className="absolute left-1/2 top-8 bottom-8 w-px bg-border opacity-30" />

            {/* Card Representation */}
            <div className="absolute inset-16 bg-primary flex flex-col justify-between p-6">
              <div>
                <span className="text-primary-foreground text-xs tracking-widest uppercase opacity-60">
                  Lobster
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-primary-foreground font-serif text-xl">
                  {card.name}
                </div>
                <div className="text-primary-foreground text-xs opacity-60">
                  {card.edition}
                </div>
              </div>
            </div>

            {/* Measurement Labels - Vertical (Right) */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground tracking-widest uppercase rotate-90 whitespace-nowrap">
                NFC Enabled
              </span>
            </div>

            {/* Bottom Scale */}
            <div className="absolute bottom-4 left-8 right-8 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-lobster-gold" />
                <span className="text-[10px] text-muted-foreground">Active</span>
              </div>
              <div className="flex gap-1">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="w-px h-2 bg-border"
                    style={{ opacity: i < 7 ? 1 : 0.3 }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Edition Counter */}
          <div className="mt-6 flex justify-between items-center px-2">
            <span className="small-caps">Limited Edition</span>
            <span className="font-serif text-lg">
              {card.remaining}/{card.totalSupply}
            </span>
          </div>
        </motion.div>

        {/* Right: Card Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="space-y-10"
        >
          {/* Header */}
          <div className="space-y-4">
            <span className="small-caps">{card.edition}</span>
            <h1 className="text-3xl md:text-4xl font-serif">{card.name}</h1>
            <p className="text-muted-foreground leading-relaxed">
              {card.description}
            </p>
          </div>

          {/* Price */}
          <div className="py-6 border-y border-border">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl">{card.price}</span>
              <span className="text-muted-foreground">{card.currency}</span>
            </div>
            <span className="text-sm text-muted-foreground">One-time purchase. Lifetime access.</span>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <span className="small-caps">What You Receive</span>
            <ul className="space-y-3">
              {card.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-lobster-gold mt-2" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Unlocks */}
          <div className="space-y-4">
            <span className="small-caps">Card Unlocks</span>
            <ul className="space-y-3">
              {card.unlocks.map((unlock, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-lobster-green mt-2" />
                  <span className="text-foreground">{unlock}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="pt-6 space-y-4">
            <button className="w-full py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wide hover:opacity-90 transition-opacity">
              Purchase Card
            </button>
            <p className="text-center narrator">
              Ships worldwide. NFC-ready on arrival.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Preview Drops Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-24 pt-16 border-t border-border"
      >
        <div className="text-center space-y-4 mb-12">
          <span className="small-caps">Currently Available</span>
          <h2 className="text-2xl font-serif">Member Drops</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Preview what awaits inside the archive. These drops unlock immediately upon card activation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {drops.map((drop, i) => (
            <motion.div
              key={drop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.6 }}
              className="group border border-border p-6 hover:border-lobster-gold/30 transition-colors duration-500"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="small-caps">{drop.type}</span>
                  {drop.exclusive && (
                    <span className="text-[10px] text-lobster-gold tracking-wider uppercase">
                      Exclusive
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-xl">{drop.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {drop.description}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground">
                    {drop.trackCount} tracks
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {drop.duration}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </PageWrapper>
  );
}
