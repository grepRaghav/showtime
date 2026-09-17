const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export type Event = {
  event_id: number;
  title: string;
  description: string;
  category: string;
  venue: string;
  event_date: string;
  capacity: number;
  price: string;
  status: string;
};

export type User = {
  user_id: number;
  name: string;
  email: string;
  role: string;
};

export type Booking = {
  booking_id: number;
  user_id: number;
  event_id: number;
  booking_date: string;
  status: string;
  event_title: string;
};

export type Payment = {
  payment_id: number;
  booking_id: number;
  amount: string;
  payment_method: string;
  payment_status: string;
  transaction_ref: string;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Request failed");
  }

  return data;
}

export const api = {
  register: (name: string, email: string, password: string) =>
    request<User>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<User>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  events: () => request<Event[]>("/api/events"),

  bookings: (userId: number) =>
    request<Booking[]>(`/api/bookings/user/${userId}`),

  book: (userId: number, eventId: number) =>
    request<Booking>("/api/bookings", {
      method: "POST",
      body: JSON.stringify({ user_id: userId, event_id: eventId }),
    }),

  payments: (userId: number) =>
    request<Payment[]>(`/api/payments/user/${userId}`),

  demoPayment: (bookingId: number) =>
    request<Payment>(`/api/payments/demo/${bookingId}`, { method: "POST" }),
};
