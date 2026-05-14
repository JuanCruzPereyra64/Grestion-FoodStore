import { useState } from 'react'
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Check, X, Clock, ShoppingBag, ArrowLeft, RefreshCw, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import { usePagoStatus } from '../hooks/usePagos'
import { usePedido, useDescargarFactura, useGenerarFactura } from '../hooks/usePedidos'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { MapPin } from 'lucide-react'

type ResultType = 'success' | 'failure' | 'pending'

function getResultType(pathname: string): ResultType {
  if (pathname.includes('/pago/success')) return 'success'
  if (pathname.includes('/pago/failure')) return 'failure'
  return 'pending'
}

const RESULT_CONFIG = {
  success: {
    icon: Check,
    bgClass: 'bg-green-100 dark:bg-green-900/20',
    textClass: 'text-green-600 dark:text-green-400',
    title: 'Pago Aprobado',
    subtitle: 'Tu pago fue procesado con éxito.',
  },
  failure: {
    icon: X,
    bgClass: 'bg-red-100 dark:bg-red-900/20',
    textClass: 'text-red-600 dark:text-red-400',
    title: 'Pago Rechazado',
    subtitle: 'El pago no pudo completarse. Intentalo de nuevo.',
  },
  pending: {
    icon: Clock,
    bgClass: 'bg-yellow-100 dark:bg-yellow-900/20',
    textClass: 'text-yellow-600 dark:text-yellow-400',
    title: 'Pago Pendiente',
    subtitle: 'Estamos esperando la confirmación del pago.',
  },
}

export function PagoResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [facturaError, setFacturaError] = useState<string | null>(null)
  const pedidoId = searchParams.get('pedido_id')
  const resultType = getResultType(location.pathname)
  const config = RESULT_CONFIG[resultType]
  const Icon = config.icon

  const numericId = pedidoId ? Number(pedidoId) : null
  const { data: pagoStatus, isLoading: statusLoading } = usePagoStatus(resultType === 'pending' ? numericId : null)
  const { data: pedido, isLoading: pedidoLoading } = usePedido(numericId ?? 0)
  const { descargar } = useDescargarFactura()
  const generarFactura = useGenerarFactura()

  if (!pedidoId || isNaN(Number(pedidoId))) {
    return (
      <div className="max-w-lg mx-auto text-center space-y-6 py-20">
        <X size={48} className="mx-auto text-red-500" />
        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Link inválido</h1>
        <p className="text-slate-500">No se encontró un número de pedido válido.</p>
        <Button variant="primary" onClick={() => navigate('/')}>Ir al inicio</Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${config.bgClass} ${config.textClass} mx-auto`}>
          <Icon size={40} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">{config.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            {config.subtitle}
          </p>
          <p className="text-sm text-slate-400 mt-1">Pedido #{pedidoId}</p>
        </div>

        {resultType === 'pending' && (
          <div className="space-y-4">
            {statusLoading && (
              <div className="flex items-center justify-center gap-2 text-slate-500">
                <RefreshCw size={18} className="animate-spin" />
                <span>Verificando estado del pago...</span>
              </div>
            )}
            {pagoStatus && (
              <Card className="text-left">
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <p>Estado del pedido: <span className="font-semibold text-slate-900 dark:text-white">{pagoStatus.estado}</span></p>
                  {pagoStatus.pago && (
                    <p>Estado del pago: <span className="font-semibold text-slate-900 dark:text-white">{pagoStatus.pago.status}</span></p>
                  )}
                </div>
              </Card>
            )}
            <Button variant="secondary" onClick={() => window.location.reload()} icon={RefreshCw}>
              Verificar de nuevo
            </Button>
          </div>
        )}

        {resultType === 'failure' && (
          <Card className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Podés intentar el pago nuevamente desde el panel de administración o contactarnos para asistencia.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="secondary" onClick={() => navigate('/')} icon={ArrowLeft}>
                Volver al inicio
              </Button>
            </div>
          </Card>
        )}

        {resultType === 'success' && pedido && (
          <Card className="text-left">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <MapPin size={16} />
                <span>{pedido.direccion_snapshot}</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {pedido.detalles.map((d) => (
                  <div key={d.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{d.producto_nombre_snapshot}</p>
                      <p className="text-xs text-slate-500">x{d.cantidad} — ${d.precio_unitario_snapshot.toFixed(2)} c/u</p>
                    </div>
                    <p className="font-display font-bold text-slate-900 dark:text-white">${d.subtotal.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                <p className="text-lg font-display font-bold text-slate-900 dark:text-white">Total</p>
                <p className="text-2xl font-display font-bold text-accent">${pedido.total.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        )}

        {resultType === 'success' && pedido && (
          <Card className="space-y-4">
            <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white">
              Facturación
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Descargá la factura de tu pedido o generala si aún no está disponible.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="accent"
                size="sm"
                icon={FileText}
                onClick={async () => {
                  setFacturaError(null)
                  try {
                    await descargar(numericId!)
                  } catch {
                    setFacturaError('Primero generá la factura.')
                  }
                }}
              >
                Descargar Factura
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={FileText}
                isLoading={generarFactura.isPending}
                onClick={() => {
                  setFacturaError(null)
                  generarFactura.mutate(
                    { pedidoId: numericId!, data: { tipo_factura: 'B' } },
                    {
                      onSuccess: () => descargar(numericId!),
                      onError: (err: Error) => setFacturaError(err.message),
                    },
                  )
                }}
              >
                Generar Factura
              </Button>
            </div>
            {facturaError && (
              <p className="text-sm text-red-500">{facturaError}</p>
            )}
          </Card>
        )}

        {resultType === 'success' && !pedido && pedidoLoading && (
          <p className="text-slate-500">Cargando detalles del pedido...</p>
        )}

        <div className="flex justify-center gap-4">
          <Button variant="secondary" onClick={() => navigate('/productos')} icon={ArrowLeft}>
            Seguir comprando
          </Button>
          <Button variant="primary" onClick={() => navigate('/')} icon={ShoppingBag}>
            Ir al inicio
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
