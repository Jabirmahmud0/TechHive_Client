import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, X, ShoppingCart } from 'lucide-react';
import { ComparisonContext } from '../context/ComparisonContext';
import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';

const Compare = () => {
  const { comparedProducts, removeFromComparison, clearComparison } = useContext(ComparisonContext);
  const { addToCart } = useContext(CartContext);
  const { theme } = useContext(ThemeContext);

  const removeFromComparisonHandler = (productId) => {
    removeFromComparison(productId);
  };

  const addToCartHandler = (product) => {
    addToCart(product, 1);
  };

  // Function to get all unique keys from all products for comparison table
  const getAllKeys = () => {
    const allKeys = new Set();
    comparedProducts.forEach(product => {
      Object.keys(product).forEach(key => {
        if (key !== '_id' && key !== 'image' && key !== 'description' && key !== '__v' && key !== 'user' && key !== 'reviews' && key !== 'numReviews') {
          allKeys.add(key);
        }
      });
    });
    return Array.from(allKeys);
  };

  const allKeys = getAllKeys();

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/shop" className="inline-flex items-center text-text-secondary hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
        </Link>
      </div>
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Product Comparison</h1>
        {comparedProducts.length > 0 && (
          <button
            onClick={clearComparison}
            className="text-error hover:text-red-400 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {comparedProducts.length === 0 ? (
        <div className="bg-surface p-8 rounded-lg border border-gray-800 text-center card">
          <p className="text-text-secondary mb-4">No products added to comparison.</p>
          <Link to="/shop" className="btn-primary inline-block">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Product Headers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {comparedProducts.map((product) => (
              <div 
                key={product._id} 
                className={`bg-surface rounded-lg p-4 border border-gray-800 card ${theme === 'light' ? 'bg-surface-light border border-gray-300' : 'bg-surface border border-gray-800'}`}
              >
                <div className="relative">
                  <button
                    onClick={() => removeFromComparisonHandler(product._id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-contain mb-4 rounded"
                  />
                </div>
                <h3 className="font-semibold text-text-primary mb-2 text-center">{product.name}</h3>
                <p className="text-primary font-bold text-center mb-4">${product.price}</p>
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-current text-secondary' : 'text-gray-600'
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                  <span className="text-text-secondary text-sm ml-1">({product.numReviews})</span>
                </div>
                <button
                  onClick={() => addToCartHandler(product)}
                  disabled={product.countInStock === 0}
                  className={`w-full py-2 rounded font-bold flex justify-center items-center transition-colors ${
                    product.countInStock > 0
                      ? 'btn-primary'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto border border-gray-800 rounded-lg">
            <table className="min-w-full">
              <thead>
                <tr className={`${theme === 'light' ? 'bg-surface-light' : 'bg-surface'}`}>
                  <th className={`p-4 text-left ${theme === 'light' ? 'text-text-primary-light' : 'text-text-primary'}`}>Feature</th>
                  {comparedProducts.map((product) => (
                    <th key={product._id} className={`p-4 text-center font-semibold ${theme === 'light' ? 'text-text-primary-light' : 'text-text-primary'}`}>
                      {product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allKeys.map((key) => (
                  <tr 
                    key={key} 
                    className={`border-t ${theme === 'light' ? 'border-gray-300' : 'border-gray-800'} ${key % 2 === 0 ? (theme === 'light' ? 'bg-gray-50' : 'bg-dark') : ''}`}
                  >
                    <td className={`p-4 font-medium ${theme === 'light' ? 'text-text-primary-light' : 'text-text-primary'}`}>
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </td>
                    {comparedProducts.map((product) => (
                      <td key={`${product._id}-${key}`} className="p-4 text-center">
                        {key === 'createdAt' || key === 'updatedAt' 
                          ? new Date(product[key]).toLocaleDateString() 
                          : product[key] !== undefined && product[key] !== null 
                            ? String(product[key]) 
                            : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;