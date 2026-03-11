import { useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { memberCards, drops } from '@/data/cards';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export function CardPage() {
  const navigate = useNavigate();
  const card = memberCards[0];
  const [hoveredDrop, setHoveredDrop] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#1A1A1A] relative overflow-hidden">
      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center"
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 text-xs tracking-[0.15em] uppercase opacity-60 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          Return
        </button>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-4 h-4 border border-[#1A1A1A]/30 rotate-45" />
          <span className="text-xs tracking-[0.2em] uppercase opacity-60">Lobster Sound</span>
        </Link>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-8 md:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left: Card Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="relative"
          >
            {/* Diagrammatic Frame */}
            <div className="relative aspect-[3/4] border border-[#1A1A1A]/10 p-8">
              {/* Corner Markers */}
              <div className="absolute top-4 left-4 w-4 h-4 border-l border-t border-[#1A1A1A]/20" />
              <div className="absolute top-4 right-4 w-4 h-4 border-r border-t border-[#1A1A1A]/20" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-l border-b border-[#1A1A1A]/20" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-r border-b border-[#1A1A1A]/20" />

              {/* Grid Lines */}
              <div className="absolute inset-12 border border-[#1A1A1A]/5" />
              <div className="absolute top-1/2 left-12 right-12 h-px bg-[#1A1A1A]/5" />
              <div className="absolute left-1/2 top-12 bottom-12 w-px bg-[#1A1A1A]/5" />

              {/* The Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="absolute inset-16 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-[#A38767]/30 flex flex-col justify-between p-8"
              >
                {/* Top */}
                <div className="flex justify-between items-start">
                  <div className="w-8 h-8 border border-[#A38767]/60 rotate-45" />
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#A38767]/60">
                    NFC
                  </span>
                </div>

                {/* Center - Chip Representation */}
                <div className="flex justify-center">
                  <div className="w-12 h-10 border border-[#A38767]/40 flex items-center justify-center">
                    <div className="w-6 h-6 grid grid-cols-2 gap-0.5">
                      <div className="bg-[#A38767]/30" />
                      <div className="bg-[#A38767]/20" />
                      <div className="bg-[#A38767]/20" />
                      <div className="bg-[#A38767]/30" />
                    </div>
                  </div>
                </div>

                {/* Bottom */}
                <div>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#FAF8F2]/40">
                    Lobster
                  </span>
                  <div className="mt-2 font-serif text-xl text-[#FAF8F2]">{card.name}</div>
                  <div className="text-[10px] tracking-[0.15em] uppercase text-[#FAF8F2]/30 mt-1">
                    {card.edition}
                  </div>
                </div>
              </motion.div>

              {/* Measurement Labels */}
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-[10px] tracking-[0.1em] text-[#1A1A1A]/20 rotate-90 whitespace-nowrap">
                NFC-ENABLED · CR80
              </div>

              {/* Scale at bottom */}
              <div className="absolute bottom-2 left-12 right-12 flex items-center gap-1">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className={`flex-1 h-px ${i < 15 ? 'bg-[#A38767]/40' : 'bg-[#1A1A1A]/10'}`} />
                ))}
              </div>
            </div>

            {/* Edition Counter */}
            <div className="mt-8 flex justify-between items-center">
              <span className="text-[10px] tracking-[0.15em] uppercase text-[#1A1A1A]/40">
                LIMITED EDITION
              </span>
              <div className="font-serif text-2xl">
                {card.remaining}<span className="text-[#1A1A1A]/30">/{card.totalSupply}</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="space-y-10"
          >
            {/* Header */}
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#A38767]">
                {card.edition}
              </span>
              <h1 className="mt-3 text-4xl md:text-5xl font-serif">{card.name}</h1>
              <p className="mt-4 text-[#1A1A1A]/50 leading-relaxed">
                {card.description}
              </p>
            </div>

            {/* Price */}
            <div className="py-8 border-y border-[#1A1A1A]/10">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-4xl">{card.price}</span>
                <span className="text-[#1A1A1A]/40">{card.currency}</span>
              </div>
              <p className="mt-2 text-xs text-[#1A1A1A]/30">
                One-time purchase. Lifetime access.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <span className="text-[10px] tracking-[0.15em] uppercase text-[#1A1A1A]/40">
                What You Receive
              </span>
              <div className="space-y-4">
                {card.features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#A38767]" />
                    <span className="text-sm text-[#1A1A1A]/80">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Unlocks */}
            <div className="space-y-6">
              <span className="text-[10px] tracking-[0.15em] uppercase text-[#1A1A1A]/40">
                Card Unlocks
              </span>
              <div className="space-y-4">
                {card.unlocks.map((unlock, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-1.5 h-1.5 bg-[#1A1A1A]/40" />
                    <span className="text-sm text-[#1A1A1A]/60">{unlock}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="pt-6 space-y-4"
            >
              <Link
                to="/thank-you"
                className="block w-full py-5 bg-[#1A1A1A] text-[#FAF8F2] text-xs tracking-[0.2em] uppercase text-center hover:bg-[#A38767] transition-all duration-300"
              >
                Purchase Card
              </Link>
              <p className="text-center text-xs text-[#1A1A1A]/30 italic">
                Ships worldwide. NFC-ready on arrival.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Drops Preview */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-32 pt-16 border-t border-[#1A1A1A]/10"
        >
          <div className="text-center mb-16">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/40">
              Currently Available
            </span>
            <h2 className="mt-3 text-3xl font-serif">Member Drops</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {drops.map((drop, i) => (
              <motion.div
                key={drop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + i * 0.1 }}
                onMouseEnter={() => setHoveredDrop(drop.id)}
                onMouseLeave={() => setHoveredDrop(null)}
                className={`group relative border border-[#1A1A1A]/10 p-8 transition-all duration-500 ${
                  hoveredDrop === drop.id ? 'border-[#A38767]/40 bg-[#A38767]/5' : ''
                }`}
              >
                {/* Corner accent */}
                <div className={`absolute top-0 right-0 w-8 h-8 border-t border-r transition-colors duration-300 ${
                  hoveredDrop === drop.id ? 'border-[#A38767]/60' : 'border-[#1A1A1A]/10'
                }`} />

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] tracking-[0.15em] uppercase text-[#1A1A1A]/30">
                      {drop.type}
                    </span>
                    {drop.exclusive && (
                      <span className="text-[10px] tracking-[0.1em] uppercase text-[#A38767]">
                        Exclusive
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-xl">{drop.title}</h3>

                  <p className="text-xs text-[#1A1A1A]/40 line-clamp-2">
                    {drop.description}
                  </p>

                  <div className="pt-4 flex justify-between items-center border-t border-[#1A1A1A]/5">
                    <span className="text-xs text-[#1A1A1A]/30">{drop.trackCount} tracks</span>
                    <span className="text-xs text-[#1A1A1A]/30">{drop.duration}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Bottom Diamond */}
      <div className="fixed bottom-8 right-8">
        <div className="w-3 h-3 border border-[#1A1A1A]/20 rotate-45" />
      </div>
    </div>
  );
}
