import { Link, useParams, useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { drops, memberCards, type Drop } from '@/data/cards';
import { useState, useEffect, useMemo } from 'react';
import { Play, Pause, Search, Grid3X3, List, Disc, Music, Layers, Radio } from 'lucide-react';

// Abstract cover patterns
const CoverPatterns = {
  squares: ({ isPlaying }: { isPlaying: boolean }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {[0, 1, 2, 3].map((i) => (
        <motion.rect
          key={i}
          x={20 + i * 5}
          y={20 + i * 5}
          width={60 - i * 10}
          height={60 - i * 10}
          fill="none"
          stroke={isPlaying ? '#8B5CF6' : '#1A1A1A'}
          strokeWidth="0.5"
          strokeOpacity={isPlaying ? 0.8 - i * 0.15 : 0.2 - i * 0.03}
          animate={isPlaying ? { rotate: [0, 90], scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
          style={{ transformOrigin: '50px 50px' }}
        />
      ))}
      <motion.rect
        x="45"
        y="45"
        width="10"
        height="10"
        fill={isPlaying ? '#8B5CF6' : '#1A1A1A'}
        fillOpacity={isPlaying ? 0.6 : 0.1}
        animate={isPlaying ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ transformOrigin: '50px 50px' }}
      />
    </svg>
  ),
  circles: ({ isPlaying }: { isPlaying: boolean }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.circle
          key={i}
          cx="50"
          cy="50"
          r={10 + i * 8}
          fill="none"
          stroke={isPlaying ? '#8B5CF6' : '#1A1A1A'}
          strokeWidth="0.5"
          strokeOpacity={isPlaying ? 0.6 - i * 0.1 : 0.15 - i * 0.02}
          animate={isPlaying ? { r: [10 + i * 8, 12 + i * 8, 10 + i * 8] } : {}}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
      <motion.circle
        cx="50"
        cy="50"
        r="4"
        fill={isPlaying ? '#8B5CF6' : '#1A1A1A'}
        fillOpacity={isPlaying ? 0.8 : 0.2}
        animate={isPlaying ? { scale: [1, 1.5, 1] } : {}}
        transition={{ duration: 1, repeat: Infinity }}
        style={{ transformOrigin: '50px 50px' }}
      />
    </svg>
  ),
  grid: ({ isPlaying }: { isPlaying: boolean }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 5 }).map((_, col) => (
          <motion.rect
            key={`${row}-${col}`}
            x={20 + col * 15}
            y={20 + row * 15}
            width="8"
            height="8"
            fill={isPlaying ? '#8B5CF6' : '#1A1A1A'}
            fillOpacity={isPlaying ? 0.1 + (row + col) * 0.05 : 0.05 + (row + col) * 0.02}
            animate={isPlaying ? {
              scale: [1, 1.2, 1],
              fillOpacity: [0.1 + (row + col) * 0.05, 0.3 + (row + col) * 0.05, 0.1 + (row + col) * 0.05]
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity, delay: (row + col) * 0.1 }}
            style={{ transformOrigin: `${24 + col * 15}px ${24 + row * 15}px` }}
          />
        ))
      )}
    </svg>
  ),
  hexagon: ({ isPlaying }: { isPlaying: boolean }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {[0, 1, 2].map((i) => (
        <motion.polygon
          key={i}
          points="50,15 80,32.5 80,67.5 50,85 20,67.5 20,32.5"
          fill="none"
          stroke={isPlaying ? '#8B5CF6' : '#1A1A1A'}
          strokeWidth="0.5"
          strokeOpacity={isPlaying ? 0.6 - i * 0.15 : 0.15 - i * 0.03}
          transform={`scale(${1 - i * 0.2})`}
          style={{ transformOrigin: '50px 50px' }}
          animate={isPlaying ? { rotate: [0, 60, 0] } : {}}
          transition={{ duration: 6, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
      <motion.circle
        cx="50"
        cy="50"
        r="5"
        fill={isPlaying ? '#8B5CF6' : '#1A1A1A'}
        fillOpacity={isPlaying ? 0.6 : 0.15}
        animate={isPlaying ? { scale: [1, 1.4, 1] } : {}}
        transition={{ duration: 1.2, repeat: Infinity }}
        style={{ transformOrigin: '50px 50px' }}
      />
    </svg>
  ),
};

const patterns = ['squares', 'circles', 'grid', 'hexagon'] as const;

// Category icons
const categoryIcons = {
  all: Layers,
  pack: Disc,
  single: Music,
  collection: Radio,
};

type FilterType = 'all' | 'pack' | 'single' | 'collection';

export function MemberAccessPage() {
  const { token } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const card = memberCards[0];
  const [phase, setPhase] = useState<'detecting' | 'recognized' | 'granted' | 'ready'>('detecting');
  const [hoveredDrop, setHoveredDrop] = useState<string | null>(null);
  const [playingDrop, setPlayingDrop] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get filter from URL params
  const filterParam = searchParams.get('filter') as FilterType | null;
  const [activeFilter, setActiveFilter] = useState<FilterType>(
    filterParam === 'packs' ? 'pack' : filterParam || 'all'
  );

  const togglePlay = (dropId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPlayingDrop(playingDrop === dropId ? null : dropId);
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      searchParams.delete('filter');
    } else {
      searchParams.set('filter', filter === 'pack' ? 'packs' : filter);
    }
    setSearchParams(searchParams);
  };

  // Filter drops based on active filter and search
  const filteredDrops = useMemo(() => {
    let result = drops;

    if (activeFilter !== 'all') {
      result = result.filter(drop => drop.type === activeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(drop =>
        drop.title.toLowerCase().includes(query) ||
        drop.artist.toLowerCase().includes(query) ||
        drop.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [activeFilter, searchQuery]);

  // Stats
  const stats = useMemo(() => ({
    total: drops.length,
    packs: drops.filter(d => d.type === 'pack').length,
    singles: drops.filter(d => d.type === 'single').length,
    collections: drops.filter(d => d.type === 'collection').length,
    totalTracks: drops.reduce((sum, d) => sum + d.trackCount, 0),
  }), []);

  useEffect(() => {
    // NFC Magic Sequence
    const timers = [
      setTimeout(() => setPhase('recognized'), 1200),
      setTimeout(() => setPhase('granted'), 2400),
      setTimeout(() => setPhase('ready'), 3600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const isReady = phase === 'ready';

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#1A1A1A] relative overflow-hidden">
      {/* NFC Detection Overlay - The Magic Moment */}
      <AnimatePresence>
        {phase !== 'ready' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 bg-[#FAF8F2] flex items-center justify-center"
          >
            {/* Ambient glow */}
            <motion.div
              animate={{
                scale: phase === 'granted' ? [1, 1.5] : 1,
                opacity: phase === 'granted' ? [0.3, 0] : 0.2
              }}
              transition={{ duration: 1 }}
              className="absolute w-[80vmin] h-[80vmin] rounded-full blur-[100px]"
              style={{
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)'
              }}
            />

            {/* Main Circle */}
            <div className="relative">
              {/* Outer expanding rings */}
              {phase === 'recognized' && (
                <>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.6 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-[#8B5CF6]"
                  />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.4 }}
                    animate={{ scale: 3, opacity: 0 }}
                    transition={{ duration: 1.8, ease: 'easeOut', delay: 0.2 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-[#8B5CF6]"
                  />
                </>
              )}

              {/* The Circle */}
              <motion.div
                animate={{
                  scale: phase === 'detecting' ? [1, 1.02, 1] : 1,
                  boxShadow: phase === 'recognized' || phase === 'granted'
                    ? '0 0 60px rgba(139, 92, 246, 0.4), 0 0 120px rgba(139, 92, 246, 0.2)'
                    : '0 0 0px transparent'
                }}
                transition={{
                  scale: { duration: 2, repeat: phase === 'detecting' ? Infinity : 0 },
                  boxShadow: { duration: 0.6 }
                }}
                className="w-64 h-64 rounded-full border border-[#1A1A1A]/10 relative flex items-center justify-center"
                style={{
                  background: phase === 'granted'
                    ? 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)'
                    : 'transparent'
                }}
              >
                {/* Inner geometric element */}
                <motion.div
                  animate={{
                    rotate: phase === 'detecting' ? [0, 360] : phase === 'recognized' ? 45 : 0,
                    scale: phase === 'granted' ? [1, 0.9, 1] : 1
                  }}
                  transition={{
                    rotate: phase === 'detecting'
                      ? { duration: 8, repeat: Infinity, ease: 'linear' }
                      : { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                    scale: { duration: 1.5, repeat: phase === 'granted' ? Infinity : 0 }
                  }}
                  className="w-16 h-16 border border-[#8B5CF6]/40 relative"
                  style={{
                    background: phase !== 'detecting'
                      ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 139, 250, 0.05) 100%)'
                      : 'transparent'
                  }}
                >
                  {/* Center dot */}
                  <motion.div
                    animate={{
                      scale: phase === 'recognized' || phase === 'granted' ? [1, 1.5, 1] : 1,
                      opacity: phase === 'detecting' ? 0.3 : 1
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2"
                    style={{
                      background: '#8B5CF6',
                      boxShadow: phase !== 'detecting' ? '0 0 20px rgba(139, 92, 246, 0.8)' : 'none'
                    }}
                  />
                </motion.div>

                {/* Corner markers */}
                <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-[#8B5CF6]/20" />
                <div className="absolute top-8 right-8 w-4 h-4 border-t border-r border-[#8B5CF6]/20" />
                <div className="absolute bottom-8 left-8 w-4 h-4 border-b border-l border-[#8B5CF6]/20" />
                <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-[#8B5CF6]/20" />
              </motion.div>

              {/* Text States */}
              <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 text-center w-80">
                <AnimatePresence mode="wait">
                  {phase === 'detecting' && (
                    <motion.div
                      key="detecting"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-2"
                    >
                      <motion.p
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-xs tracking-[0.3em] uppercase text-[#1A1A1A]/40"
                      >
                        Detecting Signal...
                      </motion.p>
                    </motion.div>
                  )}

                  {phase === 'recognized' && (
                    <motion.div
                      key="recognized"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3"
                    >
                      <p
                        className="text-sm tracking-[0.25em] uppercase font-medium"
                        style={{ color: '#8B5CF6' }}
                      >
                        Lobster Card Detected
                      </p>
                      <p className="text-xs tracking-[0.15em] uppercase text-[#1A1A1A]/30">
                        Card #{String(41).padStart(3, '0')}
                      </p>
                    </motion.div>
                  )}

                  {phase === 'granted' && (
                    <motion.div
                      key="granted"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3"
                    >
                      <p
                        className="text-sm tracking-[0.25em] uppercase font-medium"
                        style={{ color: '#8B5CF6' }}
                      >
                        Archive Access Granted
                      </p>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-px mx-auto w-24"
                        style={{ background: 'linear-gradient(90deg, transparent, #8B5CF6, transparent)' }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Layout - Spotify-like with sidebar */}
      <div className="flex min-h-screen">
        {/* Left Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isReady ? 1 : 0, x: isReady ? 0 : -20 }}
          transition={{ duration: 0.6 }}
          className="w-64 border-r border-[#1A1A1A]/5 p-6 flex flex-col"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-10">
            <div className="w-5 h-5 border border-[#1A1A1A]/30 rotate-45" />
            <span className="text-xs tracking-[0.2em] uppercase opacity-60">Lobster</span>
          </Link>

          {/* Navigation Categories */}
          <nav className="space-y-1 mb-8">
            <p className="text-[9px] tracking-[0.2em] uppercase text-[#1A1A1A]/30 mb-4">
              Browse
            </p>
            {[
              { id: 'all', label: 'All Sounds', count: stats.total },
              { id: 'pack', label: 'Sample Packs', count: stats.packs },
              { id: 'single', label: 'Singles', count: stats.singles },
              { id: 'collection', label: 'Collections', count: stats.collections },
            ].map((item) => {
              const Icon = categoryIcons[item.id as FilterType];
              const isActive = activeFilter === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleFilterChange(item.id as FilterType)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]'
                      : 'hover:bg-[#1A1A1A]/5 text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs tracking-wide flex-1">{item.label}</span>
                  <span className={`text-[10px] ${isActive ? 'text-[#8B5CF6]' : 'text-[#1A1A1A]/30'}`}>
                    {item.count}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Quick Links */}
          <nav className="space-y-1 mb-8">
            <p className="text-[9px] tracking-[0.2em] uppercase text-[#1A1A1A]/30 mb-4">
              Studio
            </p>
            <Link
              to="/instrument"
              className="flex items-center gap-3 px-3 py-2.5 text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/5 transition-all duration-200"
            >
              <div className="w-4 h-4 border border-current rounded-full" />
              <span className="text-xs tracking-wide">Instrument</span>
            </Link>
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Card Status - Bottom */}
          <div className="border-t border-[#1A1A1A]/5 pt-6">
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2"
                style={{ background: '#8B5CF6', boxShadow: '0 0 8px rgba(139, 92, 246, 0.5)' }}
              />
              <span className="text-[10px] tracking-[0.1em] uppercase text-[#8B5CF6]">
                Signal Active
              </span>
            </div>
            <p className="text-[10px] text-[#1A1A1A]/40">
              Card #{String(41).padStart(3, '0')} · {card.edition}
            </p>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Header with Search */}
          <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : -10 }}
            transition={{ duration: 0.6 }}
            className="sticky top-0 z-10 bg-[#FAF8F2]/90 backdrop-blur-sm border-b border-[#1A1A1A]/5 px-8 py-4"
          >
            <div className="flex items-center justify-between gap-6">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sounds..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A1A]/5 border-none text-sm placeholder:text-[#1A1A1A]/30 focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]/30"
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 p-1 bg-[#1A1A1A]/5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-[#8B5CF6] shadow-sm' : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A]'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list' ? 'bg-white text-[#8B5CF6] shadow-sm' : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A]'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.header>

          {/* Content Area */}
          <div className="p-8">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-serif mb-2">
                {activeFilter === 'all' ? 'Your Archive' :
                 activeFilter === 'pack' ? 'Sample Packs' :
                 activeFilter === 'single' ? 'Singles' : 'Collections'}
              </h1>
              <p className="text-sm text-[#1A1A1A]/40">
                {filteredDrops.length} {filteredDrops.length === 1 ? 'item' : 'items'} · {stats.totalTracks} total signals
              </p>
            </motion.div>

            {/* Drops Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDrops.map((drop, i) => (
                  <DropCard
                    key={drop.id}
                    drop={drop}
                    index={i}
                    isReady={isReady}
                    isPlaying={playingDrop === drop.id}
                    isHovered={hoveredDrop === drop.id}
                    onHover={setHoveredDrop}
                    onTogglePlay={togglePlay}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredDrops.map((drop, i) => (
                  <DropListItem
                    key={drop.id}
                    drop={drop}
                    index={i}
                    isReady={isReady}
                    isPlaying={playingDrop === drop.id}
                    isHovered={hoveredDrop === drop.id}
                    onHover={setHoveredDrop}
                    onTogglePlay={togglePlay}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredDrops.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-16 h-16 border border-[#1A1A1A]/10 rotate-45 mx-auto mb-6" />
                <p className="text-[#1A1A1A]/40">No sounds found</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    handleFilterChange('all');
                  }}
                  className="mt-4 text-xs text-[#8B5CF6] hover:underline"
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* Bottom Diamond */}
      <div className="fixed bottom-8 right-8 pointer-events-none">
        <div className="w-3 h-3 border border-[#1A1A1A]/20 rotate-45" />
      </div>
    </div>
  );
}

// Drop Card Component
interface DropCardProps {
  drop: Drop;
  index: number;
  isReady: boolean;
  isPlaying: boolean;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onTogglePlay: (id: string, e: React.MouseEvent) => void;
}

function DropCard({ drop, index, isReady, isPlaying, isHovered, onHover, onTogglePlay }: DropCardProps) {
  const PatternComponent = CoverPatterns[patterns[index % patterns.length]];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 20 }}
      transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
      className="group"
      onMouseEnter={() => onHover(drop.id)}
      onMouseLeave={() => onHover(null)}
    >
      <Link to={`/drop/${drop.id}`} className="block">
        <div className={`relative border transition-all duration-300 ${
          isHovered || isPlaying
            ? 'border-[#8B5CF6]/40 bg-[#8B5CF6]/[0.02]'
            : 'border-[#1A1A1A]/10 hover:border-[#1A1A1A]/20'
        }`}>
          {/* Cover */}
          <div className="aspect-square relative overflow-hidden bg-[#FAF8F2]">
            <div className="absolute inset-0 flex items-center justify-center">
              <PatternComponent isPlaying={isPlaying} />
            </div>

            {/* Play Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered || isPlaying ? 1 : 0 }}
              className="absolute inset-0 flex items-center justify-center bg-[#FAF8F2]/60 backdrop-blur-sm"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => onTogglePlay(drop.id, e)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isPlaying
                    ? 'bg-[#8B5CF6] text-white'
                    : 'border-2 border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" fill="currentColor" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                )}
              </motion.button>
            </motion.div>

            {/* Exclusive Badge */}
            {drop.exclusive && (
              <div className="absolute top-3 right-3">
                <span className="text-[8px] tracking-[0.1em] uppercase px-2 py-1 border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#8B5CF6]">
                  Exclusive
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className={`font-serif text-sm transition-colors duration-200 ${
              isHovered || isPlaying ? 'text-[#8B5CF6]' : ''
            }`}>
              {drop.title}
            </h3>
            <p className="text-xs text-[#1A1A1A]/40 mt-1">{drop.artist}</p>
            <p className="text-[10px] text-[#1A1A1A]/30 mt-2">
              {drop.trackCount} signals · {drop.duration}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Drop List Item Component
function DropListItem({ drop, index, isReady, isPlaying, isHovered, onHover, onTogglePlay }: DropCardProps) {
  const PatternComponent = CoverPatterns[patterns[index % patterns.length]];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: isReady ? 1 : 0, x: isReady ? 0 : -10 }}
      transition={{ delay: 0.2 + index * 0.03, duration: 0.4 }}
      onMouseEnter={() => onHover(drop.id)}
      onMouseLeave={() => onHover(null)}
    >
      <Link
        to={`/drop/${drop.id}`}
        className={`flex items-center gap-4 p-3 border transition-all duration-200 ${
          isHovered || isPlaying
            ? 'border-[#8B5CF6]/40 bg-[#8B5CF6]/[0.02]'
            : 'border-[#1A1A1A]/5 hover:border-[#1A1A1A]/15'
        }`}
      >
        {/* Mini Cover */}
        <div className="w-14 h-14 relative flex-shrink-0 bg-[#FAF8F2]">
          <div className="absolute inset-0 flex items-center justify-center">
            <PatternComponent isPlaying={isPlaying} />
          </div>
          {/* Play button on hover */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            onClick={(e) => onTogglePlay(drop.id, e)}
            className="absolute inset-0 flex items-center justify-center bg-[#FAF8F2]/80"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-[#8B5CF6]" fill="currentColor" />
            ) : (
              <Play className="w-5 h-5 text-[#8B5CF6] ml-0.5" fill="currentColor" />
            )}
          </motion.button>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-medium truncate transition-colors ${
            isHovered || isPlaying ? 'text-[#8B5CF6]' : ''
          }`}>
            {drop.title}
          </h3>
          <p className="text-xs text-[#1A1A1A]/40 truncate">{drop.artist}</p>
        </div>

        {/* Meta */}
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-[#1A1A1A]/50">{drop.trackCount} signals</p>
          <p className="text-[10px] text-[#1A1A1A]/30">{drop.duration}</p>
        </div>

        {/* Exclusive Badge */}
        {drop.exclusive && (
          <span className="text-[8px] tracking-[0.1em] uppercase px-2 py-1 border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#8B5CF6] flex-shrink-0">
            Exclusive
          </span>
        )}
      </Link>
    </motion.div>
  );
}
