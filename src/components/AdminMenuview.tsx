"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  HomeIcon,
  PackageIcon,
  UserIcon,
  UsersIcon,
  FilterIcon,
  DownloadIcon,
  XIcon,
  CheckIcon,
  ChevronDownIcon,
  CalendarIcon,
  SettingsIcon,
  EditIcon,
} from "./Icons"
import "./AdminMenuView.css";
import axios from 'axios';

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface Order {
  id: number
  customerName: string
  customerEmail: string
  items: OrderItem[]
  total: number
  timestamp: Date
  status: "pending" | "completed" | "cancelled"
  paymentMethod: string
}
interface Producto {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients: string;
  categories: string;
  disponibilidad: number; // 1 = disponible, 0 = no disponible
}

export default function AdminMenuView() {
    const navigate = useNavigate();
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    useEffect(() => {
    axios.get<Producto[]>('http://localhost:3000/producto')
      .then((response) => {
        setProductos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('❌ Error al cargar productos:', error);
        setLoading(false);
      });
  }, []);

   const toggleDisponibilidad = (id: number, nuevaDisponibilidad: number) => {
    axios.put(`http://localhost:3000/producto/${id}`, {
      disponibilidad: nuevaDisponibilidad
    }).then(() => {
      setProductos(prev =>
        prev.map(p =>
          p.id === id ? { ...p, disponibilidad: nuevaDisponibilidad } : p
        )
      );
    }).catch(err => {
      console.error('❌ Error actualizando disponibilidad:', err);
    });
  };

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div className="admin-home-container">
      <header className="home-header">
        <div className="logo">
          <h1>FUKUSUKE SUSHI</h1>
          <h2 className="subtitle">Administración</h2>
        </div>
      </header>

       <div className="AdminMenuView">
      <h1>Gestión de Productos</h1>
      <div className="sushi-list">
        {productos.map(producto => (
          <div className="sushi-card" key={producto.id}>
            <div className="header">
              <h3>{producto.name}</h3>
              <span className={`tag ${producto.disponibilidad ? 'disponible' : 'no-disponible'}`}>
                {producto.disponibilidad ? 'Disponible' : 'No disponible'}
              </span>
            </div>
            <p>{producto.description}</p>
            <p><strong>${producto.price.toLocaleString()}</strong></p>
            <p><em>Ingredientes: {JSON.parse(producto.ingredients).join(', ')}</em></p>
            <div className="switch-row">
              <label>Cambiar disponibilidad:</label>
              <input
                type="checkbox"
                checked={producto.disponibilidad === 1}
                onChange={() =>
                  toggleDisponibilidad(producto.id, producto.disponibilidad === 1 ? 0 : 1)
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>

   


      <nav className="bottom-nav">
        <button className="nav-item active" onClick={() => navigate("/admin")}>
          <HomeIcon />
          <span>Inicio</span>
        </button>
        <button className="nav-item active" onClick={() => navigate("/admin/menu")}>
          <EditIcon />
          <span>Menu</span>
        </button>
        <button className="nav-item" onClick={() => navigate("/admin/usuarios")}>
          <UsersIcon />
          <span>Usuarios</span>
        </button>
        <button className="nav-item" onClick={() => navigate("/perfil")}>
          <UserIcon />
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  )
}
