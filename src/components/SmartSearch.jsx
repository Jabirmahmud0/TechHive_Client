import React, { useState, useContext } from 'react';
import { Search, Camera, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const SmartSearch = () => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${query}`);
      setIsExpanded(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsProcessingImage(true);
      
      try {
        // Convert image to base64
        const reader = new FileReader();
        reader.onload = async (event) => {
          const imageBase64 = event.target.result;
          
          // Send to backend for AI analysis
          const response = await fetch('/api/ai/visual-search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageBase64 }),
          });
          
          if (response.ok) {
            const result = await response.json();
            // Navigate to search results with keywords
            const searchQuery = result.keywords.join(' ');
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
          } else {
            alert('Visual search failed. Please try again.');
          }
          
          setIsProcessingImage(false);
        };
        
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Visual search error:', error);
        alert('Visual search failed. Please try again.');
        setIsProcessingImage(false);
      }
    }
  };

  return (
    <div className={`relative transition-all duration-300 ${isExpanded ? 'w-full md:w-96' : 'w-full md:w-64'}`}>
      <form onSubmit={handleSearch} className="relative flex items-center">
        <input
          type="text"
          placeholder="Search for products..."
          className={`w-full ${theme === 'light' ? 'bg-surface-light border border-gray-300 text-text-primary-light' : 'bg-surface border border-gray-700 text-text-primary'} rounded-lg py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all pl-10 pr-12`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onBlur={() => setTimeout(() => setIsExpanded(false), 200)}
        />
        <Search className="absolute left-3 text-gray-400 w-5 h-5" />
        
        <div className="absolute right-3 flex items-center space-x-2">
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <label className="cursor-pointer text-gray-400 hover:text-primary transition-colors relative">
            <Camera className="w-5 h-5" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={isProcessingImage}
            />
            {isProcessingImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin"></div>
              </div>
            )}
          </label>
        </div>
      </form>
      
      {/* Visual search processing indicator */}
      {isProcessingImage && (
        <div className={`absolute right-0 top-full mt-2 rounded-lg p-3 shadow-lg w-48 ${theme === 'light' ? 'bg-surface-light border border-gray-300' : 'bg-surface border border-gray-800'}`}>
          <div className="flex items-center">
            <div className="w-4 h-4 border-t-2 border-primary rounded-full animate-spin mr-2"></div>
            <span className={`${theme === 'light' ? 'text-text-secondary-light' : 'text-text-secondary'} text-sm`}>Analyzing image...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSearch;