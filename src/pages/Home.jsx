import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ChevronRight, Zap, TrendingUp, Star, Mail } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [email, setEmail] = useState('');
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch AI recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Mock user preferences for demonstration
        const userPreferences = {
          categories: ['Smartphones', 'Laptops'],
          brands: ['TechCorp', 'GameMaster'],
          priceRange: { min: 100, max: 2000 }
        };
        
        // Mock viewed products for demonstration
        const viewedProducts = products.slice(0, 2).map(p => p._id);
        
        const response = await fetch('/api/ai/recommend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userPreferences, viewedProducts }),
        });
        
        if (response.ok) {
          const recommendations = await response.json();
          setRecommendedProducts(recommendations);
        } else {
          // If response is not ok, still show some products
          const fallbackProducts = products.slice(0, 3);
          setRecommendedProducts(fallbackProducts);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        // Show fallback products on error
        const fallbackProducts = products.slice(0, 3);
        setRecommendedProducts(fallbackProducts);
      }
    };

    // Only fetch recommendations after products are loaded
    if (products.length > 0) {
      fetchRecommendations();
    }
  }, [products]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with ${email}!`);
    setEmail('');
  };

  return (
    // Updated to match the padding and margin of the Header, Footer, and Layout components
    <div className="container mx-auto px-8 space-y-24">
      {/* Hero Section */}
      <section className={`relative overflow-hidden rounded-3xl p-12 md:p-24 mb-16 ${theme === 'light' ? 'light-mode bg-gradient-to-br from-surface-light to-dark-light border border-gray-300' : 'bg-gradient-to-br from-surface to-dark border border-gray-800'}`}>
        {/* Animated background elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse-slow"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 animate-fade-in ${theme === 'light' ? 'text-text-primary-light' : 'text-text-primary'}`}>
              The Future of <span className="text-primary">Tech</span>
            </h1>
            <p className={`text-lg mb-10 max-w-lg animate-fade-in delay-100 ${theme === 'light' ? 'text-text-secondary-light' : 'text-text-secondary'}`}>
              Discover the latest gadgets and electronics with AI-powered recommendations tailored just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-200">
              <Link
                to="/shop"
                className="btn-primary inline-flex items-center justify-center"
              >
                Shop Now
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/shop"
                className="btn-secondary inline-flex items-center justify-center"
              >
                Explore AI Features
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center relative">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <img
                src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Hero Tech"
                className="relative z-10 rounded-2xl shadow-2xl w-full max-w-md border-4 border-surface"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="mb-16">
        <h2 className={`text-3xl font-bold mb-10 flex items-center ${theme === 'light' ? 'text-text-primary-light' : 'text-text-primary'}`}>
          <Zap className="mr-3 text-secondary" />
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['Smartphones', 'Laptops', 'Headphones', 'Smart Watches'].map((category, index) => (
            <Link 
              key={index}
              to={`/shop?category=${category}`}
              className={`group relative rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1 overflow-hidden ${theme === 'light' ? 'light-mode bg-surface-light border border-gray-300 hover:border-primary' : 'bg-surface border border-gray-800 hover:border-primary'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="bg-gray-800 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors duration-300">
                  <div className="bg-gray-600 rounded-full w-8 h-8"></div>
                </div>
                <h3 className={`font-medium text-sm transition-colors duration-300 ${theme === 'light' ? 'text-text-primary-light group-hover:text-primary' : 'text-text-primary group-hover:text-primary'}`}>{category}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AI-Powered Recommendations */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className={`text-3xl font-bold flex items-center ${theme === 'light' ? 'text-text-primary-light' : 'text-text-primary'}`}>
            <Star className="mr-3 text-secondary" />
            AI Recommended For You
          </h2>
          <Link to="/shop" className="btn-tertiary text-sm flex items-center">
            View All
            <ChevronRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        {recommendedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((product) => (
              <div key={product._id} className="animate-fade-in">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-8 ${theme === 'light' ? 'text-text-secondary-light' : 'text-text-secondary'}`}>
            Getting personalized recommendations...
          </div>
        )}
      </section>

      {/* Trending Now */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className={`text-3xl font-bold flex items-center ${theme === 'light' ? 'text-text-primary-light' : 'text-text-primary'}`}>
            <TrendingUp className="mr-3 text-secondary" />
            Trending Now
          </h2>
          <Link to="/shop" className="btn-tertiary text-sm flex items-center">
            View All
            <ChevronRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="text-center text-text-secondary">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <div key={product._id} className="animate-fade-in">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* New Arrivals */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className={`text-3xl font-bold border-b pb-4 ${theme === 'light' ? 'text-text-primary-light border-gray-300' : 'text-text-primary border-gray-800'}`}>
            New Arrivals
          </h2>
          <Link to="/shop" className="btn-tertiary text-sm flex items-center">
            View All
            <ChevronRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className={`text-center ${theme === 'light' ? 'text-text-secondary-light' : 'text-text-secondary'}`}>Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(-4).map((product) => (
              <div key={product._id} className="animate-fade-in">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter Signup */}
      <section className={`rounded-3xl p-12 md:p-16 mb-16 ${theme === 'light' ? 'light-mode bg-gradient-to-r from-surface-light to-dark-light border border-gray-300' : 'bg-gradient-to-r from-surface to-dark border border-gray-800'}`}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h2 className={`text-3xl font-bold mb-4 ${theme === 'light' ? 'text-text-primary-light' : 'text-text-primary'}`}>Stay Updated</h2>
          <p className={`mb-10 max-w-2xl mx-auto ${theme === 'light' ? 'text-text-secondary-light' : 'text-text-secondary'}`}>
            Subscribe to our newsletter for the latest product releases, exclusive deals, and tech insights delivered straight to your inbox.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="input-field flex-grow"
              required
            />
            <button type="submit" className="btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;