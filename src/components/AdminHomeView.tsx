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
} from "./Icons"
import "./AdminHomeView.css"

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

export default function AdminHomeView() {
  const navigate = useNavigate()

  // Estado para los pedidos
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState<"success" | "error">("success")

  // Estado para filtros
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed" | "cancelled">("all")
  const [dateFilter, setDateFilter] = useState<"today" | "week" | "month" | "all">("all")
  const [showFilters, setShowFilters] = useState(false)

  // Generar datos de pedidos simulados
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
        { name: "Sophia Anderson", email: "sophia@example.com" },
        { name: "Carlos Mendoza", email: "carlos@example.com" },
        { name: "María González", email: "maria@example.com" },
        { name: "John Smith", email: "john@example.com" },
        { name: "Ana Torres", email: "ana@example.com" },
      ]

      const paymentMethods = ["Tarjeta de Crédito", "Tarjeta de Débito", "Efectivo"]
      const statuses: ("pending" | "completed" | "cancelled")[] = ["pending", "completed", "cancelled"]

      // Generar pedidos para los últimos 30 días
      const today = new Date()
      const ordersData: Order[] = []

      for (let i = 0; i < 20; i++) {
        const orderDate = new Date(today)
        orderDate.setDate(today.getDate() - Math.floor(Math.random() * 30))

        // Generar entre 1 y 4 items por pedido
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
        const status = statuses[Math.floor(Math.random() * (i < 5 ? 1 : 3))] // Asegurar que algunos pedidos estén pendientes

        ordersData.push({
          id: 1000 + i,
          customerName: customer.name,
          customerEmail: customer.email,
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

  // Filtrar pedidos
  useEffect(() => {
    let filtered = [...orders]

    // Filtrar por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // Filtrar por fecha
    const now = new Date()
    if (dateFilter === "today") {
      filtered = filtered.filter(
        (order) =>
          order.timestamp.getDate() === now.getDate() &&
          order.timestamp.getMonth() === now.getMonth() &&
          order.timestamp.getFullYear() === now.getFullYear(),
      )
    } else if (dateFilter === "week") {
      const weekAgo = new Date(now)
      weekAgo.setDate(now.getDate() - 7)
      filtered = filtered.filter((order) => order.timestamp >= weekAgo)
    } else if (dateFilter === "month") {
      const monthAgo = new Date(now)
      monthAgo.setMonth(now.getMonth() - 1)
      filtered = filtered.filter((order) => order.timestamp >= monthAgo)
    }

    setFilteredOrders(filtered)
  }, [orders, statusFilter, dateFilter])

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

  const handleCancelOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowCancelModal(true)
  }

  const confirmCancelOrder = () => {
    if (selectedOrder) {
      // Actualizar el estado del pedido a cancelado
      setOrders(orders.map((order) => (order.id === selectedOrder.id ? { ...order, status: "cancelled" } : order)))

      // Cerrar el modal
      setShowCancelModal(false)

      // Mostrar notificación
      setNotificationMessage("Pedido cancelado correctamente")
      setNotificationType("success")
      setShowNotification(true)

      // Ocultar la notificación después de 3 segundos
      setTimeout(() => {
        setShowNotification(false)
      }, 3000)
    }
  }

  const cancelModal = () => {
    setShowCancelModal(false)
    setSelectedOrder(null)
  }

  const handleGenerateReport = (type: "daily" | "weekly" | "monthly") => {
    // En una aplicación real, aquí se generaría un informe
    setNotificationMessage(
      `Generando reporte ${type === "daily" ? "diario" : type === "weekly" ? "semanal" : "mensual"}...`,
    )
    setNotificationType("success")
    setShowNotification(true)

    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "status-pending"
      case "completed":
        return "status-completed"
      case "cancelled":
        return "status-cancelled"
      default:
        return ""
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "completed":
        return "Completado"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  return (
    <div className="admin-home-container">
      <header className="home-header">
        <div className="logo">
          <h1>FUKUSUKE SUSHI</h1>
          <h2 className="subtitle">Administración</h2>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-header">
          <h2 className="section-title">Pedidos Recientes</h2>
          <div className="admin-actions">
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
                  className={`filter-option ${statusFilter === "all" ? "active" : ""}`}
                  onClick={() => setStatusFilter("all")}
                >
                  Todos
                </button>
                <button
                  className={`filter-option ${statusFilter === "pending" ? "active" : ""}`}
                  onClick={() => setStatusFilter("pending")}
                >
                  Pendientes
                </button>
                <button
                  className={`filter-option ${statusFilter === "completed" ? "active" : ""}`}
                  onClick={() => setStatusFilter("completed")}
                >
                  Completados
                </button>
                <button
                  className={`filter-option ${statusFilter === "cancelled" ? "active" : ""}`}
                  onClick={() => setStatusFilter("cancelled")}
                >
                  Cancelados
                </button>
              </div>
            </div>

            <div className="filter-group">
              <label>Período:</label>
              <div className="filter-options">
                <button
                  className={`filter-option ${dateFilter === "all" ? "active" : ""}`}
                  onClick={() => setDateFilter("all")}
                >
                  Todos
                </button>
                <button
                  className={`filter-option ${dateFilter === "today" ? "active" : ""}`}
                  onClick={() => setDateFilter("today")}
                >
                  Hoy
                </button>
                <button
                  className={`filter-option ${dateFilter === "week" ? "active" : ""}`}
                  onClick={() => setDateFilter("week")}
                >
                  Última semana
                </button>
                <button
                  className={`filter-option ${dateFilter === "month" ? "active" : ""}`}
                  onClick={() => setDateFilter("month")}
                >
                  Último mes
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="orders-list admin-orders">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div className={`order-card ${order.status !== "pending" ? "non-pending" : ""}`} key={order.id}>
                <div className="order-header">
                  <div className="order-id">Pedido #{order.id}</div>
                  <div className={`order-status ${getStatusClass(order.status)}`}>{getStatusText(order.status)}</div>
                </div>

                <div className="order-info">
                  <div className="order-customer">
                    <strong>Cliente:</strong> {order.customerName}
                  </div>
                  <div className="order-date">
                    <strong>Fecha:</strong> {formatDate(order.timestamp)}
                  </div>
                  <div className="order-payment">
                    <strong>Pago:</strong> {order.paymentMethod}
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

                  <div className="order-actions">
                    {order.status === "pending" && (
                      <button className="cancel-order-button" onClick={() => handleCancelOrder(order)}>
                        Anular
                      </button>
                    )}
                    <button className="view-details-button" onClick={() => navigate(`/admin/orders/${order.id}`)}>
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-orders">
              <p>No hay pedidos que coincidan con los filtros seleccionados</p>
            </div>
          )}
        </div>

        <div className="reports-section">
          <h2 className="section-title">Reportes de Ventas</h2>

          <div className="reports-grid">
            <div className="report-card" onClick={() => handleGenerateReport("daily")}>
              <div className="report-icon">
                <CalendarIcon />
              </div>
              <div className="report-info">
                <h3>Reporte Diario</h3>
                <p>Ventas del día actual</p>
              </div>
              <div className="report-action">
                <DownloadIcon />
              </div>
            </div>

            <div className="report-card" onClick={() => handleGenerateReport("weekly")}>
              <div className="report-icon">
                <CalendarIcon />
              </div>
              <div className="report-info">
                <h3>Reporte Semanal</h3>
                <p>Ventas de los últimos 7 días</p>
              </div>
              <div className="report-action">
                <DownloadIcon />
              </div>
            </div>

            <div className="report-card" onClick={() => handleGenerateReport("monthly")}>
              <div className="report-icon">
                <CalendarIcon />
              </div>
              <div className="report-info">
                <h3>Reporte Mensual</h3>
                <p>Ventas del mes actual</p>
              </div>
              <div className="report-action">
                <DownloadIcon />
              </div>
            </div>

            <div className="report-card" onClick={() => navigate("/admin/ventas")}>
              <div className="report-icon">
                <SettingsIcon />
              </div>
              <div className="report-info">
                <h3>Reporte Personalizado</h3>
                <p>Configurar período y filtros</p>
              </div>
              <div className="report-action">
                <ChevronDownIcon />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para confirmar cancelación */}
      {showCancelModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Confirmar Cancelación</h2>
              <button className="close-modal-button" onClick={cancelModal}>
                <XIcon />
              </button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas cancelar el pedido #{selectedOrder.id}?</p>
              <p>Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={cancelModal}>
                Volver
              </button>
              <button className="confirm-button" onClick={confirmCancelOrder}>
                Confirmar Cancelación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notificación */}
      {showNotification && (
        <div className={`notification ${notificationType === "success" ? "success" : "error"}`}>
          {notificationType === "success" ? <CheckIcon /> : <XIcon />}
          <span>{notificationMessage}</span>
        </div>
      )}

      <nav className="bottom-nav">
        <button className="nav-item active" onClick={() => navigate("/admin")}>
          <HomeIcon />
          <span>Inicio</span>
        </button>
        <button className="nav-item" onClick={() => navigate("/admin/usuarios")}>
          <UsersIcon />
          <span>Usuarios</span>
        </button>
        <button className="nav-item" onClick={() => navigate("/inventario")}>
          <PackageIcon />
          <span>Inventario</span>
        </button>
        <button className="nav-item" onClick={() => navigate("/perfil")}>
          <UserIcon />
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  )
}
