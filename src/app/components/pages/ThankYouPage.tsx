import { Link } from 'react-router';
import { motion } from 'motion/react';
import { PageWrapper } from '../layout';
import { memberCards } from '@/data/cards';
import { Check } from 'lucide-react';

export function ThankYouPage() {
  const card = memberCards[0];

  return (
    <PageWrapper fullHeight centered className="relative overflow-hidden">
      {/* Background Circle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0, 0, 0.2, 1] }}
          className="w-[500px] h-[500px] rounded-full border border-lobster-gold/20"
        />
      </div>

      <div className="relative z-10 max-w-lg mx-auto text-center space-y-10">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-lobster-green bg-lobster-green/10"
        >
          <Check className="w-8 h-8 text-lobster-green" />
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="space-y-4"
        >
          <span className="small-caps">Order Confirmed</span>
          <h1 className="text-3xl md:text-4xl font-serif">
            Your card is on its way
          </h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Thank you for joining Lobster. Your {card.name} will ship within 3-5 business days.
          </p>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="p-6 border border-border bg-paper-warm space-y-4 text-left"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-serif text-lg">{card.name}</h3>
              <p className="text-sm text-muted-foreground">{card.edition}</p>
            </div>
            <span className="font-serif text-lg">{card.price} {card.currency}</span>
          </div>
          <div className="pt-4 border-t border-border">
            <span className="small-caps">Order Number</span>
            <p className="text-sm mt-1">LST-2024-{Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
          </div>
        </motion.div>

        {/* What Happens Next */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="space-y-6"
        >
          <span className="small-caps">What Happens Next</span>
          <div className="space-y-4 text-left">
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-xs text-muted-foreground shrink-0">1</div>
              <div>
                <p className="text-sm">Your card will be crafted and shipped</p>
                <p className="text-xs text-muted-foreground mt-1">Expect tracking info within 24 hours</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-xs text-muted-foreground shrink-0">2</div>
              <div>
                <p className="text-sm">Upon arrival, tap your card on any NFC-enabled device</p>
                <p className="text-xs text-muted-foreground mt-1">iPhone, Android, or NFC reader</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-xs text-muted-foreground shrink-0">3</div>
              <div>
                <p className="text-sm">Access your member archive instantly</p>
                <p className="text-xs text-muted-foreground mt-1">All current drops + future releases</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="space-y-4"
        >
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wide hover:opacity-90 transition-opacity"
          >
            Return Home
          </Link>
          <p className="narrator">
            A confirmation email has been sent
          </p>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
