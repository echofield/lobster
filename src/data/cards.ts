/**
 * Lobster Member Card Data
 * Mock data for the NFC membership cards
 */

export interface MemberCard {
  id: string;
  name: string;
  edition: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  unlocks: string[];
  limited: boolean;
  totalSupply?: number;
  remaining?: number;
  image?: string;
}

export interface Drop {
  id: string;
  title: string;
  artist: string;
  description: string;
  type: 'pack' | 'single' | 'collection';
  trackCount: number;
  duration: string;
  releaseDate: string;
  exclusive: boolean;
  cover?: string;
  samples?: Sample[];
}

export interface Sample {
  id: string;
  name: string;
  duration: string;
  bpm?: number;
  key?: string;
}

// Member Cards
export const memberCards: MemberCard[] = [
  {
    id: 'founding-member',
    name: 'Founding Member',
    edition: 'Genesis Edition',
    description: 'The original Lobster access card. Tap to enter a curated sonic universe. Reserved for those who arrived early.',
    price: 149,
    currency: 'EUR',
    features: [
      'NFC-enabled physical card',
      'Lifetime access to member drops',
      'Early access to new releases',
      'Exclusive founder editions'
    ],
    unlocks: [
      'All current drops',
      'Monthly curated packs',
      'Founder-only releases',
      'Future studio features'
    ],
    limited: true,
    totalSupply: 500,
    remaining: 127
  },
  {
    id: 'studio-access',
    name: 'Studio Access',
    edition: 'Standard Edition',
    description: 'Your key to the Lobster archive. A physical connection to sound, delivered through touch.',
    price: 89,
    currency: 'EUR',
    features: [
      'NFC-enabled physical card',
      'Access to member drops',
      'Quarterly releases'
    ],
    unlocks: [
      'All current drops',
      'Quarterly curated packs'
    ],
    limited: false
  }
];

// Sample Drops (what the card unlocks)
export const drops: Drop[] = [
  {
    id: 'mineral-textures',
    title: 'Mineral Textures',
    artist: 'Lobster Studio',
    description: 'Granular soundscapes derived from geological recordings. Earth frequencies translated into usable textures.',
    type: 'pack',
    trackCount: 24,
    duration: '18:42',
    releaseDate: '2024-03',
    exclusive: true,
    samples: [
      { id: '1', name: 'Sediment Flow', duration: '0:48', bpm: 92, key: 'Am' },
      { id: '2', name: 'Crystal Resonance', duration: '0:52', bpm: 78 },
      { id: '3', name: 'Pressure Point', duration: '0:41', bpm: 110, key: 'Dm' },
      { id: '4', name: 'Erosion Pattern', duration: '0:38', bpm: 85 },
      { id: '5', name: 'Deep Strata', duration: '0:55', bpm: 65, key: 'Fm' }
    ]
  },
  {
    id: 'night-signals',
    title: 'Night Signals',
    artist: 'Lobster Studio',
    description: 'Captured transmissions from the quiet hours. Radio artifacts and nocturnal frequencies.',
    type: 'pack',
    trackCount: 18,
    duration: '14:23',
    releaseDate: '2024-02',
    exclusive: true,
    samples: [
      { id: '1', name: 'Static Bloom', duration: '0:44', bpm: 88 },
      { id: '2', name: 'Carrier Wave', duration: '0:51', bpm: 120, key: 'Cm' },
      { id: '3', name: 'Distant Station', duration: '0:47', bpm: 95 }
    ]
  },
  {
    id: 'studio-percussion',
    title: 'Studio Percussion Vol. 1',
    artist: 'Lobster Studio',
    description: 'Essential percussive elements recorded in controlled environments. Clean, processed, ready.',
    type: 'pack',
    trackCount: 42,
    duration: '8:15',
    releaseDate: '2024-01',
    exclusive: false,
    samples: [
      { id: '1', name: 'Kick - Warm', duration: '0:02', bpm: 128 },
      { id: '2', name: 'Kick - Tight', duration: '0:02', bpm: 128 },
      { id: '3', name: 'Snare - Room', duration: '0:03' },
      { id: '4', name: 'Hi-Hat - Closed', duration: '0:01' }
    ]
  }
];

// Get card by ID
export function getCardById(id: string): MemberCard | undefined {
  return memberCards.find(card => card.id === id);
}

// Get drop by ID
export function getDropById(id: string): Drop | undefined {
  return drops.find(drop => drop.id === id);
}

// Get all featured drops
export function getFeaturedDrops(): Drop[] {
  return drops.filter(drop => drop.exclusive);
}
