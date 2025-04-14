"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./HomeView.css"
import { HomeIcon, ShoppingCartIcon, UserIcon, SearchIcon, PlusIcon, MinusIcon, CheckIcon, XIcon } from "./Icons"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  ingredients: string[]
  categories: string[]
}

interface Category {
  id: number
  name: string
  active: boolean
}

export default function HomeView() {
  const navigate = useNavigate()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Populares", active: true },
    { id: 2, name: "Tempura", active: false },
    { id: 3, name: "Nori", active: false },
    { id: 4, name: "Avocado", active: false },
  ])

  const [allProducts, setAllProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Nigiri",
      description: "Arroz, Salmón",
      price: 9990,
      image: "/sushi3.jpg",
      ingredients: ["Arroz", "Salmón"],
      categories: ["Populares"],
    },
    {
      id: 2,
      name: "Smoked Salmon Roll",
      description: "Arroz, Salmón, Palta, Alga Nori",
      price: 9990,
      image: "/sushi2.jpg",
      ingredients: ["Arroz", "Salmón", "Palta", "Alga Nori"],
      categories: ["Populares", "Nori", "Avocado"],
    },
    {
      id: 3,
      name: "Tobiko California Roll",
      description: "Arroz, Pepino, Cangrejo, Palta, Tobiko",
      price: 9990,
      image: "/sushi1.jpg",
      ingredients: ["Arroz", "Pepino", "Cangrejo", "Palta", "Tobiko"],
      categories: ["Populares", "Avocado"],
    },
    {
      id: 4,
      name: "Yasu Roll",
      description: "Arroz, Camarón, Queso crema, Salmón, Cebollín",
      price: 9990,
      image: "/sushi4.jpg",
      ingredients: ["Arroz", "Camarón", "Queso crema", "Salmón", "Cebollín"],
      categories: ["Populares"],
    },
    {
      id: 5,
      name: "Tempura Roll",
      description: "Arroz, Camarón tempura, Palta, Salsa especial",
      price: 10990,
      image: "/sushi1.jpg",
      ingredients: ["Arroz", "Camarón tempura", "Palta", "Salsa especial"],
      categories: ["Tempura", "Avocado"],
    },
    {
      id: 6,
      name: "Nori Special",
      description: "Arroz, Salmón, Alga Nori, Aguacate",
      price: 11990,
      image: "/sushi2.jpg",
      ingredients: ["Arroz", "Salmón", "Alga Nori", "Aguacate"],
      categories: ["Nori", "Avocado"],
    },
  ])

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Estados para la selección de cantidad
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1)

  // Lista de todos los ingredientes disponibles
  const allIngredients = [...new Set(allProducts.flatMap((product) => product.ingredients))].sort()

  // Filtrar productos cuando cambia la categoría, los ingredientes seleccionados o el término de búsqueda
  useEffect(() => {
    const activeCategory = categories.find((cat) => cat.active)?.name || "Populares"

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
  }, [categories, selectedIngredients, allProducts, searchTerm])

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
        // Aquí podrías implementar la lógica para añadir al carrito
        // Por ejemplo, usando localStorage o un estado global
        console.log(`Añadiendo ${selectedQuantity} unidades de ${product.name} al carrito`)

        // Simulamos añadir al carrito (en una aplicación real, esto se haría con un estado global o localStorage)
        const cartItem = {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: selectedQuantity,
          image: product.image,
        }

        // En una aplicación real, aquí guardarías el item en el carrito
        console.log("Item añadido al carrito:", cartItem)

        // Redirigir al carrito
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
          <h1>FUKAKU SUSHI</h1>
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
          {filteredProducts.length > 0 ? (
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
