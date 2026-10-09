from pydantic import BaseModel, ConfigDict


class CategoryBase(BaseModel):
    name: str
    description: str | None = None
    image_url: str | None = None


class CategoryResponse(CategoryBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True
    )