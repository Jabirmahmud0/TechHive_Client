import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Sun, Moon, Heart, Scale } from 'lucide-react';
import SmartSearch from './SmartSearch';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { WishlistContext } from '../context/WishlistContext';
import { ComparisonContext } from '../context/ComparisonContext';

const Header = () => {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { wishlistItems } = useContext(WishlistContext);
  const { comparedProducts } = useContext(ComparisonContext);

  return (
    // Align logo and search bar on the same line
    <header className={`sticky top-0 z-50 border-b ${theme === 'light' ? 'light-mode bg-surface-light border-gray-300' : 'bg-surface border-gray-800'}`}>
      <div className="container mx-auto px-10 py-5">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-3xl font-bold text-primary tracking-wide">
            TechHive
          </Link>

          {/* Search Bar - Centered */}
          <div className="hidden md:block w-1/3">
            <SmartSearch />
          </div>

          {/* Navigation Icons */}
          <nav className="flex items-center space-x-6">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="text-gray-300 hover:text-primary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-7 h-7" /> : <Moon className="w-7 h-7" />}
            </button>
            
            <Link to="/compare" className="relative text-gray-300 hover:text-primary transition-colors mr-4">
              <Scale className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 bg-secondary text-black text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {comparedProducts.length}
              </span>
            </Link>
            <Link to="/wishlist" className="relative text-gray-300 hover:text-primary transition-colors mr-4">
              <Heart className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 bg-secondary text-black text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistItems.length}
              </span>
            </Link>
            <Link to="/cart" className="relative text-gray-300 hover:text-primary transition-colors">
              <ShoppingCart className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 bg-secondary text-black text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </Link>
            {user ? (
              <Link to="/profile" className="text-gray-300 hover:text-primary transition-colors">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.name} 
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-7 h-7" />
                )}
              </Link>
            ) : (
              <Link to="/login" className="text-gray-300 hover:text-primary transition-colors">
                <User className="w-7 h-7" />
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;