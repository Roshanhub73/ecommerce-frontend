import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryNavigation from '../components/CategoryNavigation';
import ProductList from '../components/ProductList';
import CartDrawer from '../components/CartDrawer';
import LoginPromptModal from '../components/LoginPromptModal';
import { http } from '../services/http';

// Backend: http://localhost:9090/api/products?category=... (Vite proxy forwards /api -> 9090)
const DEFAULT_CATEGORY = 'All';
// Fallback categories if backend doesn't provide them
const FALLBACK_CATEGORIES = ['All', 'Shirts', 'watches', 'shoes', 'Electronics', 'mobileaccessories', 'Sports'];

function getStoredUsername() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user?.username ?? '';
  } catch {
    return '';
  }
}

export default function HomePage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [username, setUsername] = useState(getStoredUsername());
  const [cartError, setCartError] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Check if user is authenticated
  const isAuthenticated = () => {
    const user = localStorage.getItem('user');
    return user && user !== 'null';
  };

  const fetchProducts = async (category, search = '') => {
    setProductsLoading(true);
    setProductsError('');
    try {
      let url = '/products';
      const params = new URLSearchParams();
      
      if (search && search.trim()) {
        params.append('category', search.trim());
      } else if (category && category !== 'All') {
        params.append('category', String(category).toLowerCase());
      } else {
        // For "All" category, fetch a mix of products from different categories
        const categoriesToFetch = ['shirts', 'watches', 'shoes', 'electronics'];
        const productPromises = categoriesToFetch.map(cat => 
          http.get(`/products?category=${cat}`).catch(() => ({ data: { products: [] } }))
        );
        
        const responses = await Promise.all(productPromises);
        const allProducts = responses.flatMap(res => 
          Array.isArray(res.data?.products) ? res.data.products : Array.isArray(res.data) ? res.data : []
        );
        
        // Shuffle and limit to show a good mix
        const shuffled = allProducts.sort(() => Math.random() - 0.5);
        const mixedProducts = shuffled.slice(0, 20); // Limit to 20 products
        
        if (responses[0]?.data?.user?.name) setUsername(responses[0].data.user.name);
        setProducts(mixedProducts);
        return;
      }
      
      const res = await http.get(`${url}?${params.toString()}`);
      const data = res.data;
      // API response: { user: { role, name }, products: [...] }
      if (data?.user?.name) setUsername(data.user.name);
      setProducts(Array.isArray(data?.products) ? data.products : Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Product fetch error:', e);
      
      // Extract detailed error message
      let errorMessage = 'Error fetching products';
      if (e?.response?.data?.message) {
        errorMessage = e.response.data.message;
      } else if (e?.response?.data?.error) {
        errorMessage = e.response.data.error;
      } else if (e?.response?.status) {
        errorMessage = `Server error (${e.response.status}): ${e.response.statusText || 'Unknown error'}`;
      } else if (e?.message) {
        errorMessage = e.message;
      }
      
      setProductsError(errorMessage);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setActiveCategory('All'); // Reset to All when searching
    fetchProducts(null, query);
  };

  const fetchCartCount = async () => {
    const user = getStoredUsername();
    if (!user) {
      setIsCartLoading(false);
      setCartCount(0);
      return;
    }
    setIsCartLoading(true);
    setCartError(false);
    try {
      // Backend: GET /api/cart/count returns total cart count (number)
      const res = await http.get('/cart/count');
      const data = res.data;
      const count = typeof data === 'number' ? data : data?.count ?? 0;
      setCartCount(count);
    } catch {
      setCartError(true);
      setCartCount(0);
    } finally {
      setIsCartLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await http.get('/products');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCategories(['All', ...res.data]);
        }
      } catch (e) {
        console.log('Categories endpoint not available, using fallback categories');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    fetchCartCount();
  }, [username]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSearchQuery(''); // Clear search when selecting category
    fetchProducts(category);
  };

  const handleAddToCart = async (productId) => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      setShowLoginPrompt(true);
      return;
    }

    const user = getStoredUsername();
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      await http.post('/cart/add', {
        username: user,
        productid: productId,
        quantity: 1,
      });
      
      // Update cart count optimistically
      setCartCount(prev => prev + 1);
      
      // Show success feedback
      alert('Product added to cart successfully!');
    } catch (err) {
      console.error('Add to cart error:', err);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  const handleOrdersClick = () => {
    navigate('/orders');
  };

  const handleCartUpdate = () => {
    fetchCartCount();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header 
        cartCount={cartCount} 
        isCartLoading={isCartLoading} 
        cartError={cartError} 
        username={username}
        onCartClick={() => setCartDrawerOpen(true)}
        onSearch={handleSearch}
        onOrdersClick={handleOrdersClick}
        isAuthenticated={isAuthenticated()}
        onLoginClick={() => navigate('/')}
      />

      <nav className="navigation shop-toolbar" aria-label="Categories" style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-primary)',
        padding: '1rem 0'
      }}>
        <CategoryNavigation
          categories={categories}
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
        />
      </nav>

      <main className="main-content shop-main" style={{
        flex: 1,
        padding: '2rem 0',
        background: 'var(--bg-primary)'
      }}>
        {productsLoading && (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            fontWeight: '500'
          }}>
            <div style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '3px solid var(--border-primary)',
              borderTop: '3px solid var(--primary-500)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '1rem'
            }}></div>
            <div>Loading amazing products...</div>
          </div>
        )}
        
        {!productsLoading && productsError && (
          <div style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            background: 'var(--danger-50)',
            border: '1px solid var(--danger-500)',
            borderRadius: 'var(--radius-lg)',
            margin: '2rem auto',
            maxWidth: '500px',
            color: 'var(--danger-600)',
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
            <div>{productsError}</div>
          </div>
        )}
        
        {!productsLoading && !productsError && products.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: 'var(--text-secondary)',
            fontSize: '1.1rem'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: '0.5' }}>📦</div>
            <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>No products found</div>
            <div style={{ fontSize: '0.9rem', opacity: '0.7' }}>
              Try adjusting your search or browse different categories
            </div>
          </div>
        )}
        
        {!productsLoading && !productsError && products.length > 0 && (
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            <ProductList products={products} onAddToCart={handleAddToCart} />
          </div>
        )}
      </main>

      <Footer />

      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        onCartUpdate={handleCartUpdate}
      />

      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        message="Please login to add items to your cart"
      />
    </div>
  );
}
