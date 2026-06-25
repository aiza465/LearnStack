from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# What is a Schema (Pydantic model)?
# While SQLAlchemy models define how data is saved inside the database,
# Pydantic schemas define how data is transmitted over the internet (as JSON).
# They act as validators, checking that the client sent the correct fields
# and data types before they reach our database.

# 1. Base Schema
# This contains the shared properties that exist for any flashcard.
class FlashcardBase(BaseModel):
    front: str = Field(..., min_length=1, description="The front side/question of the card")
    back: str = Field(..., min_length=1, description="The back side/answer of the card")
    category: str = Field(default="General", description="The category/tag for grouping")

# 2. Create Schema
# Used when a user wants to CREATE a new card.
# The user doesn't specify an ID, review_count, or created_at (the backend handles those).
# So this schema only expects front, back, and category.
class FlashcardCreate(FlashcardBase):
    pass

# 3. Update Schema
# Used when editing an existing card.
# All fields are optional because the user might only want to edit the "front"
# or just the "category".
class FlashcardUpdate(BaseModel):
    front: Optional[str] = None
    back: Optional[str] = None
    category: Optional[str] = None

# 4. Response Schema
# Used when sending data BACK to the React frontend.
# It includes database-managed fields like id, review_count, last_reviewed, and created_at.
class FlashcardResponse(FlashcardBase):
    id: int
    review_count: int
    last_reviewed: Optional[datetime] = None
    created_at: datetime

    # This is a critical configuration for FastAPI:
    # It tells Pydantic to allow reading SQLAlchemy objects (orm models)
    # and converting them into JSON objects.
    # (In older Pydantic versions, this was called `orm_mode = True`).
    class Config:
        from_attributes = True
