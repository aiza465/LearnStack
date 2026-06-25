"""
LearnStack Local Verification Script

This script allows you to verify that Python, SQLAlchemy, and SQLite database connections
are working correctly in your environment. It performs a local mock test of our data
model without running the FastAPI server.

To run this script:
    python check_backend.py
"""

import sys
import os

# Adjust path so we can import modules from the backend directory
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

try:
    from sqlalchemy.orm import Session
    import database
    import models
    import schemas
    print("✅ Successfully imported database and model definitions!")
except ImportError as e:
    print("❌ Import Error! Make sure you have installed packages from backend/requirements.txt.")
    print(f"Details: {e}")
    sys.exit(1)

def run_verification():
    print("\n--- Starting Verification ---")
    
    # 1. Initialize Tables (creates the flashcards.db if not already there)
    try:
        models.Base.metadata.create_all(bind=database.engine)
        print("✅ SQLite database file 'flashcards.db' loaded / created successfully.")
    except Exception as e:
        print(f"❌ Failed to initialize database: {e}")
        return

    # 2. Open a direct database session
    db = database.SessionLocal()
    print("✅ Opened a database connection session.")

    try:
        # 3. Create a test card
        print("\nCreating a test card...")
        test_card = models.Flashcard(
            front="What is database persistence?",
            back="Storing data in a non-volatile location (like a hard disk SQLite file) so it survives system restarts.",
            category="Database"
        )
        db.add(test_card)
        db.commit() # Save to disk
        db.refresh(test_card) # Load database-assigned values (id)
        print(f"✅ Created card! ID: {test_card.id}, Front: '{test_card.front}'")

        # 4. Read back the card
        print("\nReading cards from database...")
        cards = db.query(models.Flashcard).all()
        print(f"✅ Retrieved {len(cards)} card(s) from SQLite!")
        for c in cards:
            print(f" - [ID {c.id}] ({c.category}) Q: {c.front}")

        # 5. Clean up the test card (so we don't spam the DB during validation)
        print("\nCleaning up test card...")
        db.delete(test_card)
        db.commit()
        print("✅ Cleaned up test card successfully.")
        
    except Exception as e:
        print(f"❌ Error during database operations: {e}")
        db.rollback() # Rollback if something broke
    finally:
        db.close() # Always close the connection
        print("✅ Closed database connection session.")

    print("\n🎉 ALL BACKEND VERIFICATIONS PASSED!")
    print("Your environment is fully ready for development.")

if __name__ == "__main__":
    run_verification()
