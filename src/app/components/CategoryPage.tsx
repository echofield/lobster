import { useLocation } from 'react-router';
import { AlbumCard } from './AlbumCard';

const SAMPLE_ALBUMS = [
  {
    id: '1',
    title: 'Lobster Drums Vol.1',
    artist: 'Lobster Studio',
    coverImage: 'https://images.unsplash.com/photo-1768936919311-58724077d894?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: 29,
  },
  {
    id: '2',
    title: 'Tape FX',
    artist: 'Lobster Studio',
    coverImage: 'https://images.unsplash.com/photo-1616663395403-2e0052b8e595?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: 24,
  },
  {
    id: '3',
    title: 'Paris Night Textures',
    artist: 'Lobster Studio',
    coverImage: 'https://images.unsplash.com/photo-1565928472362-fe784a95fe7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: 35,
  },
  {
    id: '4',
    title: 'Analog Bass Toolkit',
    artist: 'Lobster Studio',
    coverImage: 'https://images.unsplash.com/photo-1759266039439-0eb91a98e050?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: 32,
  },
  {
    id: '5',
    title: 'Vintage Keys Collection',
    artist: 'Lobster Studio',
    coverImage: 'https://images.unsplash.com/photo-1600148272607-7bbf03a40d3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: 39,
  },
  {
    id: '6',
    title: 'Lo-Fi Essentials',
    artist: 'Lobster Studio',
    coverImage: 'https://images.unsplash.com/photo-1768936919311-58724077d894?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: 27,
  },
  {
    id: '7',
    title: 'Studio Percussion',
    artist: 'Lobster Studio',
    coverImage: 'https://images.unsplash.com/photo-1616663395403-2e0052b8e595?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: 28,
  },
  {
    id: '8',
    title: 'Modular Synth Pack',
    artist: 'Lobster Studio',
    coverImage: 'https://images.unsplash.com/photo-1565928472362-fe784a95fe7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: 42,
  },
];

export function CategoryPage() {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/samples') return 'Sample Packs';
    if (path === '/instrumentals') return 'Instrumentals';
    if (path === '/unique-sounds') return 'Unique Sounds';
    if (path === '/creative-lab') return 'Creative Lab';
    if (path === '/membership') return 'Membership';
    if (path === '/about') return 'About Lobster Studio';
    if (path === '/terms') return 'Terms of Service';
    if (path === '/privacy') return 'Privacy Policy';
    return 'Browse Packs';
  };

  const getPageDescription = () => {
    const path = location.pathname;
    if (path === '/samples') return 'High-quality sample packs recorded at Lobster Studio';
    if (path === '/instrumentals') return 'Full instrumental tracks ready for your projects';
    if (path === '/unique-sounds') return 'One-of-a-kind sounds you won\'t find anywhere else';
    if (path === '/creative-lab') return 'Experimental sounds and creative tools';
    if (path === '/membership') return 'Get unlimited access to our entire catalog';
    return 'Discover premium audio samples';
  };

  return (
    <div className="flex-1 px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-medium mb-2">{getPageTitle()}</h1>
        <p className="text-neutral-600">{getPageDescription()}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {SAMPLE_ALBUMS.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    </div>
  );
}
