import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './stores/authStore'
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

function ClientShell({ children }: { children: ReactNode }) {
  const { state } = useAuth()
  if (!state.isAuthenticated) return <Navigate to="/login" replace />
  if (!state.user?.roles?.includes('CLIENT')) return <Navigate to="/admin" replace />
  return <ClientLayout>{children}</ClientLayout>
}

function AppRoutes() {
  const { state } = useAuth()
  const isClient = state.user?.roles?.includes('CLIENT')
  const defaultPath = isClient ? '/' : '/admin'

  return (
    <Routes>
      <Route path="/login" element={state.isAuthenticated ? <Navigate to={defaultPath} replace /> : <LoginPage />} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminShell><AdminDashboardPage /></AdminShell>} />
      <Route path="/admin/productos" element={<AdminShell><AdminProductosListPage /></AdminShell>} />
      <Route path="/admin/producto/nuevo" element={<AdminShell><AdminProductoPage /></AdminShell>} />
      <Route path="/admin/ingredientes" element={<AdminShell><IngredientesPage /></AdminShell>} />
      <Route path="/admin/pedidos" element={<AdminShell><PedidosPage /></AdminShell>} />

      {/* Client routes */}
      <Route path="/" element={<ClientShell><ClientHomePage /></ClientShell>} />
      <Route path="/conocenos" element={<ClientShell><ConocenosPage /></ClientShell>} />
      <Route path="/descuentos" element={<ClientShell><DescuentosPage /></ClientShell>} />
      <Route path="/envios" element={<ClientShell><EnviosPage /></ClientShell>} />
      <Route path="/productos" element={<ClientShell><ProductosPage /></ClientShell>} />
      <Route path="/productos/:id" element={<ClientShell><ProductoDetallePage /></ClientShell>} />
      <Route path="/carrito" element={<ClientShell><CartPage /></ClientShell>} />
      <Route path="/checkout" element={<ClientShell><CheckoutPage /></ClientShell>} />
      <Route path="/pedidos" element={<ClientShell><PedidosPage /></ClientShell>} />
      <Route path="/pago/success" element={<ClientShell><PagoResultPage /></ClientShell>} />
      <Route path="/pago/failure" element={<ClientShell><PagoResultPage /></ClientShell>} />
      <Route path="/pago/pending" element={<ClientShell><PagoResultPage /></ClientShell>} />

      <Route path="*" element={<Navigate to={defaultPath} replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
