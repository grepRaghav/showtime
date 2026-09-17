from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import auth, bookings, events, payments

app = FastAPI(
    title="Event Management API",
    version="1.0.0",
    description="College event management backend using FastAPI, SQLAlchemy and Oracle.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(events.router)
app.include_router(bookings.router)
app.include_router(payments.router)


@app.get("/")
def root():
    return {"message": "Event Management API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}
