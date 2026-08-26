import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ServicesList({ services }) {
  return (
    <section id="services" className="py-24 md:py-32 px-6 md:px-16 border-t border-[#2A2828]" data-testid="services-section">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 items-end">
          <div className="md:col-span-8">
            <p className="overline mb-6">01 — Menu</p>
            <h2 className="font-serif font-light text-4xl md:text-6xl tracking-tight text-[#F3F0EC] leading-none">
              Services &amp;<br /><em className="text-[#C19277]">prices.</em>
            </h2>
          </div>
          <div className="md:col-span-4">
            <p className="font-sans text-sm text-[#A6A19C] leading-relaxed">
              A curated menu built around technique, longevity, and quiet confidence.
              Prices in USD. Members save on select treatments.
            </p>
          </div>
        </div>

        <div className="border-t border-[#2A2828]">
          {services.map((s, idx) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.05 }}
              className="group grid grid-cols-12 gap-4 md:gap-8 py-8 border-b border-[#2A2828] hover:bg-[#161515]/40 transition-colors duration-500 px-2"
              data-testid={`service-row-${s.id}`}
            >
              <div className="col-span-2 md:col-span-1">
                <span className="font-sans text-xs text-[#A6A19C]">0{idx + 1}</span>
              </div>
              <div className="col-span-10 md:col-span-5">
                <p className="overline mb-2 !text-[#A6A19C]">{s.category}</p>
                <h3 className="font-serif text-2xl md:text-3xl font-light text-[#F3F0EC] tracking-tight">{s.name}</h3>
              </div>
              <div className="col-span-8 md:col-span-4">
                <p className="font-sans text-sm text-[#A6A19C] leading-relaxed">{s.description}</p>
                <p className="font-sans text-xs text-[#A6A19C]/70 mt-2">{s.duration_min} min</p>
              </div>
              <div className="col-span-4 md:col-span-2 flex flex-col items-end justify-start">
                {s.discount_price ? (
                  <>
                    <span className="font-sans text-xs line-through text-[#A6A19C]/60">${s.price.toFixed(0)}</span>
                    <span className="font-serif text-3xl font-light text-[#C19277]">${s.discount_price.toFixed(0)}</span>
                    <span className="overline mt-1 !text-[10px]">Save {Math.round(100 - (s.discount_price / s.price) * 100)}%</span>
                  </>
                ) : (
                  <span className="font-serif text-3xl font-light text-[#F3F0EC]">${s.price.toFixed(0)}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex justify-end">
          <Link
            to="/booking"
            data-testid="services-book-btn"
            className="group inline-flex items-center gap-3 border border-[#C19277] text-[#C19277] px-8 py-4 text-xs tracking-wider uppercase hover:bg-[#C19277] hover:text-[#0F0E0E] transition-colors duration-500"
          >
            Reserve your seat
            <span className="group-hover:translate-x-1 transition-transform duration-500">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
