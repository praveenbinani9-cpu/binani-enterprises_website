import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { adminMe } from "@/lib/api";
import { clearEmail } from "@/lib/auth";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  // null = checking, true = authenticated, false = not authenticated
  const [authed, setAuthed] = useState(null);

  useEffect(() => {
    let cancelled = false;
    adminMe()
      .then(() => { if (!cancelled) setAuthed(true); })
      .catch(() => {
        if (!cancelled) {
          clearEmail();
          setAuthed(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  if (authed === null) {
    return (
      <div data-testid="auth-loading" className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  if (authed === false) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
