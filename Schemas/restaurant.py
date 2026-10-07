from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.restaurant import Restaurant
from models.dish import Dish
from schemas.restaurant import RestaurantResponse
from schemas.dish import DishResponse


router = APIRouter(
    prefix="/api/restaurants",
    tags=["Restaurants"]
)


@router.get(
    "",
    response_model=list[RestaurantResponse]
)
def get_restaurants(
    search: str | None = None,
    cuisine: str | None = None,
    veg_only: bool = False,
    min_rating: float | None = None,
    sort: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(Restaurant)

    # Search restaurant name/cuisine
    if search:
        search_text = f"%{search}%"

        query = query.filter(
            (Restaurant.name.ilike(search_text))
            |
            (Restaurant.cuisine.ilike(search_text))
        )

    # Cuisine filter
    if cuisine:
        query = query.filter(
            Restaurant.cuisine.ilike(f"%{cuisine}%")
        )

    # Vegetarian filter
    if veg_only:
        query = query.filter(
            Restaurant.is_veg == True
        )

    # Rating filter
    if min_rating is not None:
        query = query.filter(
            Restaurant.average_rating >= min_rating
        )

    # Sorting
    if sort == "rating":
        query = query.order_by(
            Restaurant.average_rating.desc()
        )

    elif sort == "price_low":
        query = query.order_by(
            Restaurant.price_for_two.asc()
        )

    elif sort == "price_high":
        query = query.order_by(
            Restaurant.price_for_two.desc()
        )

    elif sort == "delivery":
        query = query.order_by(
            Restaurant.delivery_time.asc()
        )

    else:
        query = query.order_by(
            Restaurant.name.asc()
        )

    return query.all()


@router.get(
    "/{restaurant_id}",
    response_model=RestaurantResponse
)
def get_restaurant(
    restaurant_id: int,
    db: Session = Depends(get_db)
):
    restaurant = db.query(Restaurant).filter(
        Restaurant.id == restaurant_id
    ).first()

    if not restaurant:
        raise HTTPException(
            status_code=404,
            detail="Restaurant not found"
        )

    return restaurant


@router.get(
    "/{restaurant_id}/dishes",
    response_model=list[DishResponse]
)
def get_restaurant_dishes(
    restaurant_id: int,
    db: Session = Depends(get_db)
):
    restaurant = db.query(Restaurant).filter(
        Restaurant.id == restaurant_id
    ).first()

    if not restaurant:
        raise HTTPException(
            status_code=404,
            detail="Restaurant not found"
        )

    dishes = db.query(Dish).filter(
        Dish.restaurant_id == restaurant_id
    ).all()

    return dishes