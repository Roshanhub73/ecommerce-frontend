import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import './shop.css';

export default function LoginPromptModal({ isOpen, onClose, message = "Please login to add items to your cart" }) {
  const { theme } = useTheme();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate('/');
  };

  return (
    <>
      <div className="login-prompt-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="login-prompt-modal" role="dialog" aria-modal="true" aria-labelledby="login-prompt-title">
        <div className="login-prompt-header">
          <h3 id="login-prompt-title" className="login-prompt-title">Login Required</h3>
          <button 
            type="button" 
            className="login-prompt-close" 
            onClick={onClose}
            aria-label="Close login prompt"
          >
            ✕
          </button>
        </div>
        
        <div className="login-prompt-content">
          <div className="login-prompt-icon">🔐</div>
          <p className="login-prompt-message">{message}</p>
          
          <div className="login-prompt-actions">
            <button
              type="button"
              className="login-prompt-btn login-prompt-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="login-prompt-btn login-prompt-login"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
