import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShoppingBag, ArrowLeft, AlertTriangle, CreditCard, User, ExternalLink, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../stores/cartStore'
import { useCreatePedido } from '../hooks/usePedidos'
import { useCreatePreference } from '../hooks/usePagos'
import { Button } from '../components/common/Button'
import type { PedidoCreate } from '../types'

const ZONAS = ['Maipú', 'Ciudad', 'Godoy Cruz', 'Luján de Cuyo', 'Guaymallén']

export function CheckoutPage() {
  const cart = useCart()
  const createMutation = useCreatePedido()
  const createPreferenceMutation = useCreatePreference()
  const navigate = useNavigate()

  const [clienteNombre, setClienteNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [zonaEnvio, setZonaEnvio] = useState('')
  const [metodoPago, setMetodoPago] = useState('mercadopago')

  const isValid =
    clienteNombre.trim().length > 0 &&
    telefono.trim().length > 0 &&
    direccion.trim().length > 0 &&
    zonaEnvio.length > 0 &&
    cart.items.length > 0

  useEffect(() => {
    if (createPreferenceMutation.isSuccess && createPreferenceMutation.data) {
      window.location.href = createPreferenceMutation.data.init_point
    }
  }, [createPreferenceMutation.isSuccess, createPreferenceMutation.data])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid || createMutation.isPending) return

    const payload: PedidoCreate = {
      cliente_nombre: clienteNombre.trim(),
      telefono: telefono.trim(),
      direccion: direccion.trim(),
      zona_envio: zonaEnvio,
      items: cart.items.map(item => ({
        producto_id: item.producto.id,
        cantidad: item.cantidad,
        excluded_ingrediente_ids: item.excludedIngredienteIds,
      })),
    }

    createMutation.mutate(payload, {
      onSuccess: (pedido) => {
        cart.clearCart()
        if (metodoPago === 'efectivo') {
          navigate('/')
        } else {
          createPreferenceMutation.mutate(pedido.id)
        }
      },
    })
  }

  if (createMutation.isSuccess && createPreferenceMutation.isPending) {
    return (
      <div className="max-w-lg mx-auto text-center space-y-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 md:p-12 bg-black/80 backdrop-blur-md rounded-3xl border border-white/10 space-y-6"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#FF5100]/10 text-[#FF5100] mx-auto">
            <ExternalLink size={40} strokeWidth={2.5} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Redirigiendo al pago</h1>
            <p className="text-gray-400 mt-2 text-lg">
              Pedido #{createMutation.data.id} creado. Estamos preparando el pago con MercadoPago...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-[#FF5100]/30 border-t-[#FF5100] rounded-full animate-spin" />
          </div>
        </motion.div>
      </div>
    )
  }

  if (createPreferenceMutation.isError) {
    return (
      <div className="max-w-lg mx-auto text-center space-y-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 md:p-12 bg-black/80 backdrop-blur-md rounded-3xl border border-white/10 space-y-6"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-900/20 text-red-400 mx-auto">
            <AlertCircle size={40} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Error al generar el pago</h1>
            <p className="text-gray-400 mt-2 text-lg">
              No pudimos conectar con MercadoPago. Tu pedido fue registrado, pero el pago no pudo iniciarse.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Button variant="secondary" onClick={() => navigate('/')} icon={ArrowLeft}>
              Ir al inicio
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-8 md:p-12 bg-black/80 backdrop-blur-md rounded-3xl border border-white/10">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT: Form */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 space-y-6">
              <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <User size={20} className="text-[#FF5100]" />
                Datos de entrega
              </h2>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-200 ml-1">Nombre completo</label>
                  <input
                    required
                    placeholder="Ej: Juan Pérez"
                    value={clienteNombre}
                    onChange={(e) => setClienteNombre(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF5100] focus:ring-1 focus:ring-[#FF5100] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-200 ml-1">Teléfono</label>
                  <input
                    required
                    type="tel"
                    placeholder="Ej: 2615555555"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF5100] focus:ring-1 focus:ring-[#FF5100] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-200 ml-1">Dirección de entrega</label>
                  <input
                    required
                    placeholder="Ej: Av. Siempre Viva 123, Piso 3, Depto B"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF5100] focus:ring-1 focus:ring-[#FF5100] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-200 ml-1">Zona de Envío</label>
                  <select
                    required
                    value={zonaEnvio}
                    onChange={(e) => setZonaEnvio(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF5100] focus:ring-1 focus:ring-[#FF5100] transition-all"
                  >
                    <option value="" disabled className="bg-black text-gray-500">Seleccioná una zona</option>
                    {ZONAS.map(z => (
                      <option key={z} value={z} className="bg-black text-white">{z}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10">
              <h2 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-[#FF5100]" />
                Método de Pago
              </h2>

              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  metodoPago === 'efectivo'
                    ? 'border-[#FF5100] bg-[#FF5100]/10'
                    : 'border-white/10 bg-black/30 hover:bg-white/5'
                }`}>
                  <input
                    type="radio"
                    name="metodoPago"
                    value="efectivo"
                    checked={metodoPago === 'efectivo'}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="w-4 h-4 text-[#FF5100] focus:ring-[#FF5100] bg-black/50 border-white/20"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">Efectivo (Pago en puerta)</p>
                    <p className="text-xs text-gray-400">Pagás al recibir el pedido</p>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  metodoPago === 'mercadopago'
                    ? 'border-[#FF5100] bg-[#FF5100]/10'
                    : 'border-white/10 bg-black/30 hover:bg-white/5'
                }`}>
                  <input
                    type="radio"
                    name="metodoPago"
                    value="mercadopago"
                    checked={metodoPago === 'mercadopago'}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="w-4 h-4 text-[#FF5100] focus:ring-[#FF5100] bg-black/50 border-white/20"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">Mercado Pago</p>
                    <p className="text-xs text-gray-400">Pagá con tarjeta o transferencia</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 sticky top-24 space-y-4">
              <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#FF5100]" />
                Resumen ({cart.totalItems} ítems)
              </h2>

              {cart.items.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-gray-400 italic mb-4">Tu carrito está vacío.</p>
                  <Link to="/productos">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF5100] hover:text-[#cc4100] transition-colors"
                    >
                      <ArrowLeft size={16} />
                      Ver productos
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {cart.items.map((item) => (
                      <motion.div
                        key={item.producto.id}
                        layout
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 rounded-xl bg-black/30 border border-white/10"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-white truncate">{item.producto.nombre}</p>
                          <p className="text-sm font-display font-bold text-[#FF5100] shrink-0 ml-2">
                            ${(item.producto.precio_base * item.cantidad).toFixed(2)}
                          </p>
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium">Cant: {item.cantidad}</p>
                        {item.excludedIngredienteIds.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.producto.ingredientes
                              ?.filter(i => item.excludedIngredienteIds.includes(i.id))
                              .map(ing => (
                                <span key={ing.id} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium bg-red-900/20 text-red-400 border border-red-800">
                                  <AlertTriangle size={8} />
                                  Sin {ing.nombre}
                                </span>
                              ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-400">Subtotal</span>
                      <span className="text-sm font-semibold text-white">${cart.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className="text-base font-display font-bold text-white">Total</span>
                      <span className="text-xl font-display font-bold text-[#FF5100]">${cart.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!isValid || createMutation.isPending}
                    className="bg-[#FF5100] text-white font-bold w-full py-4 rounded-xl hover:bg-[#cc4100] transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                  >
                    {createMutation.isPending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        Confirmar Pedido
                      </>
                    )}
                  </button>

                  {!isValid && (
                    <p className="text-[10px] text-red-400 font-medium text-center italic">
                      * Completá todos los datos para confirmar.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
