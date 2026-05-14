export interface Categoria {
  id: number
  nombre: string
  descripcion?: string
}

export interface Ingrediente {
  id: number
  nombre: string
  descripcion?: string
  es_alergeno: boolean
  stock: number
  unidad_medida: string
}

export interface ProductoIngredienteRead {
  ingrediente_id: number
  nombre: string
  cantidad_requerida: number
  unidad_medida: string
  es_alergeno: boolean
  stock_disponible: number
}

export interface ProductoIngredienteInput {
  ingrediente_id: number
  cantidad_requerida: number
}

export interface Producto {
  id: number
  nombre: string
  precio_base: number
  descripcion?: string
  stock_cantidad: number
  disponible: boolean
  puede_prepararse: boolean
  imagenes_url: string[]
  categorias: Categoria[]
  ingredientes: ProductoIngredienteRead[]
}

export interface CategoriaCreate {
  nombre: string
  descripcion?: string
}

export interface IngredienteCreate {
  nombre: string
  descripcion?: string
  es_alergeno?: boolean
  stock?: number
  unidad_medida?: string
}

export interface ProductoCreate {
  nombre: string
  precio_base: number
  descripcion?: string
  categoria_ids: number[]
  ingredientes: ProductoIngredienteInput[]
  stock_cantidad?: number
  disponible?: boolean
  imagenes_url?: string[]
}

export interface AsociarIngrediente {
  ingrediente_id: number
  cantidad_requerida?: number
  es_removible?: boolean
}

export interface CartItem {
  producto: Producto
  cantidad: number
  excludedIngredienteIds: number[]
}

export interface PedidoItem {
  producto_id: number
  cantidad: number
  excluded_ingrediente_ids: number[]
}

export interface PedidoCreate {
  cliente_nombre: string
  telefono?: string
  direccion: string
  zona_envio?: string
  items: PedidoItem[]
}

export interface PedidoDetalleRead {
  id: number
  producto_id: number
  producto_nombre_snapshot: string
  precio_unitario_snapshot: number
  cantidad: number
  subtotal: number
  personalizacion: number[]
}

export interface PedidoRead {
  id: number
  cliente_nombre: string
  direccion_snapshot: string
  total: number
  created_at: string
  detalles: PedidoDetalleRead[]
}

export interface PreferenceRead {
  id: string
  init_point: string
  sandbox_init_point: string
}

export interface PagoInfo {
  status: string | null
  status_detail: string | null
  mp_payment_id: number | null
}

export interface PagoStatusResponse {
  pedido_id: number
  estado: string
  pago: PagoInfo | null
}

export interface FacturaCreate {
  cuit_cliente?: string
  tipo_factura?: string
}

export interface FacturaRead {
  id: number
  pedido_id: number
  numero_factura: string
  fecha_emision: string
  cuit_cliente: string | null
  tipo_factura: string
  monto_total: number
}

export interface TopProducto {
  producto_nombre: string
  cantidad_total: number
  ingresos_total: number
}

export interface IngresoPorDia {
  fecha: string
  total: number
}

export interface UserResponse {
  id: number
  nombre: string
  email: string
  telefono: string | null
  roles: string[]
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: UserResponse
}

export interface LoginRequest {
  email: string
  password: string
}

export interface EstadisticasResponse {
  total_pedidos: number
  ingresos_totales: number
  ingresos_por_dia: IngresoPorDia[]
  top_productos: TopProducto[]
}
