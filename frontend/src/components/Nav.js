import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      data-testid="main-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-[#0F0E0E]/70 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 md:px-16 py-5">
        <Link to="/" data-testid="logo-link" className="font-serif text-2xl md:text-3xl font-light tracking-tight text-[#F3F0EC]">
          Lumière<span className="text-[#C19277]">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-10 font-sans text-sm">
          <a href="/#services" data-testid="nav-services" className="hover-underline text-[#F3F0EC]/85 hover:text-[#F3F0EC] transition-colors">Services</a>
          <a href="/#portfolio" data-testid="nav-portfolio" className="hover-underline text-[#F3F0EC]/85 hover:text-[#F3F0EC] transition-colors">Portfolio</a>
          <a href="/#artists" data-testid="nav-artists" className="hover-underline text-[#F3F0EC]/85 hover:text-[#F3F0EC] transition-colors">Artists</a>
          <a href="/#contact" data-testid="nav-contact" className="hover-underline text-[#F3F0EC]/85 hover:text-[#F3F0EC] transition-colors">Contact</a>
        </div>

        <Link
          to="/booking"
          data-testid="nav-book-btn"
          className="hidden md:inline-flex bg-[#C19277] text-[#0F0E0E] px-6 py-3 text-xs tracking-wider uppercase hover:bg-[#A67A60] transition-colors duration-500"
        >
          Book now
        </Link>

        <button
          data-testid="mobile-menu-btn"
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#F3F0EC] text-2xl"
          aria-label="Toggle menu"
        >
          {open ? "×" : "☰"}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#0F0E0E]/95 backdrop-blur-xl border-t border-white/5 overflow-hidden"
          >
            <div className="flex flex-col gap-6 px-6 py-8 font-sans text-base">
              <a onClick={() => setOpen(false)} href="/#services" className="text-[#F3F0EC]">Services</a>
              <a onClick={() => setOpen(false)} href="/#portfolio" className="text-[#F3F0EC]">Portfolio</a>
              <a onClick={() => setOpen(false)} href="/#artists" className="text-[#F3F0EC]">Artists</a>
              <a onClick={() => setOpen(false)} href="/#contact" className="text-[#F3F0EC]">Contact</a>
              <Link to="/booking" onClick={() => setOpen(false)} className="inline-block bg-[#C19277] text-[#0F0E0E] px-6 py-3 text-xs tracking-wider uppercase w-fit">
                Book now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
