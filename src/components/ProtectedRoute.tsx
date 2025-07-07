import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  allowedTypes?: ('cliente' | 'trabajador')[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  allowedTypes = [],
  redirectTo = '/login'
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Verificar tipo de usuario si se especifica
  if (allowedTypes.length > 0 && !allowedTypes.includes(user.tipo)) {
    return <Navigate to="/" replace />;
  }

  // Verificar rol si se especifica (solo para trabajadores)
  if (allowedRoles.length > 0 && user.tipo === 'trabajador' && user.rol) {
    if (!allowedRoles.includes(user.rol)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

// Componentes específicos para diferentes tipos de usuarios
export const ClientRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedTypes={['cliente']}>
    {children}
  </ProtectedRoute>
);

export const WorkerRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ 
  children, 
  roles = [] 
}) => (
  <ProtectedRoute allowedTypes={['trabajador']} allowedRoles={roles}>
    {children}
  </ProtectedRoute>
);

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedTypes={['trabajador']} allowedRoles={['admin', 'dueno']}>
    {children}
  </ProtectedRoute>
); 