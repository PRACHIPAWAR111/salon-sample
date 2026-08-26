import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { getServices, getStylists, getAvailability, createBooking, createCheckout } from "@/lib/api";
import Nav from "@/components/Nav";

const STEPS = ["Service", "Artist", "Date & Time", "Details", "Payment"];

export default function Booking() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const [service, setService] = useState(null);
  const [stylist, setStylist] = useState(null);
  const [date, setDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState(null);
  const [details, setDetails] = useState({ name: "", email: "", phone: "", notes: "" });

  useEffect(() => {
    getServices().then(setServices);
    getStylists().then(setStylists);
  }, []);

  useEffect(() => {
    if (stylist && date) {
      const iso = date.toISOString().slice(0, 10);
      getAvailability(stylist.id, iso).then(d => setSlots(d.slots));
    }
  }, [stylist, date]);

  const currentPrice = service ? (service.discount_price ?? service.price) : 0;

  const canProceed = () => {
    if (step === 0) return !!service;
    if (step === 1) return !!stylist;
    if (step === 2) return !!date && !!timeSlot;
    if (step === 3) return details.name && details.email && details.phone;
    return true;
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      const booking = await createBooking({
        service_id: service.id,
        stylist_id: stylist.id,
        date: date.toISOString().slice(0, 10),
        time: timeSlot,
        customer_name: details.name,
        customer_email: details.email,
        customer_phone: details.phone,
        notes: details.notes,
      });
      const { checkout_url } = await createCheckout(booking.id, window.location.origin);
      window.location.href = checkout_url;
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div data-testid="booking-page" className="min-h-screen bg-[#0F0E0E]">
      <Nav />
      <div className="pt-32 pb-24 px-6 md:px-16">
        <div className="max-w-5xl mx-auto">
          {/* Step indicator */}
          <div className="mb-16">
            <p className="overline mb-8" data-testid="booking-step-label">Step 0{step + 1} / 05 — {STEPS[step]}</p>
            <div className="flex gap-2">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-[2px] flex-1 transition-colors duration-500 ${i <= step ? "bg-[#C19277]" : "bg-[#2A2828]"}`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {step === 0 && (
                <div data-testid="step-service">
                  <h1 className="font-serif font-light text-4xl md:text-6xl tracking-tight text-[#F3F0EC] mb-12 leading-none">
                    Choose your <em className="text-[#C19277]">service.</em>
                  </h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map(s => (
                      <button
                        key={s.id}
                        data-testid={`select-service-${s.id}`}
                        onClick={() => setService(s)}
                        className={`text-left p-8 border transition-all duration-500 ${
                          service?.id === s.id
                            ? "border-[#C19277] bg-[#C19277]/5"
                            : "border-[#2A2828] hover:border-[#A6A19C]"
                        }`}
                      >
                        <p className="overline mb-3 !text-[10px]">{s.category} · {s.duration_min} min</p>
                        <h3 className="font-serif text-2xl font-light text-[#F3F0EC] mb-3 tracking-tight">{s.name}</h3>
                        <p className="font-sans text-sm text-[#A6A19C] mb-4 leading-relaxed">{s.description}</p>
                        <div className="flex items-baseline gap-3">
                          {s.discount_price ? (
                            <>
                              <span className="font-serif text-2xl text-[#C19277]">${s.discount_price.toFixed(0)}</span>
                              <span className="font-sans text-sm line-through text-[#A6A19C]/60">${s.price.toFixed(0)}</span>
                            </>
                          ) : (
                            <span className="font-serif text-2xl text-[#F3F0EC]">${s.price.toFixed(0)}</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div data-testid="step-stylist">
                  <h1 className="font-serif font-light text-4xl md:text-6xl tracking-tight text-[#F3F0EC] mb-12 leading-none">
                    Choose your <em className="text-[#C19277]">artist.</em>
                  </h1>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stylists.map(s => (
                      <button
                        key={s.id}
                        data-testid={`select-stylist-${s.id}`}
                        onClick={() => setStylist(s)}
                        className={`text-left border transition-all duration-500 overflow-hidden ${
                          stylist?.id === s.id
                            ? "border-[#C19277]"
                            : "border-[#2A2828] hover:border-[#A6A19C]"
                        }`}
                      >
                        <div className="aspect-[4/5] bg-[#161515] overflow-hidden">
                          <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-6">
                          <p className="overline mb-2 !text-[10px]">{s.title}</p>
                          <h3 className="font-serif text-2xl font-light text-[#F3F0EC] mb-2 tracking-tight">{s.name}</h3>
                          <p className="font-sans text-xs text-[#A6A19C] leading-relaxed">{s.bio}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div data-testid="step-datetime">
                  <h1 className="font-serif font-light text-4xl md:text-6xl tracking-tight text-[#F3F0EC] mb-12 leading-none">
                    Pick a <em className="text-[#C19277]">moment.</em>
                  </h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                      <p className="overline mb-6">Select date</p>
                      <div className="bg-[#161515] p-4 border border-[#2A2828]">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(d) => { setDate(d); setTimeSlot(null); }}
                          disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
                          className="text-[#F3F0EC]"
                          data-testid="booking-calendar"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="overline mb-6">Select time</p>
                      {!date ? (
                        <p className="font-sans text-sm text-[#A6A19C]">Choose a date to see available times.</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {slots.map(s => (
                            <button
                              key={s.time}
                              data-testid={`select-time-${s.time.replace(':', '')}`}
                              disabled={!s.available}
                              onClick={() => setTimeSlot(s.time)}
                              className={`py-4 border font-sans text-sm transition-all duration-300 ${
                                timeSlot === s.time
                                  ? "border-[#C19277] bg-[#C19277] text-[#0F0E0E]"
                                  : s.available
                                    ? "border-[#2A2828] text-[#F3F0EC] hover:border-[#A6A19C]"
                                    : "border-[#2A2828]/50 text-[#A6A19C]/40 line-through cursor-not-allowed"
                              }`}
                            >
                              {s.time}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div data-testid="step-details">
                  <h1 className="font-serif font-light text-4xl md:text-6xl tracking-tight text-[#F3F0EC] mb-12 leading-none">
                    Your <em className="text-[#C19277]">details.</em>
                  </h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                    <div>
                      <label className="overline block mb-3">Full name</label>
                      <input
                        data-testid="input-name"
                        type="text"
                        value={details.name}
                        onChange={e => setDetails({ ...details, name: e.target.value })}
                        className="w-full bg-transparent border-b border-[#2A2828] py-3 text-[#F3F0EC] focus:outline-none focus:border-[#C19277] transition-colors font-sans"
                      />
                    </div>
                    <div>
                      <label className="overline block mb-3">Phone</label>
                      <input
                        data-testid="input-phone"
                        type="tel"
                        value={details.phone}
                        onChange={e => setDetails({ ...details, phone: e.target.value })}
                        className="w-full bg-transparent border-b border-[#2A2828] py-3 text-[#F3F0EC] focus:outline-none focus:border-[#C19277] transition-colors font-sans"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="overline block mb-3">Email</label>
                      <input
                        data-testid="input-email"
                        type="email"
                        value={details.email}
                        onChange={e => setDetails({ ...details, email: e.target.value })}
                        className="w-full bg-transparent border-b border-[#2A2828] py-3 text-[#F3F0EC] focus:outline-none focus:border-[#C19277] transition-colors font-sans"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="overline block mb-3">Notes (optional)</label>
                      <textarea
                        data-testid="input-notes"
                        rows="3"
                        value={details.notes}
                        onChange={e => setDetails({ ...details, notes: e.target.value })}
                        className="w-full bg-transparent border-b border-[#2A2828] py-3 text-[#F3F0EC] focus:outline-none focus:border-[#C19277] transition-colors font-sans resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div data-testid="step-payment">
                  <h1 className="font-serif font-light text-4xl md:text-6xl tracking-tight text-[#F3F0EC] mb-12 leading-none">
                    Confirm &amp; <em className="text-[#C19277]">reserve.</em>
                  </h1>
                  <div className="border border-[#2A2828] p-8 md:p-12 max-w-2xl">
                    <div className="space-y-6">
                      <Row label="Service" value={service?.name} />
                      <Row label="Artist" value={stylist?.name} />
                      <Row label="Date" value={date?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} />
                      <Row label="Time" value={timeSlot} />
                      <Row label="Client" value={details.name} />
                      <div className="pt-6 border-t border-[#2A2828] flex items-end justify-between">
                        <span className="overline">Total due</span>
                        <span className="font-serif text-4xl font-light text-[#C19277]">${currentPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sans text-xs text-[#A6A19C] mt-6 max-w-2xl leading-relaxed">
                    You'll be redirected to Stripe to complete your payment securely. Test card:
                    <span className="text-[#F3F0EC]"> 4242 4242 4242 4242</span>, any future expiry, any CVC.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Nav buttons */}
          <div className="flex justify-between items-center mt-16 pt-8 border-t border-[#2A2828]">
            <button
              data-testid="booking-back-btn"
              onClick={() => step === 0 ? navigate("/") : setStep(step - 1)}
              className="font-sans text-xs tracking-wider uppercase text-[#A6A19C] hover:text-[#F3F0EC] transition-colors"
            >
              ← {step === 0 ? "Home" : "Back"}
            </button>

            {step < 4 ? (
              <button
                data-testid="booking-next-btn"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="group inline-flex items-center gap-3 bg-[#C19277] text-[#0F0E0E] px-8 py-4 text-xs tracking-wider uppercase hover:bg-[#A67A60] transition-colors duration-500 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Continue
                <span className="group-hover:translate-x-1 transition-transform duration-500">→</span>
              </button>
            ) : (
              <button
                data-testid="booking-pay-btn"
                onClick={handlePay}
                disabled={loading}
                className="group inline-flex items-center gap-3 bg-[#C19277] text-[#0F0E0E] px-8 py-4 text-xs tracking-wider uppercase hover:bg-[#A67A60] transition-colors duration-500 disabled:opacity-50"
              >
                {loading ? "Redirecting…" : `Pay $${currentPrice.toFixed(0)}`}
                {!loading && <span className="group-hover:translate-x-1 transition-transform duration-500">→</span>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const Row = ({ label, value }) => (
  <div className="flex justify-between items-baseline gap-6">
    <span className="overline">{label}</span>
    <span className="font-serif text-xl text-[#F3F0EC] text-right">{value || "—"}</span>
  </div>
);
