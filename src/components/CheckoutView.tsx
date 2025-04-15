"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./CheckoutView.css"
import { HomeIcon, ShoppingCartIcon, UserIcon, SearchIcon } from "./Icons"

interface CheckoutProps {
  total: number
}

export default function CheckoutView({ total = 29970 }: CheckoutProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: "",
    calleNumero: "",
    comuna: "",
    ciudad: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirigir a la vista de método de pago
    navigate("/payment", { state: { total } })
  }

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("es-CL")}`
  }

  return (
    <div className="checkout-container">
      <header className="checkout-header">
        <div className="checkout-title">
          <h1>Confirmar compra</h1>
        </div>
        <button className="search-button">
          <SearchIcon />
        </button>
      </header>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Recibe:</h2>
          <div className="input-group">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Confirmar dirección:</h2>
          <div className="input-group">
            <input
              type="text"
              name="calleNumero"
              placeholder="Calle y número"
              value={formData.calleNumero}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              name="comuna"
              placeholder="Comuna"
              value={formData.comuna}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              name="ciudad"
              placeholder="Ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="checkout-footer">
          <div className="checkout-total">
            <span>Total</span>
            <span>${formatPrice(total)}</span>
          </div>
          <button type="submit" className="pay-button">
            Ir a pagar
          </button>
        </div>
      </form>

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
