import React from 'react';

export default function Dashboard({ cards }) {
  // 1. Calculate general statistics
  const totalCards = cards.length;
  const totalReviews = cards.reduce((acc, card) => acc + card.review_count, 0);
  const studiedCardsCount = cards.filter(card => card.review_count > 0).length;
  const completionRate = totalCards > 0 
    ? Math.round((studiedCardsCount / totalCards) * 100) 
    : 0;

  // 2. Count cards per category
  const categoryCounts = cards.reduce((acc, card) => {
    acc[card.category] = (acc[card.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="dashboard-container">
      <h2 className="section-title">Learning Dashboard</h2>
      
      {/* Grid of Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon">🗂️</div>
          <div className="stat-info">
            <span className="stat-label">Total Cards</span>
            <span className="stat-value">{totalCards}</span>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <span className="stat-label">Total Reviews</span>
            <span className="stat-value">{totalReviews}</span>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon">🧠</div>
          <div className="stat-info">
            <span className="stat-label">Studied Cards</span>
            <span className="stat-value">{studiedCardsCount} / {totalCards}</span>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <span className="stat-label">Progress Rate</span>
            <span className="stat-value">{completionRate}%</span>
          </div>
        </div>
      </div>

      {/* Category Distribution list */}
      <div className="category-section glass">
        <h3>Category Breakdown</h3>
        {totalCards === 0 ? (
          <p className="empty-text">No cards available. Create some to see your categories!</p>
        ) : (
          <div className="category-list">
            {Object.entries(categoryCounts).map(([category, count]) => {
              const percentage = Math.round((count / totalCards) * 100);
              return (
                <div key={category} className="category-item">
                  <div className="category-info">
                    <span className="category-name">{category}</span>
                    <span className="category-count">{count} {count === 1 ? 'card' : 'cards'} ({percentage}%)</span>
                  </div>
                  {/* Visual progress bar */}
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
