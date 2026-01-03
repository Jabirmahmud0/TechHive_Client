import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { CreditCard, CreditCardIcon, DollarSign, Zap } from 'lucide-react';

const Checkout = () => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }
    
    if (!address || !city || !postalCode || !country) {
      alert('Please fill in all shipping information');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const order = {
        orderItems: cartItems,
        shippingAddress: {
          address,
          city,
          postalCode,
          country,
        },
        paymentMethod,
        taxPrice: 0, // Calculate on backend
        shippingPrice: 0, // Calculate on backend
        totalPrice: cartItems.reduce((acc, item) => acc + item.qty * item.price, 0),
      };
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(order),
      });
      
      if (response.ok) {
        const data = await response.json();
        clearCart();
        alert('Order placed successfully!');
        navigate(`/order/${data._id}`);
      } else {
        const error = await response.json();
        alert(error.message || 'Error placing order');
      }
    } catch (error) {
      alert('Error placing order');
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-text-primary mb-8 text-center">Secure Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="bg-surface p-8 rounded-lg shadow-lg border border-gray-800 card">
            <form onSubmit={submitHandler}>
              <h2 className="text-xl font-bold text-text-primary mb-4">Shipping Address</h2>
              <div className="mb-4">
                <label className="block text-text-secondary mb-2">Address</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-text-secondary mb-2">City</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary mb-2">Postal Code</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="10001"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-text-secondary mb-2">Country</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United States"
                />
              </div>

              <h2 className="text-xl font-bold text-text-primary mb-4">Payment Method</h2>
              <div className="mb-6 space-y-4">
                <label className="flex items-center text-text-secondary cursor-pointer p-3 rounded-lg border border-gray-700 hover:border-primary transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="PayPal"
                    checked={paymentMethod === 'PayPal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 accent-primary h-4 w-4"
                  />
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-primary" />
                    <span className="font-medium">PayPal</span>
                  </div>
                </label>
                
                <label className="flex items-center text-text-secondary cursor-pointer p-3 rounded-lg border border-gray-700 hover:border-primary transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Stripe"
                    checked={paymentMethod === 'Stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 accent-primary h-4 w-4"
                  />
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-primary" />
                    <span className="font-medium">Credit Card (Stripe)</span>
                  </div>
                </label>
                
                <label className="flex items-center text-text-secondary cursor-pointer p-3 rounded-lg border border-gray-700 hover:border-primary transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CashOnDelivery"
                    checked={paymentMethod === 'CashOnDelivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 accent-primary h-4 w-4"
                  />
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-primary" />
                    <span className="font-medium">Cash on Delivery</span>
                  </div>
                </label>
                
                {paymentMethod === 'Stripe' && (
                  <div className="ml-7 pl-4 border-l-2 border-gray-700 pt-4 space-y-4">
                    <div>
                      <label className="block text-text-secondary mb-2">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="input-field"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-text-secondary mb-2">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="input-field"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-text-secondary mb-2">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="input-field"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-surface p-6 rounded-lg border border-gray-800 sticky top-24 card">
            <h2 className="text-xl font-bold text-text-primary mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between text-text-secondary text-sm">
                  <span>{item.name} x {item.qty}</span>
                  <span>${(item.qty * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-800 my-4"></div>
            <div className="flex justify-between mb-2 text-text-secondary">
              <span>Subtotal</span>
              <span>${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2 text-text-secondary">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between mb-2 text-text-secondary">
              <span>Tax</span>
              <span>$0.00</span>
            </div>
            <div className="border-t border-gray-800 my-4"></div>
            <div className="flex justify-between mb-6 text-xl font-bold text-text-primary">
              <span>Total</span>
              <span>${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;