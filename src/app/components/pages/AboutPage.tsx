import { motion } from 'motion/react';
import { PageWrapper } from '../layout';

export function AboutPage() {
  return (
    <PageWrapper className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-16"
      >
        {/* Header */}
        <div className="text-center space-y-6">
          <span className="small-caps">About</span>
          <h1 className="text-4xl font-serif">
            Lobster Studio
          </h1>
        </div>

        {/* Story */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif">A private sonic archive</h2>
            <p className="text-muted-foreground leading-relaxed">
              Lobster is not a marketplace. It is an archive.
              A carefully curated collection of sound, delivered through a single point of access: the Member Card.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-serif">The Card</h3>
            <p className="text-muted-foreground leading-relaxed">
              Each Lobster Member Card is NFC-enabled. One tap opens your personal archive.
              No apps. No passwords. Just touch and access.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-serif">The Archive</h3>
            <p className="text-muted-foreground leading-relaxed">
              Inside, you'll find sample packs, textures, and sonic experiments.
              All curated by Lobster Studio. All exclusive to members.
              New drops arrive regularly. Your card unlocks everything.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-serif">The Philosophy</h3>
            <p className="text-muted-foreground leading-relaxed">
              We believe in constraint. In quality over quantity.
              In physical objects that mean something.
              The card is not just access. It's membership.
              It's belonging to a community that values sound.
            </p>
          </div>
        </div>

        {/* Principles */}
        <div className="py-12 border-y border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <span className="small-caps">Curated</span>
              <p className="text-sm text-muted-foreground">
                Every sound is selected. Nothing is filler.
              </p>
            </div>
            <div className="space-y-3">
              <span className="small-caps">Physical</span>
              <p className="text-sm text-muted-foreground">
                A real card. Real presence. Real access.
              </p>
            </div>
            <div className="space-y-3">
              <span className="small-caps">Evolving</span>
              <p className="text-sm text-muted-foreground">
                Your archive grows. New drops. Same card.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center space-y-4">
          <span className="small-caps">Contact</span>
          <p className="text-muted-foreground">
            Questions? Reach us at{' '}
            <a href="mailto:hello@lobster.studio" className="text-foreground hover:text-lobster-gold transition-colors">
              hello@lobster.studio
            </a>
          </p>
        </div>
      </motion.div>
    </PageWrapper>
  );
}
