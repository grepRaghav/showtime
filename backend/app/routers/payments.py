from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Booking, Payment

router = APIRouter(prefix="/api/payments", tags=["payments"])


@router.get("/user/{user_id}")
def user_payments(user_id: int, db: Session = Depends(get_db)):
    rows = (
        db.query(Payment)
        .join(Booking, Booking.booking_id == Payment.booking_id)
        .filter(Booking.user_id == user_id)
        .order_by(Payment.payment_id.desc())
        .all()
    )
    return rows


@router.post("/demo/{booking_id}")
def create_demo_payment(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    existing = db.query(Payment).filter(Payment.booking_id == booking_id).first()
    if existing:
        return existing

    amount = booking.event.price
    payment = Payment(
        booking_id=booking_id,
        amount=amount,
        payment_method="DEMO",
        payment_status="PAID",
        transaction_ref=f"DEMO-{booking_id}",
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment
