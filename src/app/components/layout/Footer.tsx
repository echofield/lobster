import { Link } from 'react-router';

export function Footer() {
  return (
    <footer className="px-6 py-12 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <span className="font-serif text-xl tracking-tight">Lobster</span>
            <p className="text-sm text-muted-foreground max-w-xs">
              A private sonic archive. Curated sound, delivered through touch.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div className="space-y-3">
              <span className="small-caps">Access</span>
              <div className="flex flex-col gap-2">
                <Link to="/card" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Member Card
                </Link>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </div>
            </div>
            <div className="space-y-3">
              <span className="small-caps">Legal</span>
              <div className="flex flex-col gap-2">
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms
                </Link>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-border flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {new Date().getFullYear()} Lobster Studio
          </span>
          <span className="narrator">
            Sound is access
          </span>
        </div>
      </div>
    </footer>
  );
}
