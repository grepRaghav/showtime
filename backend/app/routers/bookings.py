from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Booking, Event, User
from ..schemas import BookingCreate, BookingOut

router = APIRouter(prefix="/api/bookings", tags=["bookings"])


@router.get("/user/{user_id}", response_model=list[BookingOut])
def user_bookings(user_id: int, db: Session = Depends(get_db)):
    rows = (
        db.query(Booking, Event.title)
        .join(Event, Event.event_id == Booking.event_id)
        .filter(Booking.user_id == user_id)
        .order_by(Booking.booking_date.desc())
        .all()
    )

    return [
        {
            "booking_id": booking.booking_id,
            "user_id": booking.user_id,
            "event_id": booking.event_id,
            "booking_date": booking.booking_date,
            "status": booking.status,
            "event_title": title,
        }
        for booking, title in rows
    ]


@router.post("", response_model=BookingOut)
def create_booking(data: BookingCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == data.user_id).first()
    event = db.query(Event).filter(Event.event_id == data.event_id).first()

    if not user or not event:
        raise HTTPException(status_code=404, detail="User or event not found")

    if event.status != "OPEN":
        raise HTTPException(status_code=400, detail="Event is not open")

    existing = (
        db.query(Booking)
        .filter(
            Booking.user_id == data.user_id,
            Booking.event_id == data.event_id,
            Booking.status == "CONFIRMED",
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="You already booked this event")

    booking = Booking(user_id=data.user_id, event_id=data.event_id)
    db.add(booking)
    db.commit()
    db.refresh(booking)

    return {
        "booking_id": booking.booking_id,
        "user_id": booking.user_id,
        "event_id": booking.event_id,
        "booking_date": booking.booking_date,
        "status": booking.status,
        "event_title": event.title,
    }
