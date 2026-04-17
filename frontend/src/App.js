import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import StickyMobileCTA from "@/components/site/StickyMobileCTA";
import Home from "@/pages/Home";
import Booking from "@/pages/Booking";

function App() {
  return (
    <div className="App bg-white text-slate-900">
      <BrowserRouter>
        <Navbar />
        <main data-testid="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<Booking />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <StickyMobileCTA />
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;
