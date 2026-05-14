import { motion } from 'framer-motion'
import { ChefHat, Flame, Code, Music, Pizza, Swords } from 'lucide-react'

const datos = [
  {
    icon: Flame,
    title: 'El origen',
    text: 'Nuestro primer laboratorio de pruebas fue una parrilla en Maipú. Sí, el humo casi nos cuesta el contrato de alquiler.',
  },
  {
    icon: Music,
    title: 'Tolerancia cero al aburrimiento',
    text: 'En nuestra cocina no hay silencio. Si no hay una playlist de rock o algo con buen ritmo sonando al palo, las hamburguesas no salen igual. Está comprobado científicamente por nosotros.',
  },
  {
    icon: Pizza,
    title: 'El código 426',
    text: 'Nuestra pizza Urbana 426 se llama así porque es el balance exacto que encontramos después de quemarnos la cabeza buscando la fermentación perfecta. (Y porque sonaba a expediente policial o a código de error, nos copó la estética).',
  },
  {
    icon: Swords,
    title: 'Prioridades',
    text: 'Amamos lo que hacemos, pero si hay un buen partido de pádel o sale torneo, es probable que la parrilla arranque media hora más tarde. Somos humanos.',
  },
]

export function ConocenosPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto mt-20 p-8 md:p-12 bg-black/70 backdrop-blur-md rounded-3xl border border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-2">
            <ChefHat size={36} className="text-primary" />
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary">
              Bienvenidos al Distrito.
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-white italic mb-10 leading-relaxed">
            No inventamos la comida callejera, la hackeamos.
          </p>

          {/* Intro body */}
          <div className="space-y-5 text-gray-200 leading-relaxed text-base md:text-lg mb-12">
            <p>
              Todo arrancó en Maipú, entre noches largas, líneas de código y ganas de comer algo que de verdad valiera la pena.
              Estábamos cansados de la comida rápida con gusto a plástico y de los lugares &ldquo;gourmet&rdquo; donde te quedás con hambre.
              Queríamos la potencia y la mugre linda del street food, pero con una ejecución perfecta.
            </p>
            <p>
              En Distrito Food no somos chefs de cristal; somos obsesivos del detalle. Tratamos nuestra cocina como si fuera un setup de alto rendimiento:
              calibramos los tiempos de cocción, ajustamos las proporciones de la salsa secreta y testeamos cada medallón smash como si fuera el mod
              de supervivencia más extremo. Si no sale perfecto, no sale de la cocina.
            </p>
          </div>

          {/* Datos random */}
          <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-8">
            Nuestros Datos Random <span className="text-sm text-gray-400 font-normal">(Nivel de Confidencialidad: Bajo)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {datos.map((d, i) => (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <d.icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{d.title}</h3>
                <p className="text-gray-200 leading-relaxed text-sm">{d.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Cierre */}
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-lg md:text-xl text-white font-bold leading-relaxed max-w-2xl mx-auto">
              No te pedimos que nos creas. Pedite una Smash Doble, ensuciate las manos y comprobalo vos mismo.
            </p>
            <p className="text-xl md:text-2xl text-primary font-display font-bold mt-4">
              Bienvenido a tu nuevo vicio.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
