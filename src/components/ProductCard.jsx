import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye, Heart, Scale } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { WishlistContext } from '../context/WishlistContext';
import { ComparisonContext } from '../context/ComparisonContext';

const ProductCard = ({ product }) => {
  const { theme } = useContext(ThemeContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const { addToComparison, isInComparison, canAddToComparison } = useContext(ComparisonContext);
  
  const handleWishlistToggle = async () => {
    if (isInWishlist(product._id)) {
      await removeFromWishlist(product._id);
    } else {
      const result = await addToWishlist(product);
      if (!result.success) {
        alert(result.message);
      }
    }
  };
  
  const handleComparisonToggle = () => {
    if (isInComparison(product._id)) {
      // If already in comparison, we might want to show a message or remove
      // For now, just inform the user
      alert('Product is already in comparison list');
    } else {
      if (canAddToComparison()) {
        addToComparison(product);
        alert('Product added to comparison');
      } else {
        alert('You can only compare up to 4 products');
      }
    }
  };
  
  return (
    <div className={`rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 group card hover-lift relative ${theme === 'light' ? 'bg-surface-light border border-gray-300 hover:border-primary' : 'bg-surface border border-gray-800 hover:border-primary'}`}>
      <Link to={`/product/${product._id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.countInStock === 0 && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              Out of Stock
            </div>
          )}
          {/* Quick View Button - appears on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button className="bg-primary text-dark p-2 rounded-full hover:bg-cyan-400 transition-colors">
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className={`text-lg font-semibold truncate mb-2 ${theme === 'light' ? 'text-text-primary-light hover:text-primary' : 'text-text-primary hover:text-primary'}`}>
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center mb-2">
          <div className="flex text-secondary mr-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className={`${theme === 'light' ? 'text-text-secondary-light' : 'text-text-secondary'} text-sm`}>({product.numReviews} reviews)</span>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-primary">${product.price}</span>
          <div className="flex space-x-2">
            <button
              onClick={handleComparisonToggle}
              className={`p-2 rounded-full transition-colors ${
                isInComparison(product._id) 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-primary hover:text-white'
              }`}
            >
              <Scale className="w-5 h-5" />
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`p-2 rounded-full transition-colors ${
                isInWishlist(product._id) 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-red-500 hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
            </button>
            <button
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
  );
};

export default ProductCard;