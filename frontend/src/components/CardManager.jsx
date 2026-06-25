import React, { useState } from 'react';

export default function CardManager({ cards, onEditCard, onDeleteCard }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // 1. Get list of unique categories for the filter dropdown
  const categories = ['All', ...new Set(cards.map(card => card.category))];

  // 2. Filter cards based on search input and selected category dropdown
  const filteredCards = cards.filter(card => {
    const matchesSearch = 
      card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.back.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'All' || card.category === selectedCategory;
      
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="manager-container">
      <h2 className="section-title">Manage Deck</h2>
      <p className="subtitle">View, edit, filter, or delete items from your flashcard collection.</p>

      {/* Filters and Search Bar */}
      <div className="filter-bar glass">
        <div className="search-box">
          <label htmlFor="search-input" className="sr-only">Search cards</label>
          <input 
            id="search-input"
            type="text" 
            placeholder="🔍 Search cards by content..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-select">
          <label htmlFor="category-filter">Filter by Category:</label>
          <select 
            id="category-filter"
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Flashcard list grid */}
      {filteredCards.length === 0 ? (
        <div className="empty-state glass">
          <p className="empty-text">No cards match your current search/filters.</p>
        </div>
      ) : (
        <div className="cards-list-grid">
          {filteredCards.map(card => (
            <div key={card.id} className="manager-card glass">
              <div className="manager-card-header">
                <span className="card-category-badge">{card.category}</span>
                <span className="card-reviews-badge">Reviews: {card.review_count}</span>
              </div>
              
              <div className="manager-card-body">
                <div className="field-preview">
                  <strong>Front:</strong>
                  <p>{card.front}</p>
                </div>
                <div className="field-preview">
                  <strong>Back:</strong>
                  <p>{card.back}</p>
                </div>
              </div>

              <div className="manager-card-actions">
                <button 
                  onClick={() => onEditCard(card)} 
                  className="btn-text btn-edit"
                  title="Edit card"
                >
                  ✏️ Edit
                </button>
                <button 
                  onClick={() => onDeleteCard(card.id)} 
                  className="btn-text btn-delete"
                  title="Delete card"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
