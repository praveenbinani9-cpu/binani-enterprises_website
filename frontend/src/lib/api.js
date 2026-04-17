import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
});

export async function createBooking(payload) {
  const { data } = await api.post("/bookings", payload);
  return data;
}

export async function getStats() {
  const { data } = await api.get("/stats");
  return data;
}
