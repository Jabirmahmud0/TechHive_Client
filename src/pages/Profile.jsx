import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, MapPin } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const response = await fetch('/api/users/orders', {
            headers: {
              'Authorization': `Bearer ${user.token}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            setOrders(data);
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div className="text-center mt-10 text-text-primary">Please login to view profile.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-8">
      <h2 className="text-3xl font-bold text-primary mb-6">My Profile</h2>
      
      <div className="bg-surface p-6 rounded-lg shadow-lg border border-gray-800 card">
        <div className="mb-4">
          <label className="block text-text-secondary text-sm font-bold mb-2">Name</label>
          <p className="text-xl text-text-primary">{user.name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-text-secondary text-sm font-bold mb-2">Email</label>
          <p className="text-xl text-text-primary">{user.email}</p>
        </div>
        <div className="mb-6">
          <label className="block text-text-secondary text-sm font-bold mb-2">Account Type</label>
          <p className="text-xl text-text-primary">{user.isAdmin ? 'Admin' : 'Customer'}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-error text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
      
      {/* Order History Section */}
      <div className="bg-surface p-6 rounded-lg shadow-lg border border-gray-800 card">
        <h3 className="text-2xl font-bold text-text-primary mb-6">Order History</h3>
        
        {loading ? (
          <div className="text-center text-text-secondary py-4">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-text-secondary py-8">
            <Package className="w-12 h-12 mx-auto text-gray-600 mb-4" />
            <p>You haven't placed any orders yet.</p>
            <Link to="/shop" className="text-primary hover:underline mt-2 inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="py-3 px-4 text-left text-text-secondary">Order ID</th>
                  <th className="py-3 px-4 text-left text-text-secondary">Date</th>
                  <th className="py-3 px-4 text-left text-text-secondary">Total</th>
                  <th className="py-3 px-4 text-left text-text-secondary">Status</th>
                  <th className="py-3 px-4 text-left text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-800 hover:bg-dark transition-colors">
                    <td className="py-3 px-4 text-text-primary">#{order._id.substring(0, 8).toUpperCase()}</td>
                    <td className="py-3 px-4 text-text-secondary">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-text-primary font-bold">${order.totalPrice}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.isDelivered
                          ? 'bg-green-900 text-green-300'
                          : order.isPaid
                            ? 'bg-blue-900 text-blue-300'
                            : 'bg-yellow-900 text-yellow-300'
                      }`}>
                        {order.isDelivered ? 'Delivered' : order.isPaid ? 'Processing' : 'Pending Payment'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/order/${order._id}`}
                        className="text-primary hover:text-cyan-400 transition-colors inline-flex items-center"
                      >
                        <MapPin className="w-4 h-4 mr-1" /> Track
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;