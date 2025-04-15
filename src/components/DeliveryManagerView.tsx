"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { UserIcon, TruckIcon, FilterIcon, PrinterIcon, CheckIcon, XIcon, ChevronDownIcon } from "./Icons"
import "./DeliveryManagerView.css"

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
  customerAddress: string
  customerPhone: string
  items: OrderItem[]
  total: number
  timestamp: Date
  status: "pendiente" | "preparando" | "en_camino" | "entregado"
  paymentMethod: string
}

export default function DeliveryManagerView() {
  const navigate = useNavigate()

  // Estado para las órdenes
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showPrintModal, setShowPrintModal] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")

  // Estado para filtros
  const [statusFilter, setStatusFilter] = useState<"todos" | "pendiente" | "preparando" | "en_camino">("todos")
  const [showFilters, setShowFilters] = useState(false)

  // Generar datos de órdenes simulados
  useEffect(() => {
    const generateOrders = (): Order[] => {
      const products = [
        { id: 1, name: "Tobiko California Roll", price: 9990 },
        { id: 2, name: "Nigiri", price: 9990 },
        { id: 3, name: "Smoked Salmon Roll", price: 9990 },
        { id: 4, name: "Tempura Roll", price: 10990 },
        { id: 5, name: "Yasu Roll", price: 9990 },
        { id: 6, name: "Nori Special", price: 11990 },
      ]

      const customers = [
        {
          name: "Sophia Anderson",
          email: "sophia@example.com",
          address: "Av. Providencia 1234, Providencia",
          phone: "+56 9 1234 5678",
        },
        {
          name: "Carlos Mendoza",
          email: "carlos@example.com",
          address: "Av. Las Condes 5678, Las Condes",
          phone: "+56 9 8765 4321",
        },
        {
          name: "María González",
          email: "maria@example.com",
          address: "Av. Apoquindo 9876, Las Condes",
          phone: "+56 9 2345 6789",
        },
        {
          name: "John Smith",
          email: "john@example.com",
          address: "Av. Vitacura 4321, Vitacura",
          phone: "+56 9 3456 7890",
        },
        {
          name: "Ana Torres",
          email: "ana@example.com",
          address: "Av. Irarrázaval 7654, Ñuñoa",
          phone: "+56 9 4567 8901",
        },
      ]

      const paymentMethods = ["Tarjeta de Crédito", "Tarjeta de Débito", "Efectivo"]
      const statuses: ("pendiente" | "preparando" | "en_camino")[] = ["pendiente", "preparando", "en_camino"]

      // Generar órdenes
      const ordersData: Order[] = []

      for (let i = 0; i < 15; i++) {
        const orderDate = new Date()
        orderDate.setMinutes(orderDate.getMinutes() - Math.floor(Math.random() * 120)) // Últimas 2 horas

        // Generar entre 1 y 4 items por orden
        const itemCount = Math.floor(Math.random() * 4) + 1
        const items: OrderItem[] = []
        let total = 0

        for (let j = 0; j < itemCount; j++) {
          const product = products[Math.floor(Math.random() * products.length)]
          const quantity = Math.floor(Math.random() * 3) + 1

          items.push({
            ...product,
            quantity,
          })

          total += product.price * quantity
        }

        const customer = customers[Math.floor(Math.random() * customers.length)]
        // Distribuir los estados para tener ejemplos de cada uno
        let status: "pendiente" | "preparando" | "en_camino"
        if (i < 5) {
          status = "pendiente"
        } else if (i < 10) {
          status = "preparando"
        } else {
          status = "en_camino"
        }

        ordersData.push({
          id: 1000 + i,
          customerName: customer.name,
          customerEmail: customer.email,
          customerAddress: customer.address,
          customerPhone: customer.phone,
          items,
          total,
          timestamp: orderDate,
          status,
          paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        })
      }

      // Ordenar por fecha, más reciente primero
      return ordersData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    }

    setOrders(generateOrders())
  }, [])

  // Filtrar órdenes según el estado seleccionado
  const filteredOrders = statusFilter === "todos" ? orders : orders.filter((order) => order.status === statusFilter)

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("es-CL")}`
  }

  const formatDate = (date: Date) => {
    return date.toLocaleString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pendiente":
        return "status-pending"
      case "preparando":
      case "en_camino":
        return "status-in-progress"
      default:
        return ""
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pendiente":
        return "Pendiente"
      case "preparando":
        return "Preparando"
      case "en_camino":
        return "En camino"
      default:
        return status
    }
  }

  const getActionButton = (order: Order) => {
    switch (order.status) {
      case "pendiente":
        return (
          <button className="action-button print-button" onClick={() => handlePrintOrder(order)}>
            <PrinterIcon />
            <span>Imprimir</span>
          </button>
        )
      case "preparando":
        return (
          <button className="action-button dispatch-button" onClick={() => handleDispatchOrder(order)}>
            <TruckIcon />
            <span>En camino</span>
          </button>
        )
      case "en_camino":
        return (
          <button className="action-button deliver-button" onClick={() => handleDeliverOrder(order)}>
            <CheckIcon />
            <span>Entregado</span>
          </button>
        )
      default:
        return null
    }
  }

  const handlePrintOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowPrintModal(true)
  }

  const confirmPrint = () => {
    if (selectedOrder) {
      // Actualizar el estado de la orden a preparando
      setOrders(orders.map((order) => (order.id === selectedOrder.id ? { ...order, status: "preparando" } : order)))

      // Cerrar el modal
      setShowPrintModal(false)

      // Mostrar notificación
      setNotificationMessage("Orden impresa y enviada a cocina")
      setShowNotification(true)

      // Ocultar la notificación después de 3 segundos
      setTimeout(() => {
        setShowNotification(false)
      }, 3000)
    }
  }

  const handleDispatchOrder = (order: Order) => {
    // Actualizar el estado de la orden a en_camino
    setOrders(orders.map((o) => (o.id === order.id ? { ...o, status: "en_camino" } : o)))

    // Mostrar notificación
    setNotificationMessage("Orden enviada para entrega")
    setShowNotification(true)

    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  const handleDeliverOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowConfirmModal(true)
  }

  const confirmDelivery = () => {
    if (selectedOrder) {
      // Actualizar el estado de la orden a entregado (lo que la eliminará de la vista)
      setOrders(orders.map((order) => (order.id === selectedOrder.id ? { ...order, status: "entregado" } : order)))

      // Cerrar el modal
      setShowConfirmModal(false)

      // Mostrar notificación
      setNotificationMessage("Entrega confirmada")
      setShowNotification(true)

      // Ocultar la notificación después de 3 segundos
      setTimeout(() => {
        setShowNotification(false)
      }, 3000)
    }
  }

  const cancelModal = () => {
    setShowConfirmModal(false)
    setShowPrintModal(false)
    setSelectedOrder(null)
  }

  return (
    <div className="delivery-manager-container">
      <header className="home-header">
        <div className="logo">
          <h1>FUKAKU SUSHI</h1>
          <h2 className="subtitle">Despachos</h2>
        </div>
      </header>

      <div className="delivery-content">
        <div className="delivery-header">
          <h2 className="section-title">Órdenes de Despacho</h2>
          <div className="delivery-actions">
            <button className="filter-button" onClick={() => setShowFilters(!showFilters)}>
              <FilterIcon />
              <span>Filtros</span>
              <ChevronDownIcon />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Estado:</label>
              <div className="filter-options">
                <button
                  className={`filter-option ${statusFilter === "todos" ? "active" : ""}`}
                  onClick={() => setStatusFilter("todos")}
                >
                  Todos
                </button>
                <button
                  className={`filter-option ${statusFilter === "pendiente" ? "active" : ""}`}
                  onClick={() => setStatusFilter("pendiente")}
                >
                  Pendientes
                </button>
                <button
                  className={`filter-option ${statusFilter === "preparando" ? "active" : ""}`}
                  onClick={() => setStatusFilter("preparando")}
                >
                  Preparando
                </button>
                <button
                  className={`filter-option ${statusFilter === "en_camino" ? "active" : ""}`}
                  onClick={() => setStatusFilter("en_camino")}
                >
                  En camino
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="orders-list delivery-orders">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="order-header">
                  <div className="order-id">Pedido #{order.id}</div>
                  <div className={`order-status ${getStatusClass(order.status)}`}>{getStatusText(order.status)}</div>
                </div>

                <div className="order-info">
                  <div className="order-customer">
                    <strong>Cliente:</strong> {order.customerName}
                  </div>
                  <div className="order-address">
                    <strong>Dirección:</strong> {order.customerAddress}
                  </div>
                  <div className="order-phone">
                    <strong>Teléfono:</strong> {order.customerPhone}
                  </div>
                  <div className="order-date">
                    <strong>Fecha:</strong> {formatDate(order.timestamp)}
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div className="order-item" key={index}>
                      <div className="item-name">
                        {item.name} x{item.quantity}
                      </div>
                      <div className="item-price">${formatPrice(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <strong>Total:</strong> ${formatPrice(order.total)}
                  </div>

                  <div className="order-actions">{getActionButton(order)}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-orders">
              <p>No hay órdenes que coincidan con los filtros seleccionados</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para confirmar entrega */}
      {showConfirmModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Confirmar Entrega</h2>
              <button className="close-modal-button" onClick={cancelModal}>
                <XIcon />
              </button>
            </div>
            <div className="modal-body">
              <p>
                ¿Confirmas que el pedido #{selectedOrder.id} ha sido entregado a {selectedOrder.customerName}?
              </p>
              <p>Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={cancelModal}>
                Cancelar
              </button>
              <button className="confirm-button" onClick={confirmDelivery}>
                Confirmar Entrega
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para imprimir orden */}
      {showPrintModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content print-modal">
            <div className="modal-header">
              <h2>Imprimir Orden de Despacho</h2>
              <button className="close-modal-button" onClick={cancelModal}>
                <XIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="print-preview">
                <div className="print-header">
                  <h3>FUKAKU SUSHI - ORDEN DE DESPACHO</h3>
                  <p>Pedido #{selectedOrder.id}</p>
                  <p>Fecha: {formatDate(selectedOrder.timestamp)}</p>
                </div>
                <div className="print-customer">
                  <p>
                    <strong>Cliente:</strong> {selectedOrder.customerName}
                  </p>
                  <p>
                    <strong>Dirección:</strong> {selectedOrder.customerAddress}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {selectedOrder.customerPhone}
                  </p>
                </div>
                <div className="print-items">
                  <h4>Productos:</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cant.</th>
                        <th>Precio</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>${formatPrice(item.price)}</td>
                          <td>${formatPrice(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="print-total">
                  <p>
                    <strong>Total:</strong> ${formatPrice(selectedOrder.total)}
                  </p>
                  <p>
                    <strong>Método de pago:</strong> {selectedOrder.paymentMethod}
                  </p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={cancelModal}>
                Cancelar
              </button>
              <button className="print-confirm-button" onClick={confirmPrint}>
                <PrinterIcon />
                <span>Imprimir y enviar a cocina</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notificación */}
      {showNotification && (
        <div className="notification success">
          <CheckIcon />
          <span>{notificationMessage}</span>
        </div>
      )}

      <nav className="bottom-nav">
        <button className="nav-item active" onClick={() => navigate("/despachos")}>
          <TruckIcon />
          <span>Despachos</span>
        </button>
        <button className="nav-item" onClick={() => navigate("/perfil")}>
          <UserIcon />
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  )
}
