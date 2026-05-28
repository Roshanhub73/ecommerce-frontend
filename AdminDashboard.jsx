import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { http } from '../services/http';

function AdminDashboard() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [stats, setStats] = useState({
    dailySales: 0,
    monthlySales: 0,
    yearlySales: 0,
    overallSales: 0
  });

  // Modify User State
  const [modifyUser, setModifyUser] = useState({
    userid: '',
    username: '',
    email: '',
    role: 'CUSTOMER'
  });
  const [modifyResponse, setModifyResponse] = useState(null);
  const [modifyLoading, setModifyLoading] = useState(false);
  const [modifyError, setModifyError] = useState('');

  useEffect(() => {
    // Fetch admin stats (mock data for now)
    setStats({
      dailySales: 1250,
      monthlySales: 37800,
      yearlySales: 456000,
      overallSales: 1234567
    });
  }, []);

  const handleLogout = () => {
    console.log('🔍 Admin logging out...');
    
    // Clear admin user from localStorage
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    
    console.log('🔍 Admin logged out, redirecting to login...');
    navigate('/admin');
  };

  const handleModifyUser = async () => {
    setModifyLoading(true);
    setModifyError('');
    setModifyResponse(null);

    try {
      const response = await http.post('http://localhost:9090/admin/user/modify', {
        userid: parseInt(modifyUser.userid),
        username: modifyUser.username,
        email: modifyUser.email,
        role: modifyUser.role
      });

      console.log('🔍 Modify User Response:', response.data);
      setModifyResponse(response.data);
    } catch (error) {
      console.error('🔍 Modify User Error:', error);
      setModifyError(error.response?.data?.message || 'Failed to modify user');
    } finally {
      setModifyLoading(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'orders', label: 'Orders', icon: '🛒' },
    { id: 'categories', label: 'Categories', icon: '📂' },
    { id: 'brands', label: 'Brands', icon: '🏷️' },
    { id: 'coupons', label: 'Coupons', icon: '🎫' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const renderContent = () => {
    switch (selectedSection) {
      case 'dashboard':
        return (
          <div style={{ padding: '20px' }}>
            {/* Statistics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={{
                background: theme === 'light' ? '#fff' : '#2d3748',
                padding: '25px',
                borderRadius: '15px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568')
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '10px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px'
                  }}>
                    <span style={{ fontSize: '24px' }}>�</span>
                  </div>
                  <div>
                    <h3 style={{ color: theme === 'light' ? '#333' : '#fff', margin: '0 0 5px 0', fontSize: '14px' }}>USERS</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#3182ce', margin: 0 }}>1,234</p>
                  </div>
                </div>
              </div>
              
              <div style={{
                background: theme === 'light' ? '#fff' : '#2d3748',
                padding: '25px',
                borderRadius: '15px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568')
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px'
                  }}>
                    <span style={{ fontSize: '24px' }}>�</span>
                  </div>
                  <div>
                    <h3 style={{ color: theme === 'light' ? '#333' : '#fff', margin: '0 0 5px 0', fontSize: '14px' }}>PRODUCTS</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', margin: 0 }}>89</p>
                  </div>
                </div>
              </div>
              
              <div style={{
                background: theme === 'light' ? '#fff' : '#2d3748',
                padding: '25px',
                borderRadius: '15px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568')
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '10px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px'
                  }}>
                    <span style={{ fontSize: '24px' }}>�</span>
                  </div>
                  <div>
                    <h3 style={{ color: theme === 'light' ? '#333' : '#fff', margin: '0 0 5px 0', fontSize: '14px' }}>ORDERS</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>567</p>
                  </div>
                </div>
              </div>
              
              <div style={{
                background: theme === 'light' ? '#fff' : '#2d3748',
                padding: '25px',
                borderRadius: '15px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568')
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '10px',
                    background: 'rgba(139, 92, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px'
                  }}>
                    <span style={{ fontSize: '24px' }}>💰</span>
                  </div>
                  <div>
                    <h3 style={{ color: theme === 'light' ? '#333' : '#fff', margin: '0 0 5px 0', fontSize: '14px' }}>REVENUE</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6', margin: 0 }}>$45,678</p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Management Table */}
            <div style={{
              background: theme === 'light' ? '#fff' : '#2d3748',
              borderRadius: '15px',
              padding: '25px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568')
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ color: theme === 'light' ? '#333' : '#fff', margin: 0 }}>Recent Users</h3>
                <button style={{
                  background: '#3182ce',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  + Add New User
                </button>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px'
                }}>
                  <thead>
                    <tr style={{ background: theme === 'light' ? '#f8f9fa' : '#2d3748' }}>
                      <th style={{
                        padding: '12px 15px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: theme === 'light' ? '#2d3748' : '#fff',
                        borderBottom: '2px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568'),
                        fontSize: '12px'
                      }}>ID</th>
                      <th style={{
                        padding: '12px 15px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: theme === 'light' ? '#2d3748' : '#fff',
                        borderBottom: '2px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568'),
                        fontSize: '12px'
                      }}>NAME</th>
                      <th style={{
                        padding: '12px 15px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: theme === 'light' ? '#2d3748' : '#fff',
                        borderBottom: '2px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568'),
                        fontSize: '12px'
                      }}>EMAIL</th>
                      <th style={{
                        padding: '12px 15px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: theme === 'light' ? '#2d3748' : '#fff',
                        borderBottom: '2px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568'),
                        fontSize: '12px'
                      }}>ROLE</th>
                      <th style={{
                        padding: '12px 15px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: theme === 'light' ? '#2d3748' : '#fff',
                        borderBottom: '2px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568'),
                        fontSize: '12px'
                      }}>STATUS</th>
                      <th style={{
                        padding: '12px 15px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: theme === 'light' ? '#2d3748' : '#fff',
                        borderBottom: '2px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568'),
                        fontSize: '12px'
                      }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568') }}>
                      <td style={{ padding: '12px 15px', color: theme === 'light' ? '#333' : '#fff' }}>#001</td>
                      <td style={{ padding: '12px 15px', color: theme === 'light' ? '#333' : '#fff' }}>John Doe</td>
                      <td style={{ padding: '12px 15px', color: theme === 'light' ? '#333' : '#fff' }}>john@example.com</td>
                      <td style={{ padding: '12px 15px' }}>
                        <span style={{
                          background: '#10b981',
                          color: '#fff',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>ADMIN</span>
                      </td>
                      <td style={{ padding: '12px 15px' }}>
                        <span style={{
                          background: '#10b981',
                          color: '#fff',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>ACTIVE</span>
                      </td>
                      <td style={{ padding: '12px 15px' }}>
                        <button style={{
                          background: '#3182ce',
                          color: '#fff',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          marginRight: '5px'
                        }}>Edit</button>
                        <button style={{
                          background: '#e53e3e',
                          color: '#fff',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}>Delete</button>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568') }}>
                      <td style={{ padding: '12px 15px', color: theme === 'light' ? '#333' : '#fff' }}>#002</td>
                      <td style={{ padding: '12px 15px', color: theme === 'light' ? '#333' : '#fff' }}>Jane Smith</td>
                      <td style={{ padding: '12px 15px', color: theme === 'light' ? '#333' : '#fff' }}>jane@example.com</td>
                      <td style={{ padding: '12px 15px' }}>
                        <span style={{
                          background: '#f59e0b',
                          color: '#fff',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>USER</span>
                      </td>
                      <td style={{ padding: '12px 15px' }}>
                        <span style={{
                          background: '#10b981',
                          color: '#fff',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>ACTIVE</span>
                      </td>
                      <td style={{ padding: '12px 15px' }}>
                        <button style={{
                          background: '#3182ce',
                          color: '#fff',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          marginRight: '5px'
                        }}>Edit</button>
                        <button style={{
                          background: '#e53e3e',
                          color: '#fff',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}>Delete</button>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568') }}>
                      <td style={{ padding: '12px 15px', color: theme === 'light' ? '#333' : '#fff' }}>#003</td>
                      <td style={{ padding: '12px 15px', color: theme === 'light' ? '#333' : '#fff' }}>Bob Johnson</td>
                      <td style={{ padding: '12px 15px', color: theme === 'light' ? '#333' : '#fff' }}>bob@example.com</td>
                      <td style={{ padding: '12px 15px' }}>
                        <span style={{
                          background: '#f59e0b',
                          color: '#fff',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>USER</span>
                      </td>
                      <td style={{ padding: '12px 15px' }}>
                        <span style={{
                          background: '#ef4444',
                          color: '#fff',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>INACTIVE</span>
                      </td>
                      <td style={{ padding: '12px 15px' }}>
                        <button style={{
                          background: '#3182ce',
                          color: '#fff',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          marginRight: '5px'
                        }}>Edit</button>
                        <button style={{
                          background: '#e53e3e',
                          color: '#fff',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}>Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      
      case 'users':
        return (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: theme === 'light' ? '#333' : '#fff', marginBottom: '30px' }}>User Management</h2>
            
            {/* Modify User Form */}
            <div style={{
              background: theme === 'light' ? '#fff' : '#2d3748',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568'),
              marginBottom: '30px'
            }}>
              <h3 style={{ color: theme === 'light' ? '#333' : '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>✏️</span>
                Modify User
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', color: theme === 'light' ? '#333' : '#fff', marginBottom: '8px', fontWeight: '500' }}>
                    User ID
                  </label>
                  <input
                    type="number"
                    value={modifyUser.userid}
                    onChange={(e) => setModifyUser({...modifyUser, userid: e.target.value})}
                    placeholder="Enter user ID"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568'),
                      borderRadius: '8px',
                      background: theme === 'light' ? '#fff' : '#1a202c',
                      color: theme === 'light' ? '#333' : '#fff',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', color: theme === 'light' ? '#333' : '#fff', marginBottom: '8px', fontWeight: '500' }}>
                    Username
                  </label>
                  <input
                    type="text"
                    value={modifyUser.username}
                    onChange={(e) => setModifyUser({...modifyUser, username: e.target.value})}
                    placeholder="Enter username"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568'),
                      borderRadius: '8px',
                      background: theme === 'light' ? '#fff' : '#1a202c',
                      color: theme === 'light' ? '#333' : '#fff',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', color: theme === 'light' ? '#333' : '#fff', marginBottom: '8px', fontWeight: '500' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={modifyUser.email}
                    onChange={(e) => setModifyUser({...modifyUser, email: e.target.value})}
                    placeholder="Enter email"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568'),
                      borderRadius: '8px',
                      background: theme === 'light' ? '#fff' : '#1a202c',
                      color: theme === 'light' ? '#333' : '#fff',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', color: theme === 'light' ? '#333' : '#fff', marginBottom: '8px', fontWeight: '500' }}>
                    Role
                  </label>
                  <select
                    value={modifyUser.role}
                    onChange={(e) => setModifyUser({...modifyUser, role: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568'),
                      borderRadius: '8px',
                      background: theme === 'light' ? '#fff' : '#1a202c',
                      color: theme === 'light' ? '#333' : '#fff',
                      fontSize: '14px'
                    }}
                  >
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="MANAGER">MANAGER</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  onClick={handleModifyUser}
                  disabled={modifyLoading || !modifyUser.userid || !modifyUser.username || !modifyUser.email}
                  style={{
                    padding: '12px 24px',
                    background: modifyLoading ? '#ccc' : '#3182ce',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: modifyLoading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {modifyLoading ? 'Modifying...' : 'Modify User'}
                </button>
                
                <button
                  onClick={() => {
                    setModifyUser({ userid: '', username: '', email: '', role: 'CUSTOMER' });
                    setModifyResponse(null);
                    setModifyError('');
                  }}
                  style={{
                    padding: '12px 24px',
                    background: theme === 'light' ? '#e2e8f0' : '#4a5568',
                    color: theme === 'light' ? '#333' : '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
            
            {/* Response Display */}
            {modifyResponse && (
              <div style={{
                background: theme === 'light' ? '#f0fff4' : '#1a202c',
                border: '1px solid ' + (theme === 'light' ? '#9ae6b4' : '#4a5568'),
                borderRadius: '15px',
                padding: '20px',
                marginBottom: '20px'
              }}>
                <h4 style={{ color: theme === 'light' ? '#22543d' : '#fff', marginBottom: '15px' }}>✅ User Modified Successfully</h4>
                <div style={{ 
                  background: theme === 'light' ? '#fff' : '#2d3748',
                  padding: '15px',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  color: theme === 'light' ? '#333' : '#fff',
                  overflow: 'auto'
                }}>
                  {JSON.stringify(modifyResponse, null, 2)}
                </div>
              </div>
            )}
            
            {modifyError && (
              <div style={{
                background: theme === 'light' ? '#fff5f5' : '#1a202c',
                border: '1px solid ' + (theme === 'light' ? '#fc8181' : '#4a5568'),
                borderRadius: '15px',
                padding: '20px',
                marginBottom: '20px'
              }}>
                <h4 style={{ color: theme === 'light' ? '#c53030' : '#fff', marginBottom: '10px' }}>❌ Error</h4>
                <p style={{ color: theme === 'light' ? '#742a2a' : '#fff', margin: 0 }}>{modifyError}</p>
              </div>
            )}
            
            {/* Get User by ID Card */}
            <div style={{
              background: theme === 'light' ? '#f8f9fa' : '#1a202c',
              padding: '20px',
              borderRadius: '10px',
              border: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568'),
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '15px'
              }}>
                <span style={{ fontSize: '24px' }}>🔍</span>
              </div>
              <h3 style={{ color: theme === 'light' ? '#333' : '#fff', margin: '0 0 10px 0', fontSize: '18px' }}>Get User by ID</h3>
              <p style={{ color: theme === 'light' ? '#666' : '#a0aec0', margin: 0, fontSize: '14px' }}>Search and retrieve specific user details by ID</p>
            </div>
          </div>
        );
      
      case 'products':
        return (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: theme === 'light' ? '#333' : '#fff', marginBottom: '30px' }}>Product Management</h2>
            <div style={{
              background: theme === 'light' ? '#fff' : '#2d3748',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568')
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div style={{
                  background: theme === 'light' ? '#f8f9fa' : '#1a202c',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568'),
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '15px'
                  }}>
                    <span style={{ fontSize: '24px' }}>➕</span>
                  </div>
                  <h3 style={{ color: theme === 'light' ? '#333' : '#fff', margin: '0 0 10px 0', fontSize: '18px' }}>Add Product</h3>
                  <p style={{ color: theme === 'light' ? '#666' : '#a0aec0', margin: 0, fontSize: '14px' }}>Create new products with details, images, and pricing</p>
                </div>
                
                <div style={{
                  background: theme === 'light' ? '#f8f9fa' : '#1a202c',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568'),
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '10px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '15px'
                  }}>
                    <span style={{ fontSize: '24px' }}>🗑️</span>
                  </div>
                  <h3 style={{ color: theme === 'light' ? '#333' : '#fff', margin: '0 0 10px 0', fontSize: '18px' }}>Delete Product</h3>
                  <p style={{ color: theme === 'light' ? '#666' : '#a0aec0', margin: 0, fontSize: '14px' }}>Remove products from inventory with confirmation</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'orders':
        return (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: theme === 'light' ? '#333' : '#fff', marginBottom: '30px' }}>Order Management</h2>
            <div style={{
              background: theme === 'light' ? '#fff' : '#2d3748',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568')
            }}>
              <p style={{ color: theme === 'light' ? '#666' : '#a0aec0' }}>Order management functionality coming soon...</p>
            </div>
          </div>
        );
      
      case 'categories':
        return (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: theme === 'light' ? '#333' : '#fff', marginBottom: '30px' }}>Category Management</h2>
            <div style={{
              background: theme === 'light' ? '#fff' : '#2d3748',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568')
            }}>
              <p style={{ color: theme === 'light' ? '#666' : '#a0aec0' }}>Category management functionality coming soon...</p>
            </div>
          </div>
        );
      
      case 'brands':
        return (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: theme === 'light' ? '#333' : '#fff', marginBottom: '30px' }}>Brand Management</h2>
            <div style={{
              background: theme === 'light' ? '#fff' : '#2d3748',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568')
            }}>
              <p style={{ color: theme === 'light' ? '#666' : '#a0aec0' }}>Brand management functionality coming soon...</p>
            </div>
          </div>
        );
      
      case 'coupons':
        return (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: theme === 'light' ? '#333' : '#fff', marginBottom: '30px' }}>Coupon Management</h2>
            <div style={{
              background: theme === 'light' ? '#fff' : '#2d3748',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568')
            }}>
              <p style={{ color: theme === 'light' ? '#666' : '#a0aec0' }}>Coupon management functionality coming soon...</p>
            </div>
          </div>
        );
      
      case 'analytics':
        return (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: theme === 'light' ? '#333' : '#fff', marginBottom: '30px' }}>Analytics & Reports</h2>
            <div style={{
              background: theme === 'light' ? '#fff' : '#2d3748',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568')
            }}>
              <p style={{ color: theme === 'light' ? '#666' : '#a0aec0' }}>Analytics functionality coming soon...</p>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: theme === 'light' ? '#333' : '#fff', marginBottom: '30px' }}>Admin Settings</h2>
            <div style={{
              background: theme === 'light' ? '#fff' : '#2d3748',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568')
            }}>
              <p style={{ color: theme === 'light' ? '#666' : '#a0aec0' }}>Settings functionality coming soon...</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: theme === 'light' ? '#f8f9fa' : '#1a202c',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: theme === 'light' ? '#fff' : '#2d3748',
        padding: '15px 30px',
        borderBottom: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568'),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            A
          </div>
          <div>
            <h1 style={{ 
              color: theme === 'light' ? '#2d3748' : '#fff', 
              margin: 0, 
              fontSize: '20px',
              fontWeight: '600'
            }}>
              Admin Dashboard
            </h1>
            <p style={{ 
              color: theme === 'light' ? '#718096' : '#a0aec0',
              margin: '5px 0 0 0',
              fontSize: '14px'
            }}>
              Welcome back, Admin
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={() => navigate('/home')}
            style={{
              background: 'transparent',
              color: theme === 'light' ? '#718096' : '#a0aec0',
              border: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568'),
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            User View
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: '#e53e3e',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
        {/* Sidebar */}
        <div style={{
          width: '280px',
          background: theme === 'light' ? '#fff' : '#2d3748',
          borderRight: '1px solid ' + (theme === 'light' ? '#e2e8f0' : '#4a5568'),
          padding: '20px 0'
        }}>
          <div style={{ padding: '0 20px', marginBottom: '30px' }}>
            <h3 style={{ 
              color: theme === 'light' ? '#2d3748' : '#fff', 
              margin: '0 0 15px 0',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              MAIN MENU
            </h3>
          </div>
          
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedSection(item.id)}
              style={{
                width: '100%',
                padding: '15px 20px',
                background: selectedSection === item.id 
                  ? (theme === 'light' ? '#f3f4f6' : '#2d3748') 
                  : 'transparent',
                color: selectedSection === item.id 
                  ? (theme === 'light' ? '#3182ce' : '#63b3ed') 
                  : (theme === 'light' ? '#4a5568' : '#a0aec0'),
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: selectedSection === item.id ? '600' : '400',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s ease',
                borderRadius: '0',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (selectedSection !== item.id) {
                  e.target.style.background = theme === 'light' ? '#f7fafc' : '#2d3748';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedSection !== item.id) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
              {selectedSection === item.id && (
                <div style={{
                  position: 'absolute',
                  left: '0',
                  top: '0',
                  bottom: '0',
                  width: '3px',
                  background: theme === 'light' ? '#3182ce' : '#63b3ed'
                }} />
              )}
            </button>
          ))}

          <div style={{ padding: '0 20px', marginTop: '30px' }}>
            <h3 style={{ 
              color: theme === 'light' ? '#2d3748' : '#fff', 
              margin: '0 0 15px 0',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              OTHERS
            </h3>
          </div>
          
          <button
            onClick={() => navigate('/')}
            style={{
              width: '100%',
              padding: '15px 20px',
              background: 'transparent',
              color: theme === 'light' ? '#4a5568' : '#a0aec0',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '400',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.3s ease',
              borderRadius: '0'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = theme === 'light' ? '#f7fafc' : '#2d3748';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
          >
            <span style={{ fontSize: '18px' }}>🏠</span>
            Back to Home
          </button>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: 'auto', background: theme === 'light' ? '#f8f9fa' : '#1a202c' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
