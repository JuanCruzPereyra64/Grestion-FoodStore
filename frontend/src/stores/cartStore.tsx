import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react'
import type { CartItem, Producto } from '../types'

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_ITEM'; producto: Producto; cantidad?: number; excludedIngredienteIds?: number[] }
  | { type: 'REMOVE_ITEM'; productoId: number }
  | { type: 'UPDATE_CANTIDAD'; productoId: number; cantidad: number }
  | { type: 'TOGGLE_EXCLUDE_INGREDIENTE'; productoId: number; ingredienteId: number }
  | { type: 'CLEAR_CART' }

const STORAGE_KEY = 'foodstore-cart'

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return []
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch { /* ignore */ }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.producto.id === action.producto.id)
      if (existing) {
        return {
          items: state.items.map(i =>
            i.producto.id === action.producto.id
              ? { ...i, cantidad: i.cantidad + (action.cantidad ?? 1) }
              : i
          ),
        }
      }
      return {
        items: [...state.items, {
          producto: action.producto,
          cantidad: action.cantidad ?? 1,
          excludedIngredienteIds: action.excludedIngredienteIds ?? [],
        }],
      }
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter(i => i.producto.id !== action.productoId) }
    case 'UPDATE_CANTIDAD':
      return {
        items: state.items.map(i =>
          i.producto.id === action.productoId
            ? { ...i, cantidad: Math.max(1, action.cantidad) }
            : i
        ),
      }
    case 'TOGGLE_EXCLUDE_INGREDIENTE': {
      return {
        items: state.items.map(i =>
          i.producto.id === action.productoId
            ? {
                ...i,
                excludedIngredienteIds: i.excludedIngredienteIds.includes(action.ingredienteId)
                  ? i.excludedIngredienteIds.filter(id => id !== action.ingredienteId)
                  : [...i.excludedIngredienteIds, action.ingredienteId],
              }
            : i
        ),
      }
    }
    case 'CLEAR_CART':
      return { items: [] }
    default:
      return state
  }
}

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

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: loadCart() })

  useEffect(() => { saveCart(state.items) }, [state.items])

  const addItem = useCallback((producto: Producto, cantidad?: number, excludedIngredienteIds?: number[]) => {
    dispatch({ type: 'ADD_ITEM', producto, cantidad, excludedIngredienteIds })
  }, [])

  const removeItem = useCallback((productoId: number) => {
    dispatch({ type: 'REMOVE_ITEM', productoId })
  }, [])

  const updateCantidad = useCallback((productoId: number, cantidad: number) => {
    dispatch({ type: 'UPDATE_CANTIDAD', productoId, cantidad })
  }, [])

  const toggleExcludeIngrediente = useCallback((productoId: number, ingredienteId: number) => {
    dispatch({ type: 'TOGGLE_EXCLUDE_INGREDIENTE', productoId, ingredienteId })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  const itemInCart = useCallback((productoId: number) => {
    return state.items.find(i => i.producto.id === productoId)
  }, [state.items])

  const totalItems = state.items.reduce((sum, i) => sum + i.cantidad, 0)
  const totalPrice = state.items.reduce((sum, i) => sum + i.producto.precio_base * i.cantidad, 0)

  return (
    <CartContext.Provider value={{
      items: state.items,
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      updateCantidad,
      toggleExcludeIngrediente,
      clearCart,
      itemInCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
