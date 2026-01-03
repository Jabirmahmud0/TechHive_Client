import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet, createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import { WishlistProvider } from './context/WishlistContext'
import { ComparisonProvider } from './context/ComparisonContext'
import Loader from './components/Loader'

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'))
const Shop = lazy(() => import('./pages/Shop'))
const ProductDetails = lazy(() => import('./pages/ProductDetails'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Compare = lazy(() => import('./pages/Compare'))
const OrderTracking = lazy(() => import('./pages/OrderTracking'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Profile = lazy(() => import('./pages/Profile'))

// Admin Pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const ProductList = lazy(() => import('./pages/admin/ProductList'))
const OrderList = lazy(() => import('./pages/admin/OrderList'))
const UserList = lazy(() => import('./pages/admin/UserList'))
const ProductEdit = lazy(() => import('./pages/admin/ProductEdit'))

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ComparisonProvider>
              <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Suspense fallback={<Loader />}>
              <Routes>
                {/* Public Routes */}
                <Route element={<Layout><Outlet /></Layout>}>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/order/:orderId" element={<OrderTracking />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<ProductList />} />
                  <Route path="product/new" element={<ProductEdit />} />
                  <Route path="product/:id/edit" element={<ProductEdit />} />
                  <Route path="orders" element={<OrderList />} />
                  <Route path="users" element={<UserList />} />
                </Route>
              </Routes>
              </Suspense>
            </Router>
          </ComparisonProvider>
        </WishlistProvider>
      </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
