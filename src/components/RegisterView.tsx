import { useState } from "react";
import { HomeIcon, ShoppingCartIcon, UserIcon, SearchIcon } from "./Icons";
import { useNavigate } from "react-router-dom";
import "./RegisterView.css";
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

  // Captura de formulario
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    city: "",
    comuna: "",
    sexo: "",
    birthdate: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario, como enviar los datos a una API
    console.log("Formulario enviado:", formData);

    navigate("/login");
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
          <h2 className="form-title">Registro</h2>

          <input
            placeholder="Nombre Completo"
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

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

          <input
            placeholder="Confirmar Contraseña"
            type="password"
            id="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <input
            placeholder="Teléfono"
            type="tel"
            id="phone"
            required
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            placeholder="Dirección "
            type="text"
            id="address"
            required
            value={formData.address}
            onChange={handleChange}
          />

          <input
            placeholder="Ciudad"
            type="text"
            id="city"
            required
            value={formData.city}
            onChange={handleChange}
          />

          <input
            placeholder="Comuna"
            type="text"
            id="comuna"
            required
            value={formData.comuna}
            onChange={handleChange}
          />

          <input
            placeholder="Sexo"
            type="text"
            id="sexo"
            required
            value={formData.sexo}
            onChange={handleChange}
          />

          <input
            placeholder="Fecha de nacimiento"
            type="text"
            id="birthdate"
            required
            value={formData.birthdate}
            onChange={handleChange}
          />

          <button type="submit" className="button">
            Crear cuenta
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
