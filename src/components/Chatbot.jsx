import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Image, ShoppingCart } from 'lucide-react';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: 'Hi! I am Nova, your AI assistant. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const messagesEndRef = useRef(null);
  const { cartItems } = useContext(CartContext);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Format history for Gemini API
      const history = messages.map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage.text, 
          history,
          context: {
            cartItems: cartItems.map(item => ({
              name: item.name,
              quantity: item.qty,
              price: item.price
            }))
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const botMessage = { role: 'model', text: errorData.reply || 'Sorry, I encountered an error on the server.' };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const data = await response.json();
        const botMessage = { role: 'model', text: data.reply || 'Sorry, I am having trouble connecting right now.' };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: 'Sorry, I am having trouble connecting right now.' },
      ]);
    } finally {
      setLoading(false);
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
          
          // Add user message indicating image upload
          const userMessage = { role: 'user', text: 'I\'ve uploaded an image for visual search.' };
          setMessages((prev) => [...prev, userMessage]);
          setLoading(true);
          
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
            
            // Create bot response with visual search results
            const botMessage = { 
              role: 'model', 
              text: `I analyzed your image and found a ${result.category}. ${result.description}. Key features: ${result.features.join(', ')}. I can help you find similar products in our store.` 
            };
            setMessages((prev) => [...prev, botMessage]);
            
            // Automatically suggest a search
            setTimeout(() => {
              const searchMessage = { 
                role: 'model', 
                text: `Would you like me to search for "${result.keywords.join(' ')}"?` 
              };
              setMessages((prev) => [...prev, searchMessage]);
            }, 1000);
          } else {
            // Handle error response
            const result = await response.json();
            const errorMessage = { 
              role: 'model', 
              text: result.message || 'Sorry, I couldn\'t analyze that image. Please try another one.' 
            };
            setMessages((prev) => [...prev, errorMessage]);
          }
          
          setIsProcessingImage(false);
          setLoading(false);
        };
        
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Image upload error:', error);
        const errorMessage = { 
          role: 'model', 
          text: 'Sorry, there was an error processing your image.' 
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsProcessingImage(false);
        setLoading(false);
      }
    }
  };

  // Proactive engagement - cart abandonment
  useEffect(() => {
    if (cartItems.length > 0 && messages.length === 1) {
      // Only show once and only if it's the initial message
      const cartValue = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
      
      setTimeout(() => {
        const reminderMessage = { 
          role: 'model', 
          text: `I noticed you have items worth $${cartValue.toFixed(2)} in your cart. Need help with your purchase?` 
        };
        setMessages((prev) => [...prev, reminderMessage]);
      }, 5000);
    }
  }, [cartItems]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-surface border border-gray-800 rounded-lg shadow-2xl w-80 sm:w-96 h-96 flex flex-col mb-4 transition-all duration-300 transform origin-bottom-right card">
          {/* Header */}
          <div className="bg-dark p-4 rounded-t-lg border-b border-gray-800 flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-primary p-1 rounded-full mr-2">
                <Bot className="w-5 h-5 text-dark" />
              </div>
              <h3 className="font-bold text-text-primary">Nova AI</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-dark rounded-br-none'
                      : 'bg-gray-700 text-text-primary rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-text-secondary p-3 rounded-lg rounded-bl-none text-sm italic">
                  Nova is typing...
                  <div className="flex space-x-1 mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            {isProcessingImage && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-text-secondary p-3 rounded-lg rounded-bl-none text-sm italic">
                  Analyzing image...
                  <div className="flex items-center mt-1">
                    <div className="w-4 h-4 border-t-2 border-primary rounded-full animate-spin mr-2"></div>
                    <span>Processing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-gray-800 bg-dark rounded-b-lg">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Ask me anything..."
                className="input-field flex-grow"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading || isProcessingImage}
              />
              <div className="flex items-center ml-2">
                <label className="cursor-pointer text-gray-400 hover:text-primary transition-colors relative mr-2">
                  <Image className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={loading || isProcessingImage}
                  />
                  {isProcessingImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                      <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin"></div>
                    </div>
                  )}
                </label>
                <button
                  type="submit"
                  disabled={loading || isProcessingImage || !input.trim()}
                  className="bg-primary text-dark p-2 rounded-full hover:bg-cyan-400 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-dark p-4 rounded-full shadow-lg hover:bg-cyan-400 transition-all duration-300 hover:scale-110 flex items-center justify-center relative"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {/* Notification dot when new messages */}
        {!isOpen && messages.length > 1 && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-secondary rounded-full"></span>
        )}
      </button>
    </div>
  );
};

export default Chatbot;