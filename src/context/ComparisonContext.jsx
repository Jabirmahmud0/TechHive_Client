import React, { createContext, useState, useContext } from 'react';

export const ComparisonContext = createContext();

export const ComparisonProvider = ({ children }) => {
  const [comparedProducts, setComparedProducts] = useState([]);

  const addToComparison = (product) => {
    // Check if product is already in comparison list
    const exists = comparedProducts.some(item => item._id === product._id);
    
    if (!exists && comparedProducts.length < 4) { // Limit to 4 products for comparison
      setComparedProducts(prev => [...prev, product]);
      return true;
    }
    return false;
  };

  const removeFromComparison = (productId) => {
    setComparedProducts(prev => prev.filter(item => item._id !== productId));
  };

  const clearComparison = () => {
    setComparedProducts([]);
  };

  const isInComparison = (productId) => {
    return comparedProducts.some(item => item._id === productId);
  };

  const canAddToComparison = () => {
    return comparedProducts.length < 4;
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparedProducts,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        canAddToComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};