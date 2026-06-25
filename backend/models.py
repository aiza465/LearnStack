from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database import Base

# What is a Database Model?
# In SQLAlchemy, a model is a Python class that maps directly to a table in the database.
# By inheriting from the "Base" class we imported from database.py, we tell SQLAlchemy
# that this class should be registered as a database table.

class Flashcard(Base):
    # This sets the name of the table inside the SQLite database
    __tablename__ = "flashcards"

    # Define the columns (fields) of our table:
    
    # 1. Primary Key: Unique ID for each card. Autoincremented by default.
    id = Column(Integer, primary_key=True, index=True)
    
    # 2. Front of the card: The question or concept to learn (e.g. "What is CORS?")
    front = Column(String, nullable=False)
    
    # 3. Back of the card: The answer or explanation (e.g. "Cross-Origin Resource Sharing...")
    back = Column(String, nullable=False)
    
    # 4. Category: Helps group cards (e.g. "React", "FastAPI", "CSS")
    category = Column(String, default="General")
    
    # 5. Review Count: How many times has this card been studied? Starts at 0.
    review_count = Column(Integer, default=0)
    
    # 6. Last Reviewed: Date and time of the last study session. Optional.
    last_reviewed = Column(DateTime, nullable=True)
    
    # 7. Created At: Date and time when the card was created.
    created_at = Column(DateTime, default=datetime.utcnow)
