// Designer Storage - Persistence and export utilities

import type { DesignerInstrumentPack } from './types';

const STORAGE_KEY = 'lobster-instruments';

/**
 * Save an instrument to localStorage
 */
export function saveInstrument(pack: DesignerInstrumentPack): void {
  const instruments = loadInstruments();
  const existingIndex = instruments.findIndex((i) => i.id === pack.id);

  const updatedPack = {
    ...pack,
    updatedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    instruments[existingIndex] = updatedPack;
  } else {
    instruments.push(updatedPack);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(instruments));
}

/**
 * Load all saved instruments from localStorage
 */
export function loadInstruments(): DesignerInstrumentPack[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Load a specific instrument by ID
 */
export function loadInstrument(id: string): DesignerInstrumentPack | null {
  const instruments = loadInstruments();
  return instruments.find((i) => i.id === id) ?? null;
}

/**
 * Delete an instrument from localStorage
 */
export function deleteInstrument(id: string): void {
  const instruments = loadInstruments();
  const filtered = instruments.filter((i) => i.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Export instrument as JSON file download
 */
export function exportAsJSON(pack: DesignerInstrumentPack): void {
  const dataStr = JSON.stringify(pack, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${pack.id || 'instrument'}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import instrument from JSON file
 */
export async function importFromJSON(file: File): Promise<DesignerInstrumentPack> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        // Validate required fields
        if (!data.id || !data.title || !data.samples || !data.geometry) {
          throw new Error('Invalid instrument file');
        }
        resolve(data as DesignerInstrumentPack);
      } catch (err) {
        reject(new Error('Failed to parse instrument file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Generate a URL-safe ID from a title
 */
export function generateId(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const suffix = Date.now().toString(36).slice(-4);
  return `${slug}-${suffix}`;
}
