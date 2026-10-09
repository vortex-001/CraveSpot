from pydantic import BaseModel, ConfigDict


class RestaurantBase(BaseModel):
    name: str
    description: str | None = None
    cuisine: str | None = None
    location: str | None = None
    city: str | None = None
    average_rating: float = 0
    price_for_two: int | None = None
    delivery_time: int | None = None
    is_veg: bool = False
    offer: str | None = None
    image_url: str | None = None


class RestaurantResponse(RestaurantBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True
    )