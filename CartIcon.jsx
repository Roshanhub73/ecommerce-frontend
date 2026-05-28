import './shop.css';

export default function CartIcon({ count = 0, isLoading, hasError, onClick }) {
  const showBadge =
    !isLoading &&
    !hasError &&
    (typeof count === 'number' ? count > 0 : String(count) !== '0' && count !== 'Error');
  const label = isLoading ? '...' : hasError ? 'Error' : count;

  return (
    <button
      type="button"
      className="icon-btn"
      onClick={onClick}
      aria-label={`Cart${typeof label === 'number' ? `, ${label} items` : ''}`}
      disabled={isLoading}
    >
      <span className="icon" aria-hidden="true">
        🛒
      </span>
      {(showBadge || isLoading || hasError) && (
        <span className={showBadge ? 'badge' : 'cart-label'}>{label}</span>
      )}
    </button>
  );
}

