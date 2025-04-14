"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./CartView.css"
import { HomeIcon, ShoppingCartIcon, UserIcon, SearchIcon, PlusIcon, MinusIcon } from "./Icons"

interface CartItem {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  image: string
}

export default function CartView() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Tobiko California Roll",
      description: "Arroz, Palta, Camarón, Palta, Tobiko",
      price: 9990,
      quantity: 1,
      image: "/sushi1.jpg",
    },
    {
      id: 2,
      name: "Smoked Salmon Roll",
      description: "Arroz, Salmón, Palta, Ajo Nori",
      price: 9990,
      quantity: 1,
      image: "/sushi2.jpg",
    },
    {
      id: 3,
      name: "Nigiri",
      description: "Arroz, Salmón",
      price: 9990,
      quantity: 1,
      image: "/sushi3.jpg",
    },
  ])

  const increaseQuantity = (id: number) => {
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)))
  }

  const decreaseQuantity = (id: number) => {
    setCartItems(
      cartItems.map((item) => (item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item)),
    )
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const formatPrice = (price: number) => {
    return `${(price).toLocaleString("es-CL")}`
  }

  return (
    <div className="cart-container">
      <header className="cart-header">
        <div className="cart-title">
          <h1>Carrito</h1>
          <ShoppingCartIcon />
        </div>
        <button className="search-button">
          <SearchIcon />
        </button>
      </header>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div className="cart-item" key={item.id}>
            <div className="item-image">
              <img src={item.image || "/placeholder.svg"} alt={item.name} />
            </div>
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p className="item-price">{formatPrice(item.price)}</p>
            </div>
            <div className="item-quantity">
              <button className="quantity-button increase" onClick={() => increaseQuantity(item.id)}>
                <PlusIcon />
              </button>
              <span>{item.quantity}</span>
              <button className="quantity-button decrease" onClick={() => decreaseQuantity(item.id)}>
                <MinusIcon />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <span>Total</span>
          <span>{formatPrice(calculateTotal())}</span>
        </div>
        <button className="confirm-button">Confirmar</button>
      </div>

      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => navigate("/")}>
          <HomeIcon />
          <span>Inicio</span>
        </button>
        <button className="nav-item active" onClick={() => navigate("/carrito")}>
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
