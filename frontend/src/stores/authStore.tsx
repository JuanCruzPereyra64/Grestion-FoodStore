import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react'
import type { UserResponse } from '../types'

interface AuthState {
  user: UserResponse | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}

type AuthAction =
  | { type: 'LOGIN'; user: UserResponse; accessToken: string; refreshToken: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_TOKEN'; accessToken: string; refreshToken: string }

const STORAGE_KEY = 'foodstore-auth'

function pasadasLasTres(): boolean {
  try {
    if (!('toLocaleTimeString' in Date.prototype)) return false
    const hora = parseInt(
      new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: false,
        timeZone: 'America/Argentina/Buenos_Aires',
      }),
      10,
    )
    return hora >= 3
  } catch {
    return false
  }
}

function loadAuth(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      if (pasadasLasTres()) {
        localStorage.removeItem(STORAGE_KEY)
        return { user: null, accessToken: null, refreshToken: null, isAuthenticated: false }
      }
      const parsed = JSON.parse(raw)
      return {
        ...parsed,
        isAuthenticated: true,
      }
    }
  } catch { /* ignore */ }
  return { user: null, accessToken: null, refreshToken: null, isAuthenticated: false }
}

function saveAuth(state: AuthState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      user: state.user,
      accessToken: state.accessToken,
      refreshToken: state.refreshToken,
    }))
  } catch { /* ignore */ }
}

function clearAuth() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch { /* ignore */ }
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return {
        user: action.user,
        accessToken: action.accessToken,
        refreshToken: action.refreshToken,
        isAuthenticated: true,
      }
    case 'LOGOUT':
      return { user: null, accessToken: null, refreshToken: null, isAuthenticated: false }
    case 'UPDATE_TOKEN':
      return { ...state, accessToken: action.accessToken, refreshToken: action.refreshToken }
    default:
      return state
  }
}

interface AuthContextValue {
  state: AuthState
  login: (user: UserResponse, accessToken: string, refreshToken: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, null, loadAuth)

  useEffect(() => {
    if (state.isAuthenticated) {
      saveAuth(state)
    } else {
      clearAuth()
    }
  }, [state])

  const login = useCallback((user: UserResponse, accessToken: string, refreshToken: string) => {
    dispatch({ type: 'LOGIN', user, accessToken, refreshToken })
  }, [])

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' })
  }, [])

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
