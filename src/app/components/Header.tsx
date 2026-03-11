import { Link } from 'react-router';
import { Search, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import logoImage from 'figma:asset/1c3c553c4e7f23b71d55815d2e9d693b4379d431.png';

export function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center">
              <img src={logoImage} alt="Lobster Studio" className="h-8" />
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm text-neutral-700 hover:text-neutral-900 transition-colors">
                Our Collection
              </Link>
              <Link to="/creative-lab" className="text-sm text-neutral-700 hover:text-neutral-900 transition-colors">
                Creative Lab
              </Link>
              <Link to="/membership" className="text-sm text-neutral-700 hover:text-neutral-900 transition-colors">
                Membership
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <Search className="w-5 h-5 text-neutral-700" />
            </button>
            
            <Button variant="ghost" size="sm" className="gap-2">
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Cart</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
