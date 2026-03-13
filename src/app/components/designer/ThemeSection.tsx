// ThemeSection - Color theme selection

import { motion } from 'motion/react';
import { useDesigner } from '@/app/context/DesignerContext';
import { COLORS } from '@/app/lib/instrument/constants';
import { COLOR_PRESETS } from '@/app/lib/designer/types';

export function ThemeSection() {
  const { state, setColor } = useDesigner();
  const { colors } = state.pack;

  const applyPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setColor('primary', preset.primary);
    setColor('accent', preset.accent);
    setColor('glow', preset.glow);
  };

  return (
    <div className="space-y-4">
      <div className="text-[9px] tracking-[0.2em] uppercase opacity-40">
        Theme
      </div>

      {/* Preset swatches */}
      <div className="flex gap-2">
        {COLOR_PRESETS.map((preset) => {
          const isActive = colors.primary === preset.primary;
          return (
            <motion.button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className="relative w-10 h-10 rounded-full transition-all"
              style={{
                background: `linear-gradient(135deg, ${preset.accent} 0%, ${preset.primary} 100%)`,
                boxShadow: isActive ? `0 0 0 2px ${COLORS.paper}, 0 0 0 3px ${preset.primary}` : 'none',
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title={preset.name}
            />
          );
        })}
      </div>

      {/* Custom color inputs */}
      <div className="space-y-3">
        <ColorInput
          label="Primary"
          value={colors.primary}
          onChange={(v) => setColor('primary', v)}
        />
        <ColorInput
          label="Accent"
          value={colors.accent}
          onChange={(v) => setColor('accent', v)}
        />
      </div>

      {/* Preview swatch */}
      <div className="flex items-center gap-3">
        <div
          className="w-full h-8 rounded-lg"
          style={{
            background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.accent} 50%, ${colors.glow} 100%)`,
          }}
        />
      </div>
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="text-[9px] tracking-wider uppercase w-16"
        style={{ color: COLORS.ink, opacity: 0.4 }}
      >
        {label}
      </span>
      <div className="flex items-center gap-2 flex-1">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-6 h-6 rounded cursor-pointer border-0 p-0"
          style={{ background: 'transparent' }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-[10px] font-mono tracking-wider outline-none"
          style={{ color: COLORS.ink, opacity: 0.6 }}
        />
      </div>
    </div>
  );
}
