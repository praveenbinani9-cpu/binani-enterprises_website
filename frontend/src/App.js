import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import StickyMobileCTA from "@/components/site/StickyMobileCTA";
import ProtectedRoute from "@/components/site/ProtectedRoute";
import Home from "@/pages/Home";
import Booking from "@/pages/Booking";
import AdminLogin from "@/pages/AdminLogin";
import AdminBookings from "@/pages/AdminBookings";

function SiteChrome({ children }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  return (
    <>
      {!isAdmin && <Navbar />}
      <main data-testid="main-content">{children}</main>
      {!isAdmin && <Footer />}
      {!isAdmin && <StickyMobileCTA />}
    </>
  );
}

function App() {
  return (
    <div className="App bg-white text-slate-900">
      <BrowserRouter>
        <SiteChrome>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<Booking />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute>
                  <AdminBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminBookings />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Home />} />
          </Routes>
        </SiteChrome>
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;
