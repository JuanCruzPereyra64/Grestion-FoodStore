import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../stores/cartStore'
import { getImageUrl } from '../services/api'

export function CartPage() {
  const cart = useCart()
  const navigate = useNavigate()

  if (cart.items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto mt-10 p-8 bg-black/80 backdrop-blur-md rounded-3xl border border-white/10">
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-gray-600">
            <ShoppingBag size={32} />
          </div>
          <p className="text-gray-400 font-medium text-lg">Tu carrito está vacío</p>
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5100] text-white font-bold rounded-xl hover:bg-[#cc4100] transition-colors"
          >
            <ArrowLeft size={18} />
            Ver productos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-8 bg-black/80 backdrop-blur-md rounded-3xl border border-white/10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Tu Carrito</h1>
          <p className="text-gray-400 mt-1">{cart.totalItems} producto(s) en tu pedido</p>
        </div>
        <button
          onClick={cart.clearCart}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <Trash2 size={16} />
          Vaciar carrito
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        {cart.items.map((item) => (
          <motion.div
            key={item.producto.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-colors mb-4"
          >
            <div className="flex flex-col md:flex-row items-start gap-4">
              <img
                src={getImageUrl(item.producto.imagenes_url?.[0]) || '/placeholder.svg'}
                alt={item.producto.nombre}
                className="w-20 h-20 rounded-xl object-cover shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    to={`/productos/${item.producto.id}`}
                    className="text-white font-bold text-lg hover:text-primary transition-colors truncate"
                  >
                    {item.producto.nombre}
                  </Link>
                </div>

                {item.excludedIngredienteIds.length > 0 && (
                  <div className="mt-1 space-y-0.5">
                    {item.producto.ingredientes
                      ?.filter(i => item.excludedIngredienteIds.includes(i.id))
                      .map(ing => (
                        <p key={ing.id} className="text-sm text-gray-400">
                          - Sin {ing.nombre}
                        </p>
                      ))}
                  </div>
                )}

                <p className="text-primary font-display font-bold text-2xl mt-2">
                  ${(item.producto.precio_base * item.cantidad).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1 border border-white/10">
                  <button
                    onClick={() => cart.updateCantidad(item.producto.id, item.cantidad - 1)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-bold text-sm min-w-[2ch] text-center text-white">
                    {item.cantidad}
                  </span>
                  <button
                    onClick={() => cart.updateCantidad(item.producto.id, item.cantidad + 1)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={() => cart.removeItem(item.producto.id)}
                  className="p-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mt-6">
        <div className="space-y-3">
          <div className="flex justify-between text-gray-400">
            <span>Subtotal</span>
            <span className="text-white font-semibold">${cart.totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Envío</span>
            <span className="text-white font-semibold">$0.00</span>
          </div>
          <div className="flex justify-between text-lg pt-3 border-t border-white/10">
            <span className="text-white font-bold">Total</span>
            <span className="text-white font-bold">${cart.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/checkout')}
          className="bg-[#FF5100] text-white font-bold w-full py-4 rounded-xl hover:bg-[#cc4100] transition-colors text-lg mt-6"
        >
          Proceder al Pago
        </button>
      </div>
    </div>
  )
}
