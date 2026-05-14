import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Leaf, 
  UtensilsCrossed, 
  ChefHat,
  Menu,
  Home,
  ClipboardList,
  LogOut
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../stores/authStore'

interface LayoutProps {
  children: React.ReactNode
}

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: Home },
  { to: '/admin/producto/nuevo', label: 'Cargar Producto', icon: LayoutDashboard },
  { to: '/admin/ingredientes', label: 'Ingredientes', icon: Leaf },
  { to: '/admin/productos', label: 'Productos', icon: UtensilsCrossed },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ClipboardList },
]

export function MainLayout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { state, logout } = useAuth()

  const visibleNavItems = navItems

  return (
    <div className="min-h-screen flex bg-transparent">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 p-4 bg-primary text-white rounded-full shadow-2xl"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 lg:translate-x-0 lg:fixed lg:inset-y-0 lg:left-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center text-primary">
              <ChefHat size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold leading-tight neon-title neon-flicker">
                DISTRITO FOOD
              </h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
                Panel de Control
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => `
                  group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-primary/10 text-primary dark:bg-primary/20' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }
                `}
              >
                <item.icon size={20} className="group-hover:scale-110 transition-transform" />
                <span className="flex-1">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer Section */}
          <div className="p-6 border-t border-slate-100 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center text-slate-500 font-bold text-sm">
                  {state.user?.nombre?.charAt(0) || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {state.user?.nombre || 'Usuario'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {state.user?.roles?.join(', ') || 'Sin rol'}
                  </p>
                </div>
                <button
                  onClick={() => { logout(); navigate('/login') }}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col lg:pl-72">
        <div className="flex-1 overflow-x-hidden p-6 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
