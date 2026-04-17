import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarCheck, CheckCircle2, Clock, Mail, Phone, ShieldCheck, Sparkles,
  FileText, CalendarRange,
} from "lucide-react";
import { createBooking } from "@/lib/api";

const TIME_SLOTS = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

const REASONS = [
  { value: "gateway-setup", label: "Gateway Setup" },
  { value: "integration", label: "Integration" },
  { value: "consultation", label: "Consultation" },
  { value: "other", label: "Other" },
];

const ZOHO_URL = process.env.REACT_APP_ZOHO_BOOKING_URL || "";

export default function Booking() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("form"); // "form" | "zoho"
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [date, setDate] = useState(undefined);
  const [time, setTime] = useState("");
  const [form, setForm] = useState({
    full_name: "", phone: "", email: "", reason: "", message: "",
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    if (!form.full_name || form.full_name.trim().length < 2) return "Please enter your full name";
    if (!form.phone || form.phone.trim().length < 6) return "Please enter a valid phone number";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email";
    if (!form.reason) return "Please select a reason";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { toast.error(err); return; }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        preferred_date: date ? date.toISOString().slice(0, 10) : null,
        preferred_time: time || null,
      };
      await createBooking(payload);
      toast.success("Booking received! We'll reach out within 24 hours.");
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again or email us directly.");
    } finally { setSubmitting(false); }
  };

  if (submitted) {
    return (
      <section data-testid="booking-success" className="relative gradient-hero min-h-[80vh] flex items-center">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-accent text-white mb-6">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black tracking-tighter text-navy-900">You're on the list.</h1>
          <p className="mt-5 text-slate-600 text-lg max-w-xl mx-auto leading-relaxed">
            Thanks, <span className="font-semibold text-navy-900">{form.full_name}</span> — one of our payments
            specialists will reach out within 24 hours to confirm your slot
            {date ? ` on ${date.toDateString()}${time ? ` at ${time}` : ""}` : ""}.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button data-testid="return-home-btn" onClick={() => navigate("/")} className="rounded-full bg-navy-900 hover:bg-navy-800 text-white h-11 px-6">
              Back to home
            </Button>
            <Button variant="outline" className="rounded-full h-11 px-6 border-slate-300"
              onClick={() => { setSubmitted(false); setForm({ full_name: "", phone: "", email: "", reason: "", message: "" }); setDate(undefined); setTime(""); }}>
              Book another
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section data-testid="booking-page" className="relative gradient-hero">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
          {/* Left */}
          <div className="md:col-span-5 animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-700">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Free 30-min payments audit
            </div>
            <h1 className="mt-5 font-display text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-navy-900 leading-[1.05]">
              Book a Free <span className="gradient-text">Consultation</span>
            </h1>
            <p className="mt-5 text-slate-600 text-base md:text-lg leading-relaxed max-w-md">
              Tell us a little about your business. We'll come back with a recommended gateway stack,
              expected success rate, and an onboarding timeline — no pitch, no pressure.
            </p>

            <ul className="mt-8 space-y-3.5 text-sm">
              {[
                { icon: CalendarCheck, text: "30 minutes · on Zoom or Google Meet" },
                { icon: Clock, text: "Reply within 24 hours" },
                { icon: ShieldCheck, text: "Your information stays private" },
              ].map((i) => (
                <li key={i.text} className="flex items-center gap-3 text-slate-600">
                  <span className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600">
                    <i.icon className="h-4 w-4" />
                  </span>
                  {i.text}
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-5">
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-semibold">Prefer to reach out directly?</div>
              <div className="mt-3 space-y-2 text-sm">
                <a href="mailto:hello@binanienterprises.in" className="flex items-center gap-2 text-navy-900 hover:text-indigo-600 font-medium">
                  <Mail className="h-4 w-4" /> hello@binanienterprises.in
                </a>
                <a href="tel:+918460360600" className="flex items-center gap-2 text-navy-900 hover:text-indigo-600 font-medium">
                  <Phone className="h-4 w-4" /> +91 84603 60600
                </a>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="md:col-span-7 animate-fade-up" style={{ animationDelay: "120ms" }}>
            {/* Mode toggle */}
            <div className="inline-flex p-1 rounded-full bg-white border border-slate-200 shadow-sm" data-testid="booking-mode-toggle">
              <button
                type="button"
                data-testid="mode-form-btn"
                onClick={() => setMode("form")}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === "form" ? "bg-navy-900 text-white" : "text-slate-600 hover:text-navy-900"
                }`}
              >
                <FileText className="h-4 w-4" /> Quick form
              </button>
              <button
                type="button"
                data-testid="mode-zoho-btn"
                onClick={() => setMode("zoho")}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === "zoho" ? "bg-navy-900 text-white" : "text-slate-600 hover:text-navy-900"
                }`}
              >
                <CalendarRange className="h-4 w-4" /> Pick a slot
              </button>
            </div>

            {mode === "form" ? (
              <form
                data-testid="booking-form"
                onSubmit={onSubmit}
                className="mt-5 relative rounded-3xl bg-white border border-slate-200 hard-shadow p-6 md:p-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <Label htmlFor="full_name" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Full name</Label>
                    <Input id="full_name" data-testid="input-full-name" placeholder="Jane Doe"
                      value={form.full_name} onChange={(e) => update("full_name", e.target.value)}
                      className="mt-2 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 focus-visible:ring-2" required />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Phone</Label>
                    <Input id="phone" data-testid="input-phone" placeholder="+91 84603 60600"
                      value={form.phone} onChange={(e) => update("phone", e.target.value)}
                      className="mt-2 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 focus-visible:ring-2" required />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Email</Label>
                    <Input id="email" type="email" data-testid="input-email" placeholder="jane@company.com"
                      value={form.email} onChange={(e) => update("email", e.target.value)}
                      className="mt-2 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 focus-visible:ring-2" required />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Reason</Label>
                    <Select value={form.reason} onValueChange={(v) => update("reason", v)}>
                      <SelectTrigger data-testid="select-reason" className="mt-2 h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-indigo-500 focus:ring-2">
                        <SelectValue placeholder="What do you need help with?" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {REASONS.map((r) => (
                          <SelectItem key={r.value} value={r.value} data-testid={`reason-${r.value}`}>{r.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="message" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Message <span className="text-slate-400 normal-case tracking-normal">(optional)</span>
                    </Label>
                    <Textarea id="message" data-testid="input-message" rows={4}
                      placeholder="Tell us about your business, volume, or current gateway."
                      value={form.message} onChange={(e) => update("message", e.target.value)}
                      className="mt-2 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 focus-visible:ring-2" />
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-200">
                  <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Pick a preferred date & time
                    <span className="text-slate-400 normal-case tracking-normal ml-1">(optional — we'll confirm)</span>
                  </div>
                  <div className="mt-4 grid md:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-3 flex justify-center">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        data-testid="booking-calendar"
                        disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-semibold">Available time slots</div>
                      <div className="mt-4 grid grid-cols-2 gap-2.5">
                        {TIME_SLOTS.map((t) => {
                          const active = time === t;
                          return (
                            <button type="button" key={t} data-testid={`time-${t.replace(/[:\s]/g, "")}`}
                              onClick={() => setTime(active ? "" : t)}
                              className={`h-11 rounded-xl text-sm font-medium transition-all ${
                                active
                                  ? "bg-navy-900 text-white border border-navy-900"
                                  : "bg-slate-50 text-slate-700 border border-slate-200 hover:border-indigo-400 hover:text-navy-900"
                              }`}>
                              {t}
                            </button>
                          );
                        })}
                      </div>
                      <p className="mt-5 text-xs text-slate-500 leading-relaxed">
                        Times shown in IST. If nothing works, leave it blank and we'll send options via email.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <p className="text-xs text-slate-500 max-w-md">
                    By submitting, you agree to be contacted by our team. We never share your data.
                  </p>
                  <Button type="submit" data-testid="submit-booking-btn" disabled={submitting}
                    className="h-12 px-8 rounded-full bg-navy-900 hover:bg-navy-800 text-white font-semibold shadow-xl disabled:opacity-60">
                    {submitting ? "Submitting..." : "Book Consultation"}
                  </Button>
                </div>
              </form>
            ) : (
              <div data-testid="zoho-panel" className="mt-5 rounded-3xl bg-white border border-slate-200 hard-shadow overflow-hidden">
                {ZOHO_URL ? (
                  <div className="relative">
                    <iframe
                      src={ZOHO_URL}
                      title="Zoho Bookings"
                      className="w-full h-[780px] border-0"
                      loading="lazy"
                      data-testid="zoho-iframe"
                    />
                  </div>
                ) : (
                  <div className="p-8 md:p-12">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl gradient-accent text-white">
                      <CalendarRange className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 font-display text-2xl md:text-3xl font-black tracking-tight text-navy-900">
                      Zoho Bookings — one-step setup
                    </h3>
                    <p className="mt-3 text-slate-600 leading-relaxed max-w-xl">
                      We've wired up real calendar scheduling through Zoho Bookings (free on Zoho's Forever Plan).
                      Paste your booking page URL and clients can pick live slots here.
                    </p>
                    <ol className="mt-6 space-y-3 text-sm text-slate-700">
                      <li className="flex gap-3"><span className="h-6 w-6 flex-shrink-0 rounded-full bg-navy-900 text-white text-xs font-bold flex items-center justify-center">1</span>
                        Create a free account at <a href="https://www.zoho.com/bookings/" target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold hover:underline">zoho.com/bookings</a> and set up your service + availability.</li>
                      <li className="flex gap-3"><span className="h-6 w-6 flex-shrink-0 rounded-full bg-navy-900 text-white text-xs font-bold flex items-center justify-center">2</span>
                        Copy your booking page URL (looks like <code className="text-xs bg-slate-100 rounded px-1.5 py-0.5">https://your-name.zohobookings.in/#/your-service</code>).</li>
                      <li className="flex gap-3"><span className="h-6 w-6 flex-shrink-0 rounded-full bg-navy-900 text-white text-xs font-bold flex items-center justify-center">3</span>
                        Paste it into <code className="text-xs bg-slate-100 rounded px-1.5 py-0.5">REACT_APP_ZOHO_BOOKING_URL</code> in <code className="text-xs bg-slate-100 rounded px-1.5 py-0.5">frontend/.env</code>. Done.</li>
                    </ol>
                    <div className="mt-8 flex items-center gap-3">
                      <Button onClick={() => setMode("form")} variant="outline" className="rounded-full h-11 px-5 border-slate-300">
                        Use quick form for now
                      </Button>
                      <a href="https://www.zoho.com/bookings/" target="_blank" rel="noreferrer">
                        <Button className="rounded-full h-11 px-5 bg-navy-900 hover:bg-navy-800 text-white">
                          Open Zoho Bookings
                        </Button>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
