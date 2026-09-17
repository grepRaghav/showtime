import { useEffect, useMemo, useState } from "react";
import { Search, MapPin, Calendar, Users, ArrowUpRight } from "lucide-react";
import { api, Event, User } from "../lib/api";

export default function Events({ user }: { user: User }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [selected, setSelected] = useState<Event | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.events().then(setEvents).catch((err) => setMessage(err.message));
  }, []);

  const categories = useMemo(
    () => ["ALL", ...Array.from(new Set(events.map((event) => event.category)))],
    [events],
  );

  const filtered = events.filter((event) => {
    const haystack = `${event.title} ${event.description} ${event.venue} ${event.category}`.toLowerCase();
    return haystack.includes(search.toLowerCase()) &&
      (category === "ALL" || event.category === category);
  });

  async function book(eventId: number) {
    try {
      await api.book(user.user_id, eventId);
      setMessage("Booking created successfully.");
      setSelected(null);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Booking failed");
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">CATALOGUE / {events.length.toString().padStart(2, "0")} EVENTS</div>
          <h1>Events</h1>
          <p>Browse upcoming events and reserve a place.</p>
        </div>
        <div className="head-status"><span className="status-dot" /> DATABASE ONLINE</div>
      </div>

      {message && <div className="notice">{message}</div>}

      <div className="toolbar">
        <div className="search">
          <Search size={15} />
          <input
            placeholder="Search events, venues, categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      <div className="event-table">
        <div className="table-row table-header">
          <span>EVENT</span>
          <span>CATEGORY</span>
          <span>DATE / VENUE</span>
          <span>PRICE</span>
          <span>STATUS</span>
          <span />
        </div>

        {filtered.map((event, index) => (
          <button className="table-row event-row" key={event.event_id} onClick={() => setSelected(event)}>
            <span className="event-title-cell">
              <b>{String(index + 1).padStart(2, "0")}</b>
              <strong>{event.title}</strong>
            </span>
            <span><span className="tag">{event.category}</span></span>
            <span className="muted">
              {new Date(event.event_date).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
              <br />
              {event.venue}
            </span>
            <span className="price">{Number(event.price) === 0 ? "FREE" : `₹${event.price}`}</span>
            <span><span className="status open">{event.status}</span></span>
            <span><ArrowUpRight size={15} /></span>
          </button>
        ))}

        {filtered.length === 0 && <div className="empty">NO MATCHING EVENTS</div>}
      </div>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <section className="event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <span className="eyebrow">{selected.category}</span>
              <button className="close" onClick={() => setSelected(null)}>×</button>
            </div>
            <h2>{selected.title}</h2>
            <p>{selected.description}</p>
            <div className="detail-grid">
              <div><Calendar size={15} /><span>{new Date(selected.event_date).toLocaleString()}</span></div>
              <div><MapPin size={15} /><span>{selected.venue}</span></div>
              <div><Users size={15} /><span>{selected.capacity} capacity</span></div>
            </div>
            <div className="modal-bottom">
              <span className="big-price">{Number(selected.price) === 0 ? "FREE" : `₹${selected.price}`}</span>
              <button className="primary-button compact" onClick={() => book(selected.event_id)}>
                RESERVE PLACE
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
