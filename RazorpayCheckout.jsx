import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { http } from '../services/http';
import '../components/shop.css';

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

export default function RazorpayCheckout() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    const user = getStoredUsername();
    if (!user) {
      setError('Please login to continue');
      setLoading(false);
      return;
    }

    try {
      const res = await http.get('/cart/items');
      const data = res.data;
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
    fetchCartItems();
  }, []);

  const totalPrice = cartItems.reduce((sum, item) => {
    const total =
      Number(item.Total_price) ||
      Number(item['Total_price']) ||
      Number(item['Total price']) ||
      0;
    return sum + total;
  }, 0);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (processing) return;
    
    setProcessing(true);
    
    try {
      const user = getStoredUsername();
      if (!user) {
        setError('User not found. Please login again.');
        return;
      }

      const amountInPaise = Math.round(totalPrice * 100); // Convert to paise for Razorpay
      
      // Prepare request body with all cart details
      const requestBody = {
        totalAmount: totalPrice,
        cartItems: cartItems.map(item => ({
          productId: item.product_id,
          quantity: Number(item.Quantity) || 1,
          price: Number(item['price-per-unit']) || Number(item.pricePerUnit) || 0
        }))
      };
      
      // Create order on backend
      const orderResponse = await http.post('/payment/create', requestBody);
      
      const razorpayOrderId = orderResponse.data;
      
      if (!razorpayOrderId) {
        setError('Backend did not return order ID. Please try again.');
        return;
      }
      
      // Razorpay script is already loaded in index.html
      if (!window.Razorpay) {
        setError('Razorpay script not loaded. Please refresh the page.');
        return;
      }

      const options = {
        key: 'rzp_test_SDAG6dR031OIA2', // Razorpay test key
        amount: amountInPaise,
        currency: 'INR',
        name: 'Shopping Store',
        description: 'Purchase of items',
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            // Use the order ID from backend create order response
            const verifyRequest = {
              razorpayOrderId: razorpayOrderId, // From backend /payment/create response
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            };
            
            // Validate all required fields before sending
            console.log('Field validation:');
            console.log('razorpayOrderId:', razorpayOrderId, 'Type:', typeof razorpayOrderId);
            console.log('razorpayPaymentId:', response.razorpay_payment_id, 'Type:', typeof response.razorpay_payment_id);
            console.log('razorpaySignature:', response.razorpay_signature, 'Type:', typeof response.razorpay_signature);
            
            if (!razorpayOrderId || !response.razorpay_payment_id || !response.razorpay_signature) {
              console.error('Missing fields:', {
                razorpayOrderId: !!razorpayOrderId,
                razorpayPaymentId: !!response.razorpay_payment_id,
                razorpaySignature: !!response.razorpay_signature
              });
              setError('Missing required payment information. Please try again.');
              return;
            }
            
            console.log('Sending to backend:', verifyRequest);
            console.log('verifyRequest structure:', JSON.stringify(verifyRequest, null, 2));
            console.log('Request headers:', {
              'Content-Type': 'application/json',
              'Authorization': http.defaults.headers.Authorization
            });
            
            // Verify payment on backend
            const verifyResponse = await http.post('/payment/verify', verifyRequest);
            
            console.log('Backend verification response:', verifyResponse);
            console.log('Response status:', verifyResponse.status);
            console.log('Response data:', verifyResponse.data);

            alert('Payment successful! Order placed.');
            navigate('/home');
          } catch (error) {
            console.error('Payment verification error:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            console.error('Error message:', error.response?.data?.message);
            console.error('Full error:', error);
            
            setError(`Payment verification failed: ${error.response?.data?.message || error.message}`);
          }
        },
        prefill: {
          name: user,
          email: '',
          contact: ''
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setError(`Payment failed: ${response.error.description}`);
        setProcessing(false);
      });

      rzp.open();
    } catch (error) {
      setError(error?.message || 'Payment processing failed. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading cart details...</p>
        </div>
      </div>
    );
  }

  if (error && cartItems.length === 0) {
    return (
      <div className="page-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="shop-btn" onClick={() => navigate('/home')}>
            Back to Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <button className="back-btn" onClick={() => navigate('/home')}>
            ← Back to Shopping
          </button>
        </div>

        <div className="checkout-content">
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
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
                  <div key={productId} className="order-item">
                    <div className="order-item-image">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name || 'Product'} />
                      ) : (
                        <div className="product-fallback" />
                      )}
                    </div>
                    <div className="order-item-details">
                      <h4>{item.name || 'Product'}</h4>
                      <p>Quantity: {quantity}</p>
                      <p>Price: {formatPrice(pricePerUnit)} each</p>
                      <p className="item-total">Total: {formatPrice(totalPrice)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="payment-section">
            <div className="payment-summary">
              <h3>Payment Details</h3>
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal:</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="price-row">
                  <span>Delivery:</span>
                  <span>FREE</span>
                </div>
                <div className="price-row total">
                  <span>Total Amount:</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>

            <div className="payment-method">
              <h3>Payment Method</h3>
              <div className="payment-option selected">
                <div className="payment-info">
                  <div className="razorpay-logo">
                    <span>Razorpay</span>
                  </div>
                  <p>Secure payment via Razorpay</p>
                </div>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              className="shop-btn payment-btn"
              onClick={handlePayment}
              disabled={processing || cartItems.length === 0}
            >
              {processing ? (
                <>
                  <div className="btn-spinner"></div>
                  Processing...
                </>
              ) : (
                `Pay ${formatPrice(totalPrice)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
