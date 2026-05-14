import { useQuery } from '@tanstack/react-query'
import { reportesApi } from '../services/api'

export function useEstadisticas(fechaDesde?: string, fechaHasta?: string) {
  return useQuery({
    queryKey: ['estadisticas', fechaDesde, fechaHasta],
    queryFn: () => reportesApi.getEstadisticas(fechaDesde, fechaHasta),
  })
}
