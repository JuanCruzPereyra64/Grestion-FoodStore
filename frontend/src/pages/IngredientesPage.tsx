import { useState } from 'react'
import { Plus, Edit2, Trash2, Leaf, AlertTriangle } from 'lucide-react'
import { Modal } from '../components/common/Modal'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { useIngredientes, useCreateIngrediente, useUpdateIngrediente, useDeleteIngrediente } from '../hooks/useIngredientes'
import type { Ingrediente, IngredienteCreate } from '../types'

export function IngredientesPage() {
  const { data: ingredientes, isLoading, isError } = useIngredientes()
  const createMutation = useCreateIngrediente()
  const updateMutation = useUpdateIngrediente()
  const deleteMutation = useDeleteIngrediente()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Ingrediente | null>(null)
  const [form, setForm] = useState<IngredienteCreate>({ nombre: '', es_alergeno: false, stock: 0, unidad_medida: 'unidad' })

  function openCreate() {
    setEditing(null)
    setForm({ nombre: '', es_alergeno: false, stock: 0, unidad_medida: 'unidad' })
    setModalOpen(true)
  }

  function openEdit(ing: Ingrediente) {
    setEditing(ing)
    setForm({ nombre: ing.nombre, es_alergeno: ing.es_alergeno, stock: ing.stock, unidad_medida: ing.unidad_medida })
    setModalOpen(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: form }, { onSuccess: () => setModalOpen(false) })
    } else {
      createMutation.mutate(form, { onSuccess: () => setModalOpen(false) })
    }
  }

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-slate-500 dark:text-white font-medium italic">Recolectando ingredientes...</p>
    </div>
  )

  if (isError) return (
    <Card className="border-red-100 bg-red-50 dark:bg-red-900/10">
      <p className="text-red-600 dark:text-red-400 font-medium">Hubo un error al cargar la despensa.</p>
    </Card>
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Ingredientes</h1>
          <p className="text-slate-500 dark:text-white mt-1">
            Gestioná la materia prima para tus creaciones culinarias.
          </p>
        </div>
        <Button onClick={openCreate} icon={Plus} size="lg" variant="accent">
          Nuevo ingrediente
        </Button>
      </div>

      <Card noPadding className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr>
                <th className="premium-table-header w-16">ID</th>
                <th className="premium-table-header">Nombre</th>
                <th className="premium-table-header">Stock</th>
                <th className="premium-table-header">Unidad</th>
                <th className="premium-table-header">Alérgeno</th>
                <th className="premium-table-header">Descripción</th>
                <th className="premium-table-header text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ingredientes?.map((ing) => (
                <tr key={ing.id} className="premium-table-row">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-white">#{ing.id}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900 dark:text-white">{ing.nombre}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-semibold text-slate-700 dark:text-white">{ing.stock}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500 dark:text-white uppercase tracking-wider">{ing.unidad_medida}</span>
                    </td>
                    <td className="px-6 py-4">
                    {ing.es_alergeno ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                        <AlertTriangle size={10} />
                        Alérgeno
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 dark:text-white font-medium uppercase tracking-wider px-2.5 py-1">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-500 dark:text-white italic text-sm">
                      {ing.descripcion || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" size="sm" icon={Edit2} onClick={() => openEdit(ing)} />
                      <Button variant="danger" size="sm" icon={Trash2} onClick={() => deleteMutation.mutate(ing.id)} />
                    </div>
                  </td>
                </tr>
              ))}
              {ingredientes?.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Leaf size={48} className="text-slate-200 dark:text-slate-700" />
                      <p className="text-slate-500 dark:text-white font-medium">La despensa está vacía.</p>
                      <Button variant="ghost" size="sm" onClick={openCreate}>Abastecer ahora</Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={modalOpen}
        title={editing ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-white ml-1">Nombre</label>
            <input
              required
              placeholder="Ej: Harina 000, Sal, Tomate..."
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-white ml-1">Descripción</label>
            <input
              placeholder="Breve descripción del ingrediente..."
              value={form.descripcion ?? ''}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-white ml-1">Stock en inventario</label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Ej: 50, 12.5, 1000..."
              value={form.stock || ''}
              onChange={(e) => setForm({ ...form, stock: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-white ml-1">Unidad de medida</label>
            <div className="grid grid-cols-2 gap-2">
              {['g', 'unidad'].map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setForm({ ...form, unidad_medida: u })}
                  className={`px-4 py-3 rounded-2xl text-sm font-semibold border transition-all ${
                    form.unidad_medida === u
                      ? 'bg-primary text-white border-primary shadow-md'
                      : 'bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-white border-slate-200 dark:border-slate-700 hover:border-primary/50'
                  }`}
                >
                  {u === 'g' ? 'Gramos' : 'Unidad'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
            <input
              type="checkbox"
              id="es_alergeno"
              checked={form.es_alergeno ?? false}
              onChange={(e) => setForm({ ...form, es_alergeno: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-accent focus:ring-accent/20"
            />
            <label htmlFor="es_alergeno" className="text-sm font-semibold text-slate-700 dark:text-white cursor-pointer">
              Es alérgeno
            </label>
          </div>
          
          <div className="pt-2">
            <Button
              type="submit"
              variant="accent"
              className="w-full py-4 text-base"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editing ? 'Actualizar Ingrediente' : 'Cargar Ingrediente'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
