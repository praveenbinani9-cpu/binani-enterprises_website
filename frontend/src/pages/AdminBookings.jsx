import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  LogOut, RefreshCcw, Search, Mail, Phone, Calendar, Clock, Trash2,
  Inbox, CheckCircle2, PhoneCall, UserCheck,
} from "lucide-react";
import {
  adminListBookings, adminUpdateBookingStatus, adminDeleteBooking,
  adminStats,
} from "@/lib/api";
import { clearSession, getEmail } from "@/lib/auth";

const STATUSES = [
  { value: "new", label: "New", color: "bg-indigo-100 text-indigo-700" },
  { value: "contacted", label: "Contacted", color: "bg-amber-100 text-amber-700" },
  { value: "scheduled", label: "Scheduled", color: "bg-cyan-100 text-cyan-700" },
  { value: "converted", label: "Converted", color: "bg-emerald-100 text-emerald-700" },
  { value: "closed", label: "Closed", color: "bg-slate-200 text-slate-700" },
];

const REASON_LABELS = {
  "gateway-setup": "Gateway Setup",
  "integration": "Integration",
  "consultation": "Consultation",
  "other": "Other",
};

function formatDate(ts) {
  if (!ts) return "—";
  try {
    const d = new Date(ts);
    return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch { return String(ts); }
}

export default function AdminBookings() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({ total: 0, by_status: {} });

  const load = async () => {
    setLoading(true);
    try {
      const [bookings, s] = await Promise.all([adminListBookings(), adminStats()]);
      setItems(bookings);
      setStats(s);
    } catch (err) {
      if (err.response?.status === 401) {
        clearSession();
        navigate("/admin/login");
        return;
      }
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      const updated = await adminUpdateBookingStatus(id, status);
      setItems((prev) => prev.map((b) => b.id === id ? updated : b));
      toast.success("Status updated");
      const s = await adminStats();
      setStats(s);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this booking permanently?")) return;
    try {
      await adminDeleteBooking(id);
      setItems((prev) => prev.filter((b) => b.id !== id));
      toast.success("Booking deleted");
      const s = await adminStats();
      setStats(s);
    } catch {
      toast.error("Failed to delete");
    }
  };

  const logout = () => {
    clearSession();
    navigate("/admin/login");
  };

  const filtered = items.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (q) {
      const s = q.toLowerCase();
      return (
        b.full_name?.toLowerCase().includes(s) ||
        b.email?.toLowerCase().includes(s) ||
        b.phone?.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const kpis = [
    { label: "Total leads", value: stats.total ?? 0, icon: Inbox, tone: "bg-indigo-50 text-indigo-600" },
    { label: "New", value: stats.by_status?.new ?? 0, icon: Inbox, tone: "bg-indigo-50 text-indigo-600" },
    { label: "Contacted", value: stats.by_status?.contacted ?? 0, icon: PhoneCall, tone: "bg-amber-50 text-amber-600" },
    { label: "Converted", value: stats.by_status?.converted ?? 0, icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <section data-testid="admin-bookings-page" className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-5 md:px-10 pt-24 md:pt-28 pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Admin console</div>
            <h1 className="mt-2 font-display text-3xl md:text-4xl font-black tracking-tighter text-navy-900">
              Consultation leads
            </h1>
            <p className="mt-1.5 text-sm text-slate-600">
              Signed in as <span className="font-semibold text-navy-900">{getEmail() || "admin"}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={load}
              data-testid="refresh-btn"
              className="rounded-full border-slate-300"
            >
              <RefreshCcw className="h-4 w-4 mr-1.5" /> Refresh
            </Button>
            <Button
              variant="outline"
              onClick={logout}
              data-testid="logout-btn"
              className="rounded-full border-slate-300"
            >
              <LogOut className="h-4 w-4 mr-1.5" /> Log out
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} data-testid={`kpi-${k.label.toLowerCase().replace(/\s+/g, "-")}`} className="rounded-2xl bg-white border border-slate-200 p-5">
                <div className="flex items-center justify-between">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${k.tone}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-4 text-[11px] uppercase tracking-wider text-slate-500 font-medium">{k.label}</div>
                <div className="font-display font-black text-2xl md:text-3xl text-navy-900 tracking-tight">{k.value}</div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              data-testid="search-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, email, phone..."
              className="pl-9 h-11 rounded-xl bg-white border-slate-200"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger data-testid="status-filter" className="h-11 rounded-xl bg-white border-slate-200 md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="mt-5 rounded-2xl bg-white border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                <Inbox className="h-5 w-5" />
              </div>
              <div className="text-sm text-slate-600">No bookings match your filters yet.</div>
              <Link to="/book" className="mt-3 inline-block text-sm font-semibold text-indigo-600 hover:underline">
                Open booking form →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="text-left font-semibold px-5 py-3">Lead</th>
                    <th className="text-left font-semibold px-5 py-3 hidden md:table-cell">Contact</th>
                    <th className="text-left font-semibold px-5 py-3 hidden lg:table-cell">Reason</th>
                    <th className="text-left font-semibold px-5 py-3 hidden lg:table-cell">Preferred</th>
                    <th className="text-left font-semibold px-5 py-3">Status</th>
                    <th className="text-left font-semibold px-5 py-3 hidden md:table-cell">Received</th>
                    <th className="text-right font-semibold px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => {
                    const st = STATUSES.find((s) => s.value === b.status) || STATUSES[0];
                    return (
                      <tr key={b.id} data-testid={`booking-row-${b.id}`} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-navy-900">{b.full_name}</div>
                          {b.message && <div className="text-xs text-slate-500 line-clamp-1 max-w-xs mt-0.5">{b.message}</div>}
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <a href={`mailto:${b.email}`} className="flex items-center gap-1.5 text-slate-700 hover:text-indigo-600"><Mail className="h-3.5 w-3.5" /> {b.email}</a>
                          <a href={`tel:${b.phone}`} className="flex items-center gap-1.5 text-slate-500 text-xs mt-1 hover:text-indigo-600"><Phone className="h-3 w-3" /> {b.phone}</a>
                        </td>
                        <td className="px-5 py-4 hidden lg:table-cell">
                          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                            {REASON_LABELS[b.reason] || b.reason}
                          </span>
                        </td>
                        <td className="px-5 py-4 hidden lg:table-cell text-slate-700">
                          {b.preferred_date ? (
                            <div className="text-xs">
                              <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {b.preferred_date}</div>
                              {b.preferred_time && <div className="flex items-center gap-1 mt-0.5 text-slate-500"><Clock className="h-3 w-3" /> {b.preferred_time}</div>}
                            </div>
                          ) : <span className="text-slate-400">—</span>}
                        </td>
                        <td className="px-5 py-4">
                          <Select value={b.status} onValueChange={(v) => updateStatus(b.id, v)}>
                            <SelectTrigger data-testid={`status-select-${b.id}`} className={`h-8 px-2.5 rounded-full border-0 text-xs font-semibold w-auto ${st.color}`}>
                              <SelectValue>{st.label}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell text-xs text-slate-500">{formatDate(b.created_at)}</td>
                        <td className="px-5 py-4 text-right">
                          <button
                            data-testid={`delete-btn-${b.id}`}
                            onClick={() => remove(b.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
