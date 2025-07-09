import { Routes, Route, Navigate } from "react-router-dom";
import CartView from "./components/CartView";
import InventoryView from "./components/InventoryView";
import HomeView from "./components/HomeView";
import CheckoutView from "./components/CheckoutView";
import PaymentMethodView from "./components/PaymentMethodView";
import OrderConfirmationView from "./components/OrderConfirmationView";
import CashierView from "./components/CashierView";
import OwnerDashboardView from "./components/OwnerDashboardView";
import AdminHomeView from "./components/AdminHomeView";
import DeliveryManagerView from "./components/DeliveryManagerView";
import UserManagementView from "./components/UserManagementView";
import ProfileView from "./components/ProfileView";
import RegisterView from "./components/RegisterView";
import LoginView from "./components/LoginView";
import EditView from "./components/EditProfile";
import AdminMenuView from "./components/AdminMenuview";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/carrito" element={<CartView />} />
          <Route path="/checkout" element={<CheckoutView />} />
          <Route path="/payment" element={<PaymentMethodView />} />
          <Route path="/confirmacion" element={<OrderConfirmationView />} />
          <Route path="/inventario" element={<InventoryView />} />
          <Route path="/cajero" element={<CashierView />} />
          <Route path="/dueno" element={<OwnerDashboardView />} />
          <Route path="/admin" element={<AdminHomeView />} />
          <Route path="/admin/usuarios" element={<UserManagementView />} />
          <Route path="/admin/menu" element={<AdminMenuView />} />
          <Route path="/despachos" element={<DeliveryManagerView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/perfil" element={<ProfileView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/edit" element={<EditView />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
