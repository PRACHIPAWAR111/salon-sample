import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-[#2A2828] py-24 md:py-32 px-6 md:px-16 bg-[#0F0E0E]" data-testid="footer">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-7">
            <p className="overline mb-6">Ready when you are</p>
            <h2 className="font-serif font-light text-4xl md:text-7xl tracking-tight text-[#F3F0EC] leading-none mb-10">
              Book an<br /><em className="text-[#C19277]">appointment.</em>
            </h2>
            <Link
              to="/booking"
              data-testid="footer-book-btn"
              className="group inline-flex items-center gap-3 bg-[#C19277] text-[#0F0E0E] px-10 py-5 text-xs tracking-wider uppercase hover:bg-[#A67A60] transition-colors duration-500"
            >
              Reserve your seat
              <span className="group-hover:translate-x-1 transition-transform duration-500">→</span>
            </Link>
          </div>

          <div className="md:col-span-5 grid grid-cols-2 gap-8">
            <div>
              <p className="overline mb-4">Visit</p>
              <p className="font-serif text-lg text-[#F3F0EC] leading-snug">Rua do Chiado 42<br />1200-108 Lisboa<br />Portugal</p>
            </div>
            <div>
              <p className="overline mb-4">Contact</p>
              <p className="font-sans text-sm text-[#F3F0EC] leading-loose">
                +351 21 555 0142<br />
                <a href="mailto:atelier@lumiere.com" className="hover-underline">atelier@lumiere.com</a>
              </p>
            </div>
            <div>
              <p className="overline mb-4">Hours</p>
              <p className="font-sans text-sm text-[#A6A19C] leading-loose">
                Tue – Sat<br />10:00 – 19:00<br />
                <span className="text-[#F3F0EC]/60">Sun · Mon closed</span>
              </p>
            </div>
            <div>
              <p className="overline mb-4">Follow</p>
              <p className="font-sans text-sm text-[#F3F0EC] leading-loose">
                <a href="#" className="hover-underline block">Instagram</a>
                <a href="#" className="hover-underline block">Pinterest</a>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#2A2828] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="font-serif text-xl text-[#F3F0EC]">Lumière<span className="text-[#C19277]">.</span> <span className="text-[#A6A19C] text-sm font-sans ml-2">Nail Atelier</span></p>
          <p className="font-sans text-xs text-[#A6A19C]">© {new Date().getFullYear()} Lumière Nail Atelier. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
