import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const OrderTracking = () => {
  const { orderId } = useParams();
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!user) {
          alert('Please login to view order details');
          return;
        }
        
        const response = await fetch(`/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else {
          alert('Order not found');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user]);

  // Mock timeline data for visualization
  const getOrderTimeline = (order) => {
    if (!order) return [];
    
    const timeline = [
      {
        id: 1,
        status: 'Order Placed',
        date: new Date(order.createdAt).toLocaleDateString(),
        time: new Date(order.createdAt).toLocaleTimeString(),
        completed: true,
        icon: <CheckCircle className="w-5 h-5 text-success" />,
        description: 'Your order has been placed successfully'
      }
    ];
    
    if (order.isPaid) {
      timeline.push({
        id: 2,
        status: 'Payment Confirmed',
        date: new Date(order.paidAt || order.createdAt).toLocaleDateString(),
        time: new Date(order.paidAt || order.createdAt).toLocaleTimeString(),
        completed: true,
        icon: <CheckCircle className="w-5 h-5 text-success" />,
        description: 'Payment has been processed successfully'
      });
    } else {
      timeline.push({
        id: 2,
        status: 'Payment Pending',
        date: new Date(order.createdAt).toLocaleDateString(),
        time: new Date(order.createdAt).toLocaleTimeString(),
        completed: false,
        icon: <Clock className="w-5 h-5 text-gray-500" />,
        description: 'Waiting for payment confirmation'
      });
    }
    
    if (order.isDelivered) {
      timeline.push({
        id: 3,
        status: 'Order Shipped',
        date: new Date(order.createdAt).toLocaleDateString(), // In a real app, this would be the actual shipped date
        time: new Date(order.createdAt).toLocaleTimeString(),
        completed: true,
        icon: <Truck className="w-5 h-5 text-primary" />,
        description: 'Your order has been shipped'
      });
      timeline.push({
        id: 4,
        status: 'Order Delivered',
        date: new Date(order.deliveredAt || order.createdAt).toLocaleDateString(),
        time: new Date(order.deliveredAt || order.createdAt).toLocaleTimeString(),
        completed: true,
        icon: <Package className="w-5 h-5 text-success" />,
        description: 'Your order has been delivered'
      });
    } else {
      timeline.push({
        id: 3,
        status: 'Order Shipped',
        date: new Date(order.createdAt).toLocaleDateString(),
        time: new Date(order.createdAt).toLocaleTimeString(),
        completed: false,
        icon: <Truck className="w-5 h-5 text-gray-500" />,
        description: 'Your order will be shipped soon'
      });
      timeline.push({
        id: 4,
        status: 'Order Delivered',
        date: 'Estimated',
        time: 'TBD',
        completed: false,
        icon: <Package className="w-5 h-5 text-gray-500" />,
        description: 'Your order will be delivered soon'
      });
    }
    
    return timeline;
  };

  if (loading) return <div className="text-center mt-10 text-text-primary">Loading order details...</div>;
  if (!order) return <div className="text-center mt-10 text-text-primary">Order not found</div>;

  const timeline = getOrderTimeline(order);

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/profile" className="inline-flex items-center text-text-secondary hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Profile
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold text-text-primary mb-8">Order Tracking</h1>
      
      {/* Order Summary */}
      <div className={`bg-surface rounded-lg p-6 border border-gray-800 mb-8 card ${theme === 'light' ? 'bg-surface-light border border-gray-300' : 'bg-surface border border-gray-800'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Order #{order._id?.substring(0, 8).toUpperCase()}</h2>
            <p className="text-text-secondary">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.isDelivered 
                ? 'bg-green-900 text-green-300' 
                : order.isPaid 
                  ? 'bg-blue-900 text-blue-300' 
                  : 'bg-yellow-900 text-yellow-300'
            }`}>
              {order.isDelivered ? 'Delivered' : order.isPaid ? 'Processing' : 'Pending Payment'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-text-primary mb-2">Shipping Address</h3>
            <p className="text-text-secondary">
              {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-text-primary mb-2">Payment Method</h3>
            <p className="text-text-secondary">{order.paymentMethod}</p>
          </div>
          <div>
            <h3 className="font-semibold text-text-primary mb-2">Total</h3>
            <p className="text-text-primary font-bold">${order.totalPrice}</p>
          </div>
        </div>
      </div>
      
      {/* Timeline Visualization */}
      <div className={`bg-surface rounded-lg p-6 border border-gray-800 card ${theme === 'light' ? 'bg-surface-light border border-gray-300' : 'bg-surface border border-gray-800'}`}>
        <h2 className="text-xl font-bold text-text-primary mb-6">Order Timeline</h2>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-700 transform -translate-x-1/2"></div>
          
          <div className="space-y-8">
            {timeline.map((step, index) => (
              <div key={step.id} className="relative flex items-start">
                {/* Step icon */}
                <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-4 ${
                  step.completed ? 'bg-primary' : 'bg-gray-700'
                }`}>
                  {step.icon}
                </div>
                
                {/* Step content */}
                <div className="flex-1 pb-8">
                  <div className={`p-4 rounded-lg ${
                    theme === 'light' ? 'bg-gray-100' : 'bg-dark'
                  }`}>
                    <div className="flex justify-between items-start">
                      <h3 className={`font-semibold ${
                        step.completed ? 'text-primary' : 'text-text-secondary'
                      }`}>
                        {step.status}
                      </h3>
                      <span className="text-sm text-text-secondary ml-4 whitespace-nowrap">
                        {step.date} at {step.time}
                      </span>
                    </div>
                    <p className="text-text-secondary mt-2">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Order Items */}
      <div className={`mt-8 bg-surface rounded-lg p-6 border border-gray-800 card ${theme === 'light' ? 'bg-surface-light border border-gray-300' : 'bg-surface border border-gray-800'}`}>
        <h2 className="text-xl font-bold text-text-primary mb-6">Order Items</h2>
        
        <div className="space-y-4">
          {order.orderItems?.map((item, index) => (
            <div key={index} className="flex items-center border-b border-gray-800 pb-4 last:border-b-0">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-16 h-16 object-contain rounded mr-4"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary">{item.name}</h3>
                <p className="text-text-secondary">Quantity: {item.qty}</p>
              </div>
              <p className="font-bold text-primary">${item.price}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-800">
          <div className="flex justify-between">
            <span className="text-text-secondary">Subtotal:</span>
            <span className="text-text-primary">${order.totalPrice}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-text-secondary">Shipping:</span>
            <span className="text-text-primary">${order.shippingPrice || 0}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-text-secondary">Tax:</span>
            <span className="text-text-primary">${order.taxPrice || 0}</span>
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-800 font-bold text-lg">
            <span className="text-text-primary">Total:</span>
            <span className="text-primary">${order.totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;