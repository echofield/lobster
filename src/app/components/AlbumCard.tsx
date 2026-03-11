import { Link } from 'react-router';
import { Badge } from './ui/badge';
import { Play } from 'lucide-react';

interface Album {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  price?: number;
  tag?: string;
}

interface AlbumCardProps {
  album: Album;
}

export function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Link to={`/pack/${album.id}`} className="group cursor-pointer">
      <div className="relative aspect-square mb-3 overflow-hidden rounded-lg bg-neutral-100">
        <img
          src={album.coverImage}
          alt={album.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {album.tag && (
          <Badge className="absolute top-2 right-2 bg-black text-white text-xs">
            {album.tag}
          </Badge>
        )}
        {album.price && (
          <Badge className="absolute bottom-2 left-2 bg-white text-black text-xs font-medium">
            €{album.price}
          </Badge>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <Play className="w-5 h-5 text-black fill-black ml-0.5" />
          </div>
        </div>
      </div>
      <h4 className="text-sm font-medium text-neutral-900 truncate mb-1">{album.title}</h4>
      <p className="text-xs text-neutral-500 truncate">{album.artist}</p>
    </Link>
  );
}
