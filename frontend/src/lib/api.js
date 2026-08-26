import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

export const getServices = () => api.get("/services").then(r => r.data);
export const getStylists = () => api.get("/stylists").then(r => r.data);
export const getAvailability = (stylistId, date) =>
    api.get(`/availability`, { params: { stylist_id: stylistId, date } }).then(r => r.data);
export const createBooking = (payload) => api.post("/bookings", payload).then(r => r.data);
export const getBooking = (id) => api.get(`/bookings/${id}`).then(r => r.data);
export const createCheckout = (bookingId, originUrl) =>
    api.post("/payments/checkout", { booking_id: bookingId, origin_url: originUrl }).then(r => r.data);
export const getPaymentStatus = (sessionId) =>
    api.get(`/payments/status/${sessionId}`).then(r => r.data);
