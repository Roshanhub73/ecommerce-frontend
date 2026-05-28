import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';
import './shop.css';

export default function ImageZoomModal({ isOpen, onClose, image, productName, onAddToCart }) {
  const { theme } = useTheme();
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen || !image) return null;

  const handleAddToCart = async () => {
    if (onAddToCart) {
      setIsAdding(true);
      try {
        await onAddToCart();
        setTimeout(() => {
          setIsAdding(false);
          onClose();
        }, 1000);
      } catch (error) {
        setIsAdding(false);
      }
    }
  };

  return (
    <>
      <div className="zoom-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="zoom-modal" role="dialog" aria-modal="true" aria-labelledby="zoom-title">
        <div className="zoom-header">
          <h3 id="zoom-title" className="zoom-title">{productName || 'Product Image'}</h3>
          <button 
            type="button" 
            className="zoom-close" 
            onClick={onClose}
            aria-label="Close zoom view"
          >
            ✕
          </button>
        </div>
        
        <div className="zoom-content">
          <div className="zoom-image-container">
            <img 
              src={image} 
              alt={productName || 'Product'} 
              className="zoom-image"
            />
          </div>
          
          {onAddToCart && (
            <div className="zoom-actions">
              <button
                type="button"
                className="zoom-add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={isAdding}
              >
                {isAdding ? (
                  <>
                    <span className="zoom-spinner"></span>
                    Adding...
                  </>
                ) : (
                  <>
                    🛒 Add to Cart
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
