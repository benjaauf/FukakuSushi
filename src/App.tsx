import { Routes, Route, Navigate } from "react-router-dom"
import CartView from "./components/CartView"
import CheckoutView from "./components/CheckoutView"
import PaymentMethodView from "./components/PaymentMethodView"
import OrderConfirmationView from "./components/OrderConfirmationView"
import "./App.css"

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Navigate to="/carrito" replace />} />
        <Route path="/carrito" element={<CartView />} />
        <Route path="/checkout" element={<CheckoutView />} />
        <Route path="/payment" element={<PaymentMethodView />} />
        <Route path="/confirmation" element={<OrderConfirmationView />} />
        <Route path="/inicio" element={<div>Página de Inicio</div>} />
        <Route path="/perfil" element={<div>Página de Perfil</div>} />
      </Routes>
    </div>
  )
}

export default App
