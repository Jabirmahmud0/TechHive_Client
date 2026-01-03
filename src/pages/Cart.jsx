import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  const checkoutHandler = () => {
    navigate('/login?redirect=/checkout');
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/shop" className="inline-flex items-center text-text-secondary hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold text-text-primary mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-surface p-8 rounded-lg border border-gray-800 text-center card">
          <p className="text-text-secondary mb-4">Your cart is empty.</p>
          <Link to="/shop" className="btn-primary inline-block">
            Go Back to Shop
          </Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Cart Items */}
          <div className="md:w-2/3">
            <div className="bg-surface rounded-lg border border-gray-800 overflow-hidden card">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center p-4 border-b border-gray-800 last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded mr-4"
                  />
                  <div className="flex-grow">
                    <Link
                      to={`/product/${item._id}`}
                      className="text-text-primary font-semibold hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-text-secondary text-sm">${item.price}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-text-primary mx-4">Qty: {item.qty}</span>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-error hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:w-1/3">
            <div className="bg-surface p-6 rounded-lg border border-gray-800 sticky top-24 card">
              <h2 className="text-xl font-bold text-text-primary mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2 text-text-secondary">
                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-800 my-4"></div>
              <div className="flex justify-between mb-6 text-xl font-bold text-text-primary">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button
                onClick={checkoutHandler}
                className="btn-primary w-full"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;