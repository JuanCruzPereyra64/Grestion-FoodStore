export interface Categoria {
  id: number
  nombre: string
  descripcion?: string
}

export interface Ingrediente {
  id: number
  nombre: string
  unidad_medida: string
}

export interface Producto {
  id: number
  nombre: string
  precio: number
  descripcion?: string
  categoria_id: number
  categoria?: Categoria
  ingredientes?: Ingrediente[]
}

export interface CategoriaCreate {
  nombre: string
  descripcion?: string
}

export interface IngredienteCreate {
  nombre: string
  unidad_medida: string
}

export interface ProductoCreate {
  nombre: string
  precio: number
  descripcion?: string
  categoria_id: number
  ingrediente_ids: number[]
}
