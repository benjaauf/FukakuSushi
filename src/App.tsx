import { Routes, Route } from "react-router-dom";
import CartView from "./components/CartView";
import InventoryView from "./components/InventoryView";
import HomeView from "./components/HomeView";
import ProfileView from "./components/ProfileView";
import RegisterView from "./components/RegisterView";
import LoginView from "./components/LoginView";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/carrito" element={<CartView />} />
        <Route path="/inventario" element={<InventoryView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/perfil" element={<ProfileView />} />
        <Route path="/login" element={<LoginView />} />
      </Routes>
    </div>
  );
}

export default App;
