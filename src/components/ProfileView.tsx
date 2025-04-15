import { useState } from "react";
import { HomeIcon, ShoppingCartIcon, UserIcon, SearchIcon } from "./Icons";
import { useNavigate } from "react-router-dom";
import "./ProfileView.css";

export default function ProfileView() {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchTerm("");
    }
  };
  return (
    <div className="profile-view">
      <header className="header">
        <div className="logo">
          <h1>FUKAKU SUSHI</h1>
        </div>
        <div className="header-actions">
          <button className="icon-button" onClick={toggleSearch}>
            <SearchIcon />
          </button>
          <button className="icon-button" onClick={() => navigate("/carrito")}>
            <ShoppingCartIcon />
          </button>
        </div>
      </header>

      <main className="main-content">
        <h2 className="profile-title">Perfil</h2>

        {/* Buttons positioned at the bottom */}
        <div className="button-container">
          <button className="button" onClick={() => navigate("/register")}>
            Registrarse
          </button>
          <button className="button" onClick={() => navigate("/login")}>
            Iniciar Sesión
          </button>
        </div>
      </main>

      <nav className="bottom">
        <button className="nav-item" onClick={() => navigate("/")}>
          <HomeIcon />
          <span>Inicio</span>
        </button>
        <button className="nav-item" onClick={() => navigate("/carrito")}>
          <ShoppingCartIcon />
          <span>Carrito</span>
        </button>
        <button className="nav-item active" onClick={() => navigate("/perfil")}>
          <UserIcon />
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
}
