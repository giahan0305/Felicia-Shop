import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from '@components/header/header';
import Footer from '@components/footer/footer';
import DefaultLayout from '@components/ui/DefaultLayout';
import ScrollToTop from '@components/ScrollToTop';
import Login from '@components/ui/Login';
import Regist from '@components/ui/Regist';
import ConfirmRegist from '@components/ui/ConfirmRegist';
import ProductDetail from '@components/ui/Product';
import AdminLayout from '@components/admin/AdminLayout';
import AdminHome from '@components/admin/AdminHomePage';
import { AuthProvider, AuthContext } from '@contexts/AuthContext';
import { useContext } from 'react';
import AdminUser from '@components/admin/AdminUserManagement';
import AdminCategory from '@components/admin/AdminCategory';
import AdminProduct from '@components/admin/AdminProduct';
import AdminAddProduct from '@components/admin/AdminAddProduct'
import AdminOrder from '@components/admin/AdminOrders'
function App() {
  const { userRole } = useContext(AuthContext);
   
  return (
    <Router>
      <ScrollToTop />
      {userRole !== 'ROLE_ADMIN' && <Header />}
      <Routes>
        {/* Public Routes */}
        <Route path="/home" element={<DefaultLayout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Regist />} />
        <Route path="/confirmregister" element={<ConfirmRegist />} />
        <Route path="/Product" element={<ProductDetail />} />

        {/* Admin Routes */}
        {userRole === 'ROLE_ADMIN' && (
          <>
            <Route path="/admin/users" element={<AdminLayout><AdminUser/></AdminLayout>} />
            <Route path="/admin/index" element={<AdminLayout><AdminHome /></AdminLayout>} />
            <Route path="/admin/categories" element={<AdminLayout><AdminCategory /></AdminLayout>} />
            <Route path="/admin/products" element={<AdminLayout><AdminProduct /></AdminLayout>} />
            <Route path="/admin/orders" element={<AdminLayout><AdminOrder /></AdminLayout>} />
            <Route path="/admin/addproduct" element={<AdminLayout><AdminAddProduct /></AdminLayout>} />
          </>
        )}

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        {/* Redirect to home if trying to access admin routes without being an admin */}
        {userRole !== 'ROLE_ADMIN' && <Route path="/admin/*" element={<Navigate to="/home" replace />} />}
      </Routes>
      {userRole !== 'ROLE_ADMIN' && <Footer />}
    </Router>
  );
}

export default function WrappedApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
