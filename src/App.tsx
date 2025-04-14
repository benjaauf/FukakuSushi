import { Routes, Route, Navigate } from "react-router-dom"
import CartView from "./components/CartView"
import InventoryView from "./components/InventoryView"
import "./App.css"

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Navigate to="/inventario" replace />} />
        <Route path="/carrito" element={<CartView />} />
        <Route path="/inventario" element={<InventoryView />} />
        <Route path="/perfil" element={<div>Página de Perfil</div>} />
      </Routes>
    </div>
  )
}

export default App
