import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pedidosApi } from '../services/api'
import type { FacturaCreate, PedidoCreate } from '../types'

export function usePedidos() {
  return useQuery({
    queryKey: ['pedidos'],
    queryFn: pedidosApi.getAll,
  })
}

export function usePedido(id: number) {
  return useQuery({
    queryKey: ['pedidos', id],
    queryFn: () => pedidosApi.getById(id),
  })
}

export function useCreatePedido() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PedidoCreate) => pedidosApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pedidos'] }),
  })
}

export function useDescargarFactura() {
  const descargar = async (pedidoId: number) => {
    const blob = await pedidosApi.descargarFactura(pedidoId)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `factura-pedido-${pedidoId}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
  }
  return { descargar }
}

export function useGenerarFactura() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ pedidoId, data }: { pedidoId: number; data: FacturaCreate }) =>
      pedidosApi.generarFactura(pedidoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] })
    },
  })
}
