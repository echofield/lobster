import { AlbumCard } from './AlbumCard';
import { Badge } from './ui/badge';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

const HERO_BANNER = {
  title: "Classic Disco Breaks",
  description: "Authentic vinyl samples from the golden era",
  image: "https://images.unsplash.com/photo-1767482483140-701bb88c8f44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
};

const NEW_RELEASES = [
  {
    id: '1',
    title: 'Lobster Drums Vol.1',
    artist: 'Lobster Studio',
    coverImage: 'https://images.unsplash.com/photo-1768936919311-58724077d894?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: 29,
    tag: 'NEW'
  },
  {
    id: '2',
    title: 'Tape FX',
    artist: 'Lobster Studio',
    coverImage: 'https://images.unsplash.com/photo-1616663395403-2e0052b8e595?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: 24,
    tag: 'NEW'
  },
  {
    id: '3',
    title: 'Paris Night Textures',
    artist: 'Lobster Studio',
    coverImage: 'https://images.unsplash.com/photo-1565928472362-fe784a95fe7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: 35,
    tag: 'NEW'
  },
  {
    id: '4',
    title: 'Analog Bass Toolkit',
    artist: 'Lobster Studio',
    coverImage: 'https://images.unsplash.com/photo-1759266039439-0eb91a98e050?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: 32,
    tag: 'NEW'
  },
  {
    id: '5',
    title: 'Vintage Keys Collection',
    artist: 'Lobster Studio',
    coverImage: 'https://images.unsplash.com/photo-1600148272607-7bbf03a40d3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: 39,
    tag: 'NEW'
  },
];

const SAMPLE_PACKS = [
  {
    id: '6',
    title: 'Lo-Fi Essentials',
    artist: 'Lobster Studio',
    coverImage: 'https://images.unsplash.com/photo-1768936919311-58724077d894?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: 27
  },
  {
    id: '7',
    title: 'Studio Percussion',
    artist: 'Lobster Studio',
    coverImage: 'https://images.unsplash.com/photo-1616663395403-2e0052b8e595?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: 28
  },
  {
    id: '8',
    title: 'Modular Synth Pack',
    artist: 'Lobster Studio',
    coverImage: 'https://images.unsplash.com/photo-1565928472362-fe784a95fe7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: 42
  },
  {
    id: '9',
    title: 'Ambient Atmospheres',
    artist: 'Lobster Studio',
    coverImage: 'https://images.unsplash.com/photo-1759266039439-0eb91a98e050?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: 36
  },
  {
    id: '10',
    title: 'Vocal Chops & FX',
    artist: 'Lobster Studio',
    coverImage: 'https://images.unsplash.com/photo-1600148272607-7bbf03a40d3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: 31
  },
];

export function CatalogPage() {
  return (
    <div className="flex-1">
      {/* Hero Banner */}
      <div className="relative h-64 mb-8 overflow-hidden">
        <img
          src={HERO_BANNER.image}
          alt={HERO_BANNER.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <h2 className="text-3xl font-medium text-white mb-2">{HERO_BANNER.title}</h2>
          <p className="text-white/90 mb-3">{HERO_BANNER.description}</p>
          <div className="flex gap-2">
            <Badge className="bg-white/90 text-black hover:bg-white">Hip-Hop</Badge>
            <Badge className="bg-white/90 text-black hover:bg-white">Disco</Badge>
            <Badge className="bg-white/90 text-black hover:bg-white">Funk</Badge>
            <Badge className="bg-white/90 text-black hover:bg-white">Soul</Badge>
          </div>
        </div>
      </div>

      <div className="px-6 pb-12 space-y-12">
        {/* New Releases */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-medium">New releases</h3>
            <Link to="/samples" className="flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900">
              See more
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {NEW_RELEASES.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>

        {/* Sample Packs */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-medium">Sample packs</h3>
            <Link to="/samples" className="flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900">
              See more
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {SAMPLE_PACKS.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>

        {/* Instrumentals */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-medium">Instrumentals</h3>
            <Link to="/instrumentals" className="flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900">
              See more
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {NEW_RELEASES.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>

        {/* Unique Sounds */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-medium">Unique Sounds</h3>
            <Link to="/unique-sounds" className="flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900">
              See more
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {SAMPLE_PACKS.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
