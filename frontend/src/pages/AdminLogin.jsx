import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowLeft, Shield } from "lucide-react";
import { adminLogin } from "@/lib/api";
import { saveSession } from "@/lib/auth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    setSubmitting(true);
    try {
      const { token, email: userEmail } = await adminLogin(email, password);
      saveSession(token, userEmail);
      toast.success("Welcome back, admin");
      const from = location.state?.from?.pathname || "/admin/bookings";
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.detail || "Login failed";
      toast.error(typeof msg === "string" ? msg : "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section data-testid="admin-login-page" className="relative min-h-[80vh] flex items-center gradient-hero">
      <div className="max-w-md mx-auto w-full px-6 py-20">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-navy-900 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>

        <div className="rounded-3xl bg-white border border-slate-200 hard-shadow p-8 md:p-10">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl gradient-accent text-white">
            <Shield className="h-5 w-5" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-black tracking-tighter text-navy-900">Admin sign in</h1>
          <p className="mt-2 text-sm text-slate-600">
            Access your consultation leads and manage bookings.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4" data-testid="admin-login-form">
            <div>
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                data-testid="admin-email-input"
                placeholder="admin@binanienterprises.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 focus-visible:ring-2"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                data-testid="admin-password-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 focus-visible:ring-2"
              />
            </div>
            <Button
              type="submit"
              data-testid="admin-login-submit"
              disabled={submitting}
              className="w-full h-12 rounded-full bg-navy-900 hover:bg-navy-800 text-white font-semibold disabled:opacity-60"
            >
              {submitting ? "Signing in..." : (<><Lock className="h-4 w-4 mr-2" /> Sign in</>)}
            </Button>
          </form>

          <p className="mt-6 text-xs text-slate-500 leading-relaxed">
            This area is for Binani Enterprises administrators only. All access is logged.
          </p>
        </div>
      </div>
    </section>
  );
}
