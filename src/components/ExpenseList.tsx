import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Expense } from '../types'

type Props = {
  expenses: Expense[]
  currency: string
  onEdit: (expense: Expense) => void
  onRemove: (id: string) => void
}

export function ExpenseList({ expenses, currency, onEdit, onRemove }: Props) {
  if (expenses.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
        No hay gastos en este período.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      {expenses.map((expense) => (
        <li key={expense.id} className="flex items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-neutral-900">
              {expense.note || expense.category}
            </p>
            <p className="text-xs text-neutral-500">
              {expense.category} · {format(parseISO(expense.date), "d 'de' MMM", { locale: es })}
            </p>
          </div>
          <span className="text-sm font-semibold text-neutral-900 tabular-nums">
            {currency} {expense.amount.toFixed(2)}
          </span>
          <button
            type="button"
            onClick={() => onEdit(expense)}
            className="text-xs text-neutral-500 hover:text-neutral-900"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => onRemove(expense.id)}
            className="text-xs text-neutral-500 hover:text-red-600"
          >
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  )
}
