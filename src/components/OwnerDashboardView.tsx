"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  HomeIcon,
  ShoppingCartIcon,
  UserIcon,
  PackageIcon,
  ChevronDownIcon,
  CalendarIcon,
  DownloadIcon,
  FilterIcon,
} from "./Icons"
import "./OwnerDashboardView.css"

interface SaleItem {
  id: number
  name: string
  price: number
  quantity: number
  category: string
}

interface Sale {
  id: number
  customerName: string
  customerEmail: string
  items: SaleItem[]
  total: number
  date: Date
  paymentMethod: string
}

interface ProductSummary {
  id: number
  name: string
  totalSold: number
  revenue: number
}

interface DailySales {
  date: string
  sales: number
  orders: number
}

export default function OwnerDashboardView() {
  const navigate = useNavigate()

  // Estado para el período de consulta
  const [periodType, setPeriodType] = useState<"day" | "week" | "month" | "custom">("week")
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date()
    date.setDate(date.getDate() - 7)
    return date
  })
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)

  // Datos de ventas (simulados)
  const [sales, setSales] = useState<Sale[]>([])
  const [filteredSales, setFilteredSales] = useState<Sale[]>([])
  const [topProducts, setTopProducts] = useState<ProductSummary[]>([])
  const [dailySales, setDailySales] = useState<DailySales[]>([])
  const [salesSummary, setSalesSummary] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageTicket: 0,
  })

  // Generar datos de ventas simulados
  useEffect(() => {
    const generateSales = (): Sale[] => {
      const products = [
        { id: 1, name: "Tobiko California Roll", price: 9990, category: "Rolls" },
        { id: 2, name: "Nigiri", price: 9990, category: "Nigiri" },
        { id: 3, name: "Smoked Salmon Roll", price: 9990, category: "Rolls" },
        { id: 4, name: "Tempura Roll", price: 10990, category: "Rolls" },
        { id: 5, name: "Yasu Roll", price: 9990, category: "Rolls" },
        { id: 6, name: "Nori Special", price: 11990, category: "Especiales" },
      ]

      const customers = [
        { name: "Sophia Anderson", email: "sophia@example.com" },
        { name: "Carlos Mendoza", email: "carlos@example.com" },
        { name: "María González", email: "maria@example.com" },
        { name: "John Smith", email: "john@example.com" },
        { name: "Ana Torres", email: "ana@example.com" },
      ]

      const paymentMethods = ["Tarjeta de Crédito", "Tarjeta de Débito", "Efectivo"]

      // Generar ventas para los últimos 30 días
      const today = new Date()
      const salesData: Sale[] = []

      for (let i = 0; i < 100; i++) {
        const saleDate = new Date(today)
        saleDate.setDate(today.getDate() - Math.floor(Math.random() * 30))

        // Generar entre 1 y 4 items por venta
        const itemCount = Math.floor(Math.random() * 4) + 1
        const items: SaleItem[] = []
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

        salesData.push({
          id: 1000 + i,
          customerName: customer.name,
          customerEmail: customer.email,
          items,
          total,
          date: saleDate,
          paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        })
      }

      // Ordenar por fecha, más reciente primero
      return salesData.sort((a, b) => b.date.getTime() - a.date.getTime())
    }

    setSales(generateSales())
  }, [])

  // Filtrar ventas según el período seleccionado
  useEffect(() => {
    const filterSalesByPeriod = () => {
      let filteredData: Sale[] = []
      const now = new Date()

      switch (periodType) {
        case "day":
          // Ventas del día actual
          filteredData = sales.filter(
            (sale) =>
              sale.date.getDate() === now.getDate() &&
              sale.date.getMonth() === now.getMonth() &&
              sale.date.getFullYear() === now.getFullYear(),
          )
          setStartDate(new Date(now.setHours(0, 0, 0, 0)))
          setEndDate(new Date(now.setHours(23, 59, 59, 999)))
          break

        case "week":
          // Ventas de la última semana
          const weekAgo = new Date(now)
          weekAgo.setDate(now.getDate() - 7)
          filteredData = sales.filter((sale) => sale.date >= weekAgo && sale.date <= now)
          setStartDate(weekAgo)
          setEndDate(now)
          break

        case "month":
          // Ventas del último mes
          const monthAgo = new Date(now)
          monthAgo.setMonth(now.getMonth() - 1)
          filteredData = sales.filter((sale) => sale.date >= monthAgo && sale.date <= now)
          setStartDate(monthAgo)
          setEndDate(now)
          break

        case "custom":
          // Período personalizado
          filteredData = sales.filter((sale) => sale.date >= startDate && sale.date <= endDate)
          break
      }

      setFilteredSales(filteredData)
    }

    filterSalesByPeriod()
  }, [periodType, startDate, endDate, sales])

  // Calcular estadísticas cuando cambian las ventas filtradas
  useEffect(() => {
    // Calcular resumen de ventas
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0)
    const totalOrders = filteredSales.length
    const averageTicket = totalOrders > 0 ? totalSales / totalOrders : 0

    setSalesSummary({
      totalSales,
      totalOrders,
      averageTicket,
    })

    // Calcular productos más vendidos
    const productMap = new Map<number, ProductSummary>()

    filteredSales.forEach((sale) => {
      sale.items.forEach((item) => {
        if (productMap.has(item.id)) {
          const product = productMap.get(item.id)!
          productMap.set(item.id, {
            ...product,
            totalSold: product.totalSold + item.quantity,
            revenue: product.revenue + item.price * item.quantity,
          })
        } else {
          productMap.set(item.id, {
            id: item.id,
            name: item.name,
            totalSold: item.quantity,
            revenue: item.price * item.quantity,
          })
        }
      })
    })

    // Ordenar por cantidad vendida
    const sortedProducts = Array.from(productMap.values())
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5) // Top 5

    setTopProducts(sortedProducts)

    // Calcular ventas diarias para el gráfico
    const dailySalesMap = new Map<string, DailySales>()

    // Crear un array de fechas entre startDate y endDate
    const dateArray: Date[] = []
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      dateArray.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Inicializar el mapa con todas las fechas
    dateArray.forEach((date) => {
      const dateString = formatDateShort(date)
      dailySalesMap.set(dateString, {
        date: dateString,
        sales: 0,
        orders: 0,
      })
    })

    // Agregar datos de ventas
    filteredSales.forEach((sale) => {
      const dateString = formatDateShort(sale.date)

      if (dailySalesMap.has(dateString)) {
        const dailySale = dailySalesMap.get(dateString)!
        dailySalesMap.set(dateString, {
          ...dailySale,
          sales: dailySale.sales + sale.total,
          orders: dailySale.orders + 1,
        })
      }
    })

    // Convertir a array y ordenar por fecha
    const dailySalesArray = Array.from(dailySalesMap.values()).sort((a, b) => {
      const dateA = new Date(a.date.split("/").reverse().join("-"))
      const dateB = new Date(b.date.split("/").reverse().join("-"))
      return dateA.getTime() - dateB.getTime()
    })

    setDailySales(dailySalesArray)
  }, [filteredSales, startDate, endDate])

  const handlePeriodChange = (type: "day" | "week" | "month" | "custom") => {
    setPeriodType(type)
    setShowDatePicker(type === "custom")
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(new Date(e.target.value))
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(new Date(e.target.value))
  }

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("es-CL")}`
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-CL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDateShort = (date: Date) => {
    return date.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
    })
  }

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const getPeriodLabel = () => {
    switch (periodType) {
      case "day":
        return "Hoy"
      case "week":
        return "Últimos 7 días"
      case "month":
        return "Último mes"
      case "custom":
        return `${formatDateShort(startDate)} - ${formatDateShort(endDate)}`
    }
  }

  const handleExportData = () => {
    // En una aplicación real, aquí se generaría un archivo CSV o Excel
    alert("Exportando datos...")
  }

  // Renderizar gráfico de barras para ventas diarias
  const renderSalesChart = () => {
    const maxSales = Math.max(...dailySales.map((day) => day.sales))

    return (
      <div className="sales-chart">
        <div className="chart-bars">
          {dailySales.map((day, index) => (
            <div className="chart-bar-container" key={index}>
              <div
                className="chart-bar"
                style={{
                  height: `${(day.sales / maxSales) * 100}%`,
                  backgroundColor: "#800000",
                }}
                title={`$${formatPrice(day.sales)}`}
              ></div>
              <div className="chart-label">{day.date}</div>
            </div>
          ))}
        </div>
        <div className="chart-y-axis">
          <div className="chart-y-label">$0</div>
          <div className="chart-y-label">${formatPrice(maxSales / 2)}</div>
          <div className="chart-y-label">${formatPrice(maxSales)}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="owner-dashboard-container">
      <header className="home-header">
        <div className="logo">
          <h1>FUKAKU SUSHI</h1>
          <h2 className="subtitle">Ventas</h2>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="period-selector">
          <div className="period-dropdown">
            <button className="period-button" onClick={() => setShowDatePicker(!showDatePicker)}>
              <CalendarIcon />
              <span>{getPeriodLabel()}</span>
              <ChevronDownIcon />
            </button>

            {showDatePicker && (
              <div className="period-dropdown-content">
                <div className="period-options">
                  <button
                    className={`period-option ${periodType === "day" ? "active" : ""}`}
                    onClick={() => handlePeriodChange("day")}
                  >
                    Hoy
                  </button>
                  <button
                    className={`period-option ${periodType === "week" ? "active" : ""}`}
                    onClick={() => handlePeriodChange("week")}
                  >
                    Últimos 7 días
                  </button>
                  <button
                    className={`period-option ${periodType === "month" ? "active" : ""}`}
                    onClick={() => handlePeriodChange("month")}
                  >
                    Último mes
                  </button>
                  <button
                    className={`period-option ${periodType === "custom" ? "active" : ""}`}
                    onClick={() => handlePeriodChange("custom")}
                  >
                    Personalizado
                  </button>
                </div>

                {periodType === "custom" && (
                  <div className="custom-date-picker">
                    <div className="date-input-group">
                      <label>Desde:</label>
                      <input
                        type="date"
                        value={formatDateForInput(startDate)}
                        onChange={handleStartDateChange}
                        max={formatDateForInput(endDate)}
                      />
                    </div>
                    <div className="date-input-group">
                      <label>Hasta:</label>
                      <input
                        type="date"
                        value={formatDateForInput(endDate)}
                        onChange={handleEndDateChange}
                        min={formatDateForInput(startDate)}
                        max={formatDateForInput(new Date())}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <button className="export-button" onClick={handleExportData}>
            <DownloadIcon />
            <span>Exportar</span>
          </button>
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-title">Ventas Totales</div>
            <div className="summary-value">${formatPrice(salesSummary.totalSales)}</div>
            <div className="summary-subtitle">{salesSummary.totalOrders} pedidos</div>
          </div>

          <div className="summary-card">
            <div className="summary-title">Ticket Promedio</div>
            <div className="summary-value">${formatPrice(salesSummary.averageTicket)}</div>
            <div className="summary-subtitle">por pedido</div>
          </div>

          <div className="summary-card">
            <div className="summary-title">Producto Más Vendido</div>
            <div className="summary-value">{topProducts.length > 0 ? topProducts[0].name : "Sin datos"}</div>
            <div className="summary-subtitle">
              {topProducts.length > 0 ? `${topProducts[0].totalSold} unidades` : ""}
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="chart-container">
            <h2 className="section-title">Ventas Diarias</h2>
            {dailySales.length > 0 ? renderSalesChart() : <div className="no-data">No hay datos para mostrar</div>}
          </div>

          <div className="top-products-container">
            <h2 className="section-title">Productos Más Vendidos</h2>
            {topProducts.length > 0 ? (
              <div className="top-products-list">
                {topProducts.map((product, index) => (
                  <div className="top-product-item" key={product.id}>
                    <div className="product-rank">{index + 1}</div>
                    <div className="product-info">
                      <div className="product-name">{product.name}</div>
                      <div className="product-stats">
                        <span>{product.totalSold} unidades</span>
                        <span>${formatPrice(product.revenue)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">No hay datos para mostrar</div>
            )}
          </div>
        </div>

        <div className="sales-table-container">
          <div className="table-header">
            <h2 className="section-title">Detalle de Ventas</h2>
            <div className="table-actions">
              <button className="filter-button">
                <FilterIcon />
                <span>Filtrar</span>
              </button>
            </div>
          </div>

          <div className="sales-table-wrapper">
            <table className="sales-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Productos</th>
                  <th>Método de Pago</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.length > 0 ? (
                  filteredSales.map((sale) => (
                    <tr key={sale.id}>
                      <td>#{sale.id}</td>
                      <td>{formatDate(sale.date)}</td>
                      <td>{sale.customerName}</td>
                      <td>
                        <div className="product-list">
                          {sale.items.map((item, index) => (
                            <div key={index} className="product-list-item">
                              {item.name} x{item.quantity}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>{sale.paymentMethod}</td>
                      <td className="sale-total">${formatPrice(sale.total)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="no-data-cell">
                      No hay ventas en el período seleccionado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => navigate("/")}>
          <HomeIcon />
          <span>Inicio</span>
        </button>
        <button className="nav-item" onClick={() => navigate("/cajero")}>
          <ShoppingCartIcon />
          <span>Cajero</span>
        </button>
        <button className="nav-item" onClick={() => navigate("/inventario")}>
          <PackageIcon />
          <span>Inventario</span>
        </button>
        <button className="nav-item active" onClick={() => navigate("/admin")}>
          <UserIcon />
          <span>Admin</span>
        </button>
      </nav>
    </div>
  )
}
