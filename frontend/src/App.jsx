import React, { useState, useEffect } from 'react';
import * as api from './api';
import Dashboard from './components/Dashboard';
import Flashcard from './components/Flashcard';
import FlashcardForm from './components/FlashcardForm';
import CardManager from './components/CardManager';

export default function App() {
  // 1. App State declarations
  const [cards, setCards] = useState([]);
  const [activeTab, setActiveTab] = useState('study'); // 'study', 'manage', 'dashboard'
  const [editingCard, setEditingCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch cards on mount
  // useEffect runs after the component renders. Since the dependency array is empty [],
  // it will only run ONCE when the app first loads.
  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCards();
      setCards(data);
      setError(null);
    } catch (err) {
      setError('Could not connect to the backend server. Make sure it is running on port 8000!');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. API Handler: Create or Update card
  const handleFormSubmit = async (formData) => {
    try {
      if (editingCard) {
        // Mode: EDIT CARD
        const updated = await api.updateCard(editingCard.id, formData);
        
        // Update local React state: find the edited card and replace it with the new server response
        setCards(prevCards => 
          prevCards.map(c => c.id === editingCard.id ? updated : c)
        );
        setEditingCard(null); // Close the edit form
      } else {
        // Mode: CREATE CARD
        const created = await api.createCard(formData);
        
        // Update local React state: append the newly created card
        setCards(prevCards => [...prevCards, created]);
      }
    } catch (err) {
      alert(`Error saving card: ${err.message}`);
    }
  };

  // 4. API Handler: Delete card
  const handleDeleteCard = async (id) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    
    try {
      await api.deleteCard(id);
      // Update local React state: remove the deleted card from the list
      setCards(prevCards => prevCards.filter(c => c.id !== id));
      
      // If we were editing this specific card, close the editor
      if (editingCard && editingCard.id === id) {
        setEditingCard(null);
      }
    } catch (err) {
      alert(`Error deleting card: ${err.message}`);
    }
  };

  // 5. API Handler: Record card review
  const handleReviewCard = async (id) => {
    try {
      const updated = await api.reviewCard(id);
      
      // Update local React state with the updated stats (review count, last studied time)
      setCards(prevCards => 
        prevCards.map(c => c.id === id ? updated : c)
      );
    } catch (err) {
      console.error('Error reviewing card:', err);
    }
  };

  // Trigger editing state and direct user to form
  const handleEditSelect = (card) => {
    setEditingCard(card);
    // Scroll to the edit form if needed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* Header and SEO main heading */}
      <header className="app-header glass">
        <div className="header-logo">
          <span className="logo-emoji">⚡</span>
          <h1>LearnStack</h1>
        </div>
        <p className="header-subtitle">Your Fullstack React + FastAPI Learning Guide</p>
      </header>

      {/* Main Error/Offline Banner */}
      {error && (
        <div className="connection-error-banner">
          <p>{error}</p>
          <button onClick={fetchCards} className="btn btn-secondary btn-sm">
            🔄 Retry Connection
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="tab-navigation glass">
        <button 
          className={`tab-btn ${activeTab === 'study' ? 'active' : ''}`}
          onClick={() => { setActiveTab('study'); setEditingCard(null); }}
        >
          📖 Study
        </button>
        <button 
          className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          🛠️ Manage Deck
        </button>
        <button 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => { setActiveTab('dashboard'); setEditingCard(null); }}
        >
          📊 Stats Dashboard
        </button>
      </nav>

      {/* Main Body */}
      <main className="app-main">
        {isLoading ? (
          <div className="loading-spinner-container">
            <div className="spinner"></div>
            <p>Connecting to backend API...</p>
          </div>
        ) : (
          <div className="content-layout">
            {/* Tab: STUDY */}
            {activeTab === 'study' && (
              <Flashcard cards={cards} onReviewCard={handleReviewCard} />
            )}

            {/* Tab: MANAGE DECK */}
            {activeTab === 'manage' && (
              <div className="manage-tab-layout">
                {/* Form to Create/Edit Cards */}
                <div className="form-column">
                  <FlashcardForm 
                    onSubmit={handleFormSubmit}
                    initialCard={editingCard}
                    onCancel={editingCard ? () => setEditingCard(null) : null}
                  />
                </div>
                {/* List Table to View and Delete Cards */}
                <div className="manager-column">
                  <CardManager 
                    cards={cards} 
                    onEditCard={handleEditSelect} 
                    onDeleteCard={handleDeleteCard}
                  />
                </div>
              </div>
            )}

            {/* Tab: STATS DASHBOARD */}
            {activeTab === 'dashboard' && (
              <Dashboard cards={cards} />
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Built as a beginner learning hub. React (Vite) + FastAPI (Python) + SQLite.</p>
      </footer>
    </div>
  );
}
