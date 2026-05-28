import { useState } from 'react';
import ImageZoomModal from './ImageZoomModal';
import './shop.css';

function formatPrice(value) {
  const num = Number(value);
  if (Number.isFinite(num)) return `₹${num.toFixed(2)}`;
  return `₹${value ?? '0.00'}`;
}

export default function ProductList({ products, onAddToCart }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleImageClick = (imageSrc, product) => {
    setSelectedImage(imageSrc);
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setSelectedProduct(null);
  };

  const handleAddToCartFromModal = async () => {
    if (selectedProduct && onAddToCart) {
      const productId = selectedProduct.product_id ?? selectedProduct.id ?? selectedProduct.sku;
      await onAddToCart(productId);
    }
  };

  return (
    <>
      <div className="product-grid">
        {products.map((product) => {
          const key = product.product_id ?? product.id ?? product.sku ?? product.name;
          const imageSrc = Array.isArray(product.images) ? product.images[0] : product.image;

          return (
            <div key={key} className="product-card">
              <div className="product-image" onClick={() => handleImageClick(imageSrc, product)}>
                {imageSrc ? (
                  <img 
                    src={imageSrc} 
                    alt={product.name ?? 'Product'}
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <div className="product-fallback" aria-hidden="true" />
                )}
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.name ?? 'Unnamed product'}</h3>
                {product.description && (
                  <p className="product-description">{product.description}</p>
                )}
                <div className="product-price">{formatPrice(product.price)}</div>
                <div className="product-actions">
                  <button
                    type="button"
                    className="add-to-cart-btn"
                    onClick={() => onAddToCart(product.product_id ?? product.id ?? product.sku)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ImageZoomModal
        isOpen={!!selectedImage}
        onClose={closeModal}
        image={selectedImage}
        productName={selectedProduct?.name}
        onAddToCart={handleAddToCartFromModal}
      />
    </>
  );
}

