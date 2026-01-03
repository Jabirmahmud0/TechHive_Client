import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, Sparkles, ThumbsUp, ThumbsDown, Camera } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [aiDescription, setAiDescription] = useState('');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  
  // Review states
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [image, setImage] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const generateAiDescription = async () => {
    if (!product) return;
    
    setIsGeneratingDescription(true);
    
    try {
      const specs = `
        Category: ${product.category}
        Brand: ${product.brand}
        Price: $${product.price}
        Rating: ${product.rating}/5 (${product.numReviews} reviews)
        In Stock: ${product.countInStock > 0 ? 'Yes' : 'No'}
      `;
      
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: product.name,
          specs,
          tone: 'Professional'
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiDescription(data.description);
      }
    } catch (error) {
      console.error('Error generating AI description:', error);
    } finally {
      setIsGeneratingDescription(false);
    }
  };
  
  const submitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to submit a review');
      return;
    }
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    if (comment.trim() === '') {
      alert('Please enter a comment');
      return;
    }
    
    setReviewLoading(true);
    
    try {
      const response = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ rating, comment, image }),
      });
      
      if (response.ok) {
        // Refresh the product to show the new review
        const refreshProduct = await fetch(`/api/products/${id}`);
        const refreshedProduct = await refreshProduct.json();
        setProduct(refreshedProduct);
        
        // Reset form
        setRating(0);
        setComment('');
        setImage('');
        
        alert('Review submitted successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Error submitting review');
      }
    } catch (error) {
      alert('Error submitting review');
    } finally {
      setReviewLoading(false);
    }
  };

  // Check if user has already reviewed this product
  const hasReviewed = user && product.reviews && product.reviews.some(review => review.user.toString() === user._id);

  if (loading) return <div className="text-center mt-10 text-text-primary">Loading...</div>;
  if (!product) return <div className="text-center mt-10 text-text-primary">Product not found</div>;

  return (
    <div>
      <Link to="/shop" className="inline-flex items-center text-text-secondary hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="bg-surface rounded-lg p-4 border border-gray-800 card">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto object-cover rounded"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex text-secondary mr-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-text-secondary">({product.numReviews} reviews)</span>
          </div>

          <p className="text-2xl font-bold text-primary mb-6">${product.price}</p>

          <div className="mb-6">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-semibold text-text-primary mr-2">Product Description</h3>
              <button
                onClick={generateAiDescription}
                disabled={isGeneratingDescription}
                className="flex items-center text-sm text-primary hover:text-cyan-400 disabled:opacity-50 transition-colors"
              >
                <Sparkles className="w-4 h-4 mr-1" />
                {isGeneratingDescription ? 'Generating...' : 'Enhance with AI'}
              </button>
            </div>
            
            {isGeneratingDescription ? (
              <div className="bg-dark p-4 rounded border border-gray-700">
                <div className="flex items-center text-text-secondary">
                  <div className="w-4 h-4 border-t-2 border-primary rounded-full animate-spin mr-2"></div>
                  Generating enhanced description with AI...
                </div>
              </div>
            ) : aiDescription ? (
              <div 
                className="bg-dark p-4 rounded border border-gray-700 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: aiDescription }}
              />
            ) : (
              <p className="text-text-secondary leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          <div className="bg-surface p-6 rounded-lg border border-gray-800 card">
            <div className="flex justify-between items-center mb-4">
              <span className="text-text-secondary">Status:</span>
              <span className={product.countInStock > 0 ? 'text-success' : 'text-error'}>
                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {product.countInStock > 0 && (
              <div className="flex justify-between items-center mb-6">
                <span className="text-text-secondary">Quantity:</span>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="input-field py-1"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              disabled={product.countInStock === 0}
              className={`w-full py-3 rounded font-bold flex justify-center items-center transition-colors ${
                product.countInStock > 0
                  ? 'btn-primary'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>

      {/* Product Specifications */}
      <div className="mt-12 bg-surface rounded-lg p-6 border border-gray-800 card">
        <h3 className="text-xl font-bold text-text-primary mb-4">Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between py-2 border-b border-gray-800">
            <span className="text-text-secondary">Category</span>
            <span className="text-text-primary">{product.category}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-800">
            <span className="text-text-secondary">Brand</span>
            <span className="text-text-primary">{product.brand}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-800">
            <span className="text-text-secondary">Rating</span>
            <span className="text-text-primary">{product.rating}/5</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-800">
            <span className="text-text-secondary">Reviews</span>
            <span className="text-text-primary">{product.numReviews}</span>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 bg-surface rounded-lg p-6 border border-gray-800 card">
        <h3 className="text-xl font-bold text-text-primary mb-6">Customer Reviews</h3>
        
        {/* Review Form */}
        {user && !hasReviewed && (
          <div className="mb-8 bg-dark p-6 rounded-lg border border-gray-700">
            <h4 className="text-lg font-semibold text-text-primary mb-4">Write a Review</h4>
            <form onSubmit={submitReview}>
              <div className="mb-4">
                <label className="block text-text-secondary mb-2">Rating</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-2xl focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating || rating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-text-secondary mb-2">Review</label>
                <textarea
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="input-field w-full"
                  placeholder="Share your experience with this product..."
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-text-secondary mb-2">Add Image (Optional)</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="input-field w-full"
                  placeholder="Image URL..."
                />
                <small className="text-text-secondary mt-1 block">Paste a direct link to an image</small>
              </div>
              
              <button
                type="submit"
                disabled={reviewLoading}
                className="btn-primary"
              >
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}
        
        {user && hasReviewed && (
          <div className="mb-8 text-text-secondary text-center py-4 bg-dark rounded-lg">
            You have already reviewed this product.
          </div>
        )}
        
        {!user && (
          <div className="mb-8 text-text-secondary text-center py-4 bg-dark rounded-lg">
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link> to submit a review.
          </div>
        )}
        
        {/* Reviews List */}
        <div className="space-y-6">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review) => (
              <div key={review._id} className="border-b border-gray-700 pb-6 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-semibold text-text-primary">{review.name}</h5>
                    <div className="flex items-center mt-1">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(review.rating) ? 'fill-current' : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-text-secondary text-sm">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                      {review.verified && (
                        <span className="ml-2 px-2 py-1 text-xs bg-green-900 text-green-300 rounded">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {review.aiSentiment && (
                    <span className={`px-2 py-1 text-xs rounded ${
                      review.aiSentiment.overall === 'positive' ? 'bg-green-900 text-green-300' :
                      review.aiSentiment.overall === 'negative' ? 'bg-red-900 text-red-300' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {review.aiSentiment.overall?.toUpperCase()}
                    </span>
                  )}
                </div>
                
                <p className="text-text-secondary mb-3">{review.comment}</p>
                
                {review.image && (
                  <div className="mb-3">
                    <img 
                      src={review.image} 
                      alt="Review" 
                      className="max-w-xs max-h-40 rounded border border-gray-700"
                    />
                  </div>
                )}
                
                {review.aiSentiment && review.aiSentiment.summary && (
                  <div className="text-sm text-text-secondary italic mb-2">
                    AI Summary: {review.aiSentiment.summary}
                  </div>
                )}
                
                <div className="flex items-center text-text-secondary text-sm">
                  <button className="flex items-center mr-4 hover:text-primary transition-colors">
                    <ThumbsUp className="w-4 h-4 mr-1" /> {review.helpful || 0}
                  </button>
                  <button className="flex items-center hover:text-primary transition-colors">
                    <ThumbsDown className="w-4 h-4 mr-1" /> {review.notHelpful || 0}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-text-secondary text-center py-4">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;