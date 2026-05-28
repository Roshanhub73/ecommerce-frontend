import './shop.css';

export default function Footer() {
  return (
    <footer className="shop-footer">
      <div className="shop-footer-inner">
        <p className="shop-footer-text">
          © {new Date().getFullYear()} Roshan Store. All rights reserved.
        </p>
        <p className="shop-footer-links">
          <a href="#privacy">Privacy</a>
          <span className="sep"> · </span>
          <a href="#terms">Terms</a>
          <span className="sep"> · </span>
          <a href="#contact">Contact</a>
        </p>
      </div>
    </footer>
  );
}
