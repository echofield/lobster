import { Outlet } from 'react-router';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { Toaster } from '../ui/sonner';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Nav />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}
