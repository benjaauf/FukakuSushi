import { useState, useEffect } from "react";
import { HomeIcon, ShoppingCartIcon, UserIcon, SearchIcon } from "./Icons";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Profileview.module.css";

export default function ProfileView() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchTerm("");
    }
  };
  const location = useLocation();
  const mail = location.state?.email || null; // Obtener el email del estado de la ubicación

  useEffect(() => {
    if (mail) {
      setUser(mail);
    }
    console.log("User email:", mail);
  }, [mail]);

  return (
    <div className={styles.profileView}>
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
        {!user ? (
          <>
            <h2 className={styles.profileTitle}>Perfil no iniciado</h2>
            <div className={styles.buttonContainer}>
              <button
                className={styles.button}
                onClick={() => navigate("/register")}
              >
                Registrarse
              </button>
              <button
                className={styles.button}
                onClick={() => navigate("/login")}
              >
                Iniciar Sesión
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className={styles.profileTitle}>Perfil de {user}</h2>
            <div className={styles.userInfo}>
              <p>Email: {user}</p>
              {/* Aquí puedes agregar más información del usuario */}
            </div>
            <div className={styles.buttonContainer}>
              <button
                className={styles.button}
                onClick={() => navigate("/edit", { state: { email: user } })} // Pasar el email al editar perfil
              >
                Editar Perfil
              </button>
              <button className={styles.button} onClick={() => setUser(null)}>
                Cerrar Sesion
              </button>
            </div>
          </>
        )}
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
        <button className="nav-item active" onClick={() => navigate("/perfil")}>
          <UserIcon />
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
}
