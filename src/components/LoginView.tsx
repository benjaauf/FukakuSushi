import { useState } from "react";
import { HomeIcon, ShoppingCartIcon, UserIcon, SearchIcon } from "./Icons";
import { useNavigate } from "react-router-dom";
import styles from "./LoginView.module.css";
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
    navigate("/perfil", { state: { email: formData.email } });
    // Redirigir a la página de perfil después del registro exitoso
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

          <button type="submit" className={styles.button}>
            Inicio sesion
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
