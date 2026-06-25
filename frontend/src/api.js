// The Base URL of our FastAPI backend server.
// Since the backend runs on port 8000 and frontend on port 5173,
// all API calls must go to http://localhost:8000.
const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Helper function to handle response errors.
 */
async function handleResponse(response) {
  if (!response.ok) {
    // If status is not in the 200-299 range, get the error detail
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.detail || `HTTP error! Status: ${response.status}`;
    console.error(`API Error: ${errorMessage}`);
    throw new Error(errorMessage);
  }
  
  // Status 204 means "No Content" (like after successful DELETE),
  // so there is no JSON body to read.
  if (response.status === 204) {
    return null;
  }
  
  return await response.json();
}

/**
 * Fetch all flashcards from the backend.
 */
export async function getCards() {
  console.log('API Request: GET /api/cards');
  const response = await fetch(`${API_BASE_URL}/cards`);
  return handleResponse(response);
}

/**
 * Create a new flashcard.
 * @param {Object} cardData - { front, back, category }
 */
export async function createCard(cardData) {
  console.log('API Request: POST /api/cards', cardData);
  const response = await fetch(`${API_BASE_URL}/cards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cardData),
  });
  return handleResponse(response);
}

/**
 * Update an existing flashcard.
 * @param {number} cardId
 * @param {Object} cardData - { front, back, category }
 */
export async function updateCard(cardId, cardData) {
  console.log(`API Request: PUT /api/cards/${cardId}`, cardData);
  const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cardData),
  });
  return handleResponse(response);
}

/**
 * Delete a flashcard.
 * @param {number} cardId
 */
export async function deleteCard(cardId) {
  console.log(`API Request: DELETE /api/cards/${cardId}`);
  const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

/**
 * Record a card review session (increments review count in backend).
 * @param {number} cardId
 */
export async function reviewCard(cardId) {
  console.log(`API Request: POST /api/cards/${cardId}/review`);
  const response = await fetch(`${API_BASE_URL}/cards/${cardId}/review`, {
    method: 'POST',
  });
  return handleResponse(response);
}
