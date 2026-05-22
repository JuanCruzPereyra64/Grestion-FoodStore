import { MapPin, Phone, Mail } from 'lucide-react'

const socialLinks = [
  {
    label: 'Instagram',
    handle: '@distritofood.ar',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'X',
    handle: '@distritofood.ar',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M4 4l16 16M20 4L4 20" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    handle: '@distritofood.ar',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M9 12a4 4 0 104 4V2h4a6 6 0 006 6" />
      </svg>
    ),
  },
]

export function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0a] border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1: Marca */}
          <div>
            <h3 className="text-2xl font-display font-bold text-[#FF5100]">
              DISTRITO FOOD
            </h3>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              El verdadero sabor del street food urbano. Calidad premium, cero excusas.
            </p>
          </div>

          {/* Col 2: Contacto */}
          <div>
            <h4 className="text-white font-bold mb-4">Contacto</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size="16" className="shrink-0 mt-0.5 text-gray-500" />
                <span>Centro, Maipú, Mendoza.</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size="16" className="shrink-0 mt-0.5 text-gray-500" />
                <span>WhatsApp: +54 9 261 555-0426</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size="16" className="shrink-0 mt-0.5 text-gray-500" />
                <span>hola@distritofood.com.ar</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Redes */}
          <div>
            <h4 className="text-white font-bold mb-4">Seguinos</h4>
            <div className="flex flex-col gap-3">
              {socialLinks.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex items-center gap-3 text-gray-400 hover:text-[#FF5100] transition-colors group"
                >
                  <span className="w-5 flex items-center justify-center">
                    {social.icon}
                  </span>
                  <span className="text-sm">{social.handle}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-500 text-xs">
          &copy; 2026 Distrito Food. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
