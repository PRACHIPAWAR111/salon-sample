import { motion } from "framer-motion";

const TILES = [
  { url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80", span: "md:col-span-5 md:row-span-2", label: "Tortoise" },
  { url: "https://images.unsplash.com/photo-1571290274554-6a2eaa771e5f?w=800&q=80", span: "md:col-span-4 md:row-span-1", label: "Sleek" },
  { url: "https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=800&q=80", span: "md:col-span-3 md:row-span-1", label: "Chrome" },
  { url: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800&q=80", span: "md:col-span-3 md:row-span-1", label: "Nude" },
  { url: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&q=80", span: "md:col-span-4 md:row-span-1", label: "Marble" },
  { url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80", span: "md:col-span-5 md:row-span-1", label: "Editorial" },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-24 md:py-32 px-6 md:px-16 border-t border-[#2A2828] relative" data-testid="portfolio-section">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 mb-16 gap-8">
          <div className="md:col-span-6 md:col-start-4">
            <p className="overline mb-6">02 — Portfolio</p>
            <h2 className="font-serif font-light text-4xl md:text-6xl tracking-tight text-[#F3F0EC] leading-none">
              A quiet <em className="text-[#C19277]">archive</em><br />
              of previous work.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-12 auto-rows-[200px] md:auto-rows-[260px] gap-4 md:gap-6">
          {TILES.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
              className={`tile relative overflow-hidden bg-[#161515] ${t.span}`}
              data-testid={`portfolio-tile-${i}`}
            >
              <img src={t.url} alt={t.label} className="tile-img w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E0E]/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="overline text-[10px]">{t.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
