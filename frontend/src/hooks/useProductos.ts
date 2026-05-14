import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productosApi } from '../services/api'
import type { ProductoCreate } from '../types'

export function useProductos(categoriaId?: number) {
  return useQuery({
    queryKey: ['productos', categoriaId],
    queryFn: () => productosApi.getAll(categoriaId),
  })
}

export function useProducto(id: number) {
  return useQuery({
    queryKey: ['productos', id],
    queryFn: () => productosApi.getById(id),
  })
}

export function useCreateProducto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ProductoCreate) => productosApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] }),
  })
}

export function useUpdateProducto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductoCreate> }) =>
      productosApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] }),
  })
}

export function useDeleteProducto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => productosApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] }),
  })
}

export function useProductoIngredientes(productoId: number) {
  return useQuery({
    queryKey: ['productos', productoId, 'ingredientes'],
    queryFn: () => productosApi.getIngredientes(productoId),
  })
}

export function useAddIngrediente() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ productoId, ingredienteId, cantidad_requerida, es_removible }: { productoId: number; ingredienteId: number; cantidad_requerida?: number; es_removible?: boolean }) =>
      productosApi.addIngrediente(productoId, { ingrediente_id: ingredienteId, cantidad_requerida, es_removible }),
    onSuccess: (_, { productoId }) => {
      queryClient.invalidateQueries({ queryKey: ['productos', productoId] })
      queryClient.invalidateQueries({ queryKey: ['productos', productoId, 'ingredientes'] })
    },
  })
}

export function useRemoveIngrediente() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ productoId, ingredienteId }: { productoId: number; ingredienteId: number }) =>
      productosApi.removeIngrediente(productoId, ingredienteId),
    onSuccess: (_, { productoId }) => {
      queryClient.invalidateQueries({ queryKey: ['productos', productoId] })
      queryClient.invalidateQueries({ queryKey: ['productos', productoId, 'ingredientes'] })
    },
  })
}
