import React, { useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    recentRevenue: 0,
    orders: 0,
    users: 0,
    products: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    { 
      title: 'Total Revenue', 
      value: `$${stats.revenue.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'text-green-500' 
    },
    { 
      title: 'Total Orders', 
      value: stats.orders.toString(), 
      icon: ShoppingBag, 
      color: 'text-blue-500' 
    },
    { 
      title: 'Total Customers', 
      value: stats.users.toString(), 
      icon: Users, 
      color: 'text-purple-500' 
    },
    { 
      title: 'Recent Revenue (30d)', 
      value: `$${stats.recentRevenue.toLocaleString()}`, 
      icon: TrendingUp, 
      color: 'text-primary' 
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statItems.map((stat, index) => (
          <div key={index} className="bg-surface p-6 rounded-lg border border-gray-800">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-full bg-dark ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Sales Overview</h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Sales Chart Visualization (Coming Soon)
          </div>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Recent Orders & User Activity (Coming Soon)
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;