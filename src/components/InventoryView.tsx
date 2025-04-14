"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./InventoryView.css"
import { PackageIcon, ShoppingCartIcon, UserIcon, SearchIcon, PlusIcon, MinusIcon, HomeIcon } from "./Icons"

interface InventoryItem {
  id: number
  name: string
  quantity: number
  image: string
}

export default function InventoryView() {
  const navigate = useNavigate()
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: 1,
      name: "Arroz",
      quantity: 25,
      image: "/arroz.png",
    },
    {
      id: 2,
      name: "Nori",
      quantity: 18,
      image: "/nori.png",
    },
    {
      id: 3,
      name: "Palta",
      quantity: 30,
      image: "/Palta.png",
    },
  ])

  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const increaseQuantity = (id: number) => {
    setInventoryItems(inventoryItems.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)))
  }

  const decreaseQuantity = (id: number) => {
    setInventoryItems(
      inventoryItems.map((item) =>
        item.id === id && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item,
      ),
    )
  }

  const filteredItems = inventoryItems.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="inventory-container">
      <header className="inventory-header">
        <div className="inventory-title">
          <h1>Inventario</h1>
          <PackageIcon />
        </div>
        <button className="search-button" onClick={() => setShowSearch(!showSearch)}>
          <SearchIcon />
        </button>
      </header>

      {showSearch && (
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar ingrediente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            autoFocus
          />
        </div>
      )}

      <div className="inventory-items">
        {filteredItems.map((item) => (
          <div className="inventory-item" key={item.id}>
            <div className="item-image">
              <img src={item.image || "/placeholder.svg"} alt={item.name} />
            </div>
            <div className="item-details">
              <h3>{item.name}</h3>
              <p className="item-quantity-display">Cantidad: {item.quantity}</p>
            </div>
            <div className="item-quantity">
              <button className="quantity-button increase" onClick={() => increaseQuantity(item.id)}>
                <PlusIcon />
              </button>
              <button className="quantity-button decrease" onClick={() => decreaseQuantity(item.id)}>
                <MinusIcon />
              </button>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && <div className="no-results">No se encontraron ingredientes</div>}
      </div>

      <div className="inventory-footer">
        <button className="add-button">Agregar elemento</button>
        <button className="confirm-button">Confirmar</button>
      </div>

      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => navigate("/")}>
          <HomeIcon />
          <span>Inicio</span>
        </button>
        <button className="nav-item active" onClick={() => navigate("/inventario")}>
          <PackageIcon />
          <span>Inventario</span>
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
