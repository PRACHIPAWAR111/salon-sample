import { Link } from "react-router-dom";
import Nav from "@/components/Nav";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-[#0F0E0E]" data-testid="payment-cancel-page">
      <Nav />
      <div className="pt-40 pb-24 px-6 md:px-16">
        <div className="max-w-2xl mx-auto text-center">
          <p className="overline mb-8">Payment cancelled</p>
          <h1 className="font-serif font-light text-4xl md:text-6xl text-[#F3F0EC] tracking-tight mb-8 leading-none">
            No worries.<br />
            <em className="text-[#C19277]">Whenever you're ready.</em>
          </h1>
          <p className="font-sans text-sm text-[#A6A19C] mb-12 leading-relaxed">
            Your appointment slot has been released. You can start a fresh reservation at any time.
          </p>
          <Link
            to="/booking"
            data-testid="cancel-retry-btn"
            className="inline-flex items-center gap-3 bg-[#C19277] text-[#0F0E0E] px-8 py-4 text-xs tracking-wider uppercase hover:bg-[#A67A60] transition-colors duration-500"
          >
            Try again
          </Link>
        </div>
      </div>
    </div>
  );
}
