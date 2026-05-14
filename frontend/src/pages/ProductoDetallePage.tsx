import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ChefHat, Tag, Info, ShoppingCart, AlertTriangle, Check, X, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useProducto } from '../hooks/useProductos'
import { useCart } from '../stores/cartStore'
import { Card, CardHeader } from '../components/common/Card'
import { Button } from '../components/common/Button'

export function ProductoDetallePage() {
  const { id } = useParams<{ id: string }>()
  const productoId = Number(id)

  const { data: producto, isLoading, isError } = useProducto(productoId)
  const cart = useCart()

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-slate-500 font-medium italic">Emplatando detalles...</p>
    </div>
  )

  if (isError || !producto) return (
    <Card className="border-red-100 bg-red-50 dark:bg-red-900/10 max-w-2xl mx-auto mt-10">
      <p className="text-red-600 dark:text-red-400 font-medium text-center">Ups! No pudimos encontrar este producto.</p>
      <div className="flex justify-center mt-4">
        <Link to="/productos">
          <Button variant="secondary" size="sm" icon={ArrowLeft}>Volver a la carta</Button>
        </Link>
      </div>
    </Card>
  )

  const p = producto!
  const cartItem = cart.itemInCart(p.id)
  const excludedIds = new Set(cartItem?.excludedIngredienteIds ?? [])

  function handleAddToCart() {
    cart.addItem(p)
  }

  function handleToggleExclude(ingredienteId: number) {
    if (cartItem) {
      cart.toggleExcludeIngrediente(p.id, ingredienteId)
    } else {
      cart.addItem(p, 1, [ingredienteId])
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link to="/productos" className="inline-flex items-center text-slate-500 hover:text-primary transition-colors gap-2 group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Volver a Productos</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Product Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-primary/10 pointer-events-none">
              <ChefHat size={120} strokeWidth={1} />
            </div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white leading-tight">
                    {p.nombre}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                      <Tag size={12} />
                      {p.categorias?.[0]?.nombre || 'General'}
                    </span>
                    {p.puede_prepararse ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800">
                        <Check size={10} />
                        En stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                        <X size={10} />
                        Sin stock
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display font-bold text-accent dark:text-accent">
                    ${(p.precio_base ?? 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Precio Sugerido</p>
                </div>
              </div>

              {p.imagenes_url?.[0] && (
                <div className="-mx-6 mt-4 mb-6">
                  <img src={p.imagenes_url[0]} alt={p.nombre} className="w-full max-h-[32rem] object-contain bg-slate-900/20" />
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold mb-3">
                  <Info size={18} className="text-primary" />
                  <h3>Descripción del Producto</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {p.descripcion || 'Este producto aún no cuenta con una descripción detallada en nuestra carta.'}
                </p>
              </div>
            </div>
          </Card>

          {/* Add to Cart Section — moved to right column */}
        </div>

        {/* Right Column: Ingredients */}
        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader
              title="Ingredientes"
              subtitle={`${p.ingredientes?.length || 0} ingredientes asignados`}
            />

            <div className="flex-1 space-y-4">
              {p.ingredientes?.length ? (
                <ul className="space-y-3">
                  {p.ingredientes.map((ing) => {
                    const isExcluded = excludedIds.has(ing.ingrediente_id)
                    return (
                      <motion.li
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={ing.ingrediente_id}
                        className={`p-3 rounded-2xl border transition-all duration-200 ${
                          isExcluded
                            ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                            : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                              {ing.nombre}
                            </span>
                            {ing.es_alergeno && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700 shrink-0">
                                <AlertTriangle size={8} />
                                Alérgeno
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleToggleExclude(ing.ingrediente_id)}
                            className={`shrink-0 p-1.5 rounded-lg transition-all ${
                              isExcluded
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                            }`}
                            title={isExcluded ? 'Incluir ingrediente' : 'Excluir ingrediente'}
                          >
                            {isExcluded ? <Check size={14} /> : <Trash2 size={14} />}
                          </button>
                        </div>
                      </motion.li>
                    )
                  })}
                </ul>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-sm text-slate-500 italic">No hay ingredientes asignados aún.</p>
                </div>
              )}
            </div>

            {/* CTA — moved from left column */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                {cartItem
                  ? `${cartItem.cantidad} en tu carrito — ${cartItem.excludedIngredienteIds.length} ingrediente(s) excluido(s)`
                  : p.puede_prepararse ? 'Personalizá tu pedido y agregalo al carrito' : 'Este producto no está disponible'}
              </p>
              <div className="flex items-center justify-center gap-3">
                {cartItem && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary" size="sm"
                      onClick={() => cart.updateCantidad(p.id, cartItem.cantidad - 1)}
                    >−</Button>
                    <span className="font-bold text-lg min-w-[2ch] text-center text-slate-900 dark:text-white">{cartItem.cantidad}</span>
                    <Button
                      variant="secondary" size="sm"
                      onClick={() => cart.updateCantidad(p.id, cartItem.cantidad + 1)}
                    >+</Button>
                  </div>
                )}
                <Button
                  onClick={handleAddToCart}
                  variant="primary"
                  icon={cartItem ? undefined : ShoppingCart}
                  size="lg"
                  className="flex-1"
                  disabled={!p.puede_prepararse}
                >
                  {!p.puede_prepararse ? 'Sin stock' : cartItem ? 'Agregar otro' : 'Agregar al carrito'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
