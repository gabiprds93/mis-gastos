import { useState } from 'react'
import { CATEGORIES } from '../types'
import type { Expense } from '../types'
import { todayISO } from '../lib/period'

type Props = {
  editing: Expense | null
  onSubmit: (values: { amount: number; category: string; note: string; date: string }) => void
  onCancelEdit: () => void
}

const initialForm = (editing: Expense | null) => ({
  amount: editing ? String(editing.amount) : '',
  category: editing ? editing.category : (CATEGORIES[0] as string),
  note: editing ? editing.note : '',
  date: editing ? editing.date : todayISO(),
})

export function ExpenseForm({ editing, onSubmit, onCancelEdit }: Props) {
  const [form, setForm] = useState(() => initialForm(editing))
  const [error, setError] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const amount = Number(form.amount)
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Ingresa un monto mayor a 0')
      return
    }
    if (!form.date) {
      setError('Selecciona una fecha')
      return
    }
    setError('')
    onSubmit({ amount, category: form.category, note: form.note.trim(), date: form.date })
    setForm({ ...initialForm(null), date: form.date })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-sm font-medium tracking-wide text-neutral-500 uppercase">
        {editing ? 'Editar gasto' : 'Nuevo gasto'}
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-neutral-500">Monto</span>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={form.amount}
            onChange={(event) => setForm({ ...form, amount: event.target.value })}
            placeholder="0.00"
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-neutral-500">Fecha</span>
          <input
            type="date"
            value={form.date}
            onChange={(event) => setForm({ ...form, date: event.target.value })}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-neutral-500">Categoría</span>
          <select
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-neutral-500">Nota</span>
          <input
            value={form.note}
            onChange={(event) => setForm({ ...form, note: event.target.value })}
            placeholder="Opcional"
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
        </label>
      </div>
      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          {editing ? 'Guardar cambios' : 'Agregar gasto'}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
