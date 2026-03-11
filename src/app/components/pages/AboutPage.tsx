import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

export function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAF8F2] relative">
      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-xs tracking-[0.15em] uppercase opacity-60 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          Return
        </button>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-4 h-4 border border-[#FAF8F2]/30 rotate-45" />
          <span className="text-xs tracking-[0.2em] uppercase opacity-60">Lobster</span>
        </Link>
      </motion.nav>

      {/* Content */}
      <div className="pt-32 pb-20 px-8 md:px-16 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-16"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#FAF8F2]/40">About</span>
            <h1 className="text-4xl md:text-5xl font-serif">Lobster Studio</h1>
          </div>

          {/* Story */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-serif">A private sonic archive</h2>
              <p className="text-[#FAF8F2]/50 leading-relaxed">
                Lobster is not a marketplace. It is an archive.
                A carefully curated collection of sound, delivered through a single point of access: the Member Card.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-serif">The Card</h3>
              <p className="text-[#FAF8F2]/50 leading-relaxed">
                Each Lobster Member Card is NFC-enabled. One tap opens your personal archive.
                No apps. No passwords. Just touch and access.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-serif">The Archive</h3>
              <p className="text-[#FAF8F2]/50 leading-relaxed">
                Inside, you'll find sample packs, textures, and sonic experiments.
                All curated by Lobster Studio. All exclusive to members.
                New drops arrive regularly. Your card unlocks everything.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-serif">The Philosophy</h3>
              <p className="text-[#FAF8F2]/50 leading-relaxed">
                We believe in constraint. In quality over quantity.
                In physical objects that mean something.
                The card is not just access. It's membership.
                It's belonging to a community that values sound.
              </p>
            </motion.div>
          </div>

          {/* Principles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="py-12 border-y border-[#FAF8F2]/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Curated', desc: 'Every sound is selected. Nothing is filler.' },
                { title: 'Physical', desc: 'A real card. Real presence. Real access.' },
                { title: 'Evolving', desc: 'Your archive grows. New drops. Same card.' }
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <span className="text-[10px] tracking-[0.15em] uppercase text-[#A38767]">
                    {item.title}
                  </span>
                  <p className="text-sm text-[#FAF8F2]/40">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="text-center space-y-4"
          >
            <span className="text-[10px] tracking-[0.15em] uppercase text-[#FAF8F2]/40">Contact</span>
            <p className="text-[#FAF8F2]/50">
              Questions? Reach us at{' '}
              <a
                href="mailto:hello@lobster.studio"
                className="text-[#FAF8F2] hover:text-[#A38767] transition-colors underline underline-offset-4"
              >
                hello@lobster.studio
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Diamond */}
      <div className="fixed bottom-8 right-8">
        <div className="w-3 h-3 border border-[#FAF8F2]/20 rotate-45" />
      </div>
    </div>
  );
}
