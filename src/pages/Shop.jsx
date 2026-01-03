import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Apply price filter
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        // Featured - default order
        break;
    }

    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  // Get unique categories for filter
  const categories = [...new Set(products.map(product => product.category))];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-1/4">
        <div className="bg-surface p-6 rounded-lg border border-gray-800 sticky top-24 card">
          <h3 className="text-xl font-bold text-text-primary mb-4">Filters</h3>
          
          {/* Search */}
          <div className="mb-6">
            <h4 className="text-text-secondary font-semibold mb-2">Search</h4>
            <input
              type="text"
              placeholder="Search products..."
              className="input-field"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Categories */}
          <div className="mb-6">
            <h4 className="text-text-secondary font-semibold mb-2">Categories</h4>
            <ul className="space-y-2 text-text-secondary text-sm">
              <li>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    className="mr-2 accent-primary"
                    checked={selectedCategory === ''}
                    onChange={() => setSelectedCategory('')}
                  />
                  <span className="hover:text-text-primary">All Categories</span>
                </label>
              </li>
              {categories.map((category, index) => (
                <li key={index}>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      className="mr-2 accent-primary"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                    />
                    <span className="hover:text-text-primary">{category}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h4 className="text-text-secondary font-semibold mb-2">Price Range</h4>
            <div className="mb-2">
              <input
                type="range"
                min="0"
                max="2000"
                step="10"
                className="w-full accent-primary"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              />
            </div>
            <div className="flex justify-between text-text-secondary text-sm">
              <span>$0</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <div className="w-full md:w-3/4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-text-primary">Shop All</h2>
          
          {/* Sort By */}
          <div className="flex items-center">
            <span className="text-text-secondary mr-2">Sort by:</span>
            <select
              className="input-field py-1"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center text-text-secondary">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-text-secondary py-12">
            No products found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;