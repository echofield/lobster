import { Outlet } from 'react-router';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Toaster } from './ui/sonner';

export function Root() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}
