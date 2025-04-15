import { useState } from "react";
import { HomeIcon, ShoppingCartIcon, UserIcon, SearchIcon } from "./Icons";
import { useNavigate } from "react-router-dom";
import "./LoginView.css";
export default function RegisterPage() {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchTerm("");
    }
  };
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario, como enviar los datos a una API
    console.log("Formulario enviado:", formData);
    navigate("/");
    // Redirigir a la página de perfil después del registro exitoso
  };
  return (
    <div className="register-view">
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
        <form className="form" onSubmit={handleSubmit}>
          <h2 className="form-title">Inicio Sesion</h2>

          <input
            placeholder="Correo Electrónico"
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={handleChange}
          />

          <input
            placeholder="Contraseña"
            type="password"
            id="password"
            required
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit" className="button">
            Inicio sesion
          </button>
        </form>
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
        <button className="nav-item " onClick={() => navigate("/perfil")}>
          <UserIcon />
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
}
