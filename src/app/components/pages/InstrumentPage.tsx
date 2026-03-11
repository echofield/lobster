import { Link } from 'react-router';
import { motion } from 'motion/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { audioEngine } from '@/app/audio/AudioEngine';

interface Pad {
  id: string;
  loaded: boolean;
  loading: boolean;
  label: string;
  waveformData: number[] | null;
}

interface Effects {
  filter: { freq: number; q: number };
  delay: { time: number; feedback: number; mix: number };
  reverb: { decay: number; mix: number };
  master: { volume: number };
}

export function InstrumentPage() {
  const [initialized, setInitialized] = useState(false);
  const [pads, setPads] = useState<Pad[]>(
    Array(8).fill(null).map((_, i) => ({
      id: String(i),
      loaded: false,
      loading: false,
      label: '',
      waveformData: null
    }))
  );
  const [activePad, setActivePad] = useState<string | null>(null);
  const [effects, setEffects] = useState<Effects>({
    filter: { freq: 20000, q: 1 },
    delay: { time: 0.25, feedback: 0.3, mix: 0 },
    reverb: { decay: 2.5, mix: 0 },
    master: { volume: 80 }
  });
  const [waveformData, setWaveformData] = useState<Float32Array>(new Float32Array(256));
  const animationRef = useRef<number>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPadForLoad, setSelectedPadForLoad] = useState<string | null>(null);

  // Initialize audio engine
  const initAudio = useCallback(async () => {
    if (!initialized) {
      await audioEngine.init();
      setInitialized(true);
    }
  }, [initialized]);

  // Sync effects to audio engine
  useEffect(() => {
    if (!initialized) return;

    audioEngine.setFilterFrequency(effects.filter.freq);
    audioEngine.setFilterQ(effects.filter.q);
    audioEngine.setDelayTime(effects.delay.time);
    audioEngine.setDelayFeedback(effects.delay.feedback);
    audioEngine.setDelayMix(effects.delay.mix);
    audioEngine.setReverbDecay(effects.reverb.decay);
    audioEngine.setReverbMix(effects.reverb.mix);
    audioEngine.setMasterVolume(effects.master.volume / 100);
  }, [initialized, effects]);

  // Waveform animation
  useEffect(() => {
    if (!initialized) return;

    const updateWaveform = () => {
      const data = audioEngine.getWaveform();
      setWaveformData(data);
      animationRef.current = requestAnimationFrame(updateWaveform);
    };

    animationRef.current = requestAnimationFrame(updateWaveform);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initialized]);

  // Keyboard bindings
  useEffect(() => {
    const keys = ['1', '2', '3', '4', 'q', 'w', 'e', 'r'];

    const handleKeyDown = async (e: KeyboardEvent) => {
      const index = keys.indexOf(e.key.toLowerCase());
      if (index !== -1) {
        await initAudio();
        triggerPad(String(index));
      }
      if (e.code === 'Space') {
        e.preventDefault();
        audioEngine.stopAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [initAudio]);

  const triggerPad = (padId: string) => {
    const pad = pads.find(p => p.id === padId);
    if (pad?.loaded) {
      audioEngine.triggerPad(padId);
      setActivePad(padId);
      setTimeout(() => setActivePad(null), 150);
    }
  };

  const handlePadClick = async (padId: string) => {
    await initAudio();
    const pad = pads.find(p => p.id === padId);

    if (pad?.loaded) {
      triggerPad(padId);
    } else {
      setSelectedPadForLoad(padId);
      fileInputRef.current?.click();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPadForLoad) return;

    await initAudio();

    setPads(prev => prev.map(p =>
      p.id === selectedPadForLoad ? { ...p, loading: true } : p
    ));

    try {
      await audioEngine.loadSampleFromFile(selectedPadForLoad, file);
      const waveform = audioEngine.getWaveformData(selectedPadForLoad);

      setPads(prev => prev.map(p =>
        p.id === selectedPadForLoad ? {
          ...p,
          loaded: true,
          loading: false,
          label: file.name.replace(/\.[^/.]+$/, '').slice(0, 8),
          waveformData: waveform
        } : p
      ));
    } catch (err) {
      console.error('Failed to load sample:', err);
      setPads(prev => prev.map(p =>
        p.id === selectedPadForLoad ? { ...p, loading: false } : p
      ));
    }

    setSelectedPadForLoad(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const updateEffect = (section: keyof Effects, key: string, value: number) => {
    setEffects(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: value }
    }));
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#1A1A1A] relative overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] rounded-full opacity-15 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center"
      >
        <Link
          to="/"
          className="flex items-center gap-3 text-xs tracking-[0.15em] uppercase opacity-60 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          Return
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border border-[#1A1A1A]/30 rotate-45" />
          <span className="text-xs tracking-[0.2em] uppercase opacity-60">Instrument</span>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-8 md:px-16 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/40">Sound Laboratory</span>
          <h1 className="text-3xl md:text-4xl font-serif mt-2">Lobster Sampler</h1>
          <p className="text-sm text-[#1A1A1A]/40 mt-3">
            {initialized ? 'Drop samples onto pads. Play with keyboard or click.' : 'Click to initialize audio'}
          </p>
        </motion.div>

        {/* Waveform Visualization - ARCHE style */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.8 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative h-24 mb-12 border-y border-[#1A1A1A]/10"
        >
          <svg viewBox="0 0 256 96" className="w-full h-full" preserveAspectRatio="none">
            {/* Center line */}
            <line x1="0" y1="48" x2="256" y2="48" stroke="#8B5CF6" strokeWidth="0.5" strokeOpacity="0.2" />

            {/* Waveform path */}
            <motion.path
              d={`M 0 48 ${Array.from(waveformData).map((v, i) =>
                `L ${i} ${48 - v * 40}`
              ).join(' ')}`}
              fill="none"
              stroke="url(#instrumentGradient)"
              strokeWidth="1"
              strokeLinecap="round"
            />

            {/* Measurement marks */}
            {[0, 64, 128, 192, 256].map((x, i) => (
              <g key={i}>
                <line x1={x} y1="0" x2={x} y2="4" stroke="#8B5CF6" strokeWidth="0.5" strokeOpacity="0.3" />
                <line x1={x} y1="92" x2={x} y2="96" stroke="#8B5CF6" strokeWidth="0.5" strokeOpacity="0.3" />
              </g>
            ))}

            <defs>
              <linearGradient id="instrumentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Pad Grid - 2x4 geometric squares */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-4 gap-4 mb-12 max-w-2xl mx-auto"
        >
          {pads.map((pad, index) => (
            <motion.button
              key={pad.id}
              onClick={() => handlePadClick(pad.id)}
              whileTap={{ scale: 0.95 }}
              className="relative aspect-square group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.05 }}
            >
              {/* Outer frame */}
              <div
                className={`absolute inset-0 transition-all duration-200 ${
                  activePad === pad.id
                    ? 'border-2 border-[#8B5CF6]'
                    : pad.loaded
                    ? 'border border-[#1A1A1A]/20 hover:border-[#8B5CF6]/50'
                    : 'border border-dashed border-[#1A1A1A]/15 hover:border-[#8B5CF6]/30'
                }`}
                style={{
                  boxShadow: activePad === pad.id
                    ? '0 0 30px rgba(139, 92, 246, 0.4), inset 0 0 20px rgba(139, 92, 246, 0.1)'
                    : 'none',
                  background: activePad === pad.id
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(167, 139, 250, 0.08) 100%)'
                    : pad.loaded
                    ? 'rgba(139, 92, 246, 0.03)'
                    : 'transparent'
                }}
              />

              {/* Inner content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {pad.loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border border-[#8B5CF6] border-t-transparent rounded-full"
                  />
                ) : pad.loaded ? (
                  <>
                    {/* Mini waveform */}
                    {pad.waveformData && (
                      <div className="flex items-center gap-px h-6 px-3 opacity-40">
                        {pad.waveformData.slice(0, 16).map((v, i) => (
                          <div
                            key={i}
                            className="w-0.5 bg-[#8B5CF6] rounded-full"
                            style={{ height: `${v * 100}%`, minHeight: 2 }}
                          />
                        ))}
                      </div>
                    )}
                    <span className="text-[9px] tracking-wider text-[#1A1A1A]/50 mt-1 truncate max-w-full px-2">
                      {pad.label.toUpperCase()}
                    </span>
                  </>
                ) : (
                  <Upload className="w-4 h-4 text-[#1A1A1A]/20 group-hover:text-[#8B5CF6]/40 transition-colors" />
                )}
              </div>

              {/* Keyboard hint */}
              <span className="absolute top-1 left-1 text-[8px] text-[#1A1A1A]/20">
                {['1', '2', '3', '4', 'Q', 'W', 'E', 'R'][index]}
              </span>

              {/* Corner accents when loaded */}
              {pad.loaded && (
                <>
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#8B5CF6]/30" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#8B5CF6]/30" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#8B5CF6]/30" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#8B5CF6]/30" />
                </>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Effects Panel - Minimal geometric controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="border border-[#1A1A1A]/10 p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/40">Signal Chain</span>
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1 h-1 bg-[#8B5CF6]/30" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Filter */}
            <div className="space-y-4">
              <span className="text-[10px] tracking-[0.15em] uppercase text-[#8B5CF6]">Filter</span>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[9px] text-[#1A1A1A]/30 mb-1">
                    <span>FREQ</span>
                    <span>{Math.round(effects.filter.freq)}Hz</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="20000"
                    value={effects.filter.freq}
                    onChange={(e) => updateEffect('filter', 'freq', Number(e.target.value))}
                    className="w-full h-px appearance-none bg-[#1A1A1A]/10 cursor-pointer"
                    style={{ accentColor: '#8B5CF6' }}
                  />
                </div>
              </div>
            </div>

            {/* Delay */}
            <div className="space-y-4">
              <span className="text-[10px] tracking-[0.15em] uppercase text-[#8B5CF6]">Delay</span>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[9px] text-[#1A1A1A]/30 mb-1">
                    <span>MIX</span>
                    <span>{Math.round(effects.delay.mix * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={effects.delay.mix * 100}
                    onChange={(e) => updateEffect('delay', 'mix', Number(e.target.value) / 100)}
                    className="w-full h-px appearance-none bg-[#1A1A1A]/10 cursor-pointer"
                    style={{ accentColor: '#8B5CF6' }}
                  />
                </div>
              </div>
            </div>

            {/* Reverb */}
            <div className="space-y-4">
              <span className="text-[10px] tracking-[0.15em] uppercase text-[#8B5CF6]">Reverb</span>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[9px] text-[#1A1A1A]/30 mb-1">
                    <span>MIX</span>
                    <span>{Math.round(effects.reverb.mix * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={effects.reverb.mix * 100}
                    onChange={(e) => updateEffect('reverb', 'mix', Number(e.target.value) / 100)}
                    className="w-full h-px appearance-none bg-[#1A1A1A]/10 cursor-pointer"
                    style={{ accentColor: '#8B5CF6' }}
                  />
                </div>
              </div>
            </div>

            {/* Master */}
            <div className="space-y-4">
              <span className="text-[10px] tracking-[0.15em] uppercase text-[#8B5CF6]">Master</span>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[9px] text-[#1A1A1A]/30 mb-1">
                    <span>VOLUME</span>
                    <span>{effects.master.volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={effects.master.volume}
                    onChange={(e) => updateEffect('master', 'volume', Number(e.target.value))}
                    className="w-full h-px appearance-none bg-[#1A1A1A]/10 cursor-pointer"
                    style={{ accentColor: '#8B5CF6' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex justify-between text-[10px] text-[#1A1A1A]/30"
        >
          <span>Keys: 1-4, Q-R to trigger | Space to stop</span>
          <span>Member exclusive instrument</span>
        </motion.div>
      </div>

      {/* Bottom Diamond */}
      <div className="fixed bottom-8 right-8">
        <div className="w-3 h-3 border border-[#1A1A1A]/20 rotate-45" />
      </div>
    </div>
  );
}
