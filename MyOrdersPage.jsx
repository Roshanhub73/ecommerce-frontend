import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTheme } from '../contexts/ThemeContext';
import { http } from '../services/http';

function getStoredUsername() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user?.username ?? '';
  } catch {
    return '';
  }
}

export default function MyOrdersPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const username = getStoredUsername();

  useEffect(() => {
    const fetchOrders = async () => {
      console.log('🔍 Fetching orders...');
      setLoading(true);
      setError('');
      try {
        const res = await http.get('/orders');
        console.log('🔍 Orders response:', res);
        const data = res.data;
        console.log('🔍 Orders data:', data);
        console.log('🔍 Orders data type:', typeof data);
        console.log('🔍 Orders data keys:', Object.keys(data || {}));
        console.log('🔍 Orders.products:', data?.products);
        console.log('🔍 Orders.products length:', data?.products?.length);
        setOrders(data);
      } catch (e) {
        console.error('Orders fetch error:', e);
        setError('Error fetching orders');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Unknown date';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price || 0);
  };

  // Group orders by order_id and sort by latest first
  const groupedOrders = orders && (orders.products || orders) ? 
    Object.entries(
      (orders.products || orders).reduce((acc, item) => {
        const orderId = item.order_id;
        if (!acc[orderId]) {
          acc[orderId] = {
            order_id: orderId,
            order_date: item.order_date,
            items: [],
            totalQuantity: 0,
            totalPrice: 0
          };
        }
        acc[orderId].items.push(item);
        acc[orderId].totalQuantity += item.quantity || 0;
        acc[orderId].totalPrice += item.Total_price || 0;
        return acc;
      }, {})
    )
    .sort(([, a], [, b]) => {
      // Sort by order_date descending (latest first)
      const dateA = new Date(a.order_date || 0);
      const dateB = new Date(b.order_date || 0);
      return dateB - dateA;
    })
    .reduce((acc, [orderId, orderData]) => {
      acc[orderId] = orderData;
      return acc;
    }, {}) : {};

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  return (
    <div className={`app ${theme}`}>
      <Header 
        username={username}
        cartCount={0}
        isCartLoading={false}
        cartError={false}
      />
      
      <main className="shop-main">
        <div className="shop-container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h1 style={{ color: theme === 'light' ? '#333' : '#fff' }}>
              My Orders
            </h1>
            <button
              onClick={() => navigate('/home')}
              style={{
                padding: '8px 16px',
                background: theme === 'light' ? '#007bff' : '#4a90e2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              ← Back to Home
            </button>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '18px', color: theme === 'light' ? '#666' : '#ccc' }}>
                Loading your orders...
              </div>
            </div>
          )}

          {error && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              background: theme === 'light' ? '#fee' : '#5a202c',
              border: `1px solid ${theme === 'light' ? '#fcc' : '#742a2a'}`,
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '18px', color: theme === 'light' ? '#c53030' : '#fc8181' }}>
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}

          {!loading && !error && Object.keys(groupedOrders).length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {Object.values(groupedOrders).map((order) => (
                <div 
                  key={order.order_id}
                  style={{
                    background: theme === 'light' ? '#fff' : '#2d3748',
                    border: `1px solid ${theme === 'light' ? '#e2e8f0' : '#4a5568'}`,
                    borderRadius: '8px',
                    padding: '15px',
                    boxShadow: theme === 'light' ? '0 2px 4px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  {/* Order Summary - Always Visible */}
                  <div 
                    onClick={() => toggleOrderExpansion(order.order_id)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      padding: '10px',
                      borderRadius: '6px',
                      background: theme === 'light' ? '#f8f9fa' : '#1a202c',
                      marginBottom: expandedOrders.has(order.order_id) ? '15px' : '0'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div>
                        <h3 style={{ 
                          margin: 0, 
                          color: theme === 'light' ? '#333' : '#fff',
                          fontSize: '16px'
                        }}>
                          Order #{order.order_id}
                        </h3>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '14px', 
                          color: theme === 'light' ? '#666' : '#ccc' 
                        }}>
                          Items
                        </div>
                        <div style={{ 
                          fontSize: '18px', 
                          fontWeight: 'bold', 
                          color: theme === 'light' ? '#333' : '#fff' 
                        }}>
                          {order.totalQuantity}
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '14px', 
                          color: theme === 'light' ? '#666' : '#ccc' 
                        }}>
                          Total
                        </div>
                        <div style={{ 
                          fontSize: '18px', 
                          fontWeight: 'bold', 
                          color: theme === 'light' ? '#333' : '#fff' 
                        }}>
                          {formatPrice(order.totalPrice)}
                        </div>
                      </div>
                      <div style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        background: '#d4edda',
                        color: '#155724'
                      }}>
                        SUCCESS
                      </div>
                      <div style={{ 
                        fontSize: '20px', 
                        color: theme === 'light' ? '#666' : '#ccc',
                        transform: expandedOrders.has(order.order_id) ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                      }}>
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Detailed View - Expandable */}
                  {expandedOrders.has(order.order_id) && (
                    <div style={{ 
                      borderTop: `1px solid ${theme === 'light' ? '#e2e8f0' : '#4a5568'}`,
                      paddingTop: '15px'
                    }}>
                      <h4 style={{ 
                        margin: '0 0 15px 0', 
                        color: theme === 'light' ? '#333' : '#fff',
                        fontSize: '16px'
                      }}>
                        Order Items:
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {order.items.map((item, index) => (
                          <div 
                            key={index}
                            style={{
                              display: 'flex',
                              gap: '15px',
                              alignItems: 'center',
                              padding: '10px',
                              background: theme === 'light' ? '#f7fafc' : '#1a202c',
                              borderRadius: '6px'
                            }}
                          >
                            {item.ImageUrl && (
                              <img 
                                src={item.ImageUrl}
                                alt={item.Name || item.description}
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  objectFit: 'cover',
                                  borderRadius: '6px',
                                  border: `1px solid ${theme === 'light' ? '#e2e8f0' : '#4a5568'}`
                                }}
                              />
                            )}
                            <div style={{ flex: 1 }}>
                              <div style={{ 
                                fontWeight: 'bold', 
                                color: theme === 'light' ? '#333' : '#fff',
                                fontSize: '16px',
                                marginBottom: '5px'
                              }}>
                                {item.Name || item.description}
                              </div>
                              <div style={{ 
                                fontSize: '14px', 
                                color: theme === 'light' ? '#666' : '#ccc',
                                marginBottom: '8px'
                              }}>
                                {item.description}
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <div style={{ 
                                    fontSize: '14px', 
                                    color: theme === 'light' ? '#666' : '#ccc' 
                                  }}>
                                    Qty: {item.quantity}
                                  </div>
                                  <div style={{ 
                                    fontSize: '14px', 
                                    color: theme === 'light' ? '#666' : '#ccc' 
                                  }}>
                                    Product ID: {item.productId}
                                  </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <div style={{ 
                                    fontSize: '16px', 
                                    fontWeight: 'bold', 
                                    color: theme === 'light' ? '#333' : '#fff'
                                  }}>
                                    {formatPrice(item.Total_price)}
                                  </div>
                                  <div style={{ 
                                    fontSize: '14px', 
                                    color: theme === 'light' ? '#666' : '#ccc' 
                                  }}>
                                    {formatPrice(item.price_per_unit)} each
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!loading && !error && (!orders || (!orders.products && (!Array.isArray(orders) || orders.length === 0))) && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '18px', color: theme === 'light' ? '#666' : '#ccc' }}>
                📦 No orders found
              </div>
              <p style={{ marginTop: '10px', color: theme === 'light' ? '#666' : '#ccc' }}>
                You haven't placed any orders yet.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
