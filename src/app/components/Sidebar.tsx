import { Link, useLocation } from 'react-router';
import { Music, Mic2, Sparkles, Folder } from 'lucide-react';
import { cn } from './ui/utils';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className={cn("w-64 border-r border-neutral-200 bg-white h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto", className)}>
      <nav className="p-6 space-y-2">
        <Link
          to="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
            isActive('/') ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:bg-neutral-50"
          )}
        >
          <Folder className="w-4 h-4" />
          All Packs
        </Link>
        
        <Link
          to="/samples"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
            isActive('/samples') ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:bg-neutral-50"
          )}
        >
          <Music className="w-4 h-4" />
          Samples
        </Link>

        <Link
          to="/instrumentals"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
            isActive('/instrumentals') ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:bg-neutral-50"
          )}
        >
          <Mic2 className="w-4 h-4" />
          Instrumentals
        </Link>

        <Link
          to="/unique-sounds"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
            isActive('/unique-sounds') ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:bg-neutral-50"
          )}
        >
          <Sparkles className="w-4 h-4" />
          Unique Sounds
        </Link>
      </nav>
    </aside>
  );
}
