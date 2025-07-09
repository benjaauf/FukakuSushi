"use client"

import { useState, useEffect, useRef } from "react"
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
  useEffect(() => {
    window.scrollTo(0, 0)
    document.body.style.height = '100.1vh'
    setTimeout(() => {
      document.body.style.height = ''
    }, 100)
  }, [])
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem("cart")
    return storedCart ? JSON.parse(storedCart) : []
  })
  const isInitialized = useRef(true) // Ya no es necesario, pero lo dejamos true para el useEffect

  // Sincronizar el carrito si cambia el localStorage (por navegación SPA)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "cart") {
        const newCart = e.newValue ? JSON.parse(e.newValue) : []
        setCartItems(newCart)
      }
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  // Eliminar el useEffect que cargaba el carrito desde localStorage

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (isInitialized.current) {
      localStorage.setItem("cart", JSON.stringify(cartItems))
    }
  }, [cartItems])

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

  const handleConfirm = () => {
    navigate("/checkout", { state: { total: calculateTotal() } })
  }

  const handleClearCart = () => {
    setCartItems([])
    localStorage.removeItem("cart")
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

      <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 1rem 0.5rem 1rem" }}>
        <button onClick={handleClearCart} style={{ background: "#eee", color: "#800000", border: "none", borderRadius: 6, padding: "0.5rem 1rem", cursor: "pointer", fontWeight: 600 }}>
          Limpiar carrito
        </button>
      </div>

      <div className="cart-items">
        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
            Tu carrito está vacío.
          </div>
        ) : (
          cartItems.map((item) => (
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
          ))
        )}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <span>Total</span>
          <span>{formatPrice(calculateTotal())}</span>
        </div>
        <button className="confirm-button" onClick={handleConfirm} disabled={cartItems.length === 0}>
          Confirmar
        </button>
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
