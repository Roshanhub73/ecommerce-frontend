import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

function RegisterPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('CUSTOMER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const requestBody = {
        username,
        email,
        password,
        role: role,
      };
      
      console.log('Registration request body:', JSON.stringify(requestBody, null, 2));
      console.log('Request headers:', {
        'Content-Type': 'application/json',
      });
      console.log('Request URL:', '/api/user/register');

      const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Backend error response:', errorText);
        
        let errorData = {};
        try {
          errorData = JSON.parse(errorText);
        } catch {
          console.log('Could not parse error as JSON, using raw text');
        }
        
        throw new Error(errorData.message || errorData.error || errorText || 'Registration failed');
      }

      const data = await response.json();
      console.log('🔍 Register response data:', data);
      console.log('🔍 Data keys:', Object.keys(data));
      console.log('🔍 Token fields:', {
        token: data.token,
        jwt: data.jwt,
        accessToken: data.accessToken,
        authorization: data.authorization,
        bearer: data.bearer
      });
      
      // Check for token in multiple possible fields
      const token = data.token || data.jwt || data.accessToken || data.authorization || data.bearer;
      
      if (token) {
        console.log('🔍 Found token:', token.substring(0, 20) + '...');
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({
          username: data.username || username,
          email: data.email || email,
          role: data.role || role,
        }));
        navigate('/home');
      } else {
        console.log('🔍 No token found in response. Full response:', data);
        // Try to proceed without token for now, but warn
        console.warn('⚠️ No token received, proceeding without authentication');
        localStorage.setItem('user', JSON.stringify({
          username: data.username || username,
          email: data.email || email,
          role: data.role || role,
        }));
        navigate('/home');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      backgroundImage: 'url("https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      fontFamily: 'Arial, sans-serif',
      paddingRight: '50px'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(52, 73, 94, 0.95), rgba(44, 62, 80, 0.95))',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        width: '100%',
        maxWidth: '400px',
        marginRight: '20px'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#fff',
          fontSize: '28px',
          fontWeight: '700'
        }}>
          Create Account
        </h2>
        
        {error && (
          <div style={{
            background: 'rgba(231, 76, 60, 0.9)',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              padding: '16px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              fontSize: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              width: '100%'
            }}
          />
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: '16px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              fontSize: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              width: '100%'
            }}
          />
          
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: '16px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                fontSize: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                width: '100%'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            style={{
              padding: '16px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              fontSize: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              width: '100%',
              cursor: 'pointer'
            }}
          >
            <option value="" style={{ backgroundColor: '#2c3e50', color: '#fff' }}>Select Role</option>
            <option value="CUSTOMER" style={{ backgroundColor: '#2c3e50', color: '#fff' }}>Customer</option>
            <option value="ADMIN" style={{ backgroundColor: '#2c3e50', color: '#fff' }}>Admin</option>
          </select>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '16px',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: loading 
                ? 'rgba(149, 165, 166, 0.8)'
                : 'linear-gradient(135deg, rgba(46, 204, 113, 0.9), rgba(39, 174, 96, 0.9))',
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '14px'
        }}>
          Already have an account? 
          <button
            onClick={() => navigate('/')}
            style={{ 
              background: 'none',
              border: 'none',
              color: '#3498db',
              textDecoration: 'none',
              fontWeight: '600',
              marginLeft: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
