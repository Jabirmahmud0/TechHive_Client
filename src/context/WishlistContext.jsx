import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { user } = useContext(AuthContext);
  
  // Load wishlist from localStorage or API when user logs in
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const response = await fetch('/api/users/wishlist', {
            headers: {
              'Authorization': `Bearer ${user.token}`,
            },
          });
          
          if (response.ok) {
            const wishlist = await response.json();
            setWishlistItems(wishlist);
          }
        } catch (error) {
          console.error('Error fetching wishlist:', error);
        }
      } else {
        // Clear wishlist when user logs out
        setWishlistItems([]);
      }
    };

    fetchWishlist();
  }, [user]);

  const addToWishlist = async (product) => {
    if (!user) {
      alert('Please log in to add items to your wishlist');
      return;
    }

    try {
      const response = await fetch('/api/users/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ productId: product._id }),
      });

      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.wishlist);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, message: error.message || 'Failed to add to wishlist' };
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, message: 'Network error' };
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;

    try {
      const response = await fetch('/api/users/wishlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.wishlist);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, message: error.message || 'Failed to remove from wishlist' };
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, message: 'Network error' };
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item._id === productId);
  };

  const clearWishlist = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/users/wishlist/clear', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        setWishlistItems([]);
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};