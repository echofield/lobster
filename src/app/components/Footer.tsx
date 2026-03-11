import { Link } from 'react-router';
import logoImage from 'figma:asset/1c3c553c4e7f23b71d55815d2e9d693b4379d431.png';

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <img src={logoImage} alt="Logo" className="h-16 mb-8 brightness-0 invert" />
            <p className="text-sm text-neutral-400">© All rights reserved.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <Link to="/" className="block text-sm text-neutral-300 hover:text-white transition-colors">
                Our Collection
              </Link>
              <Link to="/membership" className="block text-sm text-neutral-300 hover:text-white transition-colors">
                Membership
              </Link>
              <Link to="/about" className="block text-sm text-neutral-300 hover:text-white transition-colors">
                About Us
              </Link>
              <Link to="/faq" className="block text-sm text-neutral-300 hover:text-white transition-colors">
                Help and Support
              </Link>
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 rounded transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 rounded transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 rounded transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 rounded transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-wrap gap-6 text-xs text-neutral-500">
          <Link to="/terms" className="hover:text-neutral-300 transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-neutral-300 transition-colors">Privacy Policy</Link>
          <Link to="/cookies" className="hover:text-neutral-300 transition-colors">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
