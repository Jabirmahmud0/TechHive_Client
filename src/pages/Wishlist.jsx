import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowLeft, ShoppingCart } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const { theme } = useContext(ThemeContext);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/shop" className="inline-flex items-center text-text-secondary hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold text-text-primary mb-8">Your Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="bg-surface p-8 rounded-lg border border-gray-800 text-center card">
          <p className="text-text-secondary mb-4">Your wishlist is empty.</p>
          <Link to="/shop" className="btn-primary inline-block">
            Browse Products
          </Link>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-text-primary">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in wishlist
            </h2>
            <button
              onClick={clearWishlist}
              className="text-error hover:text-red-400 transition-colors text-sm"
            >
              Clear Wishlist
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((product) => (
              <div
                key={product._id}
                className={`rounded-lg overflow-hidden shadow-lg transition-all duration-300 group card ${theme === 'light' ? 'bg-surface-light border border-gray-300' : 'bg-surface border border-gray-800'}`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.countInStock === 0 && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      Out of Stock
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <Link to={`/product/${product._id}`} className="block">
                    <h3 className={`text-lg font-semibold mb-2 ${theme === 'light' ? 'text-text-primary-light hover:text-primary' : 'text-text-primary hover:text-primary'}`}>
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center mb-2">
                    <div className="flex text-secondary mr-2">
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
                    </div>
                    <span className={`${theme === 'light' ? 'text-text-secondary-light' : 'text-text-secondary'} text-sm`}>({product.numReviews} reviews)</span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-bold text-primary">${product.price}</span>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => removeFromWishlist(product._id)}
                        className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.countInStock === 0}
                        className={`p-2 rounded-full transition-colors ${
                          product.countInStock > 0
                            ? 'bg-primary text-dark hover:bg-cyan-400'
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;