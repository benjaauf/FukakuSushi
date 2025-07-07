import { useState } from "react";
import { HomeIcon, ShoppingCartIcon, UserIcon, SearchIcon } from "./Icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "./LoginView.module.css";

export default function LoginView() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
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
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await login(formData.email, formData.password);
      // Redirigir según el tipo de usuario
      if (response.tipo === 'trabajador') {
        if (response.rol === 'admin' || response.rol === 'dueno') {
          navigate("/admin");
        } else if (response.rol === 'cajero') {
          navigate("/cajero");
        } else if (response.rol === 'despacho') {
          navigate("/despachos");
        } else {
          navigate("/inventario");
        }
      } else {
        // Cliente
        navigate("/perfil");
      }
    } catch (err) {
      // El error ya está manejado por el contexto
      console.error("Error en login:", err);
    }
  };
  return (
    <div className={styles.loginView}>
      <header className={styles.header}>
        <div className="logo">
          <h1>FUKUSUKE SUSHI</h1>
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
      <main className={styles.main}>
        <h2 className={styles.formTitle}>Inicio Sesion</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
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

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}
          
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>
      </main>
      <nav className={styles.bottom}>
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
