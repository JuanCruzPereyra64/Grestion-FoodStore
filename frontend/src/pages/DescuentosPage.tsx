import { motion } from 'framer-motion'
import { Tag, RefreshCw, Gift, Gamepad, Pizza, Globe } from 'lucide-react'

export function DescuentosPage() {
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
            <Tag size={36} className="text-primary" />
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary">
              Codigos del Distrito.
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-white italic mb-10 leading-relaxed">
            No hay cheat code para la vida, pero si para comer como un rey sin romper la billetera.
          </p>

          {/* Body */}
          <div className="space-y-5 text-gray-200 leading-relaxed text-base md:text-lg mb-12">
            <p>
              Sabemos como viene la mano: la semana se hace larga, el codigo a veces no compila a la primera y el presupuesto tiene un limite. En Distrito Food no queremos que te quedes con las ganas de clavarte una buena Smash Doble. Por eso, armamos un sistema de beneficios fijos para que siempre tengas una excusa para pedir.
            </p>
          </div>

          {/* Martes de Reset */}
          <div className="flex items-center gap-3 mb-6">
            <RefreshCw size={28} className="text-primary" />
            <h2 className="text-2xl font-bold font-display text-primary">
              El Martes de Reset
            </h2>
          </div>
          <p className="text-gray-200 leading-relaxed text-base md:text-lg mb-6">
            Los martes son el dia mas duro de la semana, asi que reseteamos los servidores y bajamos los precios.
          </p>
          <ul className="space-y-4 mb-12">
            <li className="flex items-start gap-3 text-gray-200">
              <Gamepad size={20} className="text-primary mt-1 shrink-0" />
              <span><strong className="text-white">2x1 en Distrito Smash Doble:</strong> Ideal para juntarte a jugar algo o compartir con alguien.</span>
            </li>
            <li className="flex items-start gap-3 text-gray-200">
              <span className="w-5 shrink-0 text-primary font-bold">•</span>
              <span><strong className="text-white">Envío Bonificado:</strong> Si estas en Maipu, el envio de los martes corre por cuenta nuestra.</span>
            </li>
          </ul>

          {/* Combos Permanentes */}
          <div className="flex items-center gap-3 mb-6">
            <Gift size={28} className="text-primary" />
            <h2 className="text-2xl font-bold font-display text-primary">
              Combos Permanentes
            </h2>
          </div>
          <ul className="space-y-4 mb-12">
            <li className="flex items-start gap-3 text-gray-200">
              <Pizza size={20} className="text-primary mt-1 shrink-0" />
              <span><strong className="text-white">Combo Fin de Mes:</strong> Nuestra Urbana 426 clasica + 2 bebidas a un precio congelado. Salvavidas oficial.</span>
            </li>
            <li className="flex items-start gap-3 text-gray-200">
              <span className="w-5 shrink-0 text-primary font-bold">•</span>
              <span><strong className="text-white">Upgrade de Papas:</strong> Pedi cualquier hamburguesa antes de las 20:00 hs y te hacemos un upgrade gratuito a papas con cheddar y bacon.</span>
            </li>
          </ul>

          {/* Cierre */}
          <div className="border-t border-white/10 pt-8 text-center">
            <div className="flex items-start justify-center gap-3 max-w-2xl mx-auto">
              <Globe size={28} className="text-primary shrink-0 mt-1" />
              <p className="text-lg md:text-xl text-white font-bold leading-relaxed">
                Estate atento a nuestro Instagram. Cada tanto tiramos drops secretos con cupones de descuento que duran solo un par de horas. El que parpadea, se lo pierde.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
