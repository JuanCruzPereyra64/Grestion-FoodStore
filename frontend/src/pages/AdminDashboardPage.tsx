import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Package,
  UtensilsCrossed,
  LayoutDashboard,
  TrendingUp,
  Plus,
  ArrowRight,
  ChefHat,
  DollarSign,
  ShoppingBag,
  FileDown,
  Calendar,
  RefreshCw,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useProductos } from '../hooks/useProductos'
import { useCategorias } from '../hooks/useCategorias'
import { useIngredientes } from '../hooks/useIngredientes'
import { useEstadisticas } from '../hooks/useReportes'
import { reportesApi } from '../services/api'
import { Card, CardHeader } from '../components/common/Card'
import { Button } from '../components/common/Button'

export function AdminDashboardPage() {
  const { data: productos } = useProductos()
  const { data: categorias } = useCategorias()
  const { data: ingredientes } = useIngredientes()

  const today = new Date().toISOString().split('T')[0]
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const [fechaDesde, setFechaDesde] = useState(thirtyDaysAgo)
  const [fechaHasta, setFechaHasta] = useState(today)

  const { data: stats, isLoading: statsLoading, refetch } = useEstadisticas(fechaDesde, fechaHasta)

  const masCaro = productos?.reduce((prev, current) => (prev.precio_base > current.precio_base) ? prev : current, productos[0])

  const handleExportCSV = async () => {
    try {
      await reportesApi.descargarCSV(fechaDesde, fechaHasta)
    } catch (err) {
      console.error('Error al exportar CSV:', err)
    }
  }

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-900 dark:bg-[#1a1a1a] px-8 py-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 opacity-10">
          <ChefHat size={320} />
        </div>

        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
              Panel de Control
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-4">
              Bienvenido, <span className="text-primary">Distrito Food</span>.
            </h1>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Hoy es un gran día para innovar en la cocina. Mirá cómo van tus números y empezá a crear nuevas experiencias gastronómicas.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/admin/producto/nuevo">
                <Button size="lg" icon={Plus}>Nuevo Producto</Button>
              </Link>
              <Link to="/admin/ingredientes">
                <Button variant="secondary" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Ver Despensa
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="flex flex-wrap items-end gap-4">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-slate-400" />
          <div className="flex items-center gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Desde</label>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            <span className="text-slate-400 mt-5">—</span>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Hasta</label>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={() => refetch()} isLoading={statsLoading}>
          Actualizar
        </Button>
        <Button variant="accent" size="sm" icon={FileDown} onClick={handleExportCSV}>
          Exportar a CSV
        </Button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="group">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-5"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110">
              <UtensilsCrossed size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Productos</p>
              <p className="text-3xl font-display font-bold text-slate-900 dark:text-white">{productos?.length || 0}</p>
            </div>
          </motion.div>
        </Card>
        <Card className="group">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center transition-transform group-hover:scale-110">
              <LayoutDashboard size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Categorías</p>
              <p className="text-3xl font-display font-bold text-slate-900 dark:text-white">{categorias?.length || 0}</p>
            </div>
          </div>
        </Card>
        <Card className="group">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center transition-transform group-hover:scale-110">
              <Package size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ingredientes</p>
              <p className="text-3xl font-display font-bold text-slate-900 dark:text-white">{ingredientes?.length || 0}</p>
            </div>
          </div>
        </Card>
        <Card className="group">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center transition-transform group-hover:scale-110">
              <ShoppingBag size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pedidos</p>
              <p className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                {statsLoading ? '-' : stats?.total_pedidos ?? 0}
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center">
              <DollarSign size={32} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ingresos Totales</p>
              <p className="text-4xl font-display font-bold text-slate-900 dark:text-white">
                {statsLoading ? '-' : `$${(stats?.ingresos_totales ?? 0).toFixed(2)}`}
              </p>
            </div>
          </div>
        </Card>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card noPadding className="overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                Ingresos por Día
              </h2>
            </div>
          </div>
          <div className="p-6">
            {statsLoading && (
              <div className="h-64 flex items-center justify-center text-slate-400">Cargando...</div>
            )}
            {!statsLoading && (!stats?.ingresos_por_dia || stats.ingresos_por_dia.length === 0) && (
              <div className="h-64 flex items-center justify-center text-slate-400">Sin datos en este período</div>
            )}
            {!statsLoading && stats?.ingresos_por_dia && stats.ingresos_por_dia.length > 0 && (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={stats.ingresos_por_dia} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="fecha"
                    tick={{ fontSize: 11, fill: '#94A3B8' }}
                    tickFormatter={(val: string) => {
                      const d = new Date(val)
                      return `${d.getDate()}/${d.getMonth() + 1}`
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94A3B8' }}
                    tickFormatter={(val: number) => `$${val}`}
                  />
                  <Tooltip
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Ingresos']}
                    labelFormatter={(label: string) => {
                      const d = new Date(label)
                      return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
                    }}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                  />
                  <Bar
                    dataKey="total"
                    fill="#FF5100"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card noPadding className="overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-accent" />
                Top 5 Productos
              </h2>
            </div>
          </div>
          <div className="p-6">
            {statsLoading && (
              <div className="h-64 flex items-center justify-center text-slate-400">Cargando...</div>
            )}
            {!statsLoading && (!stats?.top_productos || stats.top_productos.length === 0) && (
              <div className="h-64 flex items-center justify-center text-slate-400">Sin ventas en este período</div>
            )}
            {!statsLoading && stats?.top_productos && stats.top_productos.length > 0 && (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={stats.top_productos}
                  layout="vertical"
                  margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis
                    type="category"
                    dataKey="producto_nombre"
                    tick={{ fontSize: 11, fill: '#94A3B8' }}
                    width={140}
                    tickFormatter={(val: string) =>
                      val.length > 18 ? `${val.slice(0, 16)}...` : val
                    }
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === 'cantidad_total') return [value, 'Cant. Vendida']
                      return [value, name]
                    }}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                  />
                  <Bar
                    dataKey="cantidad_total"
                    fill="#cc4100"
                    radius={[0, 6, 6, 0]}
                    maxBarSize={32}
                    name="cantidad_total"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card noPadding className="overflow-hidden h-full">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                Producto Destacado
              </h2>
            </div>
          </div>
          {masCaro ? (
            <div className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-3xl flex items-center justify-center shadow-inner">
                <UtensilsCrossed size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{masCaro.nombre}</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{masCaro.categorias?.[0]?.nombre || 'General'}</p>
              </div>
              <div className="px-6 py-2 rounded-2xl bg-slate-50 dark:bg-[#1a1a1a] text-accent font-display font-bold text-2xl">
                ${masCaro.precio_base.toFixed(2)}
              </div>
              <p className="text-sm text-slate-400">Es el producto de mayor valor en tu carta actual.</p>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              No hay productos para destacar aún.
            </div>
          )}
        </Card>

        <section className="space-y-6">
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white px-2">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/admin/producto/nuevo">
              <Card className="hover:border-primary/50 transition-colors h-full flex items-center gap-4 group">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <LayoutDashboard size={20} />
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">Cargar Producto</span>
              </Card>
            </Link>
            <Link to="/admin/ingredientes">
              <Card className="hover:border-amber-500/50 transition-colors h-full flex items-center gap-4 group">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors">
                  <Package size={20} />
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">Control de Insumos</span>
              </Card>
            </Link>
            <Link to="/admin/pedidos">
              <Card className="hover:border-emerald-500/50 transition-colors h-full flex items-center gap-4 group">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                  <ShoppingBag size={20} />
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">Ver Pedidos</span>
              </Card>
            </Link>
            <Link to="/admin/productos">
              <Card className="hover:border-accent/50 transition-colors h-full flex items-center gap-4 group">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                  <ShoppingBag size={20} />
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">Lista de Productos</span>
              </Card>
            </Link>
          </div>

          <Card className="bg-primary/5 border-primary/10 p-8 flex flex-col items-center text-center space-y-4">
            <ChefHat size={48} className="text-primary" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">¿Todo listo para el servicio?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Recordá revisar que todos los ingredientes estén actualizados antes de abrir el salón.</p>
          </Card>
        </section>
      </div>
    </div>
  )
}
