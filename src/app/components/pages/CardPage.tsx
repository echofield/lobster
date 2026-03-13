import { Link } from 'react-router';
import { motion } from 'motion/react';
import { memberCards, drops } from '@/data/cards';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

export function CardPage() {
  const card = memberCards[0];
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [hoveredDrop, setHoveredDrop] = useState<string | null>(null);
  const [isHoveringTrait, setIsHoveringTrait] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#1A1A1A] relative overflow-hidden">
      {/* The trait exists as ambient presence - moves with mouse */}
      <motion.div
        className="fixed pointer-events-none"
        style={{
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          opacity: [0.02, 0.04, 0.02],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <svg width="400" height="400" viewBox="0 0 400 400">
          <motion.rect
            x="150" y="150" width="100" height="100"
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="0.5"
            animate={{ rotate: [0, 90, 180, 270, 360] }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '200px 200px' }}
          />
        </svg>
      </motion.div>

      {/* Subtle grid - almost invisible */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.015]"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="traitGrid" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect x="39" y="39" width="2" height="2" fill="#8B5CF6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#traitGrid)" />
      </svg>

      {/* Nav - minimal */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center"
      >
        <Link
          to="/"
          className="flex items-center gap-3 text-[9px] tracking-[0.2em] uppercase opacity-20 hover:opacity-50 transition-opacity duration-500"
        >
          <ArrowLeft className="w-3 h-3" />
        </Link>
      </motion.nav>

      {/* Main Content - centered trait acquisition */}
      <div className="min-h-screen flex items-center justify-center px-8">
        <div className="flex flex-col items-center gap-20">

          {/* The Trait - just a square, blended into space */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 2 }}
            className="relative cursor-pointer"
            onMouseEnter={() => setIsHoveringTrait(true)}
            onMouseLeave={() => setIsHoveringTrait(false)}
          >
            <svg width="160" height="160" viewBox="0 0 160 160">
              {/* Outer square - the trait boundary */}
              <motion.rect
                x="20" y="20" width="120" height="120"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth={isHoveringTrait ? 1 : 0.5}
                animate={{
                  strokeOpacity: isHoveringTrait ? [0.3, 0.5, 0.3] : [0.06, 0.1, 0.06],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* Inner resonance */}
              <motion.rect
                x="40" y="40" width="80" height="80"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="0.3"
                animate={{
                  strokeOpacity: isHoveringTrait ? [0.2, 0.35, 0.2] : [0.03, 0.06, 0.03],
                  rotate: isHoveringTrait ? [0, 1, 0] : 0,
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ transformOrigin: '80px 80px' }}
              />

              {/* Center point - essence */}
              <motion.rect
                x="76" y="76" width="8" height="8"
                fill="#8B5CF6"
                animate={{
                  fillOpacity: isHoveringTrait ? [0.4, 0.7, 0.4] : [0.1, 0.2, 0.1],
                  scale: isHoveringTrait ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ transformOrigin: '80px 80px' }}
              />

              {/* Signal pulse on hover */}
              {isHoveringTrait && (
                <motion.rect
                  x="20" y="20" width="120" height="120"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="0.5"
                  initial={{ scale: 1, opacity: 0.3 }}
                  animate={{ scale: 1.3, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ transformOrigin: '80px 80px' }}
                />
              )}
            </svg>

            {/* Trait identifier */}
            <motion.div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2"
              animate={{ opacity: isHoveringTrait ? 0.4 : 0.15 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-[7px] tracking-[0.4em] uppercase text-[#8B5CF6]">
                001
              </span>
            </motion.div>
          </motion.div>

          {/* Trait info - appears on hover, minimal */}
          <motion.div
            className="text-center space-y-6 max-w-xs"
            animate={{ opacity: isHoveringTrait ? 1 : 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <motion.p
              className="text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/30"
            >
              {card.name}
            </motion.p>

            <motion.div className="flex items-center justify-center gap-4">
              <span className="font-serif text-xl text-[#1A1A1A]/40">{card.price}</span>
              <span className="text-[8px] text-[#1A1A1A]/15">{card.currency}</span>
            </motion.div>

            {/* Acquire - only visible on hover */}
            <motion.div
              animate={{ opacity: isHoveringTrait ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to="/thank-you"
                className="inline-flex items-center gap-3 text-[8px] tracking-[0.25em] uppercase text-[#8B5CF6]/40 hover:text-[#8B5CF6]/70 transition-colors duration-500"
              >
                <span>Acquire</span>
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-px bg-[#8B5CF6]/30"
                />
              </Link>
            </motion.div>
          </motion.div>

          {/* Traits included - subtle list */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center gap-8"
          >
            {card.features.slice(0, 3).map((feature, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2"
                animate={{ opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 5, repeat: Infinity, delay: i * 0.5 }}
              >
                <div className="w-1 h-1 bg-[#8B5CF6]/20" />
                <span className="text-[7px] tracking-[0.15em] uppercase text-[#1A1A1A]/20">
                  {feature}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Collections as trait variations - bottom */}
      {/* Trait Resonance: when main trait is hovered, these pulse in response */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-8 left-0 right-0 px-8"
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center gap-16">
            {drops.map((drop, i) => {
              // Resonance: pulse when main trait is hovered or another drop is hovered
              const isResonating = isHoveringTrait || (hoveredDrop !== null && hoveredDrop !== drop.id);
              const isDirectHover = hoveredDrop === drop.id;

              return (
                <motion.div
                  key={drop.id}
                  onMouseEnter={() => setHoveredDrop(drop.id)}
                  onMouseLeave={() => setHoveredDrop(null)}
                >
                  <Link to={`/drop/${drop.id}`} className="block">
                    <div className="flex flex-col items-center gap-3">
                      {/* Mini trait square with resonance */}
                      <svg width="32" height="32" viewBox="0 0 32 32">
                        {/* Resonance ring - appears when other traits are hovered */}
                        {isResonating && !isDirectHover && (
                          <motion.rect
                            x="2" y="2" width="28" height="28"
                            fill="none"
                            stroke="#8B5CF6"
                            strokeWidth="0.3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{
                              opacity: [0.1, 0.25, 0.1],
                              scale: [0.95, 1.02, 0.95]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.2 // Staggered resonance
                            }}
                            style={{ transformOrigin: '16px 16px' }}
                          />
                        )}

                        <motion.rect
                          x="4" y="4" width="24" height="24"
                          fill="none"
                          stroke={isDirectHover ? '#8B5CF6' : '#1A1A1A'}
                          strokeWidth="0.5"
                          animate={{
                            strokeOpacity: isDirectHover
                              ? 0.5
                              : isResonating
                                ? [0.08, 0.15, 0.08]
                                : 0.1,
                            rotate: isDirectHover ? [0, 3, 0] : 0,
                          }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
                          style={{ transformOrigin: '16px 16px' }}
                        />
                        <motion.rect
                          x="14" y="14" width="4" height="4"
                          fill={isDirectHover || isResonating ? '#8B5CF6' : '#1A1A1A'}
                          animate={{
                            fillOpacity: isDirectHover
                              ? 0.5
                              : isResonating
                                ? [0.1, 0.25, 0.1]
                                : 0.1,
                          }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                        />
                      </svg>
                      <motion.span
                        className="text-[7px] tracking-[0.2em] uppercase"
                        animate={{
                          color: isDirectHover
                            ? 'rgba(139, 92, 246, 0.5)'
                            : isResonating
                              ? 'rgba(139, 92, 246, 0.2)'
                              : 'rgba(26, 26, 26, 0.15)',
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {drop.title}
                      </motion.span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
