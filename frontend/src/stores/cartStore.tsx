import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, Producto } from '../types'
import { useAuthStore } from './authStore'

interface CartStore {
  items: CartItem[]
  addItem: (producto: Producto, cantidad?: number, excludedIngredienteIds?: number[]) => void
  removeItem: (productoId: number) => void
  updateCantidad: (productoId: number, cantidad: number) => void
  toggleExcludeIngrediente: (productoId: number, ingredienteId: number) => void
  clearCart: () => void
}

const STORAGE_KEY = 'foodstore-cart'

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (producto: Producto, cantidad = 1, excludedIngredienteIds = []) => {
        if (!useAuthStore.getState().isAuthenticated) return
        const existing = get().items.find(i => i.producto.id === producto.id)
        if (existing) {
          set({
            items: get().items.map(i =>
              i.producto.id === producto.id
                ? { ...i, cantidad: i.cantidad + cantidad }
                : i
            ),
          })
        } else {
          set({
            items: [...get().items, { producto, cantidad, excludedIngredienteIds }],
          })
        }
      },

      removeItem: (productoId: number) => {
        set({ items: get().items.filter(i => i.producto.id !== productoId) })
      },

      updateCantidad: (productoId: number, cantidad: number) => {
        set({
          items: get().items.map(i =>
            i.producto.id === productoId
              ? { ...i, cantidad: Math.max(1, cantidad) }
              : i
          ),
        })
      },

      toggleExcludeIngrediente: (productoId: number, ingredienteId: number) => {
        set({
          items: get().items.map(i =>
            i.producto.id === productoId
              ? {
                  ...i,
                  excludedIngredienteIds: i.excludedIngredienteIds.includes(ingredienteId)
                    ? i.excludedIngredienteIds.filter(id => id !== ingredienteId)
                    : [...i.excludedIngredienteIds, ingredienteId],
                }
              : i
          ),
        })
      },

      clearCart: () => {
        set({ items: [] })
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

interface CartContextValue {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (producto: Producto, cantidad?: number, excludedIngredienteIds?: number[]) => void
  removeItem: (productoId: number) => void
  updateCantidad: (productoId: number, cantidad: number) => void
  toggleExcludeIngrediente: (productoId: number, ingredienteId: number) => void
  clearCart: () => void
  itemInCart: (productoId: number) => CartItem | undefined
}

export function useCart(): CartContextValue {
  const { items, addItem, removeItem, updateCantidad, toggleExcludeIngrediente, clearCart } = useCartStore()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  const activeItems = isAuthenticated ? items : []
  const totalItems = isAuthenticated ? items.reduce((sum, i) => sum + i.cantidad, 0) : 0
  const totalPrice = isAuthenticated ? items.reduce((sum, i) => sum + i.producto.precio_base * i.cantidad, 0) : 0

  const itemInCart = (productoId: number): CartItem | undefined => {
    if (!isAuthenticated) return undefined
    return items.find(i => i.producto.id === productoId)
  }

  return {
    items: activeItems,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateCantidad,
    toggleExcludeIngrediente,
    clearCart,
    itemInCart,
  }
}
