const BASE_URL = 'http://localhost:8000/api/v1'

function getAuthHeaders(): Record<string, string> {
  try {
    const raw = localStorage.getItem('foodstore-auth')
    if (raw) {
      const { accessToken } = JSON.parse(raw)
      if (accessToken) return { 'Authorization': `Bearer ${accessToken}` }
    }
  } catch { /* ignore */ }
  return {}
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...getAuthHeaders() }
  const res = await fetch(`${BASE_URL}${path}`, {
    headers,
    ...options,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Error desconocido' }))
    throw new Error(error.detail ?? 'Error en la petición')
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const categoriasApi = {
  getAll: () => request<import('../types').Categoria[]>('/categorias/'),
  getById: (id: number) => request<import('../types').Categoria>(`/categorias/${id}`),
  create: (data: import('../types').CategoriaCreate) =>
    request<import('../types').Categoria>('/categorias/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<import('../types').CategoriaCreate>) =>
    request<import('../types').Categoria>(`/categorias/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/categorias/${id}`, { method: 'DELETE' }),
}

export const ingredientesApi = {
  getAll: () => request<import('../types').Ingrediente[]>('/ingredientes/'),
  getById: (id: number) => request<import('../types').Ingrediente>(`/ingredientes/${id}`),
  create: (data: import('../types').IngredienteCreate) =>
    request<import('../types').Ingrediente>('/ingredientes/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<import('../types').IngredienteCreate>) =>
    request<import('../types').Ingrediente>(`/ingredientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/ingredientes/${id}`, { method: 'DELETE' }),
}

export const pedidosApi = {
  getAll: () => request<import('../types').PedidoRead[]>('/pedidos/'),
  getById: (id: number) => request<import('../types').PedidoRead>(`/pedidos/${id}`),
  create: (data: import('../types').PedidoCreate) =>
    request<import('../types').PedidoRead>('/pedidos/', { method: 'POST', body: JSON.stringify(data) }),
  generarFactura: (pedidoId: number, data: import('../types').FacturaCreate) =>
    request<import('../types').FacturaRead>(`/pedidos/${pedidoId}/factura`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  descargarFactura: async (pedidoId: number): Promise<Blob> => {
    const res = await fetch(`${BASE_URL}/pedidos/${pedidoId}/factura`)
    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Error al descargar factura' }))
      throw new Error(error.detail ?? 'Error al descargar factura')
    }
    return res.blob()
  },
}

export const pagosApi = {
  createPreference: (pedidoId: number) =>
    request<import('../types').PreferenceRead>('/pagos/create_preference', {
      method: 'POST',
      body: JSON.stringify({ pedido_id: pedidoId }),
    }),
  getPagoStatus: (pedidoId: number) =>
    request<import('../types').PagoStatusResponse>(`/pagos/${pedidoId}/status`),
}

export const authApi = {
  login: (data: import('../types').LoginRequest) =>
    request<import('../types').TokenResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
}

export const reportesApi = {
  getEstadisticas: (fechaDesde?: string, fechaHasta?: string) => {
    const params = new URLSearchParams()
    if (fechaDesde) params.set('fecha_desde', fechaDesde)
    if (fechaHasta) params.set('fecha_hasta', fechaHasta)
    const qs = params.toString()
    return request<import('../types').EstadisticasResponse>(`/reportes/estadisticas${qs ? `?${qs}` : ''}`)
  },
  descargarCSV: async (fechaDesde?: string, fechaHasta?: string): Promise<void> => {
    const params = new URLSearchParams()
    if (fechaDesde) params.set('fecha_desde', fechaDesde)
    if (fechaHasta) params.set('fecha_hasta', fechaHasta)
    const qs = params.toString()
    const res = await fetch(`${BASE_URL}/reportes/ventas/csv${qs ? `?${qs}` : ''}`)
    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Error al descargar CSV' }))
      throw new Error(error.detail ?? 'Error al descargar CSV')
    }
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reporte-ventas.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
  },
}

export const productosApi = {
  getAll: (categoriaId?: number) => {
    const params = categoriaId ? `?categoria_id=${categoriaId}` : ''
    return request<import('../types').Producto[]>(`/productos/${params}`)
  },
  getById: (id: number) => request<import('../types').Producto>(`/productos/${id}`),
  create: (data: import('../types').ProductoCreate) =>
    request<import('../types').Producto>('/productos/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<import('../types').ProductoCreate>) =>
    request<import('../types').Producto>(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/productos/${id}`, { method: 'DELETE' }),
  getIngredientes: (productoId: number) =>
    request<import('../types').ProductoIngredienteRead[]>(`/productos/${productoId}/ingredientes`),
  addIngrediente: (productoId: number, data: import('../types').AsociarIngrediente) =>
    request<import('../types').Producto>(`/productos/${productoId}/ingredientes`, { method: 'POST', body: JSON.stringify(data) }),
  removeIngrediente: (productoId: number, ingredienteId: number) =>
    request<import('../types').Producto>(`/productos/${productoId}/ingredientes/${ingredienteId}`, { method: 'DELETE' }),
  uploadImage: async (formData: FormData): Promise<{ url: string }> => {
    const res = await fetch(`${BASE_URL}/productos/imagen`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
      body: formData,
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Error al subir imagen' }))
      throw new Error(error.detail ?? 'Error al subir imagen')
    }
    return res.json()
  },
}
