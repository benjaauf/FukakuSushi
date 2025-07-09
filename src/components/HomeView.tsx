"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./HomeView.css"
import { HomeIcon, ShoppingCartIcon, UserIcon, SearchIcon, PlusIcon, MinusIcon, CheckIcon, XIcon } from "./Icons"
import { ProductService, Product } from "../services/productService"

interface Category {
  id: number
  name: string
  active: boolean
}

export default function HomeView() {
  const navigate = useNavigate()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Estados para la selección de cantidad
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1)

  // Cargar productos desde la base de datos
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const products = await ProductService.getAllProducts()
        setAllProducts(products)
        
        // Generar categorías dinámicamente desde los productos
        const allCategories = [...new Set(products.flatMap(product => product.categories))]
        const categoryObjects = allCategories.map((name, index) => ({
          id: index + 1,
          name,
          active: index === 0 // La primera categoría estará activa por defecto
        }))
        setCategories(categoryObjects)
      } catch (error) {
        console.error('Error cargando productos:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadProducts()
  }, [])

  // Lista de todos los ingredientes disponibles
  const allIngredients = [...new Set(allProducts.flatMap((product) => product.ingredients))].sort()

  // Filtrar productos cuando cambia la categoría, los ingredientes seleccionados o el término de búsqueda
  useEffect(() => {
    if (loading || categories.length === 0) return
    
    const activeCategory = categories.find((cat) => cat.active)?.name || categories[0]?.name

    let filtered = allProducts

    // Si hay un término de búsqueda, filtrar por él primero
    if (searchTerm.trim() !== "") {
      const searchTermLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTermLower) ||
          product.ingredients.some((ingredient) => ingredient.toLowerCase().includes(searchTermLower)),
      )
    } else {
      // Si no hay búsqueda, filtrar por categoría
      filtered = filtered.filter((product) => product.categories.includes(activeCategory))

      // Si hay ingredientes seleccionados, filtrar por ellos también
      if (selectedIngredients.length > 0) {
        filtered = filtered.filter((product) =>
          selectedIngredients.every((ingredient) => product.ingredients.includes(ingredient)),
        )
      }
    }

    setFilteredProducts(filtered)
  }, [categories, selectedIngredients, allProducts, searchTerm, loading])

  // Enfocar el campo de búsqueda cuando se muestra
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showSearch])

  const toggleCategory = (id: number) => {
    setCategories(
      categories.map((category) => ({
        ...category,
        active: category.id === id,
      })),
    )
    // Limpiar la búsqueda al cambiar de categoría
    setSearchTerm("")
    setShowSearch(false)
  }

  const toggleIngredientFilter = (ingredient: string) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter((i) => i !== ingredient))
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient])
    }
  }

  const toggleSearch = () => {
    setShowSearch(!showSearch)
    if (showSearch) {
      // Si estamos cerrando la búsqueda, limpiar el término
      setSearchTerm("")
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const clearSearch = () => {
    setSearchTerm("")
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  const openQuantitySelector = (productId: number) => {
    setSelectedProductId(productId)
    setSelectedQuantity(1)
  }

  const increaseQuantity = () => {
    setSelectedQuantity((prev) => prev + 1)
  }

  const decreaseQuantity = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity((prev) => prev - 1)
    }
  }

  const addToCartAndNavigate = () => {
    if (selectedProductId !== null) {
      const product = allProducts.find((p) => p.id === selectedProductId)
      if (product) {
        // Leer carrito actual de localStorage
        const storedCart = localStorage.getItem("cart")
        let cart: any[] = storedCart ? JSON.parse(storedCart) : []
        // Buscar si el producto ya está en el carrito
        const existingIndex = cart.findIndex(item => item.id === product.id)
        if (existingIndex !== -1) {
          // Si ya existe, aumentar la cantidad
          cart[existingIndex].quantity += selectedQuantity
        } else {
          // Si no existe, agregarlo
          cart.push({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: selectedQuantity,
            image: product.image,
          })
        }
        // Guardar carrito actualizado
        localStorage.setItem("cart", JSON.stringify(cart))
        console.log("Carrito actualizado:", cart)
        // Navegación SPA
        navigate("/carrito")
      }
    }
  }

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("es-CL")}`
  }

  const renderIngredients = (ingredients: string[]) => {
    return ingredients.join(", ")
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo">
          <h1>FUKUSUKE SUSHI</h1>
        </div>
        <div className="header-actions">
          <button className="icon-button" onClick={toggleSearch}>
            <SearchIcon />
          </button>
          <button className="icon-button" onClick={() => navigate("/carrito")}>
            <ShoppingCartIcon />
          </button>
        </div>
      </header>

      {showSearch && (
        <div className="search-container">
          <div className="search-input-container">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar rolls o ingredientes..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-search-button" onClick={clearSearch}>
                <XIcon />
              </button>
            )}
          </div>
        </div>
      )}

      {!showSearch && (
        <div className="categories-scroll">
          <div className="categories">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-button ${category.active ? "active" : ""}`}
                onClick={() => toggleCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="products-section">
        {!showSearch && (
          <div className="products-header">
            <h2>Productos populares</h2>
            <button className="filter-button" onClick={() => setShowFilters(!showFilters)}>
              Filtros
            </button>
          </div>
        )}

        {showSearch && searchTerm && (
          <div className="search-results-header">
            <h2>Resultados de búsqueda</h2>
            <span className="search-count">{filteredProducts.length} productos encontrados</span>
          </div>
        )}

        {!showSearch && showFilters && (
          <div className="ingredients-filter">
            <h3>Filtrar por ingredientes:</h3>
            <div className="ingredients-list">
              {allIngredients.map((ingredient) => (
                <label key={ingredient} className="ingredient-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedIngredients.includes(ingredient)}
                    onChange={() => toggleIngredientFilter(ingredient)}
                  />
                  {ingredient}
                </label>
              ))}
            </div>
            {selectedIngredients.length > 0 && (
              <button className="clear-filters-button" onClick={() => setSelectedIngredients([])}>
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        <div className="products-grid">
          {loading ? (
            <div className="loading-message">
              <div className="loading-spinner"></div>
              <p>Cargando productos...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-image">
                  <img src={product.image || "/placeholder.svg"} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-ingredients">{renderIngredients(product.ingredients)}</p>
                  <div className="product-footer">
                    <span className="product-price">{formatPrice(product.price)}</span>

                    {selectedProductId === product.id ? (
                      <div className="quantity-selector">
                        <button className="quantity-button decrease" onClick={decreaseQuantity}>
                          <MinusIcon />
                        </button>
                        <span className="quantity-value">{selectedQuantity}</span>
                        <button className="quantity-button increase" onClick={increaseQuantity}>
                          <PlusIcon />
                        </button>
                        <button className="confirm-quantity-button" onClick={addToCartAndNavigate}>
                          <CheckIcon />
                        </button>
                      </div>
                    ) : (
                      <button className="add-to-cart-button" onClick={() => openQuantitySelector(product.id)}>
                        <PlusIcon />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products-message">
              {searchTerm
                ? "No se encontraron productos que coincidan con tu búsqueda."
                : "No se encontraron productos con los filtros seleccionados."}
            </div>
          )}
        </div>
      </div>

      <nav className="bottom-nav">
        <button className="nav-item active" onClick={() => navigate("/")}>
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
