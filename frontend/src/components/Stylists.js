import { motion } from "framer-motion";

export default function Stylists({ stylists }) {
  return (
    <section id="artists" className="py-24 md:py-32 px-6 md:px-16 border-t border-[#2A2828]" data-testid="stylists-section">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 mb-16 gap-8">
          <div className="md:col-span-8">
            <p className="overline mb-6">03 — The Hands</p>
            <h2 className="font-serif font-light text-4xl md:text-6xl tracking-tight text-[#F3F0EC] leading-none">
              Three artists,<br />
              <em className="text-[#C19277]">one signature.</em>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {stylists.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.12 }}
              className="group"
              data-testid={`stylist-${s.id}`}
            >
              <div className="relative overflow-hidden bg-[#161515] aspect-[3/4] mb-6">
                <img
                  src={s.image}
                  alt={s.name}
                  className="w-full h-full object-cover tile-img"
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?w=600&q=80"; }}
                />
                <div className="absolute inset-0 bg-[#0F0E0E]/10 group-hover:bg-transparent transition-colors duration-700" />
              </div>
              <p className="overline mb-2 !text-[10px]">{s.title}</p>
              <h3 className="font-serif text-3xl font-light text-[#F3F0EC] tracking-tight mb-3">{s.name}</h3>
              <p className="font-sans text-sm text-[#A6A19C] leading-relaxed">{s.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
