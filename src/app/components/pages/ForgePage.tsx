// ForgePage - Instrument Designer/Forge
// Create custom instruments with variable geometry, samples, and themes

import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Download, RotateCcw, Save } from 'lucide-react';
import { DesignerProvider, useDesigner } from '@/app/context/DesignerContext';
import {
  DesignerPreview,
  GeometrySection,
  SamplesSection,
  ThemeSection,
  SequencerSection,
  IdentitySection,
} from '@/app/components/designer';
import { COLORS } from '@/app/lib/instrument/constants';

function ForgeContent() {
  const { state, setActiveSection, setPreviewMode, save, exportJSON, reset } = useDesigner();
  const { activeSection, previewMode, isDirty } = state;

  const sections = [
    { id: 'geometry' as const, label: 'Shape' },
    { id: 'samples' as const, label: 'Samples' },
    { id: 'theme' as const, label: 'Theme' },
    { id: 'sequencer' as const, label: 'Sequence' },
    { id: 'identity' as const, label: 'Identity' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#1A1A1A]">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 md:py-6 flex justify-between items-center"
        style={{ background: 'linear-gradient(to bottom, #FAF8F2 0%, transparent 100%)' }}
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-[10px] md:text-xs tracking-[0.15em] uppercase opacity-50 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-3 md:w-4 h-3 md:h-4" />
          <span className="hidden sm:inline">Return</span>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-2.5 md:w-3 h-2.5 md:h-3 border border-[#1A1A1A]/20 rotate-45" />
          <span className="text-[8px] md:text-[10px] tracking-[0.2em] uppercase opacity-40">
            Forge
          </span>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={reset}
            className="p-2 rounded-lg opacity-30 hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Reset"
          >
            <RotateCcw size={14} />
          </motion.button>
          <motion.button
            onClick={exportJSON}
            className="p-2 rounded-lg opacity-30 hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Export JSON"
          >
            <Download size={14} />
          </motion.button>
          <motion.button
            onClick={save}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] tracking-wider uppercase transition-all"
            style={{
              background: isDirty ? COLORS.violet : `${COLORS.ink}10`,
              color: isDirty ? COLORS.paper : COLORS.ink,
              opacity: isDirty ? 1 : 0.4,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save size={12} />
            <span className="hidden sm:inline">Save</span>
          </motion.button>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-20 pb-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            {/* Left Panel - Controls */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="lg:w-80 space-y-6"
            >
              {/* Section Tabs */}
              <div className="flex flex-wrap gap-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className="px-3 py-1.5 rounded-lg text-[9px] tracking-[0.15em] uppercase transition-all"
                    style={{
                      background: activeSection === section.id ? `${COLORS.violet}15` : 'transparent',
                      color: activeSection === section.id ? COLORS.violet : COLORS.ink,
                      opacity: activeSection === section.id ? 1 : 0.4,
                    }}
                  >
                    {section.label}
                  </button>
                ))}
              </div>

              {/* Active Section Content */}
              <div
                className="p-4 rounded-xl"
                style={{
                  background: `${COLORS.ink}02`,
                  border: `1px solid ${COLORS.ink}05`,
                }}
              >
                {activeSection === 'geometry' && <GeometrySection />}
                {activeSection === 'samples' && <SamplesSection />}
                {activeSection === 'theme' && <ThemeSection />}
                {activeSection === 'sequencer' && <SequencerSection />}
                {activeSection === 'identity' && <IdentitySection />}
              </div>

              {/* Mode Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewMode('edit')}
                  className="flex-1 py-2 rounded-lg text-[10px] tracking-wider uppercase transition-all"
                  style={{
                    background: previewMode === 'edit' ? COLORS.violet : 'transparent',
                    color: previewMode === 'edit' ? COLORS.paper : COLORS.ink,
                    opacity: previewMode === 'edit' ? 1 : 0.3,
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => setPreviewMode('play')}
                  className="flex-1 py-2 rounded-lg text-[10px] tracking-wider uppercase transition-all"
                  style={{
                    background: previewMode === 'play' ? COLORS.violet : 'transparent',
                    color: previewMode === 'play' ? COLORS.paper : COLORS.ink,
                    opacity: previewMode === 'play' ? 1 : 0.3,
                  }}
                >
                  Preview
                </button>
              </div>
            </motion.div>

            {/* Right Panel - Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex-1 flex items-center justify-center py-8"
            >
              <DesignerPreview />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
        <span
          className="text-[8px] tracking-[0.2em] uppercase"
          style={{ color: COLORS.ink, opacity: 0.15 }}
        >
          Design your instrument
        </span>
      </div>
    </div>
  );
}

export function ForgePage() {
  return (
    <DesignerProvider>
      <ForgeContent />
    </DesignerProvider>
  );
}
