import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { PageWrapper } from '../layout';
import { getDropById } from '@/data/cards';
import { ArrowLeft, Play, Pause, Download } from 'lucide-react';
import { useState } from 'react';

export function DropPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const drop = getDropById(id || '');
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (!drop) {
    return (
      <PageWrapper centered fullHeight>
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-serif">Drop not found</h1>
          <button
            onClick={() => navigate('/access')}
            className="small-caps hover:opacity-100 opacity-60 transition-opacity"
          >
            Return to Archive
          </button>
        </div>
      </PageWrapper>
    );
  }

  const togglePlay = (sampleId: string) => {
    setPlayingId(playingId === sampleId ? null : sampleId);
  };

  return (
    <PageWrapper className="max-w-4xl mx-auto">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 small-caps hover:opacity-100 opacity-60 transition-opacity mb-12"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Archive
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        {/* Left: Cover & Meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Cover */}
          <div className="aspect-square border border-border bg-paper-warm relative overflow-hidden">
            {/* Abstract Pattern */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-3/4 h-3/4">
                {/* Waveform Representation */}
                <svg viewBox="0 0 100 60" className="w-full h-full opacity-20">
                  <path
                    d="M 0 30 Q 10 10, 20 30 T 40 30 T 60 30 T 80 30 T 100 30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M 0 35 Q 15 50, 30 35 T 60 35 T 90 35 T 100 35"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
            </div>
            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-paper-warm">
              <span className="font-serif text-lg">{drop.title}</span>
            </div>
          </div>

          {/* Meta */}
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-border">
              <span className="small-caps">Type</span>
              <span className="text-sm capitalize">{drop.type}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-border">
              <span className="small-caps">Tracks</span>
              <span className="text-sm">{drop.trackCount}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-border">
              <span className="small-caps">Duration</span>
              <span className="text-sm">{drop.duration}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-border">
              <span className="small-caps">Release</span>
              <span className="text-sm">{drop.releaseDate}</span>
            </div>
          </div>

          {/* Download All */}
          <button className="w-full py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wide hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Download All
          </button>
        </motion.div>

        {/* Right: Description & Samples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="lg:col-span-2 space-y-10"
        >
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="small-caps">{drop.artist}</span>
              {drop.exclusive && (
                <>
                  <span className="opacity-30">|</span>
                  <span className="text-[10px] text-lobster-gold tracking-wider uppercase">
                    Member Exclusive
                  </span>
                </>
              )}
            </div>
            <h1 className="text-3xl font-serif">{drop.title}</h1>
            <p className="text-muted-foreground leading-relaxed">
              {drop.description}
            </p>
          </div>

          {/* Sample List - Instrument-inspired */}
          <div className="space-y-4">
            <span className="small-caps">Samples</span>

            <div className="border border-border">
              {/* Header Row */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-paper-warm border-b border-border text-xs text-muted-foreground">
                <div className="col-span-1">#</div>
                <div className="col-span-5">Name</div>
                <div className="col-span-2 text-center">BPM</div>
                <div className="col-span-2 text-center">Key</div>
                <div className="col-span-2 text-right">Duration</div>
              </div>

              {/* Sample Rows */}
              {drop.samples?.map((sample, i) => (
                <motion.div
                  key={sample.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
                  className="group grid grid-cols-12 gap-4 px-4 py-4 border-b border-border last:border-b-0 hover:bg-paper-warm/50 transition-colors cursor-pointer"
                  onClick={() => togglePlay(sample.id)}
                >
                  {/* Play Button / Number */}
                  <div className="col-span-1 flex items-center">
                    <button className="w-6 h-6 flex items-center justify-center">
                      {playingId === sample.id ? (
                        <Pause className="w-3 h-3 text-lobster-gold" />
                      ) : (
                        <span className="text-sm text-muted-foreground group-hover:hidden">
                          {i + 1}
                        </span>
                      )}
                      {playingId !== sample.id && (
                        <Play className="w-3 h-3 text-muted-foreground hidden group-hover:block" />
                      )}
                    </button>
                  </div>

                  {/* Name */}
                  <div className="col-span-5 flex items-center">
                    <span className={`text-sm ${playingId === sample.id ? 'text-lobster-gold' : ''}`}>
                      {sample.name}
                    </span>
                  </div>

                  {/* BPM */}
                  <div className="col-span-2 flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">
                      {sample.bpm || '-'}
                    </span>
                  </div>

                  {/* Key */}
                  <div className="col-span-2 flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">
                      {sample.key || '-'}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="col-span-2 flex items-center justify-end">
                    <span className="text-sm text-muted-foreground">
                      {sample.duration}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Waveform Visualization - Instrument Aesthetic */}
          {playingId && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-6 border border-lobster-gold/30 bg-paper-warm"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-2 h-2 rounded-full bg-lobster-gold animate-pulse" />
                <span className="text-sm">
                  Now playing: {drop.samples?.find(s => s.id === playingId)?.name}
                </span>
              </div>
              {/* Simplified Waveform */}
              <div className="h-16 flex items-center justify-center gap-0.5">
                {[...Array(60)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 4 }}
                    animate={{ height: Math.random() * 40 + 8 }}
                    transition={{
                      repeat: Infinity,
                      repeatType: 'reverse',
                      duration: 0.3 + Math.random() * 0.5,
                      delay: i * 0.02
                    }}
                    className="w-1 bg-lobster-gold/40 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  );
}
