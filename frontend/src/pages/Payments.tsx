import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { api, type Payment, type User } from "../lib/api";

export default function Payments({ user }: { user: User }) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [message, setMessage] = useState("");

  async function load() {
    try {
      setPayments(await api.payments(user.user_id));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not load payments");
    }
  }

  useEffect(() => {
    load();
  }, [user.user_id]);

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">SHOWTIME / PAYMENTS</div>
          <h1>Payments</h1>
          <p>Recorded payment receipts associated with your event bookings.</p>
        </div>
        <div className="metric">
          <b>{payments.length}</b>
          <span>TRANSACTIONS</span>
        </div>
      </div>

      {message && <div className="notice">{message}</div>}

      <div className="event-table">
        <div className="table-row table-header">
          <span>REFERENCE</span>
          <span>BOOKING</span>
          <span>AMOUNT</span>
          <span>METHOD</span>
          <span>STATUS</span>
          <span />
        </div>

        {payments.map((payment) => (
          <div className="table-row" key={payment.payment_id}>
            <span className="event-title-cell">
              <CreditCard size={15} />
              <strong className="mono">{payment.transaction_ref}</strong>
            </span>
            <span className="mono">#{payment.booking_id}</span>
            <span className="price">₹{payment.amount}</span>
            <span className="muted">{payment.payment_method}</span>
            <span>
              <span className="status open">{payment.payment_status}</span>
            </span>
            <span />
          </div>
        ))}

        {payments.length === 0 && (
          <div className="empty">
            <div>NO PAYMENT RECORDS YET</div>
            <small>You can process demo payments for your active reservations on the Bookings tab.</small>
          </div>
        )}
      </div>
    </>
  );
}
