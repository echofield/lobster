import { Link } from 'react-router';
import { motion } from 'motion/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
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
  const [meterLevel, setMeterLevel] = useState(-60);
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

  // Waveform & meter animation
  useEffect(() => {
    if (!initialized) return;

    const updateVisuals = () => {
      const data = audioEngine.getWaveform();
      setWaveformData(data);
      const level = audioEngine.getMeterLevel();
      setMeterLevel(level);
      animationRef.current = requestAnimationFrame(updateVisuals);
    };

    animationRef.current = requestAnimationFrame(updateVisuals);
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

  // Convert dB to percentage for meter
  const meterPercent = Math.max(0, Math.min(100, (meterLevel + 60) * 1.67));

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#1A1A1A] relative overflow-hidden">
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

      {/* Main Instrument Chassis */}
      <div className="pt-20 pb-8 px-4 md:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Main Chassis */}
          <div
            className="relative border-2 border-[#1A1A1A]/20 bg-gradient-to-b from-[#F5F3ED] to-[#EBE8E0]"
            style={{
              boxShadow: '0 8px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.05)'
            }}
          >
            {/* Top Panel - Brand & Status */}
            <div className="border-b-2 border-[#1A1A1A]/10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 20 20" className="text-[#8B5CF6]">
                    <rect x="4" y="4" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="7" y="7" width="6" height="6" fill="currentColor" opacity="0.3" />
                  </svg>
                  <span className="text-sm font-medium tracking-[0.15em] uppercase">Lobster</span>
                </div>
                <span className="text-[10px] tracking-[0.1em] uppercase text-[#1A1A1A]/40">Sampler MK-1</span>
              </div>

              {/* Status LEDs */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] tracking-wider uppercase text-[#1A1A1A]/40">PWR</span>
                  <motion.div
                    animate={{ opacity: initialized ? [0.6, 1, 0.6] : 0.2 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: initialized ? '#8B5CF6' : '#1A1A1A',
                      boxShadow: initialized ? '0 0 8px rgba(139, 92, 246, 0.8)' : 'none'
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] tracking-wider uppercase text-[#1A1A1A]/40">SIG</span>
                  <motion.div
                    animate={{
                      opacity: meterLevel > -50 ? [0.6, 1, 0.6] : 0.2,
                      background: meterLevel > -10 ? '#EF4444' : meterLevel > -30 ? '#F59E0B' : '#22C55E'
                    }}
                    transition={{ duration: 0.1 }}
                    className="w-2 h-2 rounded-full"
                    style={{
                      boxShadow: meterLevel > -50 ? '0 0 6px currentColor' : 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Oscilloscope / Waveform Section */}
            <div className="border-b-2 border-[#1A1A1A]/10 p-6">
              <div
                className="relative h-28 bg-[#0A0A0A] border border-[#1A1A1A]/30 overflow-hidden"
                style={{ boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)' }}
              >
                {/* Grid */}
                <div className="absolute inset-0 opacity-20">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={`v-${i}`} className="absolute top-0 bottom-0 w-px bg-[#8B5CF6]" style={{ left: `${(i + 1) * 10}%` }} />
                  ))}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={`h-${i}`} className="absolute left-0 right-0 h-px bg-[#8B5CF6]" style={{ top: `${(i + 1) * 16.67}%` }} />
                  ))}
                </div>

                {/* Center line */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-[#8B5CF6]/40" />

                {/* Waveform */}
                <svg viewBox="0 0 256 112" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <motion.path
                    d={`M 0 56 ${Array.from(waveformData).map((v, i) =>
                      `L ${i} ${56 - v * 48}`
                    ).join(' ')}`}
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.8))' }}
                  />
                </svg>

                {/* Scanline effect */}
                <motion.div
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-0 right-0 h-px bg-[#8B5CF6]/20"
                />

                {/* Corner brackets */}
                <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-[#8B5CF6]/50" />
                <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-[#8B5CF6]/50" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-[#8B5CF6]/50" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-[#8B5CF6]/50" />
              </div>
            </div>

            {/* Pads Section */}
            <div className="border-b-2 border-[#1A1A1A]/10 p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/50">Sample Pads</span>
                <div className="flex-1 h-px bg-[#1A1A1A]/10" />
                <span className="text-[9px] tracking-wider uppercase text-[#1A1A1A]/30">
                  {pads.filter(p => p.loaded).length}/8 Loaded
                </span>
              </div>

              {/* 2x4 Pad Grid */}
              <div className="grid grid-cols-4 gap-3 max-w-xl mx-auto">
                {pads.map((pad, index) => (
                  <motion.button
                    key={pad.id}
                    onClick={() => handlePadClick(pad.id)}
                    whileTap={{ scale: 0.95 }}
                    className="relative aspect-square group"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.04 }}
                  >
                    {/* Pad base - hardware button style */}
                    <div
                      className={`absolute inset-0 transition-all duration-100 ${
                        activePad === pad.id ? 'translate-y-0.5' : ''
                      }`}
                      style={{
                        background: activePad === pad.id
                          ? 'linear-gradient(180deg, #8B5CF6 0%, #7C3AED 100%)'
                          : pad.loaded
                          ? 'linear-gradient(180deg, #3A3A3A 0%, #2A2A2A 100%)'
                          : 'linear-gradient(180deg, #4A4A4A 0%, #3A3A3A 100%)',
                        boxShadow: activePad === pad.id
                          ? 'inset 0 2px 4px rgba(0,0,0,0.3), 0 0 20px rgba(139, 92, 246, 0.5)'
                          : 'inset 0 -2px 0 rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 8px rgba(0,0,0,0.2)',
                        border: '1px solid rgba(0,0,0,0.3)'
                      }}
                    >
                      {/* Inner content */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {pad.loading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-[#8B5CF6] border-t-transparent rounded-full"
                          />
                        ) : pad.loaded ? (
                          <>
                            {/* Waveform indicator */}
                            {pad.waveformData && (
                              <div className="flex items-center gap-0.5 h-5 px-2">
                                {pad.waveformData.slice(0, 12).map((v, i) => (
                                  <motion.div
                                    key={i}
                                    className="w-0.5 rounded-full"
                                    style={{
                                      height: `${v * 100}%`,
                                      minHeight: 2,
                                      background: activePad === pad.id ? 'white' : '#8B5CF6',
                                      boxShadow: activePad === pad.id ? 'none' : '0 0 4px rgba(139, 92, 246, 0.5)'
                                    }}
                                    animate={activePad === pad.id ? { scaleY: [1, 1.3, 1] } : {}}
                                    transition={{ duration: 0.15 }}
                                  />
                                ))}
                              </div>
                            )}
                            <span className={`text-[8px] tracking-wider mt-1 truncate max-w-full px-2 ${
                              activePad === pad.id ? 'text-white' : 'text-white/60'
                            }`}>
                              {pad.label.toUpperCase()}
                            </span>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-6 h-6 border border-white/20 flex items-center justify-center">
                              <span className="text-white/30 text-lg leading-none">+</span>
                            </div>
                            <span className="text-[7px] text-white/30 tracking-wider">EMPTY</span>
                          </div>
                        )}
                      </div>

                      {/* Key binding indicator */}
                      <div className="absolute top-1.5 left-1.5 w-4 h-4 border border-white/20 flex items-center justify-center">
                        <span className="text-[9px] font-medium text-white/50">
                          {['1', '2', '3', '4', 'Q', 'W', 'E', 'R'][index]}
                        </span>
                      </div>

                      {/* Active LED */}
                      {pad.loaded && (
                        <motion.div
                          animate={activePad === pad.id ? { opacity: 1 } : { opacity: [0.3, 0.5, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                          style={{
                            background: activePad === pad.id ? '#fff' : '#8B5CF6',
                            boxShadow: activePad === pad.id
                              ? '0 0 8px rgba(255,255,255,0.8)'
                              : '0 0 6px rgba(139, 92, 246, 0.6)'
                          }}
                        />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Signal Chain Section */}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/50">Signal Chain</span>
                <div className="flex-1 h-px bg-[#1A1A1A]/10" />
              </div>

              {/* Effects Modules with Connections */}
              <div className="relative">
                {/* Connection line behind modules */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#8B5CF6]/20 via-[#8B5CF6]/60 to-[#8B5CF6]/20" style={{ transform: 'translateY(-50%)' }} />

                {/* Connection nodes */}
                <div className="absolute top-1/2 left-0 w-3 h-3 border-2 border-[#8B5CF6] bg-[#FAF8F2] rounded-full" style={{ transform: 'translate(-50%, -50%)' }} />
                <div className="absolute top-1/2 right-0 w-3 h-3 border-2 border-[#8B5CF6] bg-[#FAF8F2] rounded-full" style={{ transform: 'translate(50%, -50%)' }} />

                <div className="grid grid-cols-4 gap-4">
                  {/* Filter Module */}
                  <div className="relative bg-[#F8F6F0] border border-[#1A1A1A]/15 p-4" style={{ boxShadow: 'inset 0 1px 0 white, 0 2px 4px rgba(0,0,0,0.05)' }}>
                    {/* Input/Output nodes */}
                    <div className="absolute left-0 top-1/2 w-2 h-2 bg-[#8B5CF6] rounded-full" style={{ transform: 'translate(-50%, -50%)' }} />
                    <div className="absolute right-0 top-1/2 w-2 h-2 bg-[#8B5CF6] rounded-full" style={{ transform: 'translate(50%, -50%)' }} />

                    <div className="text-center mb-3">
                      <span className="text-[9px] font-semibold tracking-[0.15em] uppercase text-[#8B5CF6]">Filter</span>
                    </div>

                    {/* Frequency knob visual */}
                    <div className="flex flex-col items-center mb-3">
                      <div
                        className="w-12 h-12 rounded-full border-2 border-[#1A1A1A]/20 bg-gradient-to-b from-[#FAFAFA] to-[#E5E5E5] relative"
                        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 white' }}
                      >
                        <motion.div
                          className="absolute w-1 h-4 bg-[#8B5CF6] rounded-full left-1/2 top-1"
                          style={{
                            transformOrigin: 'center 20px',
                            transform: `translateX(-50%) rotate(${(effects.filter.freq / 20000) * 270 - 135}deg)`
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] tracking-wider uppercase text-[#1A1A1A]/40">Freq</span>
                        <span className="text-[9px] font-medium text-[#1A1A1A]/70">{Math.round(effects.filter.freq)}Hz</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="20000"
                        value={effects.filter.freq}
                        onChange={(e) => updateEffect('filter', 'freq', Number(e.target.value))}
                        className="w-full h-1.5 appearance-none bg-[#1A1A1A]/10 rounded-full cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #8B5CF6 ${(effects.filter.freq / 20000) * 100}%, rgba(0,0,0,0.1) ${(effects.filter.freq / 20000) * 100}%)`
                        }}
                      />
                    </div>
                  </div>

                  {/* Delay Module */}
                  <div className="relative bg-[#F8F6F0] border border-[#1A1A1A]/15 p-4" style={{ boxShadow: 'inset 0 1px 0 white, 0 2px 4px rgba(0,0,0,0.05)' }}>
                    <div className="absolute left-0 top-1/2 w-2 h-2 bg-[#8B5CF6] rounded-full" style={{ transform: 'translate(-50%, -50%)' }} />
                    <div className="absolute right-0 top-1/2 w-2 h-2 bg-[#8B5CF6] rounded-full" style={{ transform: 'translate(50%, -50%)' }} />

                    <div className="text-center mb-3">
                      <span className="text-[9px] font-semibold tracking-[0.15em] uppercase text-[#8B5CF6]">Delay</span>
                    </div>

                    <div className="flex flex-col items-center mb-3">
                      <div
                        className="w-12 h-12 rounded-full border-2 border-[#1A1A1A]/20 bg-gradient-to-b from-[#FAFAFA] to-[#E5E5E5] relative"
                        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 white' }}
                      >
                        <motion.div
                          className="absolute w-1 h-4 bg-[#8B5CF6] rounded-full left-1/2 top-1"
                          style={{
                            transformOrigin: 'center 20px',
                            transform: `translateX(-50%) rotate(${effects.delay.mix * 270 - 135}deg)`
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] tracking-wider uppercase text-[#1A1A1A]/40">Mix</span>
                        <span className="text-[9px] font-medium text-[#1A1A1A]/70">{Math.round(effects.delay.mix * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={effects.delay.mix * 100}
                        onChange={(e) => updateEffect('delay', 'mix', Number(e.target.value) / 100)}
                        className="w-full h-1.5 appearance-none bg-[#1A1A1A]/10 rounded-full cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #8B5CF6 ${effects.delay.mix * 100}%, rgba(0,0,0,0.1) ${effects.delay.mix * 100}%)`
                        }}
                      />
                    </div>
                  </div>

                  {/* Reverb Module */}
                  <div className="relative bg-[#F8F6F0] border border-[#1A1A1A]/15 p-4" style={{ boxShadow: 'inset 0 1px 0 white, 0 2px 4px rgba(0,0,0,0.05)' }}>
                    <div className="absolute left-0 top-1/2 w-2 h-2 bg-[#8B5CF6] rounded-full" style={{ transform: 'translate(-50%, -50%)' }} />
                    <div className="absolute right-0 top-1/2 w-2 h-2 bg-[#8B5CF6] rounded-full" style={{ transform: 'translate(50%, -50%)' }} />

                    <div className="text-center mb-3">
                      <span className="text-[9px] font-semibold tracking-[0.15em] uppercase text-[#8B5CF6]">Reverb</span>
                    </div>

                    <div className="flex flex-col items-center mb-3">
                      <div
                        className="w-12 h-12 rounded-full border-2 border-[#1A1A1A]/20 bg-gradient-to-b from-[#FAFAFA] to-[#E5E5E5] relative"
                        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 white' }}
                      >
                        <motion.div
                          className="absolute w-1 h-4 bg-[#8B5CF6] rounded-full left-1/2 top-1"
                          style={{
                            transformOrigin: 'center 20px',
                            transform: `translateX(-50%) rotate(${effects.reverb.mix * 270 - 135}deg)`
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] tracking-wider uppercase text-[#1A1A1A]/40">Mix</span>
                        <span className="text-[9px] font-medium text-[#1A1A1A]/70">{Math.round(effects.reverb.mix * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={effects.reverb.mix * 100}
                        onChange={(e) => updateEffect('reverb', 'mix', Number(e.target.value) / 100)}
                        className="w-full h-1.5 appearance-none bg-[#1A1A1A]/10 rounded-full cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #8B5CF6 ${effects.reverb.mix * 100}%, rgba(0,0,0,0.1) ${effects.reverb.mix * 100}%)`
                        }}
                      />
                    </div>
                  </div>

                  {/* Master Module */}
                  <div className="relative bg-[#1A1A1A] border border-[#8B5CF6]/30 p-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2), 0 0 20px rgba(139, 92, 246, 0.1)' }}>
                    <div className="absolute left-0 top-1/2 w-2 h-2 bg-[#8B5CF6] rounded-full" style={{ transform: 'translate(-50%, -50%)', boxShadow: '0 0 6px rgba(139, 92, 246, 0.8)' }} />

                    <div className="text-center mb-3">
                      <span className="text-[9px] font-semibold tracking-[0.15em] uppercase text-[#8B5CF6]">Master</span>
                    </div>

                    {/* VU Meter */}
                    <div className="flex justify-center gap-1 mb-3">
                      <div className="flex flex-col-reverse gap-0.5">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-8 h-1.5 rounded-sm"
                            style={{
                              background: i > 7 ? '#EF4444' : i > 5 ? '#F59E0B' : '#22C55E',
                              opacity: meterPercent > i * 10 ? 1 : 0.2,
                              boxShadow: meterPercent > i * 10 ? `0 0 4px ${i > 7 ? '#EF4444' : i > 5 ? '#F59E0B' : '#22C55E'}` : 'none'
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] tracking-wider uppercase text-white/40">Vol</span>
                        <span className="text-[9px] font-medium text-white/70">{effects.master.volume}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={effects.master.volume}
                        onChange={(e) => updateEffect('master', 'volume', Number(e.target.value))}
                        className="w-full h-1.5 appearance-none bg-white/10 rounded-full cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #8B5CF6 ${effects.master.volume}%, rgba(255,255,255,0.1) ${effects.master.volume}%)`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Panel - Footer */}
            <div className="border-t-2 border-[#1A1A1A]/10 px-6 py-3 flex justify-between items-center bg-[#EBE8E0]">
              <div className="flex items-center gap-4">
                <span className="text-[9px] tracking-wider uppercase text-[#1A1A1A]/40">Keys: 1-4, Q-R</span>
                <span className="text-[#1A1A1A]/20">|</span>
                <span className="text-[9px] tracking-wider uppercase text-[#1A1A1A]/40">Space: Stop</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] tracking-wider uppercase text-[#1A1A1A]/30">Member Exclusive</span>
                <div className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full" style={{ boxShadow: '0 0 4px rgba(139, 92, 246, 0.6)' }} />
              </div>
            </div>

            {/* Mounting holes - decorative */}
            <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-[#1A1A1A]/10 border border-[#1A1A1A]/5" />
            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#1A1A1A]/10 border border-[#1A1A1A]/5" />
            <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-[#1A1A1A]/10 border border-[#1A1A1A]/5" />
            <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-[#1A1A1A]/10 border border-[#1A1A1A]/5" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
