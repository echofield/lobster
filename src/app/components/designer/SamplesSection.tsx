// SamplesSection - Sample slot management

import { useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, X } from 'lucide-react';
import { useDesigner } from '@/app/context/DesignerContext';
import { COLORS } from '@/app/lib/instrument/constants';
import { KEY_MAPS } from '@/app/lib/designer/types';

export function SamplesSection() {
  const { state, setSampleLabel, setSampleLoaded, clearSample, setSelectedNode } = useDesigner();
  const { pack, selectedNodeIndex } = state;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const keyLabels = KEY_MAPS[pack.geometry.nodeCount];

  const handleFileSelect = async (index: number, file: File) => {
    // Generate simple waveform preview (8 random values for demo)
    const waveform = Array.from({ length: 16 }, () => Math.random() * 0.5 + 0.3);
    setSampleLoaded(index, waveform);
    setSampleLabel(index, file.name.replace(/\.[^/.]+$/, '').slice(0, 12));
  };

  const handleUploadClick = (index: number) => {
    setSelectedNode(index);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedNodeIndex !== null) {
      handleFileSelect(selectedNodeIndex, file);
    }
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="text-[9px] tracking-[0.2em] uppercase opacity-40">
        Samples ({pack.samples.length})
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1">
        {pack.samples.map((sample, index) => {
          const isSelected = selectedNodeIndex === index;
          const isLoaded = sample.loaded;

          return (
            <motion.div
              key={sample.id}
              className="relative p-2 rounded-lg transition-all"
              style={{
                background: isSelected ? `${COLORS.violet}08` : `${COLORS.ink}03`,
                border: `1px solid ${isSelected ? COLORS.violet : COLORS.ink}`,
                borderOpacity: isSelected ? 0.3 : 0.05,
              }}
              whileHover={{ scale: 1.01 }}
            >
              {/* Key label */}
              <div
                className="absolute top-1 left-2 text-[8px] font-mono opacity-30"
                style={{ color: COLORS.ink }}
              >
                {keyLabels[index]}
              </div>

              {/* Clear button */}
              {isLoaded && (
                <button
                  onClick={() => clearSample(index)}
                  className="absolute top-1 right-1 p-0.5 rounded opacity-30 hover:opacity-100 transition-opacity"
                >
                  <X size={10} style={{ color: COLORS.ink }} />
                </button>
              )}

              <div className="pt-3 space-y-2">
                {/* Waveform or upload */}
                <div
                  className="h-8 rounded flex items-center justify-center cursor-pointer"
                  style={{
                    background: isLoaded ? `${pack.colors.primary}15` : `${COLORS.ink}05`,
                  }}
                  onClick={() => handleUploadClick(index)}
                >
                  {isLoaded && sample.waveformData ? (
                    <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                      {sample.waveformData.map((v, i) => (
                        <rect
                          key={i}
                          x={i * (100 / sample.waveformData!.length)}
                          y={15 - v * 12}
                          width={100 / sample.waveformData!.length - 1}
                          height={v * 24}
                          fill={pack.colors.primary}
                          opacity={0.6}
                        />
                      ))}
                    </svg>
                  ) : (
                    <Upload size={12} style={{ color: COLORS.ink, opacity: 0.2 }} />
                  )}
                </div>

                {/* Label input */}
                <input
                  type="text"
                  value={sample.label}
                  onChange={(e) => setSampleLabel(index, e.target.value)}
                  className="w-full bg-transparent text-[10px] tracking-wider text-center outline-none"
                  style={{ color: COLORS.ink, opacity: isLoaded ? 0.8 : 0.4 }}
                  placeholder="Sample name"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="text-[8px] opacity-30 text-center">
        Click slots to upload audio files
      </div>
    </div>
  );
}
