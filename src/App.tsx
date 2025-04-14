import { Routes, Route, Navigate } from "react-router-dom"
import CartView from "./components/CartView"
import "./App.css"

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Navigate to="/carrito" replace />} />
        <Route path="/carrito" element={<CartView />} />
        <Route path="/inicio" element={<div>Página de Inicio</div>} />
        <Route path="/perfil" element={<div>Página de Perfil</div>} />
      </Routes>
    </div>
  )
}

export default App
