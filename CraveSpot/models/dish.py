from datetime import datetime

from sqlalchemy import (
    String,
    Text,
    Float,
    Integer,
    Boolean,
    DateTime,
    ForeignKey
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from database import Base


class Dish(Base):
    __tablename__ = "dishes"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    restaurant_id: Mapped[int] = mapped_column(
        ForeignKey("restaurants.id"),
        nullable=False
    )

    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id"),
        nullable=False
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

    long_description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    price: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    rating: Mapped[float] = mapped_column(
        Float,
        default=0
    )

    review_count: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    is_veg: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )

    cuisine: Mapped[str | None] = mapped_column(
        String(100),
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

    restaurant = relationship(
        "Restaurant",
        back_populates="dishes"
    )

    category = relationship(
        "Category",
        back_populates="dishes"
    )