import React, { useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const AdminLayout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-dark text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-primary tracking-wider">TechHive Admin</h1>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <Link to="/admin" className="flex items-center p-3 rounded hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link to="/admin/products" className="flex items-center p-3 rounded hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
            <Package className="w-5 h-5 mr-3" />
            Products
          </Link>
          <Link to="/admin/orders" className="flex items-center p-3 rounded hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
            <ShoppingBag className="w-5 h-5 mr-3" />
            Orders
          </Link>
          <Link to="/admin/users" className="flex items-center p-3 rounded hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
            <Users className="w-5 h-5 mr-3" />
            Users
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded hover:bg-red-900/20 text-red-500 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
