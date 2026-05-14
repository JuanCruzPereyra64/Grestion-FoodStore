import { motion } from 'framer-motion'
import { ChefHat, UtensilsCrossed, Truck, Star, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'

const features = [
  { icon: UtensilsCrossed, title: 'Cocina de Autor', desc: 'Platos diseñados por nuestros chefs con ingredientes seleccionados.' },
  { icon: Truck, title: 'Delivery Rápido', desc: 'Recibí tu pedido en la puerta de tu casa en menos de 45 minutos.' },
  { icon: Star, title: 'Calidad Premium', desc: 'Cada plato pasa por rigurosos controles de calidad antes de salir.' },
]

export function ClientHomePage() {
  return (
    <div className="min-h-screen">
      {/* Glass card */}
      <div className="w-[90%] max-w-5xl mx-auto bg-black/60 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 my-10 flex flex-col items-center">
      {/* Hero */}
      <section className="relative overflow-hidden py-10 md:py-16 px-6">
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 mb-6">
              <ChefHat size={40} className="text-primary" />
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold neon-title neon-flicker mb-6">
              DISTRITO FOOD
            </h1>
            <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto mb-10 leading-relaxed">
              El verdadero sabor del distrito — ahora en tu puerta.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/productos">
                <Button size="xl" icon={UtensilsCrossed} className="text-lg px-8 py-4">
                  Ver Menú
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center text-white mb-12">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full text-center p-8 hover:border-primary/30 transition-colors">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
                    <f.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                  <p className="text-gray-200 leading-relaxed">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      </div>

      {/* CTA */}
      <section className="relative z-10 py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <Card className="p-12 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              ¿Listo para tu próximo pedido?
            </h2>
            <p className="text-gray-200 text-lg mb-8">
              Explorá nuestro catálogo y encontrá tu plato favorito.
            </p>
            <Link to="/productos">
              <Button size="xl" icon={ArrowRight} className="text-lg px-10 py-4">
                Ir al Catálogo
              </Button>
            </Link>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}
