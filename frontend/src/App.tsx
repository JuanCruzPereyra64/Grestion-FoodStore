import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './stores/authStore'
import { CartProvider } from './stores/cartStore'
import { MainLayout } from './components/layout/MainLayout'
import { ClientLayout } from './components/layout/ClientLayout'
import { LoginPage } from './pages/LoginPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { AdminProductoPage } from './pages/AdminProductoPage'
import { AdminProductosListPage } from './pages/AdminProductosListPage'
import { IngredientesPage } from './pages/IngredientesPage'
import { ClientHomePage } from './pages/ClientHomePage'
import { ConocenosPage } from './pages/ConocenosPage'
import { DescuentosPage } from './pages/DescuentosPage'
import { EnviosPage } from './pages/EnviosPage'
import { ProductosPage } from './pages/ProductosPage'
import { ProductoDetallePage } from './pages/ProductoDetallePage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { PagoResultPage } from './pages/PagoResultPage'
import { PedidosPage } from './pages/PedidosPage'
import type { ReactNode } from 'react'

function AdminShell({ children }: { children: ReactNode }) {
  const { state } = useAuth()
  if (!state.isAuthenticated) return <Navigate to="/login" replace />
  if (state.user?.roles?.includes('CLIENT')) return <Navigate to="/" replace />
  return <MainLayout>{children}</MainLayout>
}

function PublicShell({ children }: { children: ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>
}

function ProtectedClientShell({ children }: { children: ReactNode }) {
  const { state } = useAuth()
  if (!state.isAuthenticated) return <Navigate to="/login" replace />
  if (!state.user?.roles?.includes('CLIENT')) return <Navigate to="/admin" replace />
  return <ClientLayout>{children}</ClientLayout>
}

function AppRoutes() {
  const { state } = useAuth()
  const isClient = state.user?.roles?.includes('CLIENT')
  const defaultPath = !state.isAuthenticated ? '/' : (isClient ? '/' : '/admin')

  return (
    <Routes>
      <Route path="/login" element={state.isAuthenticated ? <Navigate to={defaultPath} replace /> : <LoginPage />} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminShell><AdminDashboardPage /></AdminShell>} />
      <Route path="/admin/productos" element={<AdminShell><AdminProductosListPage /></AdminShell>} />
      <Route path="/admin/producto/nuevo" element={<AdminShell><AdminProductoPage /></AdminShell>} />
      <Route path="/admin/ingredientes" element={<AdminShell><IngredientesPage /></AdminShell>} />
      <Route path="/admin/pedidos" element={<AdminShell><PedidosPage /></AdminShell>} />

      {/* Public routes — sin auth */}
      <Route path="/" element={<PublicShell><ClientHomePage /></PublicShell>} />
      <Route path="/conocenos" element={<PublicShell><ConocenosPage /></PublicShell>} />
      <Route path="/descuentos" element={<PublicShell><DescuentosPage /></PublicShell>} />
      <Route path="/envios" element={<PublicShell><EnviosPage /></PublicShell>} />
      <Route path="/productos" element={<PublicShell><ProductosPage /></PublicShell>} />
      <Route path="/productos/:id" element={<PublicShell><ProductoDetallePage /></PublicShell>} />

      {/* Protected client routes — requieren auth */}
      <Route path="/carrito" element={<ProtectedClientShell><CartPage /></ProtectedClientShell>} />
      <Route path="/checkout" element={<ProtectedClientShell><CheckoutPage /></ProtectedClientShell>} />
      <Route path="/pedidos" element={<ProtectedClientShell><PedidosPage /></ProtectedClientShell>} />
      <Route path="/pago/success" element={<ProtectedClientShell><PagoResultPage /></ProtectedClientShell>} />
      <Route path="/pago/failure" element={<ProtectedClientShell><PagoResultPage /></ProtectedClientShell>} />
      <Route path="/pago/pending" element={<ProtectedClientShell><PagoResultPage /></ProtectedClientShell>} />

      <Route path="*" element={<Navigate to={defaultPath} replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
