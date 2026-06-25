# LearnStack: Fullstack Flashcard & Learning Tracker

Welcome to **LearnStack**! This project is designed specifically for beginners to understand how a React frontend, a FastAPI backend, and an SQLite database work together.

By building and running this app, you will learn the fundamental mechanics of modern web development.

---

## 🏗️ The Fullstack Architecture

In web development, we separate our system into two main areas:
1. **Frontend (Client-side)**: What the user sees and interacts with. It runs inside the user's web browser.
2. **Backend (Server-side)**: The engine that processes requests, does calculations, enforces security rules, and talks to the database. It runs on a computer or server.
3. **Database (Persistence)**: The warehouse where our data is permanently stored.

Here is how data flows in LearnStack:

```text
  ┌─────────────────────────────────────────────────────────────┐
  │                   BROWSER (Client Side)                     │
  │                                                             │
  │   ┌─────────────────┐             ┌─────────────────────┐   │
  │   │   React UI      │             │       api.js        │   │
  │   │  (Components)   │  ────────>  │ (Fetch API Request) │   │
  │   └─────────────────┘             └─────────────────────┘   │
  └──────────────────────────────────────────────│──────────────┘
                                                 │
                                                 │ HTTP POST /api/cards/5/review
                                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                    SERVER (Backend Side)                    │
  │                                                             │
  │   ┌─────────────────┐             ┌─────────────────────┐   │
  │   │   FastAPI App   │             │   SQLAlchemy Model  │   │
  │   │   (main.py)     │  ────────>  │     (models.py)     │   │
  │   └─────────────────┘             └─────────────────────┘   │
  └──────────────────────────────────────────────│──────────────┘
                                                 │
                                                 │ SQL UPDATE table
                                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                  DATABASE (Storage Layer)                   │
  │                                                             │
  │                  SQLite File: flashcards.db                 │
  └─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Walkthrough (Where to look)

### The Backend (`/backend`)
*   **[database.py](file:///C:/Users/aizan/.gemini/antigravity/scratch/fullstack-beginner-hub/backend/database.py)**: Sets up the connection to the SQLite database. It creates the database session factory.
*   **[models.py](file:///C:/Users/aizan/.gemini/antigravity/scratch/fullstack-beginner-hub/backend/models.py)**: Defines what a "Flashcard" looks like in the database (columns like `front`, `back`, `review_count`).
*   **[schemas.py](file:///C:/Users/aizan/.gemini/antigravity/scratch/fullstack-beginner-hub/backend/schemas.py)**: Defines "Pydantic" models. These check that the frontend sends correct data formats and dictates how database items are sent back as JSON.
*   **[main.py](file:///C:/Users/aizan/.gemini/antigravity/scratch/fullstack-beginner-hub/backend/main.py)**: Contains our actual API endpoints (`GET`, `POST`, `PUT`, `DELETE`). This is where we receive HTTP requests, fetch database data, save changes, and return responses.

### The Frontend (`/frontend`)
*   **[index.html](file:///C:/Users/aizan/.gemini/antigravity/scratch/fullstack-beginner-hub/frontend/index.html)**: The HTML entry page where our React app gets loaded.
*   **[App.jsx](file:///C:/Users/aizan/.gemini/antigravity/scratch/fullstack-beginner-hub/frontend/src/App.jsx)**: The heart of the frontend. It holds state (the current cards list) and handles operations like loading cards from the backend and updating the list.
*   **[api.js](file:///C:/Users/aizan/.gemini/antigravity/scratch/fullstack-beginner-hub/frontend/src/api.js)**: A helper file containing functions that use the browser's `fetch()` tool to make network requests to our backend.
*   **[App.css](file:///C:/Users/aizan/.gemini/antigravity/scratch/fullstack-beginner-hub/frontend/src/App.css)**: Custom stylesheet with glassmorphic styles and 3D card rotation styles.
*   **`/components`**: Reusable parts of our page (the interactive `Flashcard`, the statistics `Dashboard`, the creation `FlashcardForm`, and the deck list `CardManager`).

---

## 🚀 How to Run the Project (Step-by-Step)

To run this project, you need to start **two** local servers on your laptop:
1. The **FastAPI Backend Server** (runs on port `8000`).
2. The **React Frontend Development Server** (runs on port `5173`).

We will run these commands in your IDE's terminal (PyCharm).

---

### Step 1: Open the Project in PyCharm

1. Open **PyCharm**.
2. Select **Open** or **Open Folder**.
3. Navigate to:
   `C:\Users\aizan\.gemini\antigravity\scratch\fullstack-beginner-hub`
4. Click **OK** to load the project.

---

### Step 2: Start the Backend (FastAPI)

1. Open a terminal in PyCharm (usually at the bottom panel or by pressing `Alt + F12`).
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Create a Python Virtual Environment (a box to isolate this project's packages):
   * On Windows:
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```
4. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
5. Start the backend server using **Uvicorn**:
   ```bash
   uvicorn main:app --reload
   ```
   *   `main:app` means "look inside `main.py` for the variable named `app`".
   *   `--reload` makes the server automatically restart whenever you save code edits!

🚀 **Verification**: Open your browser and go to [http://localhost:8000/docs](http://localhost:8000/docs).
FastAPI automatically creates an interactive documentation page! You can click on the routes and click "Try it out" to test the backend directly.

---

### Step 3: Start the Frontend (React + Vite)

You need to keep the backend terminal running! Open a **new terminal tab** in PyCharm to start the frontend.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the Node.js packages:
   ```bash
   npm install
   ```
   *(Note: You need Node.js installed on your laptop to run `npm` commands).*
3. Start the React development server:
   ```bash
   npm run dev
   ```

🚀 **Verification**: Open your browser and go to [http://localhost:5173](http://localhost:5173).
You should see the beautiful dark-theme **LearnStack** interface!

---

## ⚡ TRACING A REQUEST: How Fullstack Data Flows

Let's trace exactly what happens when you click the **"Got It! ✅"** button on a card:

1. **User Action (React)**:
   In `Flashcard.jsx`, you click the button. This triggers `handleReviewAction()`, which in turn calls `onReviewCard(currentCard.id)` in `App.jsx`.
2. **API Call (Fetch)**:
   `App.jsx` triggers `api.reviewCard(id)`. This goes to `api.js` and runs a fetch command:
   `fetch("http://localhost:8000/api/cards/5/review", { method: "POST" })`
3. **Route Handling (FastAPI)**:
   The request travels over HTTP port 8000. FastAPI routes it to `@app.post("/api/cards/{card_id}/review")` in `main.py`.
4. **Database Update (SQLAlchemy & SQLite)**:
   FastAPI opens a database connection (`db: Session`). It queries SQLite:
   `db.query(models.Flashcard).filter(id == 5)`
   It increments `review_count` by 1, updates `last_reviewed` to the current time, and calls `db.commit()` to save the changes inside the `flashcards.db` file.
5. **API Response**:
   FastAPI converts the updated database record into JSON format matching the `FlashcardResponse` schema and sends it back to the browser with an HTTP status code 200.
6. **UI Refresh (State Update)**:
   `api.js` parses the JSON response and returns it to `App.jsx`.
   `App.jsx` takes the response and runs `setCards()`, updating its state. React detects the state change, causing the dashboard statistics and card metadata to automatically re-render with the updated review counts!
