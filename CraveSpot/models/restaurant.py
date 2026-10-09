from datetime import datetime

from sqlalchemy import String, Text, Float, Integer, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from database import Base


class Restaurant(Base):
    __tablename__ = "restaurants"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        index=True
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    cuisine: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    location: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    city: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    average_rating: Mapped[float] = mapped_column(
        Float,
        default=0
    )

    price_for_two: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    delivery_time: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    is_veg: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )

    offer: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

    dishes = relationship(
        "Dish",
        back_populates="restaurant",
        cascade="all, delete-orphan"
    )