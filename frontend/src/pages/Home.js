import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { getServices, getStylists } from "@/lib/api";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ServicesList from "@/components/ServicesList";
import Portfolio from "@/components/Portfolio";
import Stylists from "@/components/Stylists";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 100]);

  useEffect(() => {
    getServices().then(setServices).catch(() => {});
    getStylists().then(setStylists).catch(() => {});
  }, []);

  return (
    <div data-testid="home-page">
      <Nav />

      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden" data-testid="hero-section">
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0F0E0E]/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0F0E0E]" />
        </motion.div>

        <div className="relative z-10 min-h-screen flex flex-col justify-end pb-24 md:pb-32 px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl"
          >
            <p className="overline mb-8" data-testid="hero-overline">Est. 2019 — Mumbai · Delhi · Bengaluru</p>
            <h1 className="h-fluid font-serif font-light text-[#F3F0EC] mb-8">
              Nails, treated<br />
              as <em className="text-[#C19277]">quiet</em> art.
            </h1>
            <p className="font-sans text-base md:text-lg text-[#A6A19C] max-w-xl leading-relaxed mb-12">
              A hand-crafted atelier for editorial manicures, bespoke nail art,
              and the kind of finish that feels quietly extraordinary.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/booking"
                data-testid="hero-book-btn"
                className="group inline-flex items-center gap-3 bg-[#C19277] text-[#0F0E0E] px-8 py-4 font-sans text-sm tracking-wider uppercase hover:bg-[#A67A60] transition-colors duration-500"
              >
                Book an appointment
                <span className="inline-block group-hover:translate-x-1 transition-transform duration-500">→</span>
              </Link>
              <a
                href="#services"
                data-testid="hero-services-link"
                className="group inline-flex items-center gap-3 border border-[#F3F0EC]/30 text-[#F3F0EC] px-8 py-4 font-sans text-sm tracking-wider uppercase hover:border-[#C19277] hover:text-[#C19277] transition-colors duration-500"
              >
                View services
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="py-32 md:py-40 px-6 md:px-16 border-t border-[#2A2828]" data-testid="manifesto-section">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-4">
            <p className="overline mb-6">The Atelier</p>
          </div>
          <div className="md:col-span-8">
            <h2 className="font-serif font-light text-4xl md:text-5xl leading-tight tracking-tight mb-8 text-[#F3F0EC]">
              We treat every hand like a canvas — deliberate, unhurried, honest.
            </h2>
            <p className="font-sans text-[#A6A19C] leading-relaxed max-w-2xl">
              Three artists. Six chairs. One quiet room in Bandra West. Our work
              lives at the intersection of couture technique and modern restraint.
              No rush. No noise. Only the nail, the light, and the artist.
            </p>
          </div>
        </div>
      </section>

      <ServicesList services={services} />
      <Portfolio />
      <Stylists stylists={stylists} />
      <Testimonials />

      <Footer />
    </div>
  );
}
