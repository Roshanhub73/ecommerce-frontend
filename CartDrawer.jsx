import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { http } from '../services/http';
import './shop.css';

function getStoredUsername() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user?.username ?? '';
  } catch {
    return '';
  }
}

function formatPrice(value) {
  const num = Number(value);
  if (Number.isFinite(num)) return `₹${num.toFixed(2)}`;
  return `₹${value ?? '0.00'}`;
}

export default function CartDrawer({ isOpen, onClose, onCartUpdate }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    const user = getStoredUsername();
    if (!user) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await http.get('/cart/items');
      const data = res.data;
      // API response: { role: "CUSTOMER", cart: { Products: [...] } }
      const products = data?.cart?.Products || [];
      setCartItems(Array.isArray(products) ? products : []);
    } catch (e) {
      setError(e?.message || 'Failed to load cart items');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCartItems();
    }
  }, [isOpen]);

  const handleUpdateQuantity = async (productid, newQuantity) => {
    const user = getStoredUsername();
    if (!user) return;

    // If quantity goes to 0, delete the item
    if (newQuantity <= 0) {
      await handleDelete(productid);
      return;
    }

    try {
      await http.put('/cart/update', {
        username: user,
        productid: productid,
        quantity: newQuantity,
      });
      await fetchCartItems();
      if (onCartUpdate) onCartUpdate();
    } catch (e) {
      console.error('Error updating cart:', e);
      alert('Failed to update cart item');
    }
  };

  const handleDelete = async (productid) => {
    const user = getStoredUsername();
    if (!user) return;

    if (!confirm('Remove this item from cart?')) return;

    try {
      // Axios delete with body requires data in config
      await http.delete('/cart/delete', {
        data: {
          username: user,
          productid: productid,
        },
      });
      await fetchCartItems();
      if (onCartUpdate) onCartUpdate();
    } catch (e) {
      console.error('Error deleting cart item:', e);
      alert('Failed to remove item from cart');
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const total =
      Number(item.Total_price) ||
      Number(item['Total_price']) ||
      Number(item['Total price']) ||
      0;
    return sum + total;
  }, 0);

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} aria-hidden="true" />
      <aside className="drawer" aria-label="Shopping cart">
        <div className="drawer-head">
          <h3 className="drawer-title">Shopping Cart</h3>
          <button type="button" className="drawer-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="drawer-body">
          {loading && <div className="notice">Loading cart...</div>}
          {!loading && error && <div className="notice">{error}</div>}
          {!loading && !error && cartItems.length === 0 && (
            <div className="notice">Your cart is empty</div>
          )}

          {!loading && !error && cartItems.length > 0 && (
            <div className="cart-items-list">
              {cartItems.map((item) => {
                const productId = item.product_id;
                const quantity = Number(item.Quantity) || 1;
                const pricePerUnit =
                  Number(item['price-per-unit']) || Number(item.pricePerUnit) || 0;
                const totalPrice =
                  Number(item.Total_price) ||
                  Number(item['Total_price']) ||
                  Number(item['Total price']) ||
                  0;

                return (
                  <div key={productId} className="cart-item-card">
                    <div className="cart-item-image">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name || 'Product'} />
                      ) : (
                        <div className="product-fallback" />
                      )}
                    </div>

                    <div className="cart-item-details">
                      <h4 className="cart-item-name">{item.name || 'Product'}</h4>
                      {item.Description && (
                        <p className="cart-item-desc">{item.Description}</p>
                      )}
                      <div className="cart-item-prices">
                        <span className="cart-unit-price">
                          {formatPrice(pricePerUnit)} per unit
                        </span>
                        <span className="cart-total-price">
                          Total: {formatPrice(totalPrice)}
                        </span>
                      </div>

                      <div className="cart-item-actions">
                        <div className="qty-controls">
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => handleUpdateQuantity(productId, quantity - 1)}
                          >
                            −
                          </button>
                          <span className="qty-num">{quantity}</span>
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => handleUpdateQuantity(productId, quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="cart-delete-btn"
                          onClick={() => handleDelete(productId)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {!loading && !error && cartItems.length > 0 && (
          <div className="drawer-foot">
            <div className="cart-grand-total">
              <span className="total-label">Grand Total:</span>
              <span className="total-amount">{formatPrice(totalPrice)}</span>
            </div>
            <button 
              type="button" 
              className="shop-btn checkout-btn"
              onClick={() => {
                onClose();
                navigate('/checkout');
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
