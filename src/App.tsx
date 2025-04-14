import { Routes, Route } from "react-router-dom"
import CartView from "./components/CartView"
import InventoryView from "./components/InventoryView"
import HomeView from "./components/HomeView"
import "./App.css"

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/carrito" element={<CartView />} />
        <Route path="/inventario" element={<InventoryView />} />
        <Route path="/perfil" element={<div>Página de Perfil</div>} />
      </Routes>
    </div>
  )
}

export default App
