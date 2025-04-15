"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import "./PaymentMethodView.css"
import { HomeIcon, ShoppingCartIcon, UserIcon, SearchIcon } from "./Icons"

interface PaymentMethodProps {
  total?: number
}

interface PaymentMethod {
  id: number
  type: string
  lastDigits: string
  networks: string[]
}

export default function PaymentMethodView({ total = 29970 }: PaymentMethodProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 1,
      type: "Debito",
      lastDigits: "6789",
      networks: ["mastercard", "visa", "amex"],
    },
    {
      id: 2,
      type: "Debito",
      lastDigits: "6789",
      networks: ["mastercard", "visa", "amex"],
    },
    {
      id: 3,
      type: "Debito",
      lastDigits: "6789",
      networks: ["mastercard", "visa", "amex"],
    },
  ])

  const [selectedMethod, setSelectedMethod] = useState<number | null>(1)

  const handleAddCard = () => {
    // Aquí iría la lógica para agregar una nueva tarjeta
    alert("Agregar nueva tarjeta")
  }

  const handlePayment = () => {
    if (selectedMethod) {
      // Redirigir a la página de confirmación
      navigate("/confirmation")
    } else {
      alert("Por favor selecciona un método de pago")
    }
  }

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("es-CL")}`
  }

  return (
    <div className="payment-container">
      <header className="payment-header">
        <div className="payment-title">
          <h1>Metodo de pago</h1>
        </div>
        <button className="search-button">
          <SearchIcon />
        </button>
      </header>

      <div className="payment-methods">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`payment-method ${selectedMethod === method.id ? "selected" : ""}`}
            onClick={() => setSelectedMethod(method.id)}
          >
            <div className="method-info">
              <div className="method-type">{method.type}</div>
              <div className="method-number">****{method.lastDigits}</div>
            </div>
            <div className="method-networks">
              {method.networks.includes("mastercard") && <div className="network-logo mastercard"></div>}
              {method.networks.includes("visa") && <div className="network-logo visa"></div>}
              {method.networks.includes("amex") && <div className="network-logo amex"></div>}
            </div>
          </div>
        ))}

        <button className="add-card-button" onClick={handleAddCard}>
          Agregar tarjeta credito/debito
        </button>
      </div>

      <div className="payment-footer">
        <div className="payment-total">
          <span>Total</span>
          <span>${formatPrice(total)}</span>
        </div>
        <button className="pay-button" onClick={handlePayment}>
          Pagar
        </button>
      </div>

      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => navigate("/inicio")}>
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
