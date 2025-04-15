"use client"

import { useNavigate, useLocation } from "react-router-dom"
import "./OrderConfirmationView.css"
import { HomeIcon, ShoppingCartIcon, UserIcon, SearchIcon } from "./Icons"

interface OrderConfirmationProps {
  orderItems?: {
    name: string
    image: string
  }[]
}

export default function OrderConfirmationView({
  orderItems = [
    { name: "Tobiko California Roll", image: "/sushi1.jpg" },
    { name: "Smoked Salmon Roll", image: "/sushi2.jpg" },
  ],
}: OrderConfirmationProps) {
  const navigate = useNavigate()
  const location = useLocation()

  // Generar una hora de entrega aleatoria (entre 30 min y 1 hora desde ahora)
  const getDeliveryTime = () => {
    const now = new Date()
    const deliveryTime = new Date(now.getTime() + (30 + Math.floor(Math.random() * 30)) * 60000)
    return deliveryTime.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })
  }

  const handleCancelOrder = () => {
    navigate("/inicio")
  }

  return (
    <div className="confirmation-container">
      <header className="confirmation-header">
        <div className="confirmation-title">
          <h1>Compra</h1>
        </div>
        <div className="header-icons">
          <button className="search-button">
            <SearchIcon />
          </button>
          <button className="cart-button" onClick={() => navigate("/carrito")}>
            <ShoppingCartIcon />
          </button>
        </div>
      </header>

      <div className="confirmation-content">
        <div className="thank-you-message">Gracias por tu pedido!</div>

        <div className="order-items">
          {orderItems.map((item, index) => (
            <div className="order-item" key={index}>
              <div className="item-image">
                <img src={item.image || "/placeholder.svg"} alt={item.name} />
              </div>
              <div className="item-name">{item.name}</div>
            </div>
          ))}
        </div>

        <div className="delivery-info">
          <p className="delivery-person">Tu pedido lo lleva Juan Lopez!</p>
          <p className="delivery-time">Llegada aproximada: {getDeliveryTime()} PM</p>
        </div>
      </div>

      <div className="confirmation-footer">
        <button className="vuelta-button" onClick={handleCancelOrder}>
          Volver a comprar
        </button>
      </div>

      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => navigate("/inicio")}>
          <HomeIcon />
          <span>Inicio</span>
        </button>
        <button className="nav-item" onClick={() => navigate("/carrito")}>
          <ShoppingCartIcon />
          <span>Carrito</span>
        </button>
        <button className="nav-item" onClick={() => navigate("/perfil")}>
          <UserIcon />
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  )
}
