// IdentitySection - Instrument name and subtitle

import { useDesigner } from '@/app/context/DesignerContext';
import { COLORS } from '@/app/lib/instrument/constants';

export function IdentitySection() {
  const { state, setTitle, setSubtitle } = useDesigner();
  const { title, subtitle } = state.pack;

  return (
    <div className="space-y-4">
      <div className="text-[9px] tracking-[0.2em] uppercase opacity-40">
        Identity
      </div>

      <div className="space-y-3">
        {/* Title */}
        <div className="space-y-1">
          <label
            className="text-[8px] tracking-wider uppercase block"
            style={{ color: COLORS.ink, opacity: 0.3 }}
          >
            Name
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Instrument name"
            maxLength={24}
            className="w-full px-3 py-2 text-sm tracking-wide rounded-lg outline-none transition-all"
            style={{
              background: `${COLORS.ink}05`,
              color: COLORS.ink,
              border: `1px solid ${COLORS.ink}10`,
            }}
          />
        </div>

        {/* Subtitle */}
        <div className="space-y-1">
          <label
            className="text-[8px] tracking-wider uppercase block"
            style={{ color: COLORS.ink, opacity: 0.3 }}
          >
            Subtitle
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Description or theme"
            maxLength={32}
            className="w-full px-3 py-2 text-xs tracking-wide rounded-lg outline-none transition-all"
            style={{
              background: `${COLORS.ink}05`,
              color: COLORS.ink,
              opacity: 0.7,
              border: `1px solid ${COLORS.ink}10`,
            }}
          />
        </div>
      </div>

      {/* Preview card */}
      <div
        className="p-4 rounded-lg text-center"
        style={{
          background: `linear-gradient(135deg, ${state.pack.colors.primary}10 0%, ${state.pack.colors.accent}10 100%)`,
          border: `1px solid ${state.pack.colors.primary}20`,
        }}
      >
        <div
          className="text-sm font-medium tracking-wider"
          style={{ color: state.pack.colors.primary }}
        >
          {title || 'Untitled'}
        </div>
        <div
          className="text-[10px] tracking-wider uppercase mt-1"
          style={{ color: COLORS.ink, opacity: 0.4 }}
        >
          {subtitle || 'New Instrument'}
        </div>
      </div>
    </div>
  );
}
