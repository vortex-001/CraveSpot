from pydantic import BaseModel, ConfigDict


class DishBase(BaseModel):
    name: str
    description: str | None = None
    long_description: str | None = None
    price: int
    rating: float = 0
    review_count: int = 0
    is_veg: bool = False
    cuisine: str | None = None
    image_url: str | None = None
    restaurant_id: int
    category_id: int


class DishResponse(DishBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True
    )