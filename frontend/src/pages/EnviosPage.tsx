import { motion } from 'framer-motion'
import { Truck, MapPin, Shield, Zap, DollarSign } from 'lucide-react'

const zonas = [
  {
    icon: MapPin,
    title: 'Zona Centro (Epicentro Maipú):',
    text: 'Nuestro cuartel general. Si estás acá, el pedido te llega volando.',
  },
  {
    icon: MapPin,
    title: 'Gran Mendoza:',
    text: 'Llegamos a Godoy Cruz, Ciudad, Luján de Cuyo y Guaymallén.',
  },
]

const compromisos = [
  {
    icon: Zap,
    title: 'Hot-Delivery:',
    text: 'Usamos mochilas térmicas de alta densidad para que el calor se mantenga como si acabara de salir de la parrilla.',
  },
  {
    icon: Shield,
    title: 'Seguridad Total:',
    text: 'Seguimiento en tiempo real. Desde que el pibe de la moto arranca hasta que toca tu timbre, sabés dónde está tu comida.',
  },
  {
    icon: Truck,
    title: 'Cero Fricción:',
    text: 'Si vivís en un complejo o barrio privado, nuestros repartidores están entrenados para seguir los protocolos de ingreso rápido.',
  },
]

export function EnviosPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto mt-20 p-8 md:p-12 bg-black/80 backdrop-blur-md rounded-3xl border border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-2">
            <Truck size={36} className="text-primary" />
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary">
              Logística Distrito: Del Fuego a tu Puerta.
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-white mb-10 leading-relaxed">
            Cubrimos todo el Gran Mendoza con la velocidad que tu hambre necesita.
          </p>

          {/* Intro body */}
          <div className="text-gray-200 leading-relaxed text-base md:text-lg mb-12">
            <p>
              En Distrito Food no solo nos obsesiona la cocción, sino también el tiempo de llegada.
              Sabemos que no hay nada peor que una pizza fría o una hamburguesa que perdió su &ldquo;smash&rdquo;
              en el camino. Por eso, diseñamos nuestra propia red de distribución urbana.
            </p>
          </div>

          {/* Zonas de Cobertura */}
          <h2 className="text-2xl font-bold font-display text-primary mb-6">
            Zonas de Cobertura:
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {zonas.map((z, i) => (
              <motion.div
                key={z.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <z.icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{z.title}</h3>
                <p className="text-gray-200 leading-relaxed text-sm">{z.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Compromisos */}
          <h2 className="text-2xl font-bold font-display text-primary mb-6">
            Nuestros Compromisos:
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {compromisos.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <c.icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{c.title}</h3>
                <p className="text-gray-200 leading-relaxed text-sm">{c.text}</p>
              </motion.div>
            ))}
          </div>

          {/* ¿Cuánto sale? */}
          <h2 className="text-2xl font-bold font-display text-primary mb-4">
            ¿Cuánto sale?
          </h2>
          <p className="text-gray-200 leading-relaxed text-base md:text-lg mb-12">
            Mantenemos una tarifa plana para el Gran Mendoza, pero si estás en Maipú,
            el envío corre por nuestra cuenta en pedidos seleccionados. ¡Fijate en el
            carrito antes de cerrar!
          </p>

          {/* Cierre */}
          <div className="border-t border-white/10 pt-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <DollarSign size={28} className="text-primary" />
            </div>
            <p className="text-lg md:text-xl text-white font-bold leading-relaxed max-w-2xl mx-auto">
              El sabor del distrito no tiene fronteras. Si figura en el mapa, llegamos.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
