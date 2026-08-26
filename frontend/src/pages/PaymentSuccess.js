import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getPaymentStatus } from "@/lib/api";
import Nav from "@/components/Nav";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState("checking");
  const [booking, setBooking] = useState(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!sessionId) { setStatus("error"); return; }
    let cancelled = false;

    const check = async (n) => {
      if (cancelled) return;
      try {
        const data = await getPaymentStatus(sessionId);
        if (data.payment_status === "paid") {
          setStatus("paid");
          setBooking(data.booking);
          return;
        }
        if (n >= 8) {
          setStatus("timeout");
          setBooking(data.booking);
          return;
        }
        setAttempts(n + 1);
        setTimeout(() => check(n + 1), 2000);
      } catch (e) {
        setStatus("error");
      }
    };
    check(0);
    return () => { cancelled = true; };
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-[#0F0E0E]" data-testid="payment-success-page">
      <Nav />
      <div className="pt-40 pb-24 px-6 md:px-16">
        <div className="max-w-2xl mx-auto text-center">
          {status === "checking" && (
            <>
              <p className="overline mb-8" data-testid="status-checking">Verifying payment</p>
              <h1 className="font-serif font-light text-4xl md:text-5xl text-[#F3F0EC] tracking-tight mb-6">
                Confirming your <em className="text-[#C19277]">reservation…</em>
              </h1>
              <p className="font-sans text-sm text-[#A6A19C]">Attempt {attempts + 1} of 9</p>
            </>
          )}

          {status === "paid" && (
            <>
              <p className="overline mb-8" data-testid="status-paid">Confirmed</p>
              <h1 className="font-serif font-light text-4xl md:text-6xl text-[#F3F0EC] tracking-tight mb-8 leading-none">
                Thank you.<br />
                <em className="text-[#C19277]">See you soon.</em>
              </h1>
              {booking && (
                <div className="border border-[#2A2828] p-8 text-left space-y-4 mb-10">
                  <Row label="Service" value={booking.service_name} />
                  <Row label="Artist" value={booking.stylist_name} />
                  <Row label="Date" value={booking.date} />
                  <Row label="Time" value={booking.time} />
                  <Row label="Confirmation" value={booking.id.slice(0, 8).toUpperCase()} />
                </div>
              )}
              <p className="font-sans text-sm text-[#A6A19C] mb-10">
                A confirmation email is on its way. We'll see you at the atelier.
              </p>
              <Link
                to="/"
                data-testid="success-home-btn"
                className="inline-flex items-center gap-3 border border-[#C19277] text-[#C19277] px-8 py-4 text-xs tracking-wider uppercase hover:bg-[#C19277] hover:text-[#0F0E0E] transition-colors duration-500"
              >
                Return home
              </Link>
            </>
          )}

          {(status === "timeout" || status === "error") && (
            <>
              <p className="overline mb-8" data-testid="status-error">Still processing</p>
              <h1 className="font-serif font-light text-4xl md:text-5xl text-[#F3F0EC] tracking-tight mb-6">
                Payment is <em className="text-[#C19277]">taking a moment.</em>
              </h1>
              <p className="font-sans text-sm text-[#A6A19C] mb-8">
                No worries — your reservation is on hold. We'll email you as soon as it's confirmed.
              </p>
              <Link to="/" className="hover-underline text-[#C19277] text-sm">Return home</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const Row = ({ label, value }) => (
  <div className="flex justify-between items-baseline">
    <span className="overline">{label}</span>
    <span className="font-serif text-lg text-[#F3F0EC]">{value}</span>
  </div>
);
