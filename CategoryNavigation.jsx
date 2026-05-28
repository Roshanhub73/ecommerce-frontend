import { useState, useMemo, useEffect, useRef } from 'react';
import './shop.css';

export default function CategoryNavigation({ categories, activeCategory, onCategoryClick }) {
  return (
    <div className="category-nav" role="navigation" aria-label="Categories">
      {categories.map((cat) => {
        const isActive =
          activeCategory === cat ||
          String(activeCategory).toLowerCase() === String(cat).toLowerCase();
        return (
          <button
            key={cat}
            type="button"
            className={`category-btn ${isActive ? 'active' : ''}`}
            onClick={() => onCategoryClick(cat)}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
