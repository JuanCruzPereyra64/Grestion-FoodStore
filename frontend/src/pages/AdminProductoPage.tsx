import { useState, useRef } from 'react'
import { UtensilsCrossed, Search, Plus, Check, X, Package, DollarSign, Image as ImageIcon, Upload } from 'lucide-react'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { useProductos, useCreateProducto } from '../hooks/useProductos'
import { useCategorias, useCreateCategoria } from '../hooks/useCategorias'
import { useIngredientes } from '../hooks/useIngredientes'
import { productosApi } from '../services/api'
import type { ProductoIngredienteInput } from '../types'

const ACEPTADOS = 'image/jpeg,image/png,image/webp,image/gif'

interface IngredienteSeleccionado {
  ingrediente_id: number
  nombre: string
  cantidad_requerida: number
  unidad_medida: string
}

export function AdminProductoPage() {
  const { data: productos } = useProductos()
  const { data: categorias } = useCategorias()
  const { data: ingredientes } = useIngredientes()
  const createMutation = useCreateProducto()
  const createCatMutation = useCreateCategoria()

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [showNuevaCategoria, setShowNuevaCategoria] = useState(false)
  const [nuevaCategoria, setNuevaCategoria] = useState('')
  const [imagenFile, setImagenFile] = useState<File | null>(null)
  const [imagenPreview, setImagenPreview] = useState<string | null>(null)
  const [subiendoImg, setSubiendoImg] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [categoriaId, setCategoriaId] = useState<number>(0)
  const [searchIng, setSearchIng] = useState('')
  const [seleccionados, setSeleccionados] = useState<IngredienteSeleccionado[]>([])

  function processFile(file: File) {
    if (!ACEPTADOS.split(',').includes(file.type)) {
      alert('Formato no soportado. Usá JPG, PNG, WebP o GIF.')
      return
    }
    setImagenFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagenPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    processFile(file)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    processFile(file)
  }

  function toggleIngrediente(ing: { id: number; nombre: string; unidad_medida: string }) {
    setSeleccionados((prev) => {
      const exists = prev.find((s) => s.ingrediente_id === ing.id)
      if (exists) return prev.filter((s) => s.ingrediente_id !== ing.id)
      return [...prev, { ingrediente_id: ing.id, nombre: ing.nombre, cantidad_requerida: 1, unidad_medida: ing.unidad_medida }]
    })
  }

  function updateCantidad(ingredienteId: number, cantidad: number) {
    setSeleccionados((prev) =>
      prev.map((s) => (s.ingrediente_id === ingredienteId ? { ...s, cantidad_requerida: cantidad } : s))
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!categoriaId || seleccionados.length === 0 || !nombre || !precio) return

    let imagenes_url: string[] = []

    if (imagenFile) {
      setSubiendoImg(true)
      try {
        const formData = new FormData()
        formData.append('file', imagenFile)
        const res = await productosApi.uploadImage(formData)
        imagenes_url = [res.url]
      } catch {
        alert('Error al subir la imagen. Intentá de nuevo.')
        setSubiendoImg(false)
        return
      }
      setSubiendoImg(false)
    }

    const ingredientesPayload: ProductoIngredienteInput[] = seleccionados.map((s) => ({
      ingrediente_id: s.ingrediente_id,
      cantidad_requerida: s.cantidad_requerida,
    }))

    createMutation.mutate(
      {
        nombre,
        precio_base: parseFloat(precio) || 0,
        descripcion: descripcion || undefined,
        categoria_ids: [categoriaId],
        ingredientes: ingredientesPayload,
        imagenes_url,
      },
      {
        onSuccess: () => {
          setNombre('')
          setDescripcion('')
          setPrecio('')
          setImagenFile(null)
          setImagenPreview(null)
          if (fileInputRef.current) fileInputRef.current.value = ''
          setCategoriaId(0)
          setSeleccionados([])
          setSearchIng('')
        },
      }
    )
  }

  const ingredientesFiltrados = ingredientes?.filter(
    (i) => i.nombre.toLowerCase().includes(searchIng.toLowerCase()) && !seleccionados.some((s) => s.ingrediente_id === i.id)
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Cargar Producto</h1>
        <p className="text-slate-500 dark:text-white mt-1">
          Registrá un nuevo producto con sus ingredientes, cantidades exactas, precio y foto.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="space-y-5">
              <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Package size={20} className="text-primary" />
                Datos del Producto
              </h2>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-white ml-1">Nombre del producto</label>
                <input
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Pancho, Hamburguesa, Pizza..."
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-white ml-1 flex items-center gap-1.5">
                  <DollarSign size={14} className="text-primary" />
                  Precio
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-white ml-1">Categoría</label>
                <div className="flex gap-2">
                  <select
                    required
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(Number(e.target.value))}
                    className="flex-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                  >
                    <option value={0} disabled>Seleccionar categoría...</option>
                    {categorias?.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNuevaCategoria(true)}
                    className="px-4 py-3 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center min-w-[48px]"
                  >
                    +
                  </button>
                </div>
                {showNuevaCategoria && (
                  <div className="flex gap-2 mt-2">
                    <input
                      value={nuevaCategoria}
                      onChange={(e) => setNuevaCategoria(e.target.value)}
                      placeholder="Nombre de la categoría..."
                      className="flex-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!nuevaCategoria.trim()) return
                        createCatMutation.mutate(
                          { nombre: nuevaCategoria.trim() },
                          { onSuccess: () => { setNuevaCategoria(''); setShowNuevaCategoria(false) } }
                        )
                      }}
                      disabled={!nuevaCategoria.trim() || createCatMutation.isPending}
                      className="px-3 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {createCatMutation.isPending ? '...' : 'Agregar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowNuevaCategoria(false); setNuevaCategoria('') }}
                      className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-white text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                      X
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-white ml-1">Descripción (opcional)</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Breve descripción del producto..."
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[80px]"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 dark:text-white ml-1 flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-primary" />
                  Foto del producto (opcional)
                </label>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative flex flex-col items-center justify-center w-full h-44 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group ${
                    isDragging
                      ? 'border-primary bg-primary/10 scale-[1.02]'
                      : imagenPreview
                        ? 'border-primary/40 bg-slate-50 dark:bg-slate-900/50'
                        : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 hover:border-primary/50 hover:bg-primary/5'
                  }`}
                >
                  {imagenPreview ? (
                    <>
                      <img
                        src={imagenPreview}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-xs text-white font-semibold">Cambiar imagen</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload size={32} className={`${isDragging ? 'text-primary' : 'text-slate-400 group-hover:text-primary'} transition-colors`} />
                      <p className={`text-sm font-semibold mt-2 ${isDragging ? 'text-primary' : 'text-slate-500 dark:text-slate-400 group-hover:text-primary'} transition-colors`}>
                        {isDragging ? 'SOLTÁ LA IMAGEN ACÁ' : 'Arrastrá una imagen acá'}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        o hacé clic para seleccionar
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">JPG, PNG, WebP o GIF</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACEPTADOS}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="accent"
              size="lg"
              icon={Plus}
              className="w-full"
              isLoading={createMutation.isPending || subiendoImg}
              disabled={!categoriaId || seleccionados.length === 0 || !nombre || !precio || subiendoImg}
            >
              {subiendoImg ? 'Subiendo imagen...' : 'Crear Producto'}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            <div className="space-y-5">
              <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UtensilsCrossed size={20} className="text-primary" />
                Ingredientes
                {seleccionados.length > 0 && (
                  <span className="ml-auto text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                    {seleccionados.length} seleccionados
                  </span>
                )}
              </h2>

              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchIng}
                  onChange={(e) => setSearchIng(e.target.value)}
                  placeholder="Buscar ingredientes..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {seleccionados.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 dark:text-white uppercase tracking-wider">Seleccionados</p>
                  <div className="space-y-1.5">
                    {seleccionados.map((s) => (
                      <div
                        key={s.ingrediente_id}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20"
                      >
                        <button
                          type="button"
                          onClick={() => toggleIngrediente({ id: s.ingrediente_id, nombre: s.nombre, unidad_medida: s.unidad_medida })}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <X size={16} />
                        </button>
                        <span className="flex-1 text-sm font-semibold text-slate-900 dark:text-white">{s.nombre}</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={s.unidad_medida === 'u' ? 1 : 0.5}
                            step={s.unidad_medida === 'u' ? 1 : 0.5}
                            value={s.cantidad_requerida || ''}
                            onChange={(e) => {
                              const raw = e.target.value
                              if (raw === '') { updateCantidad(s.ingrediente_id, 0); return }
                              const parsed = parseFloat(raw)
                              if (!isNaN(parsed)) updateCantidad(s.ingrediente_id, parsed)
                            }}
                            className="w-20 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                          <span className="text-xs font-bold text-slate-500 dark:text-white uppercase tracking-wider min-w-[14px]">
                            {s.unidad_medida}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 dark:text-white uppercase tracking-wider">
                  {searchIng ? 'Resultados' : 'Todos los ingredientes'}
                </p>
                <div className="max-h-[320px] overflow-y-auto space-y-1 pr-1">
                  {ingredientesFiltrados?.map((ing) => (
                    <button
                      key={ing.id}
                      type="button"
                      onClick={() => toggleIngrediente(ing)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 hover:border-primary/30 hover:bg-primary/5 transition-all text-left group"
                    >
                      <div className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Plus size={14} className="text-slate-400 group-hover:text-primary transition-colors" />
                      </div>
                      <span className="flex-1 text-sm font-medium text-slate-700 dark:text-white">{ing.nombre}</span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-white uppercase tracking-wider">{ing.unidad_medida}</span>
                    </button>
                  ))}
                  {(!ingredientes || ingredientes.length === 0) && (
                    <p className="text-sm text-slate-400 dark:text-white italic text-center py-8">No hay ingredientes cargados. Creá algunos primero.</p>
                  )}
                  {ingredientesFiltrados?.length === 0 && searchIng && (
                    <p className="text-sm text-slate-400 dark:text-white italic text-center py-8">No se encontraron ingredientes con ese nombre.</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </form>

      {productos && productos.length > 0 && (
        <Card>
          <div className="space-y-4">
            <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">Productos Cargados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {productos.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-start gap-3">
                    {p.imagenes_url?.[0] && (
                      <img
                        src={p.imagenes_url[0]}
                        alt={p.nombre}
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-slate-200 dark:bg-slate-800"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{p.nombre}</p>
                      <p className="text-[10px] text-slate-500 dark:text-white mt-0.5">
                        ${p.precio_base.toFixed(2)} &middot; {p.categorias?.[0]?.nombre || 'General'} &middot; {p.ingredientes?.length || 0} ingredientes
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.ingredientes?.slice(0, 4).map((ing) => (
                      <span key={ing.ingrediente_id} className="text-[9px] bg-white dark:bg-slate-800 text-slate-600 dark:text-white px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {ing.nombre} {ing.cantidad_requerida}{ing.unidad_medida}
                      </span>
                    ))}
                    {(p.ingredientes?.length || 0) > 4 && (
                      <span className="text-[9px] text-slate-400 px-1">+{p.ingredientes!.length - 4} más</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
