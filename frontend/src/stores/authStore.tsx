import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { UserResponse } from '../types'

interface AuthState {
  user: UserResponse | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}

interface AuthStore extends AuthState {
  login: (user: UserResponse, accessToken: string, refreshToken: string) => void
  logout: () => void
}

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

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      login: (user: UserResponse, accessToken: string, refreshToken: string) => {
        set({ user, accessToken, refreshToken, isAuthenticated: true })
      },

      logout: () => {
        set({ ...initialState })
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state && pasadasLasTres()) {
          state.user = null
          state.accessToken = null
          state.refreshToken = null
          state.isAuthenticated = false
          localStorage.removeItem(STORAGE_KEY)
        }
      },
    },
  ),
)

interface AuthContextValue {
  state: AuthState
  login: (user: UserResponse, accessToken: string, refreshToken: string) => void
  logout: () => void
}

export function useAuth(): AuthContextValue {
  const { user, accessToken, refreshToken, isAuthenticated, login, logout } = useAuthStore()
  return {
    state: { user, accessToken, refreshToken, isAuthenticated },
    login,
    logout,
  }
}
