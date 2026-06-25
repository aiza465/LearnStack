import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Define the Database URL
# We use SQLite as our database because it stores data in a simple local file.
# "sqlite:///./flashcards.db" tells SQLAlchemy to create a file named "flashcards.db"
# in the current working directory.
DATABASE_URL = "sqlite:///./flashcards.db"

# 2. Create the Database Engine
# The engine is the core interface to the database. It handles the actual communication.
# 'connect_args={"check_same_thread": False}' is needed ONLY for SQLite.
# By default, SQLite only allows one thread to communicate with it, but FastAPI uses
# multiple threads to handle requests concurrently, so we disable this check.
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# 3. Create a Session Factory
# SessionLocal is a class. Each instance of it will be a database session.
# We will use sessions to read/write data in our API endpoints.
# - autocommit=False: We explicitly control when to save changes (using db.commit()).
# - autoflush=False: We do not automatically send changes to the database until we commit.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Create the Base class
# All our database models (like Flashcard) will inherit from this Base class.
# This tells SQLAlchemy that these classes correspond to tables in the database.
Base = declarative_base()

# 5. Dependency helper to get a Database Session
# This function is used by our FastAPI routes.
# It opens a new database session when a request comes in, and closes it
# once the request is finished (using the "yield" statement).
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
