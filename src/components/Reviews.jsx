import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';

const Reviews = ({ reviews }) => {
  // Mock AI Sentiment Analysis
  const sentimentSummary = {
    positive: 85,
    negative: 5,
    neutral: 10,
    keywords: ['Great Battery', 'Clear Screen', 'Fast Shipping'],
  };

  // State for sentiment analysis of individual reviews
  const [reviewSentiments, setReviewSentiments] = useState({});

  // Function to analyze sentiment of a review
  const analyzeReviewSentiment = async (reviewText, reviewId) => {
    try {
      const response = await fetch('/api/ai/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewText }),
      });
      
      if (response.ok) {
        const sentimentData = await response.json();
        setReviewSentiments(prev => ({
          ...prev,
          [reviewId]: sentimentData
        }));
      }
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
    }
  };

  // Analyze sentiments when reviews load
  useEffect(() => {
    if (reviews && reviews.length > 0) {
      reviews.forEach(review => {
        // Only analyze if not already analyzed
        if (!reviewSentiments[review._id]) {
          analyzeReviewSentiment(review.comment, review._id);
        }
      });
    }
  }, [reviews]);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-text-primary mb-6">Customer Reviews</h2>

      {/* AI Sentiment Summary */}
      <div className="bg-surface p-6 rounded-lg border border-gray-800 mb-8 card">
        <h3 className="text-lg font-bold text-primary mb-4 flex items-center">
          <span className="mr-2">✨</span> AI Review Summary
        </h3>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary">Positive</span>
              <span className="text-success">{sentimentSummary.positive}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-success h-2 rounded-full"
                style={{ width: `${sentimentSummary.positive}%` }}
              ></div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary">Neutral</span>
              <span className="text-yellow-400">{sentimentSummary.neutral}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${sentimentSummary.neutral}%` }}
              ></div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary">Negative</span>
              <span className="text-error">{sentimentSummary.negative}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-error h-2 rounded-full"
                style={{ width: `${sentimentSummary.negative}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {sentimentSummary.keywords.map((keyword, index) => (
            <span
              key={index}
              className="bg-dark text-text-secondary px-3 py-1 rounded-full text-sm border border-gray-700"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="bg-surface p-6 rounded-lg border border-gray-800 card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-text-primary font-bold">{review.name}</h4>
                  <div className="flex text-secondary mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(review.rating) ? 'fill-current' : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-text-secondary text-sm">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-text-secondary leading-relaxed mb-4">{review.comment}</p>
              
              {/* Display sentiment analysis if available */}
              {reviewSentiments[review._id] && (
                <div className="mt-4 p-3 bg-dark rounded border border-gray-700">
                  <div className="flex items-center text-sm">
                    <span className="text-text-secondary mr-2">AI Analysis:</span>
                    <span className={`font-medium ${
                      reviewSentiments[review._id].overallSentiment === 'positive' ? 'text-success' :
                      reviewSentiments[review._id].overallSentiment === 'negative' ? 'text-error' :
                      'text-yellow-400'
                    }`}>
                      {reviewSentiments[review._id].overallSentiment}
                    </span>
                    <span className="text-text-secondary ml-2">
                      ({Math.round(reviewSentiments[review._id].confidence * 100)}% confidence)
                    </span>
                  </div>
                  {reviewSentiments[review._id].summary && (
                    <p className="text-text-secondary text-sm mt-1">
                      {reviewSentiments[review._id].summary}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-text-secondary">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default Reviews;