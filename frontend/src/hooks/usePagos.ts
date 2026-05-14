import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { pagosApi } from '../services/api'

export function useCreatePreference() {
  return useMutation({
    mutationFn: (pedidoId: number) => pagosApi.createPreference(pedidoId),
  })
}

export function usePagoStatus(pedidoId: number | null) {
  return useQuery({
    queryKey: ['pago-status', pedidoId],
    queryFn: () => pagosApi.getPagoStatus(pedidoId!),
    enabled: pedidoId !== null,
    refetchInterval: (query) => {
      const data = query.state.data
      if (!data) return 3000
      if (data.estado === 'CONFIRMADO' || data.estado === 'CANCELADO') return false
      return 3000
    },
  })
}
