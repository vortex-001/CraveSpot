from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.dish import Dish
from schemas.dish import DishResponse


router = APIRouter(
    prefix="/api/dishes",
    tags=["Dishes"]
)


@router.get(
    "",
    response_model=list[DishResponse]
)
def get_dishes(
    search: str | None = None,
    category_id: int | None = None,
    restaurant_id: int | None = None,
    veg_only: bool = False,
    max_price: int | None = None,
    min_rating: float | None = None,
    sort: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(Dish)

    # Search
    if search:
        search_text = f"%{search}%"

        query = query.filter(
            (Dish.name.ilike(search_text))
            |
            (Dish.cuisine.ilike(search_text))
            |
            (Dish.description.ilike(search_text))
        )

    # Category filter
    if category_id is not None:
        query = query.filter(
            Dish.category_id == category_id
        )

    # Restaurant filter
    if restaurant_id is not None:
        query = query.filter(
            Dish.restaurant_id == restaurant_id
        )

    # Vegetarian filter
    if veg_only:
        query = query.filter(
            Dish.is_veg == True
        )

    # Price filter
    if max_price is not None:
        query = query.filter(
            Dish.price <= max_price
        )

    # Rating filter
    if min_rating is not None:
        query = query.filter(
            Dish.rating >= min_rating
        )

    # Sorting
    if sort == "price_low":
        query = query.order_by(
            Dish.price.asc()
        )

    elif sort == "price_high":
        query = query.order_by(
            Dish.price.desc()
        )

    elif sort == "rating":
        query = query.order_by(
            Dish.rating.desc()
        )

    elif sort == "name":
        query = query.order_by(
            Dish.name.asc()
        )

    else:
        query = query.order_by(
            Dish.name.asc()
        )

    return query.all()


@router.get(
    "/{dish_id}",
    response_model=DishResponse
)
def get_dish(
    dish_id: int,
    db: Session = Depends(get_db)
):
    dish = db.query(Dish).filter(
        Dish.id == dish_id
    ).first()

    if not dish:
        raise HTTPException(
            status_code=404,
            detail="Dish not found"
        )

    return dish