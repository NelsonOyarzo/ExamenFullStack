
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import WebpayReturnPage from './pages/WebpayReturnPage';
import DiscoverPage from './pages/DiscoverPage';
import OddiePage from './pages/OddiePage';
import AboutPage from './pages/AboutPage';
import TermsPage from './pages/TermsPage';
import UserDashboardPage from './pages/UserDashboardPage';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <CartProvider>
              <div className="min-h-screen flex flex-col bg-brand-white dark:bg-brand-black">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/catalogo" element={<CatalogPage />} />
                    <Route path="/producto/:id" element={<ProductDetailPage />} />
                    <Route path="/carrito" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/webpay-return" element={<WebpayReturnPage />} />
                    <Route path="/ordenes" element={<OrderHistoryPage />} />
                    <Route path="/orden/:id" element={<OrderConfirmationPage />} />
                    <Route path="/contacto" element={<ContactPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/admin" element={<AdminDashboardPage />} />
                    <Route path="/dashboard" element={<UserDashboardPage />} />
                    <Route path="/descubrir" element={<DiscoverPage />} />
                    <Route path="/oddie" element={<OddiePage />} />
                    <Route path="/nosotros" element={<AboutPage />} />
                    <Route path="/terminos" element={<TermsPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </CartProvider>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
