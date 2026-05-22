import { useQuery } from '@tanstack/react-query'
import { direccionesApi } from '../services/api'

export function useDirecciones(usuarioId: number | null) {
  return useQuery({
    queryKey: ['direcciones', usuarioId],
    queryFn: () => direccionesApi.getByUsuario(usuarioId!),
    enabled: usuarioId !== null,
  })
}
