import { Link } from 'react-router';
import { motion } from 'motion/react';
import { memberCards } from '@/data/cards';
import { Check } from 'lucide-react';

export function ThankYouPage() {
  const card = memberCards[0];
  const orderNumber = `LST-2024-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAF8F2] relative overflow-hidden flex flex-col items-center justify-center px-8">
      {/* Background Circle */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute w-[60vmin] h-[60vmin] rounded-full border border-[#A38767]/20"
      />

      {/* Ripple Effect */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0.8 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute w-32 h-32 rounded-full border border-[#A38767]"
      />

      {/* Content */}
      <div className="relative z-10 max-w-md mx-auto text-center space-y-10">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 border border-[#A38767] mx-auto"
        >
          <Check className="w-8 h-8 text-[#A38767]" />
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="space-y-4"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#FAF8F2]/40">
            Order Confirmed
          </span>
          <h1 className="text-3xl md:text-4xl font-serif">
            Your card is on its way
          </h1>
          <p className="text-[#FAF8F2]/50 max-w-sm mx-auto">
            Thank you for joining Lobster. Your {card.name} will ship within 3-5 business days.
          </p>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="p-8 border border-[#FAF8F2]/10 text-left space-y-6"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-serif text-lg">{card.name}</h3>
              <p className="text-xs text-[#FAF8F2]/30 mt-1">{card.edition}</p>
            </div>
            <span className="font-serif text-lg">{card.price} {card.currency}</span>
          </div>
          <div className="pt-4 border-t border-[#FAF8F2]/10">
            <span className="text-[10px] tracking-[0.15em] uppercase text-[#FAF8F2]/30">
              Order Number
            </span>
            <p className="text-sm mt-1 font-mono">{orderNumber}</p>
          </div>
        </motion.div>

        {/* What's Next */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="space-y-6 text-left"
        >
          <span className="text-[10px] tracking-[0.15em] uppercase text-[#FAF8F2]/40 block text-center">
            What Happens Next
          </span>
          <div className="space-y-4">
            {[
              { step: '01', text: 'Your card will be crafted and shipped', sub: 'Expect tracking info within 24 hours' },
              { step: '02', text: 'Upon arrival, tap your card on any NFC device', sub: 'iPhone, Android, or NFC reader' },
              { step: '03', text: 'Access your member archive instantly', sub: 'All current drops + future releases' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.15 }}
                className="flex gap-4"
              >
                <span className="text-[10px] text-[#A38767] w-6">{item.step}</span>
                <div>
                  <p className="text-sm">{item.text}</p>
                  <p className="text-xs text-[#FAF8F2]/30 mt-1">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="space-y-4 pt-6"
        >
          <Link
            to="/"
            className="inline-block px-10 py-4 border border-[#FAF8F2]/30 text-xs tracking-[0.2em] uppercase hover:bg-[#FAF8F2] hover:text-[#0A0A0A] transition-all duration-300"
          >
            Return Home
          </Link>
          <p className="text-xs text-[#FAF8F2]/30 italic">
            A confirmation email has been sent
          </p>
        </motion.div>
      </div>

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="fixed top-0 left-0 right-0 px-8 py-6 flex justify-between items-center"
      >
        <Link to="/" className="flex items-center gap-2">
          <div className="w-4 h-4 border border-[#FAF8F2]/30 rotate-45" />
          <span className="text-xs tracking-[0.2em] uppercase opacity-60">Lobster</span>
        </Link>
      </motion.nav>

      {/* Bottom Diamond */}
      <div className="fixed bottom-8 right-8">
        <div className="w-3 h-3 border border-[#FAF8F2]/20 rotate-45" />
      </div>
    </div>
  );
}
