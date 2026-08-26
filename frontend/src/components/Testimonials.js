import { motion } from "framer-motion";

const TESTIMONIALS = [
  { quote: "The most considered manicure I've had in a decade. It felt less like a service and more like a private commission.", name: "Elena V.", role: "Editor, Vogue Portugal" },
  { quote: "Amelia turned a two-hour appointment into a small ritual. Chrome finish still perfect three weeks later.", name: "Marcus R.", role: "Creative Director" },
  { quote: "Quiet, precise, expensive-feeling in the best sense. I've booked all my out-of-town friends.", name: "Sana K.", role: "Architect" },
];

export default function Testimonials() {
  return (
    <section className="relative py-32 md:py-40 px-6 md:px-16 border-t border-[#2A2828] overflow-hidden" data-testid="testimonials-section">
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1620348579043-b634c3813717?w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-[#0F0E0E]/80" />

      <div className="relative max-w-6xl mx-auto">
        <p className="overline mb-8">04 — In their words</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              data-testid={`testimonial-${i}`}
            >
              <p className="font-serif italic text-2xl md:text-3xl font-light text-[#F3F0EC] leading-snug mb-8">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="accent-line w-12 mb-4" />
              <p className="font-sans text-sm text-[#F3F0EC]">{t.name}</p>
              <p className="font-sans text-xs text-[#A6A19C] mt-1">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
