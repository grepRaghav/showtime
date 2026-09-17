import { useEffect, useState } from "react";
import { ArrowUpRight, Ticket } from "lucide-react";
import { api, Booking, User } from "../lib/api";

export default function Bookings({ user }: { user: User }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [message, setMessage] = useState("");

  async function load() {
    try {
      setBookings(await api.bookings(user.user_id));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not load bookings");
    }
  }

  useEffect(() => { load(); }, [user.user_id]);

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">ACCOUNT / BOOKINGS</div>
          <h1>Bookings</h1>
          <p>Your event reservations and their current status.</p>
        </div>
        <div className="metric"><b>{bookings.length}</b><span>RESERVATIONS</span></div>
      </div>

      {message && <div className="notice">{message}</div>}

      <div className="event-table">
        <div className="table-row table-header">
          <span>EVENT</span><span>BOOKING ID</span><span>BOOKED AT</span><span>STATUS</span><span /><span />
        </div>

        {bookings.map((booking) => (
          <div className="table-row" key={booking.booking_id}>
            <span className="event-title-cell"><Ticket size={15} /><strong>{booking.event_title}</strong></span>
            <span className="mono">#{booking.booking_id}</span>
            <span className="muted">{new Date(booking.booking_date).toLocaleString()}</span>
            <span><span className="status open">{booking.status}</span></span>
            <span />
            <ArrowUpRight size={15} />
          </div>
        ))}

        {bookings.length === 0 && <div className="empty">NO BOOKINGS YET</div>}
      </div>
    </>
  );
}
