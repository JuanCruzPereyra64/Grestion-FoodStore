import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, LogOut, ShoppingBag, ChevronDown, ShoppingCart } from 'lucide-react'
import { useAuth } from '../../stores/authStore'
import { useCart } from '../../stores/cartStore'

import { Footer } from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: LayoutProps) {
  const { state, logout } = useAuth()
  const cart = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 grid grid-cols-3 items-center">
          {/* Col 1: Avatar */}
          <div className="justify-self-start">
            {state.isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User size={16} />
                  </div>
                  <ChevronDown size={12} className="text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-52 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-slate-700">
                      <p className="text-sm font-medium text-white truncate">{state.user?.nombre || 'Usuario'}</p>
                      <p className="text-xs text-slate-400 truncate">{state.user?.email || ''}</p>
                    </div>
                    <button
                      onClick={() => { navigate('/pedidos'); setDropdownOpen(false) }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
                    >
                      <ShoppingBag size={16} />
                      Historial de pedidos
                    </button>
                    <button
                      onClick={() => { logout(); cart.clearCart(); navigate('/login'); setDropdownOpen(false) }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:bg-slate-700 transition-colors"
                    >
                      <LogOut size={16} />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User size={16} />
                </div>
              </Link>
            )}
          </div>

          {/* Col 2: Centro agrupado — enlaces + logo */}
          <div className="flex flex-row items-center justify-center gap-8">
            <NavLink
              to="/conocenos"
              className={({ isActive }) =>
                `hidden md:block text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive ? 'text-primary' : 'text-white hover:text-primary'
                }`
              }
            >
              Conocenos
            </NavLink>
            <NavLink
              to="/productos"
              className={({ isActive }) =>
                `hidden md:block text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive ? 'text-primary' : 'text-white hover:text-primary'
                }`
              }
            >
              Productos
            </NavLink>

            <Link to="/">
              <h1 className="whitespace-nowrap text-3xl font-display font-bold neon-title neon-flicker select-none">
                DISTRITO FOOD
              </h1>
            </Link>

            <NavLink
              to="/descuentos"
              className={({ isActive }) =>
                `hidden md:block text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive ? 'text-primary' : 'text-white hover:text-primary'
                }`
              }
            >
              Descuentos
            </NavLink>
            <NavLink
              to="/envios"
              className={({ isActive }) =>
                `hidden md:block text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive ? 'text-primary' : 'text-white hover:text-primary'
                }`
              }
            >
              Envíos
            </NavLink>
          </div>

          {/* Col 3: Carrito */}
          <div className="justify-self-end">
            <Link
              to="/carrito"
              className="relative p-2 rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center"
            >
              <ShoppingCart size={22} className="text-white hover:text-primary transition-colors" />
              {cart.totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#FF5100] text-white text-[10px] font-bold flex items-center justify-center">
                  {cart.totalItems > 9 ? '9+' : cart.totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-16 flex-1 pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="pb-24"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}
