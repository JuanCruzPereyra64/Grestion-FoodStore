import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, RefreshCw, Search, AlertCircle } from 'lucide-react'
import { usePedidos, useDescargarFactura, useGenerarFactura } from '../hooks/usePedidos'
import { Card, CardHeader } from '../components/common/Card'
import { Button } from '../components/common/Button'
import type { PedidoRead } from '../types'

const ESTADO_BADGE: Record<string, string> = {
  PENDIENTE: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  CONFIRMADO: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  EN_PREPARACIÓN: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
  EN_CAMINO: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  ENTREGADO: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  FACTURADO: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  CANCELADO: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
}

export function PedidosPage() {
  const { data: pedidos, isLoading, error, refetch } = usePedidos()
  const { descargar } = useDescargarFactura()
  const generarFactura = useGenerarFactura()
  const [facturaError, setFacturaError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = pedidos?.filter((p) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      String(p.id).includes(term) ||
      p.cliente_nombre.toLowerCase().includes(term) ||
      p.estado.toLowerCase().includes(term)
    )
  }) ?? []

  const puedeFacturar = (pedido: PedidoRead) =>
    pedido.estado === 'ENTREGADO' || pedido.estado === 'FACTURADO'

  const handleDescargar = async (pedido: PedidoRead) => {
    setFacturaError(null)
    try {
      await descargar(pedido.id)
    } catch {
      setFacturaError(`El pedido #${pedido.id} no tiene factura. Generala primero.`)
    }
  }

  const handleGenerarYDescargar = (pedido: PedidoRead) => {
    setFacturaError(null)
    generarFactura.mutate(
      { pedidoId: pedido.id, data: { tipo_factura: 'B' } },
      {
        onSuccess: () => descargar(pedido.id),
        onError: (err: Error) => setFacturaError(err.message),
      },
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <CardHeader
          title="Pedidos"
          subtitle="Gestioná y descargá facturas de todos los pedidos"
          action={
            <Button
              variant="ghost"
              size="sm"
              icon={RefreshCw}
              onClick={() => refetch()}
              isLoading={isLoading}
            >
              Actualizar
            </Button>
          }
        />

        {/* Search */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por ID, cliente o estado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        </div>

        {facturaError && (
          <div className="flex items-center gap-2 p-4 mb-4 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle size={18} />
            {facturaError}
          </div>
        )}

        {isLoading && (
          <div className="text-center py-20 text-slate-500">Cargando pedidos...</div>
        )}

        {error && (
          <div className="text-center py-20 text-red-500">Error al cargar pedidos</div>
        )}

        {!isLoading && !error && filtered.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            {searchTerm ? 'No se encontraron pedidos con ese criterio.' : 'No hay pedidos aún.'}
          </div>
        )}

        {!isLoading && !error && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((pedido) => (
              <Card key={pedido.id} noPadding>
                <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-display font-bold text-slate-900 dark:text-white">
                        #{pedido.id}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ${ESTADO_BADGE[pedido.estado] || 'bg-slate-100 text-slate-600'}`}>
                        {pedido.estado}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                      {pedido.cliente_nombre}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(pedido.created_at).toLocaleDateString('es-AR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })} — ${pedido.total.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    {puedeFacturar(pedido) && (
                      <>
                        <Button
                          variant="accent"
                          size="sm"
                          icon={Download}
                          onClick={() => handleDescargar(pedido)}
                        >
                          Descargar Factura
                        </Button>
                        {pedido.estado === 'ENTREGADO' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={FileText}
                            isLoading={generarFactura.isPending}
                            onClick={() => handleGenerarYDescargar(pedido)}
                          >
                            Generar
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
