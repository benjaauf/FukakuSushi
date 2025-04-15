"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./InventoryView.css"
import {
  PackageIcon,
  ShoppingCartIcon,
  UserIcon,
  SearchIcon,
  PlusIcon,
  MinusIcon,
  HomeIcon,
  XIcon,
  CheckIcon,
} from "./Icons"

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
  // Nuevo estado para el modal de agregar ingrediente
  const [showAddModal, setShowAddModal] = useState(false)
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    quantity: 1,
    image: "/placeholder.svg",
  })

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

  // Función para manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "quantity") {
      // Asegurarse de que la cantidad sea un número positivo
      const quantity = Number.parseInt(value)
      if (!isNaN(quantity) && quantity >= 0) {
        setNewIngredient({ ...newIngredient, [name]: quantity })
      }
    } else {
      setNewIngredient({ ...newIngredient, [name]: value })
    }
  }

  // Función para añadir un nuevo ingrediente
  const addNewIngredient = () => {
    if (newIngredient.name.trim() === "") {
      alert("Por favor ingresa un nombre para el ingrediente")
      return
    }

    const newId = Math.max(0, ...inventoryItems.map((item) => item.id)) + 1

    setInventoryItems([
      ...inventoryItems,
      {
        id: newId,
        name: newIngredient.name,
        quantity: newIngredient.quantity,
        image: newIngredient.image,
      },
    ])

    // Resetear el formulario y cerrar el modal
    setNewIngredient({
      name: "",
      quantity: 1,
      image: "/placeholder.svg",
    })
    setShowAddModal(false)
  }

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
        <button className="add-button" onClick={() => setShowAddModal(true)}>
          Agregar elemento
        </button>
        <button className="confirm-button">Confirmar</button>
      </div>

      {/* Modal para agregar nuevo ingrediente */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Agregar nuevo ingrediente</h2>
              <button className="close-modal-button" onClick={() => setShowAddModal(false)}>
                <XIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="name">Nombre del ingrediente</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newIngredient.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Salmón"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="quantity">Cantidad inicial</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={newIngredient.quantity}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowAddModal(false)}>
                Cancelar
              </button>
              <button className="confirm-add-button" onClick={addNewIngredient}>
                <CheckIcon />
                <span>Agregar</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
