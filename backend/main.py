from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

import models
import schemas
from database import engine, get_db

# 1. Auto-create Database Tables
# This command tells SQLAlchemy to create all tables defined in models.py (if they don't exist yet).
# In a professional production app, developers use a tool called "Alembic" to manage
# database changes, but for learning, this auto-creation is perfect and simple!
models.Base.metadata.create_all(bind=engine)

# 2. Initialize the FastAPI Application
app = FastAPI(
    title="LearnStack API",
    description="A simple API to manage study flashcards, designed for beginners.",
    version="1.0.0"
)

# 3. Setup CORS (Cross-Origin Resource Sharing) Middleware
# Why is this necessary?
# Web browsers have a security feature called the Same-Origin Policy.
# By default, a React app running on http://localhost:5173 cannot make API requests
# to a FastAPI backend running on http://localhost:8000 because they are on different "origins".
# CORS middleware tells our backend server to allow requests originating from our React frontend.
origins = [
    "http://localhost:5173",  # Vite dev server default port
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Allow these websites to talk to our API
    allow_credentials=True,
    allow_methods=["*"],              # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],              # Allow all HTTP headers (headers like Content-Type)
)

# 4. API Endpoints

# Home / Health check route
@app.get("/", tags=["Root"])
def read_root():
    return {
        "message": "Welcome to the LearnStack API! Access interactive documentation at http://localhost:8000/docs"
    }

# GET: Fetch all flashcards
# response_model=List[schemas.FlashcardResponse] tells FastAPI to format the output list
# according to our FlashcardResponse schema.
@app.get("/api/cards", response_model=List[schemas.FlashcardResponse], tags=["Flashcards"])
def get_all_cards(db: Session = Depends(get_db)):
    """
    Retrieve all flashcards stored in the SQLite database.
    """
    # Query all records from the Flashcard table
    cards = db.query(models.Flashcard).all()
    return cards

# POST: Create a new flashcard
# status_code=status.HTTP_201_CREATED specifies that we return HTTP 201 (Created) upon success.
@app.post("/api/cards", response_model=schemas.FlashcardResponse, status_code=status.HTTP_201_CREATED, tags=["Flashcards"])
def create_card(card_data: schemas.FlashcardCreate, db: Session = Depends(get_db)):
    """
    Create a new flashcard.
    """
    # Create a new SQLAlchemy model instance using the validated Pydantic data
    new_card = models.Flashcard(
        front=card_data.front,
        back=card_data.back,
        category=card_data.category
    )
    # Add it to the session and save (commit) it to the SQLite database file
    db.add(new_card)
    db.commit()
    # Refresh retrieves database-generated fields (like the auto-incremented ID) back into our object
    db.refresh(new_card)
    return new_card

# PUT: Update an existing flashcard
@app.put("/api/cards/{card_id}", response_model=schemas.FlashcardResponse, tags=["Flashcards"])
def update_card(card_id: int, card_data: schemas.FlashcardUpdate, db: Session = Depends(get_db)):
    """
    Update a card's details (front, back, or category).
    """
    # First, find the card by its ID
    card = db.query(models.Flashcard).filter(models.Flashcard.id == card_id).first()
    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Flashcard with ID {card_id} not found."
        )
    
    # Update only the fields that were provided in the request
    if card_data.front is not None:
        card.front = card_data.front
    if card_data.back is not None:
        card.back = card_data.back
    if card_data.category is not None:
        card.category = card_data.category
        
    db.commit()
    db.refresh(card)
    return card

# DELETE: Remove a flashcard
@app.delete("/api/cards/{card_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Flashcards"])
def delete_card(card_id: int, db: Session = Depends(get_db)):
    """
    Delete a flashcard from the database.
    """
    card = db.query(models.Flashcard).filter(models.Flashcard.id == card_id).first()
    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Flashcard with ID {card_id} not found."
        )
        
    db.delete(card)
    db.commit()
    # HTTP 204 No Content doesn't return any body, which indicates successful deletion
    return None

# POST: Record a review (Study session)
# When a user views a card and reports if they got it right or wrong, we increment the count
# and record the timestamp. This demonstrates complex state updates on the backend.
@app.post("/api/cards/{card_id}/review", response_model=schemas.FlashcardResponse, tags=["Learning & Stats"])
def review_card(card_id: int, db: Session = Depends(get_db)):
    """
    Record that a card was studied. Increments review count and updates the review timestamp.
    """
    card = db.query(models.Flashcard).filter(models.Flashcard.id == card_id).first()
    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Flashcard with ID {card_id} not found."
        )
        
    # Increment counter
    card.review_count += 1
    # Update timestamp to the current local time
    card.last_reviewed = datetime.utcnow()
    
    db.commit()
    db.refresh(card)
    return card
