import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

load_dotenv()

USER = os.getenv("ORACLE_USER", "event_admin")
PASSWORD = os.getenv("ORACLE_PASSWORD", "your_password")
HOST = os.getenv("ORACLE_HOST", "127.0.0.1")
PORT = os.getenv("ORACLE_PORT", "1521")
SERVICE = os.getenv("ORACLE_SERVICE_NAME", "FREEPDB1")

DATABASE_URL = (
    f"oracle+oracledb://{USER}:{PASSWORD}@"
    f"{HOST}:{PORT}/?service_name={SERVICE}"
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    echo=False,
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
