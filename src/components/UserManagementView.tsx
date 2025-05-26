"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { HomeIcon, UserIcon, UsersIcon, PackageIcon, PlusIcon, XIcon, EditIcon, SearchIcon } from "./Icons"
import "./UserManagementView.css"

interface User {
  id: number
  run: string
  fullName: string
  role: "Cliente" | "Cajero" | "Administrador" | "Jefe de despachos"
  address: string
  commune: string
  province: string
  region: string
  birthDate: string
  gender: "Masculino" | "Femenino" | "Otro"
  email: string
  phone: string
}

export default function UserManagementView() {
  const navigate = useNavigate()

  // Estado para usuarios
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Estado para el formulario
  const [formData, setFormData] = useState<Omit<User, "id">>({
    run: "",
    fullName: "",
    role: "Cliente",
    address: "",
    commune: "",
    province: "",
    region: "",
    birthDate: "",
    gender: "Masculino",
    email: "",
    phone: "",
  })

  // Generar datos de usuarios simulados
  useEffect(() => {
    const generateUsers = (): User[] => {
      const roles: ("Cliente" | "Cajero" | "Administrador" | "Jefe de despachos")[] = [
        "Cliente",
        "Cajero",
        "Administrador",
        "Jefe de despachos",
      ]
      const genders: ("Masculino" | "Femenino" | "Otro")[] = ["Masculino", "Femenino", "Otro"]
      const regions = ["Metropolitana", "Valparaíso", "Biobío"]
      const provinces = ["Santiago", "Valparaíso", "Concepción"]
      const communes = ["Santiago", "Providencia", "Las Condes", "Ñuñoa", "Viña del Mar", "Valparaíso", "Concepción"]

      const usersData: User[] = [
        {
          id: 1,
          run: "12.345.678-9",
          fullName: "Juan Pérez",
          role: "Administrador",
          address: "Av. Providencia 1234",
          commune: "Providencia",
          province: "Santiago",
          region: "Metropolitana",
          birthDate: "1985-05-15",
          gender: "Masculino",
          email: "juan.perez@example.com",
          phone: "+56 9 1234 5678",
        },
        {
          id: 2,
          run: "11.222.333-4",
          fullName: "María González",
          role: "Cajero",
          address: "Av. Las Condes 5678",
          commune: "Las Condes",
          province: "Santiago",
          region: "Metropolitana",
          birthDate: "1990-08-22",
          gender: "Femenino",
          email: "maria.gonzalez@example.com",
          phone: "+56 9 8765 4321",
        },
        {
          id: 3,
          run: "9.876.543-2",
          fullName: "Carlos Rodríguez",
          role: "Jefe de despachos",
          address: "Av. Irarrázaval 7654",
          commune: "Ñuñoa",
          province: "Santiago",
          region: "Metropolitana",
          birthDate: "1988-03-10",
          gender: "Masculino",
          email: "carlos.rodriguez@example.com",
          phone: "+56 9 2345 6789",
        },
        {
          id: 4,
          run: "15.444.555-6",
          fullName: "Ana Torres",
          role: "Cliente",
          address: "Av. Apoquindo 9876",
          commune: "Las Condes",
          province: "Santiago",
          region: "Metropolitana",
          birthDate: "1995-11-30",
          gender: "Femenino",
          email: "ana.torres@example.com",
          phone: "+56 9 3456 7890",
        },
        {
          id: 5,
          run: "18.777.888-9",
          fullName: "Pedro Soto",
          role: "Cliente",
          address: "Calle Valparaíso 123",
          commune: "Viña del Mar",
          province: "Valparaíso",
          region: "Valparaíso",
          birthDate: "1992-07-18",
          gender: "Masculino",
          email: "pedro.soto@example.com",
          phone: "+56 9 4567 8901",
        },
      ]

      return usersData
    }

    const usersData = generateUsers()
    setUsers(usersData)
    setFilteredUsers(usersData)
  }, [])

  // Filtrar usuarios cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.run.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleAddUser = () => {
    setIsEditing(false)
    setFormData({
      run: "",
      fullName: "",
      role: "Cliente",
      address: "",
      commune: "",
      province: "",
      region: "",
      birthDate: "",
      gender: "Masculino",
      email: "",
      phone: "",
    })
    setShowUserModal(true)
  }

  const handleEditUser = (user: User) => {
    setIsEditing(true)
    setSelectedUser(user)
    setFormData({
      run: user.run,
      fullName: user.fullName,
      role: user.role,
      address: user.address,
      commune: user.commune,
      province: user.province,
      region: user.region,
      birthDate: user.birthDate,
      gender: user.gender,
      email: user.email,
      phone: user.phone,
    })
    setShowUserModal(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEditing && selectedUser) {
      // Actualizar usuario existente
      const updatedUsers = users.map((user) => (user.id === selectedUser.id ? { ...user, ...formData } : user))
      setUsers(updatedUsers)
    } else {
      // Añadir nuevo usuario
      const newUser: User = {
        id: users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1,
        ...formData,
      }
      setUsers([...users, newUser])
    }

    // Cerrar el modal
    setShowUserModal(false)
    setSelectedUser(null)
  }

  const closeModal = () => {
    setShowUserModal(false)
    setSelectedUser(null)
  }

  const getRoleClass = (role: string) => {
    switch (role) {
      case "Administrador":
        return "role-admin"
      case "Cajero":
        return "role-cashier"
      case "Jefe de despachos":
        return "role-delivery"
      case "Cliente":
        return "role-client"
      default:
        return ""
    }
  }

  return (
    <div className="user-management-container">
      <header className="home-header">
        <div className="logo">
          <h1>FUKUSUKE SUSHI</h1>
          <h2 className="subtitle">Gestión de Usuarios</h2>
        </div>
      </header>

      <div className="user-management-content">
        <div className="user-management-header">
          <div className="search-container">
            <div className="search-input-wrapper">
              <SearchIcon />
              <input
                type="text"
                placeholder="Buscar usuario por nombre, RUN, email o rol..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm("")}>
                  <XIcon />
                </button>
              )}
            </div>
          </div>
          <button className="add-user-button" onClick={handleAddUser}>
            <PlusIcon />
            <span>Añadir Usuario</span>
          </button>
        </div>

        <div className="users-list">
          <div className="users-table-header">
            <div className="user-column name-column">Nombre</div>
            <div className="user-column role-column">Rol</div>
            <div className="user-column contact-column">Contacto</div>
            <div className="user-column actions-column">Acciones</div>
          </div>

          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div className="user-row" key={user.id}>
                <div className="user-column name-column">
                  <div className="user-name">{user.fullName}</div>
                  <div className="user-run">{user.run}</div>
                </div>
                <div className="user-column role-column">
                  <span className={`user-role ${getRoleClass(user.role)}`}>{user.role}</span>
                </div>
                <div className="user-column contact-column">
                  <div className="user-email">{user.email}</div>
                  <div className="user-phone">{user.phone}</div>
                </div>
                <div className="user-column actions-column">
                  <button className="edit-user-button" onClick={() => handleEditUser(user)}>
                    <EditIcon />
                    <span>Editar</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-users">
              <p>No se encontraron usuarios que coincidan con la búsqueda</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para añadir/editar usuario */}
      {showUserModal && (
        <div className="modal-overlay">
          <div className="modal-content user-form-modal">
            <div className="modal-header">
              <h2>{isEditing ? "Editar Usuario" : "Añadir Usuario"}</h2>
              <button className="close-modal-button" onClick={closeModal}>
                <XIcon />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} className="user-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="run">RUN</label>
                    <input
                      type="text"
                      id="run"
                      name="run"
                      value={formData.run}
                      onChange={handleInputChange}
                      placeholder="Ej: 12.345.678-9"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="fullName">Nombre Completo</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Ej: Juan Pérez"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="role">Rol</label>
                    <select id="role" name="role" value={formData.role} onChange={handleInputChange} required>
                      <option value="Cliente">Cliente</option>
                      <option value="Cajero">Cajero</option>
                      <option value="Administrador">Administrador</option>
                      <option value="Jefe de despachos">Jefe de despachos</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="gender">Sexo</label>
                    <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} required>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Ej: correo@ejemplo.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Número Telefónico</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Ej: +56 9 1234 5678"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="birthDate">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="address">Dirección</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Ej: Av. Providencia 1234"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="commune">Comuna</label>
                    <input
                      type="text"
                      id="commune"
                      name="commune"
                      value={formData.commune}
                      onChange={handleInputChange}
                      placeholder="Ej: Providencia"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="province">Provincia</label>
                    <input
                      type="text"
                      id="province"
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      placeholder="Ej: Santiago"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="region">Región</label>
                    <input
                      type="text"
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      placeholder="Ej: Metropolitana"
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={closeModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="submit-button">
                    {isEditing ? "Guardar Cambios" : "Añadir Usuario"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => navigate("/admin")}>
          <HomeIcon />
          <span>Inicio</span>
        </button>
        <button className="nav-item active" onClick={() => navigate("/admin/usuarios")}>
          <UsersIcon />
          <span>Usuarios</span>
        </button>
        <button className="nav-item" onClick={() => navigate("/admin/inventario")}>
          <PackageIcon />
          <span>Inventario</span>
        </button>
        <button className="nav-item" onClick={() => navigate("/admin/perfil")}>
          <UserIcon />
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  )
}
