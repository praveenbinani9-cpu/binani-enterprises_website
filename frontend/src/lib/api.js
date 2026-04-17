import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// withCredentials ensures httpOnly cookies are sent on same-origin and
// allowed cross-origin calls (CORS must permit credentials if cross-origin).
export const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Public
export async function createBooking(payload) {
  const { data } = await api.post("/bookings", payload);
  return data;
}

export async function getStats() {
  const { data } = await api.get("/stats");
  return data;
}

// Admin
export async function adminLogin(email, password) {
  const { data } = await api.post("/admin/login", { email, password });
  return data;
}

export async function adminLogout() {
  const { data } = await api.post("/admin/logout");
  return data;
}

export async function adminMe() {
  const { data } = await api.get("/admin/me");
  return data;
}

export async function adminListBookings() {
  const { data } = await api.get("/admin/bookings");
  return data;
}

export async function adminUpdateBookingStatus(id, status) {
  const { data } = await api.patch(`/admin/bookings/${id}`, { status });
  return data;
}

export async function adminDeleteBooking(id) {
  const { data } = await api.delete(`/admin/bookings/${id}`);
  return data;
}

export async function adminStats() {
  const { data } = await api.get("/admin/stats");
  return data;
}
