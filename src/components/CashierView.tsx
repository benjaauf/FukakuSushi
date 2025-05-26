"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { HomeIcon, ShoppingCartIcon, UserIcon, CheckIcon, XIcon } from "./Icons"
import "./CashierView.css"

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
  status: "pending" | "completed"
}

export default function CashierView() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1001,
      customerName: "Sophia Anderson",
      customerEmail: "sophia@example.com",
      items: [
        { id: 1, name: "Tobiko California Roll", price: 9990, quantity: 2 },
        { id: 2, name: "Nigiri", price: 9990, quantity: 1 },
      ],
      total: 29970,
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutos atrás
      status: "pending",
    },
    {
      id: 1002,
      customerName: "Carlos Mendoza",
      customerEmail: "carlos@example.com",
      items: [
        { id: 3, name: "Smoked Salmon Roll", price: 9990, quantity: 1 },
        { id: 4, name: "Tempura Roll", price: 10990, quantity: 1 },
      ],
      total: 20980,
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutos atrás
      status: "pending",
    },
    {
      id: 1003,
      customerName: "María González",
      customerEmail: "maria@example.com",
      items: [
        { id: 5, name: "Yasu Roll", price: 9990, quantity: 2 },
        { id: 6, name: "Nori Special", price: 11990, quantity: 1 },
      ],
      total: 31970,
      timestamp: new Date(),
      status: "pending",
    },
  ])

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)

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

  const handleProcessSale = (order: Order) => {
    setSelectedOrder(order)
    setShowReceiptModal(true)
  }

  const confirmSale = () => {
    if (selectedOrder) {
      // Actualizar el estado de la orden a completada
      setOrders(orders.map((order) => (order.id === selectedOrder.id ? { ...order, status: "completed" } : order)))

      // Cerrar el modal de recibo
      setShowReceiptModal(false)

      // Mostrar notificación de éxito
      setShowSuccessNotification(true)

      // Ocultar la notificación después de 3 segundos
      setTimeout(() => {
        setShowSuccessNotification(false)
      }, 3000)

      // En una aplicación real, aquí se enviaría el correo electrónico con la boleta
      console.log(`Boleta enviada a ${selectedOrder.customerEmail}`)
    }
  }

  const cancelSale = () => {
    setShowReceiptModal(false)
    setSelectedOrder(null)
  }

  return (
    <div className="cashier-container">
      <header className="home-header">
        <div className="logo">
          <h1>FUKUSUKE SUSHI</h1>
          <h2 className="subtitle">Pedidos</h2>
        </div>
      </header>

      <div className="cashier-content">
        <h2 className="section-title">Pedidos Pendientes</h2>

        {orders.filter((order) => order.status === "pending").length === 0 ? (
          <div className="no-orders">
            <p>No hay pedidos pendientes</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders
              .filter((order) => order.status === "pending")
              .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
              .map((order) => (
                <div className="order-card" key={order.id}>
                  <div className="order-header">
                    <div className="order-id">Pedido #{order.id}</div>
                    <div className="order-time">{formatDate(order.timestamp)}</div>
                  </div>
                  <div className="order-customer">
                    <strong>Cliente:</strong> {order.customerName}
                  </div>
                  <div className="order-items">
                    {order.items.map((item) => (
                      <div className="order-item" key={item.id}>
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
                    <button className="process-button" onClick={() => handleProcessSale(order)}>
                      Realizar Venta
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        <h2 className="section-title">Ventas Completadas</h2>

        {orders.filter((order) => order.status === "completed").length === 0 ? (
          <div className="no-orders">
            <p>No hay ventas completadas</p>
          </div>
        ) : (
          <div className="orders-list completed-orders">
            {orders
              .filter((order) => order.status === "completed")
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .map((order) => (
                <div className="order-card completed" key={order.id}>
                  <div className="order-header">
                    <div className="order-id">Pedido #{order.id}</div>
                    <div className="order-time">{formatDate(order.timestamp)}</div>
                  </div>
                  <div className="order-customer">
                    <strong>Cliente:</strong> {order.customerName}
                  </div>
                  <div className="order-total">
                    <strong>Total:</strong> ${formatPrice(order.total)}
                  </div>
                  <div className="order-status">Completado</div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Modal para la boleta */}
      {showReceiptModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content receipt-modal">
            <div className="modal-header">
              <h2>Boleta Digital</h2>
              <button className="close-modal-button" onClick={cancelSale}>
                <XIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="receipt">
                <div className="receipt-header">
                  <h3>FUKUSUKE SUSHI</h3>
                  <p>Boleta Electrónica</p>
                  <p>Fecha: {formatDate(new Date())}</p>
                </div>
                <div className="receipt-customer">
                  <p>
                    <strong>Cliente:</strong> {selectedOrder.customerName}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOrder.customerEmail}
                  </p>
                </div>
                <div className="receipt-items">
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
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>${formatPrice(item.price)}</td>
                          <td>${formatPrice(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="receipt-total">
                  <p>
                    <strong>Total:</strong> ${formatPrice(selectedOrder.total)}
                  </p>
                </div>
                <div className="receipt-footer">
                  <p>¡Gracias por su compra!</p>
                </div>
              </div>
              <div className="receipt-actions">
                <p>
                  Se enviará una copia de esta boleta al correo electrónico:
                  <strong> {selectedOrder.customerEmail}</strong>
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={cancelSale}>
                Cancelar
              </button>
              <button className="confirm-button" onClick={confirmSale}>
                Confirmar y Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notificación de éxito */}
      {showSuccessNotification && (
        <div className="success-notification">
          <CheckIcon />
          <span>Boleta enviada correctamente</span>
        </div>
      )}

      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => navigate("/")}>
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
