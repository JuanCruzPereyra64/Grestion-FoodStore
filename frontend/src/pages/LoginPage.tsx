import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChefHat, LogIn, UserCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/api'
import { useAuth } from '../stores/authStore'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      const res = await authApi.login({ email, password })
      login(res.user, res.access_token, res.refresh_token)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  const quickLogin = (creds: { email: string; password: string }) => {
    setEmail(creds.email)
    setPassword(creds.password)
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 dark:bg-primary/20 mb-4">
            <ChefHat size={40} className="text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold neon-title">
            DISTRITO FOOD
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Iniciá sesión para continuar
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quick Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => quickLogin({ email: 'admin@foodstore.com', password: 'admin123' })}
                className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-primary/5 hover:border-primary/50 transition-all text-left group"
              >
                <ShieldCheck size={20} className="text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Admin</p>
                  <p className="text-[10px] text-slate-400 truncate">admin@foodstore.com</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => quickLogin({ email: 'cliente@foodstore.com', password: 'cliente123' })}
                className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-accent/5 hover:border-accent/50 transition-all text-left group"
              >
                <UserCircle size={20} className="text-accent shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Cliente</p>
                  <p className="text-[10px] text-slate-400 truncate">cliente@foodstore.com</p>
                </div>
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white dark:bg-slate-800 px-3 text-slate-400">o ingresá manualmente</span>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 bg-red-50 dark:bg-red-900/10 p-3 rounded-xl"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full" size="lg" icon={LogIn} isLoading={isLoading}>
              Iniciar Sesión
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-slate-400 mt-8">
          Distrito Food — Delivery Urbano
        </p>
      </motion.div>
    </div>
  )
}
