import { Link } from 'react-router';
import { motion } from 'motion/react';

export function Nav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-5 flex items-center justify-between"
    >
      {/* Logo */}
      <Link
        to="/"
        className="text-ink hover:opacity-70 transition-opacity duration-300"
      >
        <span className="font-serif text-xl tracking-tight">Lobster</span>
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-8">
        <Link
          to="/card"
          className="small-caps hover:opacity-100 opacity-60 transition-opacity duration-300"
        >
          Member Card
        </Link>
        <Link
          to="/about"
          className="small-caps hover:opacity-100 opacity-60 transition-opacity duration-300"
        >
          About
        </Link>
      </nav>
    </motion.header>
  );
}
