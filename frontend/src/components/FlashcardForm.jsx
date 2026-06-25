import React, { useState, useEffect } from 'react';

export default function FlashcardForm({ onSubmit, initialCard = null, onCancel = null }) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [category, setCategory] = useState('General');
  const [error, setError] = useState('');

  // If initialCard changes (e.g. user selected a card to edit), update the form states.
  useEffect(() => {
    if (initialCard) {
      setFront(initialCard.front);
      setBack(initialCard.back);
      setCategory(initialCard.category);
    } else {
      // Clear form if we are not editing
      setFront('');
      setBack('');
      setCategory('General');
    }
    setError('');
  }, [initialCard]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple frontend validation
    if (!front.trim() || !back.trim()) {
      setError('Both front and back content are required!');
      return;
    }

    // Call the submit function passed down by the parent component
    onSubmit({
      front: front.trim(),
      back: back.trim(),
      category: category.trim() || 'General'
    });

    // Clear the form if we were creating a brand new card
    if (!initialCard) {
      setFront('');
      setBack('');
      setCategory('General');
    }
    
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="flashcard-form glass">
      <h3>{initialCard ? '✏️ Edit Flashcard' : '➕ Create New Flashcard'}</h3>
      
      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="card-category">Category / Tag</label>
        <input 
          id="card-category"
          type="text" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          placeholder="e.g. React, FastAPI, Python, CSS"
        />
      </div>

      <div className="form-group">
        <label htmlFor="card-front">Front Side (Question / Concept)</label>
        <textarea 
          id="card-front"
          rows="3"
          value={front} 
          onChange={(e) => setFront(e.target.value)} 
          placeholder="Enter the question or concept..."
        ></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="card-back">Back Side (Answer / Explanation)</label>
        <textarea 
          id="card-back"
          rows="4"
          value={back} 
          onChange={(e) => setBack(e.target.value)} 
          placeholder="Enter the answer or description..."
        ></textarea>
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          {initialCard ? 'Save Changes' : 'Create Card'}
        </button>
      </div>
    </form>
  );
}
