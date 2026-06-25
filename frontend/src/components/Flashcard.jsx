import React, { useState } from 'react';

export default function Flashcard({ cards, onReviewCard }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // If there are no cards, display a message
  if (cards.length === 0) {
    return (
      <div className="study-container glass empty-state">
        <h2>Empty Deck 📭</h2>
        <p>You don't have any flashcards yet. Go to the "Manage Deck" tab to create your first card!</p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  // Flip the card state
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Move to next card
  const handleNext = () => {
    setIsFlipped(false);
    // Delay slightly to allow the card to flip back before changing content
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  // Move to previous card
  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  // Record a study review (e.g. user reports they finished reviewing this card)
  const handleReviewAction = async (knowsIt) => {
    // 1. Tell parent component to make the API call to update review count
    await onReviewCard(currentCard.id);
    
    // 2. Automatically advance to next card after a small delay
    handleNext();
  };

  // Format the date/time helper
  const formatLastReviewed = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="study-container">
      <h2 className="section-title">Study Mode</h2>
      <p className="subtitle">Click the card to flip and test your knowledge!</p>

      {/* 3D Flashcard Wrapper */}
      <div className="flashcard-wrapper">
        <div 
          className={`flashcard-3d ${isFlipped ? 'flipped' : ''}`}
          onClick={handleFlip}
        >
          {/* Front Side */}
          <div className="card-side card-front glass">
            <span className="card-category-badge">{currentCard.category}</span>
            <div className="card-content">
              <h3>Question</h3>
              <p className="card-text">{currentCard.front}</p>
            </div>
            <div className="card-footer">
              <span className="footer-tip">Click to reveal answer</span>
            </div>
          </div>

          {/* Back Side */}
          <div className="card-side card-back glass">
            <span className="card-category-badge">{currentCard.category}</span>
            <div className="card-content">
              <h3>Answer</h3>
              <p className="card-text">{currentCard.back}</p>
            </div>
            <div className="card-footer">
              <span className="footer-tip">Click to view question</span>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Status / Stats for Current Card */}
      <div className="card-meta-info glass">
        <span>Reviews: <strong>{currentCard.review_count}</strong></span>
        <span className="separator">|</span>
        <span>Last Studied: <strong>{formatLastReviewed(currentCard.last_reviewed)}</strong></span>
      </div>

      {/* Control Buttons */}
      <div className="controls-container">
        <button onClick={handlePrev} className="btn btn-secondary" title="Previous card">
          ⬅️ Prev
        </button>

        {isFlipped ? (
          <div className="review-action-buttons">
            <button 
              onClick={() => handleReviewAction(false)} 
              className="btn btn-danger"
            >
              ❌ Review Again
            </button>
            <button 
              onClick={() => handleReviewAction(true)} 
              className="btn btn-success"
            >
              ✅ Got It!
            </button>
          </div>
        ) : (
          <button onClick={handleFlip} className="btn btn-primary">
            🔄 Flip Card
          </button>
        )}

        <button onClick={handleNext} className="btn btn-secondary" title="Next card">
          Next ➡️
        </button>
      </div>

      {/* Progress indicator */}
      <div className="deck-progress">
        Card {currentIndex + 1} of {cards.length}
      </div>
    </div>
  );
}
