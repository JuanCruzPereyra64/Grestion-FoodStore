const BASE_URL = 'http://localhost:8000'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
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
  addIngrediente: (productoId: number, ingredienteId: number) =>
    request<import('../types').Producto>(`/productos/${productoId}/ingredientes/${ingredienteId}`, { method: 'POST' }),
  removeIngrediente: (productoId: number, ingredienteId: number) =>
    request<import('../types').Producto>(`/productos/${productoId}/ingredientes/${ingredienteId}`, { method: 'DELETE' }),
}
