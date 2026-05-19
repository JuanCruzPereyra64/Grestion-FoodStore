import { motion } from 'framer-motion'
import { ShoppingCart, Search, UtensilsCrossed, Star } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useProductos } from '../hooks/useProductos'
import { useCategorias } from '../hooks/useCategorias'
import { useAuth } from '../stores/authStore'
import { useCart } from '../stores/cartStore'
import { Button } from '../components/common/Button'

export function ProductosPage() {
  const { state: authState } = useAuth()
  const navigate = useNavigate()
  const { data: productos, isLoading, isError } = useProductos()
  const { data: categorias } = useCategorias()
  const { addItem } = useCart()
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState<number | undefined>()

  const lista = productos?.filter(p => {
    if (!p.disponible) return false
    if (filtroCategoria && !p.categorias?.some(c => c.id === filtroCategoria)) return false
    if (searchTerm && !p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) && !p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-slate-500 font-medium italic">Cargando nuestro menú...</p>
    </div>
  )

  if (isError) return (
    <div className="text-center py-20">
      <p className="text-red-500 font-medium">Error al cargar el menú. Intentalo de nuevo.</p>
    </div>
  )

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-12 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <UtensilsCrossed size={40} className="text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
            Nuestro Menú
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Explorá nuestras especialidades y elegí lo que se te antoje.
          </p>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-6 pb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscá tu plato favorito..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            <button
              onClick={() => setFiltroCategoria(undefined)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                !filtroCategoria ? 'bg-primary text-white' : 'bg-slate-800/50 text-slate-300 border border-slate-700 hover:border-primary/30'
              }`}
            >
              Todas
            </button>
            {categorias?.map((c) => (
              <button
                key={c.id}
                onClick={() => setFiltroCategoria(c.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filtroCategoria === c.id ? 'bg-primary text-white' : 'bg-slate-800/50 text-slate-300 border border-slate-700 hover:border-primary/30'
                }`}
              >
                {c.nombre}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        {lista?.length === 0 ? (
          <div className="text-center py-20">
            <UtensilsCrossed size={64} className="text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No encontramos productos con esos criterios.</p>
            <button
              onClick={() => { setSearchTerm(''); setFiltroCategoria(undefined) }}
              className="text-primary text-sm mt-2 hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {lista?.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div className="group relative bg-neutral-950/80 backdrop-blur-lg border border-slate-700/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300">
                  {/* Image */}
                  <Link to={`/productos/${p.id}`}>
                    <div className="aspect-[4/3] bg-slate-700/50 overflow-hidden">
                      {p.imagenes_url?.[0] ? (
                        <img
                          src={p.imagenes_url[0]}
                          alt={p.nombre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <UtensilsCrossed size={48} className="text-slate-600" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-5 space-y-3 bg-black/60 backdrop-blur-md -mt-8 pt-12 rounded-b-2xl relative z-10">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <Link to={`/productos/${p.id}`} className="hover:text-primary transition-colors">
                          <h3 className="font-bold text-white text-lg truncate">{p.nombre}</h3>
                        </Link>
                        {p.categorias?.[0] && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary/80">
                            {p.categorias[0].nombre}
                          </span>
                        )}
                      </div>
                      <span className="font-display font-bold text-xl text-primary whitespace-nowrap">
                        ${p.precio_base.toFixed(2)}
                      </span>
                    </div>

                    {p.descripcion && (
                      <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                        {p.descripcion}
                      </p>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Star size={12} className="fill-primary/30 text-primary/30" />
                      <span>{p.ingredientes?.length || 0} ingredientes</span>
                    </div>

                    <div className="pt-1">
                      <Button
                        size="sm"
                        className="w-full"
                        icon={ShoppingCart}
                        onClick={() => {
                          if (!authState.isAuthenticated) { navigate('/login'); return }
                          addItem({ ...p, cantidad: 1 })
                        }}
                      >
                        Agregar al carrito
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
